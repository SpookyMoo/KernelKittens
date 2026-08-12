import { getCollection } from "astro:content";
import { siteConfig } from "../config/site";
import { isPublicWriteup } from "../lib/publication";

export const prerender = true;

const fixedPaths = ["/", "/results/", "/writeups/", "/accessibility/"];

export async function GET(): Promise<Response> {
  const writeups = (await getCollection("writeups")).filter((entry) =>
    isPublicWriteup(entry.data)
  );
  const paths = [
    ...fixedPaths,
    ...writeups.map((entry) => `/writeups/${entry.id}/`)
  ];
  const urls = paths
    .map((path) => `  <url><loc>${new URL(path, siteConfig.origin)}</loc></url>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
}
