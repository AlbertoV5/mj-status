import { scaleLinear, scaleTime } from "d3";

interface IDimensions {
  width: number;
  height: number;
}

export const getXAxis = (
  yesterday: number,
  today: number,
  dimensions: IDimensions
) => {
  const xAxis = scaleTime()
    .domain([yesterday, today])
    .range([0, dimensions.width]);
  return xAxis;
};

export const getYAxis = (max: number, dimensions: IDimensions) => {
  const yAxis = scaleLinear().domain([0, max]).range([dimensions.height, 0]);
  return yAxis;
};
