import useWindowDimensions from "./useWindowDimensions";
import { getChartData, Key, colors, keyLabels } from "./util";
import { useEffect, useState, useRef, useLayoutEffect } from 'react'
// d3 functions
import { select } from "d3-selection";
import { line, area } from "d3-shape";
import { scaleLinear, scaleTime } from "d3-scale";
import { axisBottom, axisLeft, curveBasis, timeFormat } from "d3";
// d3 types
import type { ScaleLinear, ScaleTime, ValueFn, Selection } from "d3";
// store
import { storeSelected, loadSelected } from "./store";

interface BaseProps {
    svgRef: React.RefObject<SVGSVGElement>,
    margin: {top: number, right: number, bottom: number, left: number},
    dimensions: {width: number, height: number},
    children:  React.ReactNode
}

const BreakPointRatio = 1.6;

const Base = ({svgRef, margin, dimensions, children}: BaseProps) => {
    return (
        <svg
            width={dimensions.width + margin.left + margin.right} 
            height={dimensions.height  + margin.top + margin.bottom}
        >
            <g 
                ref={svgRef}
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

const NowLine = ({svgRef, x2, y2}: {svgRef: React.RefObject<SVGLineElement>, x2: number, y2: number}) => {
    useLayoutEffect(() => {
        if (!svgRef.current) return;
        select(svgRef.current)
        .attr("x1", x2)
        .attr("y1", 0)
        .attr("x2", x2)
        .attr("y2", y2)
        .style("stroke-width", 3)
        .style("stroke", "#fff")
        .style("stroke-dasharray", 6)
        .style("opacity", 0.8)
        .style("fill", "none")
        ;
    }, [])
    return (
        <line ref={svgRef}></line>
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
const Y_LIMIT = 10;
// Absolute Time
const utc = new Date().getTimezoneOffset() * 60000;
const startOfToday = new Date().setHours(0, 0, 0, 0) - utc;
const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
// Relative Time
const now = new Date().getTime();
const nowYesterday = (startOfToday - 24 * 60 * 60 * 1000) + (now % (24 * 60 * 60 * 1000));
const minutes15 = 15 * 60 * 1000;
// mutable
const svgGroups: Record<Key, Selection<SVGGElement, unknown, null, undefined> | undefined> = keyLabels.reduce((prev, item) => ({...prev, [item.key]: undefined}), {} as Record<Key, undefined>);

export default function Chart() {
    const svgRef = useRef<SVGSVGElement>(null);
    const lineRef = useRef<SVGLineElement>(null);
    const [chartData, setChartData] = useState<Record<Key, number[]> | undefined>(undefined);
    const [selected, setSelected] = useState<{key:string, sel: boolean}[]>(() => keyLabels.map(({key}) => ({key: key as Key, sel: true})));
    const [dates, setDates] = useState<{yesterday: string | undefined, today: string | undefined,  kind: string | undefined}>({yesterday: undefined, today: undefined, kind: undefined});
    // dimensions (client-only)
    const {width, height} = useWindowDimensions();
    const margin = {top: 30, right: height > width ? 20 : 40, bottom: 30, left: height > width ? 20 : 40};
    const dimensions = {width: (width * 0.98) - margin.left - margin.right, height: height * 0.66 - margin.top - margin.bottom}
    // axis
    const xAxis = getXAxis(startOfYesterday, startOfToday, dimensions);
    const yAxis = getYAxis(Y_LIMIT, dimensions);
    // on Load
    useEffect(() => {
        getChartData()
        .then(({data, yesterday, today, kind}) => {
            setChartData(data);
            setDates({yesterday, today, kind});
            setSelected(prev => loadSelected() || keyLabels.map(({key}, i) => ({key, sel: i > 3 ? true : false})));
        });
    }, []);
    // effect
    useLayoutEffect(() => {
        if (!svgRef.current || !chartData) return;
        const svg = select(svgRef.current);
        selected.forEach(({key, sel}) => {
            // create [x, y] data
            const data = chartData[key as Key].map((value, i) => ([startOfYesterday + (i * minutes15), value]))
            // Group initially hidden
            const svgGroup = svg.append("g").style("opacity", "0");
            svgGroups[key as Key] = svgGroup;
            // add the area
            svgGroup.append("path")
                .data([data])
                .attr("class", "area")
                .attr("fill", colors[key as Key])
                .attr("fill-opacity", 0.2)
                .attr("stroke", colors[key as Key])
                .attr("stroke-width", 2)
                .style("pointer-events", "none")
                .attr("d",
                    area()
                        .curve(curveBasis)
                        .x(([x, y]) => xAxis(x))
                        .y0(dimensions.height)
                        .y1(([x, y]) => yAxis(Math.min(y, Y_LIMIT))) as ValueFn<SVGPathElement, number[][], any>
                )
            ;
            // Add data line
            // svgGroup.append("path")
            //     .datum(data)
            //     .attr("fill", "none")
            //     .attr("stroke", colors[key as Key])
            //     .attr("stroke-width", 2)
            //     .attr("d", line()
            //         .curve(curveBasis)
            //         .x(([x, y]) => xAxis(x))
            //         .y(([x, y]) => yAxis(Math.min(y, Y_LIMIT))) as ValueFn<SVGPathElement, number[][], any>
            //     )
            // ;
            // Tooltip
           const tooltip = select("body")
                .append("div")
                .attr("class", "bg-dark")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("padding", "10px")
                .style("pointer-events", "none")
            ;
            // Points
            svgGroup.append("g")
                .selectAll("dot")
                .data(data)
                .join("circle")
                .attr("cx", ([x, y]) => xAxis(x))
                .attr("cy", ([x, y]) => yAxis(Math.min(y, Y_LIMIT)))
                .attr("r", 5)
                .attr("fill", colors[key as Key])
                .attr("stroke", "#111111")
                .style("stroke-width", 1)
                .on("mouseover", (event: PointerEvent, d: any) => {
                    const hourMinutes = new Date(d[0]).toLocaleTimeString().replace(":00 ", " ");
                    const minutes = Math.trunc(d[1]);
                    const seconds = Math.trunc((d[1] - minutes) * 60).toFixed().padStart(2, '0');
                    const tooltipContent = `<b>${keyLabels.find(({key: k}) => k === key)?.label}</b> @ ${hourMinutes}
                    <br><b>Wait Time:</b> ${minutes.toFixed().padStart(2, '0')}:${seconds}
                    `;
                    tooltip.html(tooltipContent)
                        .style("left", `${event.pageX - 48}px`)
                        .style("top", `${event.pageY - 96}px`)
                        .style("border", `1px solid ${colors[key as Key]}bb`)
                        .style("opacity", 1.0);
                })
                .on("mouseout", () => {
                    tooltip.style("opacity", 0);
                })
            if (lineRef.current) select(lineRef.current).raise();
        })
        return () => {
            // useSetReferences((prev) => prev.map((p) => ({...p, refs: []})))
            // svg.selectAll("path").remove();
        }
    }, [chartData])

    useEffect(() => {
        if (!selected) return;
        selected.forEach(({key, sel}) => {
            // toggle visibility with a 400 ms fade effect
            svgGroups[key as Key]?.transition("ease").duration(400).style("opacity", sel ? "1" : "0");
        });
    }, [selected])

    return (
        <section className="row vstack gap-2">
            <section className="container hstack gap-2 d-flex justify-content-center align-content-center flex-wrap">
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
            </section>
            <section className="col-12 vstack">
                <div className="d-flex justify-content-center">
                    <Base svgRef={svgRef} margin={margin} dimensions={dimensions}>
                        <LayoutYAxis y={yAxis} dimensions={dimensions} />
                        <LayoutXAxis x={xAxis} dimensions={dimensions} />
                        <NowLine svgRef={lineRef} x2={xAxis(nowYesterday)} y2={height} />
                    </Base>
                </div>
                <div className="gap-2 d-flex justify-content-around">
                    <p className="form-text">{dates.yesterday} to {dates.today} UTC {dates.kind} data.</p>
                </div>
            </section>
        </section>
    )
}
