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

/** Returns data based on date. */
export async function getYesterdayData(path: string = "./metrics/relax"): Promise<Record<Key, number[]>>{
    const day = new Date().getUTCDate();
    const month = (new Date().getUTCMonth() + 1).toFixed(0).padStart(2, '0');
    const year = new Date().getUTCFullYear();
    const fileName = `${year}-${month}-${day-1}_${year}-${month}-${day}.json`;
    const dataURL = `${path}/${fileName}`;
    const data = await d3.json(dataURL);
    if (!data){
        // TODO: throw error
        console.log('Failed to load data.')
        throw new Error('Failed to load data.');
    }
    return data as Record<Key, number[]>;
}