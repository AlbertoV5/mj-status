// https://docs.astro.build/en/guides/content-collections/
import { z, defineCollection } from 'astro:content';
const articleCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        tags: z.array(z.string()),
        image: z.string().optional(),
    }),
});
const slots = z.object({
    name: z.string(),
    component: z.string(),
})
const projectCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        summary: z.string(),
        tags: z.array(z.string()),
        thumbnail: z.string(),
        slots: z.array(slots),
    }),
});
export const collections = {
    'article': articleCollection,
    'project': projectCollection
};