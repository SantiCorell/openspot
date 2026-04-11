export type BlogBodyBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "cta"; title: string; text: string; href: string; buttonLabel: string };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTimeMin: number;
  category: string;
  image: string;
  imageAlt: string;
  blocks: BlogBodyBlock[];
}
