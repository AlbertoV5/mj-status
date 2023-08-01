// Packages
import { ChartBase, LayoutXAxis, LayoutYAxis} from "./components/ChartLayout";
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import useWindowDimensions from "./utils/useWindowDimensions";
import type { ValueFn, Selection } from "d3";
import { Selector } from "./components/Selector";
import { select } from "d3-selection";
import { area } from "d3-shape";
import { curveBasis } from "d3";
import * as utils from "./utils";
import type { Key } from "./utils";
import { keyLabels } from "./utils";
import { getXAxis, getYAxis } from "./utils/axis";
import { CHART_Y_LIMIT, CHART_STROKE_WIDTH, CHART_MARGINS, CHART_DIMENSIONS, DT_TODAY, DT_YESTERDAY, DT_15MIN } from './constants';
import { LocatorLine } from "./components/LocatorLine";

type chartData = Record<Key, number[]>;
type selectedData = {key:Key, sel: boolean};
// Q: best name?
type svgGroupType = Selection<SVGGElement, unknown, null, undefined>;
type svgGroupData = Record<Key, svgGroupType | undefined>;
type datesData = {yesterday: string | undefined, today: string | undefined,  kind: string | undefined};

export default function Chart() {
    // https://observablehq.com/@d3/d3-line-chart
    const svgRef = useRef<SVGSVGElement>(null);
    const lineRef = useRef<SVGSVGElement>(null);
    const [chartData, setChartData] = useState<chartData | undefined>(undefined);
    const [selected, setSelected] = useState<selectedData[]>(() => keyLabels.map(({key}) => ({key, sel: true})));
    const [dates, setDates] = useState<datesData>({yesterday: undefined, today: undefined, kind: undefined});
    const [svgGroups, setSvgGroups] = useState<svgGroupData>(() => (
        // Q: best way to use reduce with types?
        keyLabels.reduce((prev, item) => ({...prev, [item.key]: undefined}), {} as Record<Key, undefined>)
    ));
    const {width, height} = useWindowDimensions();
    const margin = {
        top: CHART_MARGINS.top, 
        right: height > width ? CHART_MARGINS.right : CHART_MARGINS.right * 2, 
        bottom: CHART_MARGINS.bottom, 
        left: height > width ? CHART_MARGINS.left : CHART_MARGINS.left * 2
    };
    const dimensions = {
        width: (width * CHART_DIMENSIONS.w) - margin.left - margin.right, 
        height: (height * CHART_DIMENSIONS.h) - margin.top - margin.bottom
    }
    const xAxis = getXAxis(DT_TODAY, DT_YESTERDAY, dimensions);
    const yAxis = getYAxis(CHART_Y_LIMIT, dimensions);
    const handleLoadSelected = () => {
        // Q: TypeGuard for Literals?
        const sel = utils.loadSelected() as selectedData[];
        const computeDefault = () => keyLabels.map(({key}, i) => ({key, sel: i > 3 ? true : false}));
        return sel || computeDefault();
    }
    useEffect(() => {
        utils.getChartData()
        .then(({data, yesterday, today, kind}) => {
            setChartData(data);
            setDates({yesterday, today, kind});
            setSelected(prev => handleLoadSelected());
        });
    }, []);
    // Layout Effect.
    useLayoutEffect(() => {
        if (!svgRef.current || !chartData) return;
        const groups = svgGroups;
        const svg = select(svgRef.current);
        selected.forEach(({key, sel}) => {
            const rightPad = chartData[key][0];
            const data = [...chartData[key], rightPad].map((value, i) => ([DT_YESTERDAY + (i * DT_15MIN), value]));
            // Create group, initially hidden and disabled.
            const svgGroup = svg.append("g")
                .style("opacity", "0")
                .style("pointer-events", "none")
            groups[key] = svgGroup;
            // Add the area svg.
            svgGroup.append("path")
                .data([data])
                .attr("class", "area")
                .attr("fill", utils.colors[key as utils.Key])
                .attr("fill-opacity", 0.2)
                .attr("stroke", utils.colors[key as utils.Key])
                .attr("stroke-width", CHART_STROKE_WIDTH)
                .style("pointer-events", "none")
                .attr("d",
                    area()
                        .curve(curveBasis)
                        .x(([x, y]) => xAxis(x))
                        .y0(dimensions.height)
                        .y1(([x, y]) => yAxis(Math.min(y, CHART_Y_LIMIT))) as ValueFn<SVGPathElement, number[][], any>
                )
            ;
           const tooltip = select("body")
                .append("div")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("padding", "10px")
                .style("pointer-events", "none")
                .style("background-color", "inherit")
            ;
            // Scatter plot.
            svgGroup.append("g")
                .selectAll("dot")
                .data(data)
                .join("circle")
                .attr("cx", ([x, y]) => xAxis(x))
                .attr("cy", ([x, y]) => yAxis(Math.min(y, CHART_Y_LIMIT)))
                .attr("r", 5)
                .attr("fill", utils.colors[key as utils.Key])
                .attr("stroke", "#111111")
                .style("stroke-width", 1)
                .on("mouseover", (event: PointerEvent, d: any) => {
                    const hourMinutes = new Date(d[0]).toLocaleTimeString().replace(":00 ", " ");
                    const minutes = Math.trunc(d[1]);
                    const seconds = Math.trunc((d[1] - minutes) * 60).toFixed().padStart(2, '0');
                    const tooltipContent = `
                        <b>${keyLabels.find(({key: k}) => k === key)?.label}</b> @ ${hourMinutes}
                        <br><b>Wait Time:</b> ${minutes.toFixed().padStart(2, '0')}:${seconds}
                    `;
                    tooltip.html(tooltipContent)
                        .style("left", `${event.pageX - 48}px`)
                        .style("top", `${event.pageY - 96}px`)
                        .style("border", `1px solid ${utils.colors[key as utils.Key]}`)
                        .style("opacity", 1.0);
                })
                .on("mouseout", () => {
                    tooltip.style("opacity", 0);
                })
            if (lineRef.current) select(lineRef.current).raise();
        })
        setSvgGroups(groups);
        return () => {
        }
    }, [chartData])

    // Interactive selected chart.
    useEffect(() => {
        if (!selected) return;
        selected.forEach(({key, sel}) => {
            // toggle visibility with a 400 ms fade effect
            svgGroups[key]?.transition("ease").duration(400)
                .style("opacity", sel ? "1" : "0")
                .style("pointer-events", sel ? "all" : "none")
            ;
            svgGroups[key]?.raise();
            if (lineRef.current) select(lineRef.current).raise();
        });
    }, [selected])
    
    return (
        <section className='container-fluid'>
            <section className="row vstack gap-2">
                <section className="col-12 vstack">
                    <div className="d-flex justify-content-center">
                        <ChartBase svgRef={svgRef} margin={margin} dimensions={dimensions}>
                            <LayoutYAxis y={yAxis} dimensions={dimensions} />
                            <LayoutXAxis x={xAxis} dimensions={dimensions} />
                            <LocatorLine svgRef={lineRef} xAxis={xAxis} y2={dimensions.height + 20} />
                        </ChartBase>
                    </div>
                    <div className="gap-2 d-flex justify-content-around">
                        <p className="form-text">{dates.yesterday} to {dates.today} UTC {dates.kind} data.</p>
                    </div>
                </section>
                <Selector
                    selected={selected}
                    setSelected={setSelected}
                    keyLabels={keyLabels}
                    colors={utils.colors}
                    storeSelected={utils.storeSelected}
                />
            </section>
        </section>
    )
}
