import * as d3 from "d3";

export type PlotDatum = [number, number];
export type Key = "kdpt_diffusion_anime" | "v4_anime_upscaler" | "v4_diffusion" | "v4_upscaler" | "v5_diffusion" | "v5_diffusion_anime";
export const testKey = 'v5_diffusion_anime';

/** Returns data based on date. */
export async function getYesterdayData(path: string = "../metrics/relax"): Promise<Record<Key, number[]>>{
    const day = new Date().getUTCDate();
    const month = (new Date().getUTCMonth() + 1).toFixed(0).padStart(2, '0');
    const year = new Date().getUTCFullYear();
    const fileName = `${year}-${month}-${day-1}_${year}-${month}-${day}.json`;
    const dataURL = `${path}/${fileName}`;
    const data = await d3.json(dataURL);
    if (!data){
        // TODO: throw error
    }
    return data as Record<Key, number[]>;
}