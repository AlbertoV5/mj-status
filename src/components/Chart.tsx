import { getYesterdayData, Key, testKey, colors, keyLabels } from "./util";
import { useEffect, useState, useRef, useLayoutEffect } from 'react'
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
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%H:%M") as any))
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
        .call(d3.axisLeft(y));
    }, [])
    return (
        <g ref={ref}></g>
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

export default function Chart() {
    
    const refChild = useRef<SVGSVGElement>(null);
    const [selected, setSelected] = useState<{key:string, sel: boolean}[]>(() => 
        keyLabels.map(({key}) => ({key, sel: key === testKey})
    ));
    // dimensions
    const margin = {top: 10, right: 30, bottom: 30, left: 60};
    const dimensions = {width: 900 - margin.left - margin.right, height: 400 - margin.top - margin.bottom}
    // time
    const utc = new Date().getTimezoneOffset() * 60000;
    const today = new Date().getTime() - utc;
    const yesterday = today - 24 * 60 * 60 * 1000;
    const minutes15 = 15 * 60 * 1000;
    // axis
    const xAxis = getXAxis(yesterday, today, dimensions);
    const yAxis = getYAxis(10.0, dimensions);
    // effect
    useEffect(() => {
        if (!refChild.current) return;
        const svg = d3.select(refChild.current);
        // data
        getYesterdayData()
        .then((allData: Record<Key, number[]>) => {
            // Data
            console.log(references);
            selected.forEach(({key, sel}) => {
                if (!sel) {
                    // remove references if not selected
                    references.find(({key: k}) => k === key)?.refs.forEach((r) => r.remove());
                    return;
                };
                const values = allData[key as Key];
                const data = values.map((value, i) => ([yesterday + (i * minutes15), value]))
                // Group
                const dots = svg.selectAll("myDots")
                    .data(data)
                    .enter()
                    .append('g')
                    .style("fill", colors[key as Key])
                ;
                references.find(({key: k}) => k === key)?.refs.push(dots);
                // Add the line
                const line = svg.append("path")
                    .datum(data)
                    .attr("fill", "none")
                    .attr("stroke", colors[key as Key])
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()
                        .curve(d3.curveBasis)
                        .x(([x, y]) => xAxis(x)).y(([x, y]) => yAxis(y)) as any
                    )
                ;
                references.find(({key: k}) => k === key)?.refs.push(line);
                // Points
                const plotPoints = svg
                    .append("g")
                    .selectAll("dot")
                    .data(data)
                    .join("circle")
                        .attr("cx", ([x, y]) => xAxis(x))
                        .attr("cy", ([x, y]) => yAxis(y))
                        .attr("r", 5)
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
        })
        return () => {
            // useSetReferences((prev) => prev.map((p) => ({...p, refs: []})))
            // svg.selectAll("path").remove();
        }
    }, [selected])

    return (
        <section className='container-fluid'>
            <Base refBase={refChild} margin={margin} dimensions={dimensions}>
                <>
                    <LayoutXAxis x={xAxis} dimensions={dimensions} />
                    <LayoutYAxis y={yAxis} dimensions={dimensions} />
                </>
            </Base>
            <section className='row'>
                <div >
                {
                    keyLabels.map(({key: k, label}) => (
                        <div key={k} className='form-check'>
                            <input 
                                className='form-check-input' 
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
                                className='form-check-label'
                            >{label}</label>
                        </div>
                    ))
                }
                </div>
            </section>
        </section>
    )
}
