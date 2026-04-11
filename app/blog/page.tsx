import type { Metadata } from "next";
import Link from "next/link";

import { BlogCoverImage } from "@/components/blog/BlogCoverImage";
import { BlogPagination } from "@/components/blog/BlogPagination";
import {
  BLOG_POSTS,
  BLOG_PAGE_SIZE,
  getBlogPageCount,
  getBlogPostsPage,
} from "@/lib/content/blog";

export const metadata: Metadata = {
  title: "Blog | OpenSpot",
  description:
    "Guías largas para abrir negocio en España: hostelería, retail, datos INE, alquileres y franquicias. Información accionable enlazada al analizador.",
};

type Props = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function BlogPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const raw = sp.page ?? "1";
  const parsed = parseInt(raw, 10);
  const page = Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
  const totalPages = getBlogPageCount();
  const safePage = Math.min(page, totalPages);
  const posts = getBlogPostsPage(safePage);

  return (
    <main className="mx-auto max-w-5xl flex-1 px-4 py-16 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Recursos
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-[2rem]">Blog</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
          Artículos extensos para decidir ubicación, leer el mercado y preparar informes. Cada pieza
          enlaza al{" "}
          <Link
            href="/analyze"
            className="font-semibold text-[var(--accent)] underline decoration-[var(--accent)]/30 underline-offset-4 hover:decoration-[var(--accent)]"
          >
            analizador
          </Link>{" "}
          cuando quieras pasar de teoría a números.
        </p>
      </header>

      <p className="mt-8 text-[13px] text-[var(--muted)]">
        {BLOG_POSTS.length} artículos · {BLOG_PAGE_SIZE} por página
      </p>

      <ul className="mt-6 grid gap-8 sm:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-[box-shadow,transform] hover:border-[var(--border-strong)] hover:shadow-md">
              <Link
                href={`/blog/${post.slug}`}
                className="relative block aspect-[16/10] min-h-[11rem] w-full overflow-hidden bg-[var(--muted-bg)]"
              >
                <BlogCoverImage
                  src={post.image}
                  alt={post.imageAlt}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  priority={safePage === 1 && posts.indexOf(post) < 2}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="pointer-events-none absolute left-3 top-3 z-[1] rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  {post.category}
                </span>
              </Link>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <time
                  dateTime={post.publishedAt}
                  className="text-[12px] font-medium text-[var(--muted)]"
                >
                  {new Date(post.publishedAt + "T12:00:00").toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  · {post.readTimeMin} min
                </time>
                <h2 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-[var(--foreground)]">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-[var(--muted)]">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-5 inline-flex text-[13px] font-semibold text-[var(--accent)]"
                >
                  Leer artículo →
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <BlogPagination currentPage={safePage} totalPages={totalPages} />
    </main>
  );
}
