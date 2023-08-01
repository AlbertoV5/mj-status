import { select } from "d3";
import type { ScaleTime } from "d3";
import { DT_15MIN, DT_24HRS, CHART_STROKE_WIDTH } from "../constants";
import { useEffect } from "react";

interface LocatorLineProps {
    svgRef: React.RefObject<SVGSVGElement>,
    xAxis: ScaleTime<number, number>,
    y2: number
}
export const LocatorLine = ({svgRef, xAxis, y2}: LocatorLineProps) => {
    const drawShape = (time: number) => {
        const x = xAxis(Math.trunc(time / DT_15MIN) * DT_15MIN);
        select(svgRef.current).selectAll("*").remove();
        select(svgRef.current).append("line")
            .attr("x1", x)
            .attr("x2", x)
            .attr("y1", 0)
            .attr("y2", y2)
            .attr("height", y2)
            .style("fill", "none")
            .style("opacity", 0.7)
            .style("stroke", "currentColor")
            .style("stroke-dasharray", 5)
            .style("stroke-width", CHART_STROKE_WIDTH)
        ;
    }
    const getTime = () => {
        const DT_YESTERDAY = new Date().setHours(0, 0, 0, 0) - new Date().getTimezoneOffset() * 60000;
        const now = new Date().getTime();
        return (DT_YESTERDAY - DT_24HRS) + (now % (DT_24HRS));
    }
    useEffect(() => {
        if (!svgRef.current) return;
        drawShape(getTime());
        // Update svg every x minutes
        const intervalId = window.setInterval(() => drawShape(getTime()), 15 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, [])
    return (
        <svg ref={svgRef}></svg>
    )
}
