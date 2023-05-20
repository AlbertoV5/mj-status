import * as d3 from "d3";

export type PlotDatum = [number, number];
export type Key = "kdpt_diffusion_anime" | "v4_anime_upscaler" | "v4_diffusion" | "v4_upscaler" | "v5_diffusion" | "v5_diffusion_anime";
export const keyLabels = [
    {key:  "kdpt_diffusion_anime", label: "V4 Niji"},
    {key:  "v4_anime_upscaler", label: "V4 NijiUp"},
    {key:  "v4_diffusion", label: "V4 Diffusion"},
    {key:  "v4_upscaler", label: "V4 Upscaler"},
    {key:  "v5_diffusion", label: "V5 Diffusion"},
    {key:  "v5_diffusion_anime", label: "V5 Niji"},
]
export const colors = {
    "kdpt_diffusion_anime": "#F9DF74",
    "v4_anime_upscaler": "#EDAE49",
    "v4_diffusion": "#4DA167",
    "v4_upscaler": "#3BC14A",
    // "v5_diffusion": "#A6D5F7",
    "v5_diffusion": "#8cc9dc",
    "v5_diffusion_anime": "#90C5F0",
}
export const defaultChartData = {
    "kdpt_diffusion_anime": [],
    "v4_anime_upscaler": [],
    "v4_diffusion": [],
    "v4_upscaler": [],
    "v5_diffusion": [],
    "v5_diffusion_anime": [],
}
export const testKey = 'v5_diffusion_anime';


interface DataResult {
    data: Record<Key, number[]>;
    yesterday: string;
    kind: "historical" | "predicted";
}

/** Returns data based on date. */
export async function getChartData(path: string = "/metrics/relax", offset: number = 1): Promise<DataResult>{
    // Get date from current time minus offset days. UTC not needed, apparently.
    const a = new Date().getTime() - (24 * (offset - 1)) * 1000 * 60 * 60;
    const b = new Date().getTime() - (24 * offset) * 1000 * 60 * 60;
    const today = new Date(a).toISOString().split('T')[0];
    const yesterday = new Date(b).toISOString().split('T')[0];
    // Construct file path.
    const dataURL = `${path}/${yesterday}_${today}.json`;
    try {
        const data = await d3.json(dataURL) as Record<Key, number[]>;
        return {data: data, yesterday: yesterday, kind: offset === 0 ? "predicted" : "historical"}
    }
    catch {
        console.log(`Failed to fetch data from ${yesterday}`);
        return {data: defaultChartData, yesterday: yesterday, kind: offset === 0 ? "predicted" : "historical"}
    }
}