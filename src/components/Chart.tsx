import { useEffect, useState, useRef } from 'react'
import * as d3 from "d3";
import { getYesterdayData, Key, testKey, colors, keyLabels } from "./util";

export default function Chart() {
    
    const ref = useRef<HTMLDivElement>(null);
    const [selected, setSelected] = useState<{key:string, sel: boolean}[]>(() => 
        keyLabels.map(({key}) => ({key, sel: key === testKey})
    ));
    useEffect(() => {
        const utc = new Date().getTimezoneOffset() * 60000;
        const today = new Date().getTime() - utc;
        const yesterday = today - 24 * 60 * 60 * 1000;
        const minutes15 = 15 * 60 * 1000;
        // Plot
        const elementId = "#dataviz";
        // TODO: Finish implementation
        const margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 900 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
        // Append the svg object to the body of the page
        const svg = d3.select(elementId)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        //Read the data
        getYesterdayData()
        .then((allData: Record<Key, number[]>) => {
            // Create X axis
            const xAxis = d3.scaleTime()
            .domain([yesterday, today])
            .range([ 0, width ]);
            // Add X axis
            svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xAxis).tickFormat(d3.timeFormat("%H:%M") as any))
            // Create Y axis
            const yAxis = d3.scaleLinear()
            .domain( [0, 10.0] )
            .range([ height, 0 ]);
            // Add Y axis
            svg.append("g")
            .call(d3.axisLeft(yAxis));
            // Data
            selected.forEach(({key, sel}) => {
                if (!sel) return;
                console.log(key);
                const values = allData[key as Key];
                const data = values.map((value, i) => ([yesterday + (i * minutes15), value]))
                // group
                svg
                .selectAll("myDots")
                .data(data)
                .enter()
                  .append('g')
                  .style("fill", colors[key as Key])

                // Add the line
                svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", colors[key as Key])
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .curve(d3.curveBasis)
                    .x(([x, y]) => xAxis(x)).y(([x, y]) => yAxis(y)) as any
                )

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

                // Tooltip
                const tooltip = d3.select("body")
                .append("div")
                .attr("class", "bg-dark")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("padding", "8px")
                .style("pointer-events", "none")
                
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
            if (ref.current) {
                ref.current.children[0].remove();
            }
        }
    }, [selected])

    return (
        <section className='container-fluid'>
            <section className='row' id="dataviz" ref={ref}></section>
            <section className='row'>
                <ul className='list-group'>
                {
                    keyLabels.map(({key, label}) => (
                        <li className='list-group-item' key={key} onClick={() => {
                            setSelected((prev) => {
                                console.log('hi')
                                const newSelected = prev.map((s) => {
                                    if (s.key === key) {
                                        return {...s, sel: !s.sel}
                                    }
                                    return s;
                                });
                                return newSelected;
                            });
                        }}>{label}</li>
                    ))
                }
                </ul>
            </section>
        </section>
    )
}
