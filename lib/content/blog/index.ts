import { BLOG_POSTS_A } from "./posts-a";
import { BLOG_POSTS_B } from "./posts-b";
import { BLOG_POSTS_C } from "./posts-c";
import type { BlogPost } from "./types";

export type { BlogBodyBlock, BlogPost } from "./types";

export const BLOG_POSTS: BlogPost[] = [...BLOG_POSTS_A, ...BLOG_POSTS_B, ...BLOG_POSTS_C].sort(
  (a, b) => (a.publishedAt < b.publishedAt ? 1 : -1),
);

export const BLOG_PAGE_SIZE = 6;

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}

export function getBlogPageCount(): number {
  return Math.max(1, Math.ceil(BLOG_POSTS.length / BLOG_PAGE_SIZE));
}

export function getBlogPostsPage(page: number): BlogPost[] {
  const safe = Math.max(1, Math.min(page, getBlogPageCount()));
  const start = (safe - 1) * BLOG_PAGE_SIZE;
  return BLOG_POSTS.slice(start, start + BLOG_PAGE_SIZE);
}
