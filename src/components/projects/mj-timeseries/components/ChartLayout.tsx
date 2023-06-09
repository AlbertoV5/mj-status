import { useRef, useLayoutEffect } from 'react';
import { select } from "d3-selection";
import { axisBottom, axisLeft, curveBasis, timeFormat } from "d3";
import type { ScaleLinear, ScaleTime, ValueFn, Selection } from "d3";


export interface ChartBaseProps {
    svgRef: React.RefObject<SVGSVGElement>,
    margin: {top: number, right: number, bottom: number, left: number},
    dimensions: {width: number, height: number},
    children:  React.ReactNode
}

export const BreakPointRatio = 1.6;

export const ChartBase = ({svgRef, margin, dimensions, children}: ChartBaseProps) => {
    return (
        <svg
            width={dimensions.width + margin.left + margin.right} 
            height={dimensions.height  + margin.top + margin.bottom}
        >
            <g ref={svgRef} transform={`translate(${margin.left},${margin.top})`}>
                {children}
            </g>
        </svg>
    )
}

export const LayoutXAxis = ({x, dimensions}: {x: ScaleTime<number, number>, dimensions: {width: number, height: number}}) => {
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

export const LayoutYAxis = ({y, dimensions}: {y: ScaleLinear<number, number>, dimensions: {width: number, height: number}}) => {
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