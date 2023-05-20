import { getChartData, Key, testKey, colors, keyLabels } from "./util";
import { useEffect, useState, useRef, useLayoutEffect } from 'react'
import useWindowDimensions from "./useWindowDimensions";
import * as d3 from "d3";

interface BaseProps {
    refBase: React.RefObject<SVGSVGElement>,
    margin: {top: number, right: number, bottom: number, left: number},
    dimensions: {width: number, height: number},
    children:  React.ReactNode
}

const Base = ({refBase, margin, dimensions, children}: BaseProps) => {
    return (
        <section id='dataviz'>
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
        </section>
    )
}


const LayoutXAxis = ({x, dimensions}: {x: d3.ScaleTime<number, number>, dimensions: {width: number, height: number}}) => {
    const ref = useRef<SVGSVGElement>(null);
    useLayoutEffect(() => {
        if (!ref.current) return;
        d3.select(ref.current)
            .attr("transform", "translate(0," + dimensions.height + ")")
            .call(
                d3.axisBottom(x)
                .ticks(10)
                .tickFormat(d3.timeFormat("%H:%M") as any)
            )
            .style("font", "14px sans-serif")
        ;
    }, []);
    return (
        <g ref={ref}></g>
    )
}

const LayoutYAxis = ({y, dimensions}: {y: d3.ScaleLinear<number, number>, dimensions: {width: number, height: number}}) => {
    const ref = useRef<SVGSVGElement>(null);
    useLayoutEffect(() => {
        if (!ref.current) return;
        d3.select(ref.current)
        .call(d3.axisLeft(y))
        .style("font", "14px sans-serif")
        ;
        const t = d3.select('.tick')
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
        d3.select(ref.current)
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
    const xAxis = d3.scaleTime()
    .domain([yesterday, today])
    .range([ 0, dimensions.width ]);
    return xAxis;
}

const getYAxis = (max: number, dimensions: {width: number, height: number}) => {
    const yAxis = d3.scaleLinear()
    .domain( [0, max] )
    .range([ dimensions.height, 0 ]);
    return yAxis;
}

const references: {key: Key, refs: any[]}[] = keyLabels.map(({key}) => ({key: key as Key, refs: [] as any[]}));
const YLIMIT = 10;

export default function Chart() {
    const refChild = useRef<SVGSVGElement>(null);
    const [selected, setSelected] = useState<{key:string, sel: boolean}[]>(() => 
        keyLabels.map(({key}) => ({key, sel: key === testKey})
    ));
    const [allData, setAllData] = useState<Record<Key, number[]> | undefined>(undefined);
    const [date, setDate] = useState<string | undefined>(undefined);
    // dimensions
    const margin = {top: 10, right: 30, bottom: 30, left: 30};
    const {width, height} = useWindowDimensions();
    const dimensions = {width: width * 0.66 - margin.left - margin.right, height: height * 0.66 - margin.top - margin.bottom}
    // time
    const utc = new Date().getTimezoneOffset() * 60000;
    const startOfToday = new Date().setHours(0, 0, 0, 0) - utc;
    const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
    // const nowYesterday = new Date().getTime() - 24 * 60 * 60 * 1000;
    const now = new Date().getTime();
    const nowYesterday = (startOfToday - 24 * 60 * 60 * 1000) + (now % (24 * 60 * 60 * 1000));
    const minutes15 = 15 * 60 * 1000;
    // axis
    const xAxis = getXAxis(startOfYesterday, startOfToday, dimensions);
    const yAxis = getYAxis(YLIMIT, dimensions);
    useEffect(() => {
        getChartData()
        .then(({data, date}) => {
            setAllData(data);
            setDate(date);
            setSelected(keyLabels.map(({key}) => ({key, sel: key === testKey})))
        });
    }, [])
    // effect
    useLayoutEffect(() => {
        if (!refChild.current || !allData) return;
        const svg = d3.select(refChild.current);
        // query data from selected
        selected.forEach(({key, sel}) => {
            if (!sel) {
                // remove references if not selected
                references.find(({key: k}) => k === key)?.refs.forEach((r) => r.remove());
                return;
            };
            const values = allData[key as Key];
            const data = values.map((value, i) => ([startOfYesterday + (i * minutes15), value]))
            // Group
            const dots = svg.selectAll("myDots")
                .data(data)
                .enter()
                .append('g')
                .style("fill", colors[key as Key])
            ;
            references.find(({key: k}) => k === key)?.refs.push(dots);
            // Add data line
            const line = svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", colors[key as Key])
                .attr("stroke-width", 2)
                .attr("d", d3.line()
                // .curve(d3.curveBasis)
                .x(([x, y]) => xAxis(x)).y(([x, y]) => yAxis(Math.min(y, YLIMIT))) as any)
            ;
            references.find(({key: k}) => k === key)?.refs.push(line);
            // Points
            const plotPoints = svg
                .append("g")
                .selectAll("dot")
                .data(data)
                .join("circle")
                    .attr("cx", ([x, y]) => xAxis(x))
                    .attr("cy", ([x, y]) => yAxis(Math.min(y, YLIMIT)))
                    .attr("r", 6)
                    .attr("fill", colors[key as Key])
                    .attr("stroke", "black")
            ;
            references.find(({key: k}) => k === key)?.refs.push(plotPoints);
            // Tooltip
            const tooltip = d3.select("body")
                .append("div")
                .attr("class", "bg-dark")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("padding", "8px")
                .style("pointer-events", "none")
            ;
            // Mouseover
            plotPoints.on("mouseover", (event: PointerEvent, d: any) => {
                const hourMinutes = new Date(d[0]).toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'});
                const minutes = Math.trunc(d[1]);
                const seconds = Math.trunc((d[1] - minutes) * 60).toFixed().padStart(2, '0');
                const tooltipContent = `Time: ${hourMinutes}<br>Minutes: ${minutes}:${seconds}`;
                tooltip.html(tooltipContent)
                    .style("left", `${event.pageX}px`)
                    .style("top", `${event.pageY}px`)
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
        <>
            <section className="col-2 px-2 vstack gap-2">
            {
                keyLabels.map(({key: k, label}) => (
                    <div key={k} className='form-check form-check-inline hstack gap-2'>
                        <input 
                            className='btn-check' 
                            id={`btn-check-${k}`}
                            type='checkbox'
                            onChange={(e) => {
                                setSelected((prev) => {
                                    const newSelected = prev.map((s) => {
                                        if (s.key === k) {
                                            return {...s, sel: !s.sel}
                                        }
                                        return s;
                                    });
                                    return newSelected;
                                });
                            }}
                            checked={selected.find(({key}) => key === k)?.sel}
                        />
                        <label
                            className='btn btn-outline-primary'
                            htmlFor={`btn-check-${k}`}
                        >{label}</label>
                        <div style={{width: '15px', height: '15px', borderRadius: '50%', backgroundColor: colors[k as Key]}}></div>
                    </div>
                ))
            }
                <div className='form-check form-check-inline'>
                    <input 
                        className='btn-check' 
                        id={`btn-check-unselect`}
                        type='checkbox'
                        onChange={(e) => {
                            setSelected((prev) => {
                                const newSelected = prev.map((s) => {
                                    return {...s, sel: false}
                                });
                                return newSelected;
                            });
                        }}
                        checked={!selected.find(({sel}) => sel === true)}
                    />
                    <label
                        className='btn btn-outline-secondary'
                        htmlFor={`btn-check-unselect`}
                    >Unselect</label>
                </div>
            </section>
            <div className="col-10 vstack gap-2">
                <Base refBase={refChild} margin={margin} dimensions={dimensions}>
                    <>
                        <LayoutYAxis y={yAxis} dimensions={dimensions} />
                        <LayoutXAxis x={xAxis} dimensions={dimensions} />
                        <TimeLine x2={xAxis(nowYesterday)} y2={height} />
                    </>
                </Base>
                <p className="px-2">{date}</p>
            </div>
        </>
    )
}
