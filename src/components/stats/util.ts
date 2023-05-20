import * as d3 from "d3";

export type PlotDatum = [number, number];
export type Key = "kdpt_diffusion_anime" | "v4_anime_upscaler" | "v4_diffusion" | "v4_upscaler" | "v5_diffusion" | "v5_diffusion_anime";
export const keyLabels = [
    {key:  "kdpt_diffusion_anime", label: "V4 Anime"},
    {key:  "v4_anime_upscaler", label: "V4 AnimUp"},
    {key:  "v4_diffusion", label: "V4 Diffusion"},
    {key:  "v4_upscaler", label: "V4 Upscaler"},
    {key:  "v5_diffusion", label: "V5 Diffusion"},
    {key:  "v5_diffusion_anime", label: "V5 Anime"}
]
export const colors = {
    "kdpt_diffusion_anime": "#F9DF74",
    "v4_anime_upscaler": "#EDAE49",
    "v4_diffusion": "#4DA167",
    "v4_upscaler": "#3BC14A",
    "v5_diffusion": "#A6D9F7",
    "v5_diffusion_anime": "#84DCCF",
}
export const testKey = 'v5_diffusion_anime';


interface DataResult {
    data: Record<Key, number[]>;
    date: string;
}

export async function testCloudFront() {
    const result = await d3.json('/test/2023-05-19_2023-05-20');
    console.log(result);
}

// TODO: Edge function to handle logic
/** Returns data based on date. */
export async function getChartData(path: string = "/metrics/relax"): Promise<DataResult>{
    // if (offset >= 7) throw new Error(`Offset must be less than 7.`);
    // date
    // const now = new Date(new Date().setDate(new Date().getDate() - (offset - 1))).toISOString().split('T')[0]
    const now = new Date().toISOString().split('T')[0]
    // const yesterday = new Date(new Date().setDate(new Date().getDate() - offset)).toISOString().split('T')[0]
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0]
    // file path
    const dataURL = `${path}/${yesterday}_${now}.json`;
    try {
        const data = await d3.json(dataURL) as Record<Key, number[]>;
        return {data: data, date: yesterday}
    }
    catch {
        console.log(`Failed to fetch ${dataURL}. Retrying...`);
        return {data: {} as Record<Key, number[]>, date: yesterday}
        // return await getChartData(path, offset + 1);
    }
}