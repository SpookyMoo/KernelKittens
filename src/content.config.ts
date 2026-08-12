import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const writeups = defineCollection({
  loader: glob({
    base: "./src/content/writeups",
    pattern: "**/*.md"
  }),
  schema: z.object({
    title: z.string().min(1),
    event: z.string().min(1),
    category: z.string().min(1),
    difficulty: z.enum(["easy", "medium", "hard", "insane", "unknown"]),
    publishedAt: z.coerce.date(),
    summary: z.string().min(1),
    authors: z.array(z.string().min(1)).min(1),
    status: z.literal("public"),
    publicationBasis: z.string().min(10),
    featured: z.boolean().default(false),
    eventUrl: z.url().optional(),
    sourceUrl: z.url().optional(),
    ctfTimeUrl: z.url().optional()
  })
});

export const collections = { writeups };
