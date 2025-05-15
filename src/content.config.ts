import { glob } from "astro/loaders";
import { defineCollection, getCollection, z, type CollectionEntry } from "astro:content";

export const cantiche = ["inferno", "purgatorio", "paradiso"] as const;
export type Cantica = (typeof cantiche)[number];
export type Canto = CollectionEntry<"analisiCanti">;
export type Analisi = Canto["data"]["analisi"][number];

export function getAnalisiCantica(cantica: Cantica) {
  return getCollection("analisiCanti", (a: Canto) => a.data.cantica === cantica)
}

const analisiCanti = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/analisi" }),
  schema: z.object({
    cantica: z.enum(cantiche),
    canto: z.number().min(1).max(33),
    data: z.coerce.date(),
    analisi: z.array(
      z.object({
        titolo: z.string(), // o autore
        url: z.string(),
      })
    ),
  }),
});

const commento = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/commento" }),
});

export const collections = { analisiCanti, commento };
