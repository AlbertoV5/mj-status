import { getChartData, Key, testKey, colors, keyLabels } from "./util";
import { useEffect, useState, useRef, useLayoutEffect } from 'react'
import useWindowDimensions from "./useWindowDimensions";
// d3 functions
import { select } from "d3-selection";
import { line, area } from "d3-shape";
import { scaleLinear, scaleTime } from "d3-scale";
import { axisBottom, axisLeft, curveBasis, timeFormat } from "d3";
// d3 types
import type { ScaleLinear, ScaleTime, ValueFn } from "d3";
// store
import { storeSelected, loadSelected } from "./store";

interface BaseProps {
    refBase: React.RefObject<SVGSVGElement>,
    margin: {top: number, right: number, bottom: number, left: number},
    dimensions: {width: number, height: number},
    children:  React.ReactNode
}

const BreakPointRatio = 1.6;

const Base = ({refBase, margin, dimensions, children}: BaseProps) => {
    return (
        <svg
            width={dimensions.width + margin.left + margin.right} 
            height={dimensions.height  + margin.top + margin.bottom}
        >
            <g 
                ref={refBase}
                transform={`translate(${margin.left},${margin.top})`}
            >
                {children}
            </g>
        </svg>
    )
}

const LayoutXAxis = ({x, dimensions}: {x: ScaleTime<number, number>, dimensions: {width: number, height: number}}) => {
    const ref = useRef<SVGSVGElement>(null);
    useLayoutEffect(() => {
        if (!ref.current) return;
        select(ref.current)
            .attr("transform", "translate(0," + dimensions.height + ")")
            .call(
                axisBottom(x)
                .ticks(dimensions.width / dimensions.height >= BreakPointRatio ? 10 : 5)
                .tickFormat(timeFormat("%H:%M") as any)
            )
            .style("font", "14px sans-serif")
        ;
    }, []);
    return (
        <g ref={ref}></g>
    )
}

const LayoutYAxis = ({y, dimensions}: {y: ScaleLinear<number, number>, dimensions: {width: number, height: number}}) => {
    const ref = useRef<SVGSVGElement>(null);
    useLayoutEffect(() => {
        if (!ref.current) return;
        select(ref.current)
        .call(axisLeft(y))
        .style("font", "14px sans-serif")
        ;
        const t = select('.tick')
        t.remove();
    }, [])
    return (
        <g ref={ref}></g>
    )
}

const TimeLine = ({x2, y2}: {x2: number, y2: number}) => {
    const ref = useRef<SVGLineElement>(null);
    useLayoutEffect(() => {
        if (!ref.current) return;
        select(ref.current)
        .attr("x1", x2)
        .attr("y1", 0)
        .attr("x2", x2)
        .attr("y2", y2)
        .style("stroke-width", 2)
        .style("stroke", "#fff")
        .style("stroke-dasharray", 5)
        .style("opacity", 0.7)
        .style("fill", "none");
    }, [])
    return (
        <line ref={ref}></line>
    )
}

const getXAxis = (yesterday: number, today: number, dimensions: {width: number, height: number}) => {
    const xAxis = scaleTime()
    .domain([yesterday, today - minutes15])
    .range([ 0, dimensions.width ]);
    return xAxis;
}

const getYAxis = (max: number, dimensions: {width: number, height: number}) => {
    const yAxis = scaleLinear()
    .domain( [0, max] )
    .range([ dimensions.height, 0 ]);
    return yAxis;
}

// Constants
const YLIMIT = 10;
// Absolute Time
const utc = new Date().getTimezoneOffset() * 60000;
const startOfToday = new Date().setHours(0, 0, 0, 0) - utc;
const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
// Relative Time
const now = new Date().getTime();
const nowYesterday = (startOfToday - 24 * 60 * 60 * 1000) + (now % (24 * 60 * 60 * 1000));
const minutes15 = 15 * 60 * 1000;
// mutable
const references: {key: Key, refs: any[]}[] = keyLabels.map(({key}) => ({key: key as Key, refs: [] as any[]}));

