import publicationPatterns from "../data/publication-patterns.json";

export interface WriteupPublicationData {
  status?: string;
  publicationBasis?: string;
}

export function isPublicWriteup(data: WriteupPublicationData): boolean {
  return data.status === "public" && Boolean(data.publicationBasis?.trim());
}

export function findForbiddenPublicContent(
  text: string,
  _path: string
): string[] {
  return publicationPatterns
    .filter((item) => new RegExp(item.source, item.flags).test(text))
    .map((item) => item.label);
}
