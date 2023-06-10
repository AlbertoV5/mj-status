// https://docs.astro.build/en/guides/content-collections/
import { z, defineCollection } from 'astro:content';
const articlesCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        summary: z.string(),
        tags: z.array(z.string()),
        thumbnail: z.string(),
        date: z.date(),
    }),
});
const projectsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        summary: z.string().max(150),
        tags: z.array(z.string()).max(5),
        thumbnail: z.string(),
        date: z.date(),
    }),
});
export const collections = {
    'articles': articlesCollection,
    'projects': projectsCollection
};

export interface EntryData {
    date: Date
    title: string
    tags: string[]
    summary: string
    thumbnail: string
}
export interface Entry {
    slug: string
    data: EntryData
}