export default function Chart() {
    const refChild = useRef<SVGSVGElement>(null);
    const [selected, setSelected] = useState<{key:string, sel: boolean}[]>(() => 
        keyLabels.map(({key}) => ({key, sel: key === testKey})
    ));
    const [allData, setAllData] = useState<Record<Key, number[]> | undefined>(undefined);
    const [dates, setDates] = useState<{yesterday: string | undefined, kind: string | undefined}>({yesterday: undefined, kind: undefined});
    // dimensions
    const {width, height} = useWindowDimensions();
    const margin = {top: 30, right: height > width ? 20 : 40, bottom: 30, left: height > width ? 20 : 40};
    const dimensions = {width: (width * 0.98) - margin.left - margin.right, height: height * 0.66 - margin.top - margin.bottom}
    // axis
    const xAxis = getXAxis(startOfYesterday, startOfToday, dimensions);
    const yAxis = getYAxis(YLIMIT, dimensions);
    useEffect(() => {
        getChartData()
        .then(({data, yesterday, kind}) => {
            setAllData(data);
            setDates({yesterday, kind});
            setSelected(loadSelected);
        });
    }, [])
    // effect
    useLayoutEffect(() => {
        if (!refChild.current || !allData) return;
        const svg = select(refChild.current);
        // query data from selected
        selected.forEach(({key, sel}) => {
            // remove all references regardless if selected or not
            references.find(({key: k}) => k === key)?.refs.forEach((r) => r.remove());
            // don't draw if not selected
            if (!sel) return;
            // det data using the selected key
            const values = allData[key as Key];
            const data = values.map((value, i) => ([startOfYesterday + (i * minutes15), value]))
            // D3
            // add the area
            const svgArea = svg.append("path")
                .data([data])
                .attr("class", "area")
                .attr("fill", colors[key as Key])
                .attr("fill-opacity", 0.2)
                .attr("stroke", "none")
                .style("pointer-events", "none")
                .attr("d",
                    area()
                        .curve(curveBasis)
                        .x(([x, y]) => xAxis(x))
                        .y0(dimensions.height)
                        .y1(([x, y]) => yAxis(Math.min(y, YLIMIT))) as ValueFn<SVGPathElement, number[][], any>
                )
            ;
            references.find(({key: k}) => k === key)?.refs.push(svgArea);
            // Group
            const svgDots = svg.selectAll("myDots")
                .data(data)
                .enter()
                .append('g')
                .style("fill", colors[key as Key])
            ;
            references.find(({key: k}) => k === key)?.refs.push(svgDots);
            // Add data line
            const svgLine = svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", colors[key as Key])
                .attr("stroke-width", 2)
                .attr("d", line()
                    .curve(curveBasis)
                    .x(([x, y]) => xAxis(x))
                    .y(([x, y]) => yAxis(Math.min(y, YLIMIT))) as ValueFn<SVGPathElement, number[][], any>
                )
            ;
            references.find(({key: k}) => k === key)?.refs.push(svgLine);
            // Points
            const plotPoints = svg.append("g")
                .selectAll("dot")
                .data(data)
                .join("circle")
                .attr("cx", ([x, y]) => xAxis(x))
                .attr("cy", ([x, y]) => yAxis(Math.min(y, YLIMIT)))
                .attr("r", 6)
                .attr("fill", colors[key as Key])
                .attr("stroke", "#1a1a1a")
                .style("stroke-width", "2px")
                .style("opacity", "1")
            ;
            references.find(({key: k}) => k === key)?.refs.push(plotPoints);
            // Tooltip
            const tooltip = select("body")
                .append("div")
                .attr("class", "bg-dark")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("padding", "8px")
                .style("pointer-events", "none")
            ;
            // Mouseover
            plotPoints.on("mouseover", (event: PointerEvent, d: any) => {
                const hourMin = new Date(d[0]).toTimeString().split(' ')[0].slice(0, 5);
                const minutes = Math.trunc(d[1]);
                const seconds = Math.trunc((d[1] - minutes) * 60).toFixed().padStart(2, '0');
                const tooltipContent = `<b>${keyLabels.find(({key: k}) => k === key)?.label}</b><br>Hour: ${hourMin}<br>Delay: ${minutes}:${seconds}`;
                tooltip.html(tooltipContent)
                    .style("left", `${event.pageX - 48}px`)
                    .style("top", `${event.pageY - 96}px`)
                    .style("border", `1px solid ${colors[key as Key]}`)
                    .style("opacity", 1);
            });
            plotPoints.on("mouseout", () => {
                tooltip.style("opacity", 0);
            });
        })
        return () => {
            // useSetReferences((prev) => prev.map((p) => ({...p, refs: []})))
            // svg.selectAll("path").remove();
        }
    }, [selected])

    return (
        <section className="row vstack gap-2">
            <section className="container hstack gap-2 d-flex justify-content-center align-content-center flex-wrap">
            {
                keyLabels.map(({key: k, label}) => (
                    <div key={k} className='form-check form-check-inline hstack gap-2'>
                        <input
                            className='btn-check' 
                            id={`btn-check-${k}`}
                            type='checkbox'
                            onChange={() => setSelected(prev => {
                                const s = [...prev.filter(({key}) => key !== k), {key: k, sel: !prev.find(({key}) => key === k)?.sel}]
                                storeSelected(s);
                                return s;
                            })}
                            checked={selected.find(({key}) => key === k)?.sel}
                        />
                        <label className='btn btn-outline-primary'htmlFor={`btn-check-${k}`}>{label}</label>
                        <svg style={{width: '15px', height: '15px', borderRadius: '50%', backgroundColor: colors[k as Key]}}></svg>
                    </div>
                ))
            }
                <div className='form-check form-check-inline'>
                    <input
                        className='btn-check' 
                        id={`btn-check-unselect`}
                        type='checkbox'
                        onChange={(e) => setSelected(prev => {
                            const s = prev.map((s) => ({...s, sel: false}));
                            storeSelected(s);
                            return s;
                        })}
                        checked={!selected.find(({sel}) => sel === true)}
                    />
                    <label className='btn btn-outline-secondary' htmlFor={`btn-check-unselect`}>Reset</label>
                </div>
            </section>
            <section className="col-12 vstack">
                <div className="d-flex justify-content-center">
                    <Base refBase={refChild} margin={margin} dimensions={dimensions}>
                        <LayoutYAxis y={yAxis} dimensions={dimensions} />
                        <LayoutXAxis x={xAxis} dimensions={dimensions} />
                        <TimeLine x2={xAxis(nowYesterday)} y2={height} />
                    </Base>
                </div>
                <div className="d-flex justify-content-center">
                    <p className="form-text">{dates.yesterday} UTC {dates.kind} data</p>
                </div>
            </section>
        </section>
    )
}
