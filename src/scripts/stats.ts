import * as d3 from "d3";


function convertToHourMinutes(minutesList: number[]) {
    var result: string[] = [];

    minutesList.forEach(function (minutes) {
        var hours = Math.floor(minutes / 60); // Calculate the hours
        var mins = minutes % 60; // Calculate the remaining minutes

        // Format the hours and minutes
        var formattedTime = ("0" + hours).slice(-2) + ":" + ("0" + mins).slice(-2);

        result.push(formattedTime); // Add the formatted time to the result array
    });

    return result;
}

const url = "../metrics/relax/2023-05-14_2023-05-15.json";

const margin = {top: 10, right: 30, bottom: 30, left: 60},
width = 900 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;
// append the svg object to the body of the page
const svg = d3.select("#test")
.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

type key = "kdpt_diffusion_anime" | "v4_anime_upscaler" | "v4_diffusion" | "v4_upscaler" | "v5_diffusion" | "v5_diffusion_anime";

// const X = convertToHourMinutes([...Array(96).keys()].map(x => x * 15));
const X = [...Array(96).keys()].map(x => x * 15);
console.log(X);
//Read the data
// v5_diffusion_anime
(d3.json(url) as Promise<Record<key, number[]>>)
.then((data: Record<key, number[]>) => (data['v5_diffusion_anime']))
.then((values: number[]) => {
    // time
    const utc = new Date().getTimezoneOffset() * 60000;
    const today = new Date().getTime() - utc;
    const yesterday = today - 24 * 60 * 60 * 1000;
    const minutes15 = 15 * 60 * 1000;
    // data
    const data = values.map((value, i) => ({x: yesterday + (i * minutes15), y: value}));
    // Create X axis
    const xAxis = d3.scaleTime()
    .domain([yesterday, today])
    .range([ 0, width ]);
    // Add X axis
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xAxis).ticks(12).tickFormat(d3.timeFormat("%H:%M") as any))
    // Create Y axis
    const yAxis = d3.scaleLinear()
    .domain( [Math.min(...values), Math.max(...values)] )
    .range([ height, 0 ]);
    // Add Y axis
    svg.append("g")
    .call(d3.axisLeft(yAxis));
    // Add the line
    svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#69b3a2")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line().x(d => xAxis(d.x)).y(d => yAxis(d.y)) as any
    )
    // Add the points
    svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .join("circle")
        .attr("cx", d => xAxis(d.x))
        .attr("cy", d => yAxis(d.y))
        .attr("r", 5)
        .attr("fill", "#69b3a2")
})
const testElement = document.getElementById('test');
const testData = '';