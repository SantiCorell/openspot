import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/blog/ArticleBody";
import { BlogCoverImage } from "@/components/blog/BlogCoverImage";
import { BlogPostingJsonLd } from "@/components/seo/BlogPostingJsonLd";
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/content/blog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Artículo | OpenSpot" };
  return {
    title: `${post.title} | Blog OpenSpot`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image, alt: post.imageAlt }],
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const published = new Date(post.publishedAt + "T12:00:00").toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
      <BlogPostingJsonLd post={post} />
      <nav className="text-[13px] text-[var(--muted)]">
        <Link href="/blog" className="font-medium text-[var(--accent)] hover:underline">
          ← Blog
        </Link>
        <span className="mx-2 opacity-50">/</span>
        <span className="text-[var(--foreground)]">{post.category}</span>
      </nav>

      <header className="mt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          {published} · {post.readTimeMin} min de lectura
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-[2.25rem] sm:leading-tight">
          {post.title}
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-[var(--muted)]">{post.excerpt}</p>
      </header>

      <div className="relative mt-10 aspect-video min-h-[14rem] w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--muted-bg)] shadow-sm sm:aspect-[16/9] sm:min-h-[16rem]">
        <BlogCoverImage
          src={post.image}
          alt={post.imageAlt}
          sizes="(max-width: 768px) 100vw, 42rem"
          priority
          className="object-cover"
        />
      </div>

      <ArticleBody blocks={post.blocks} />

      <footer className="mt-14 border-t border-[var(--border)] pt-10">
        <p className="text-[15px] font-medium text-[var(--foreground)]">
          ¿Quieres el mismo razonamiento aplicado a tu municipio?
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--muted)]">
          En{" "}
          <Link href="/producto/resultados" className="font-semibold text-[var(--accent)] hover:underline">
            Producto → Entender resultados
          </Link>{" "}
          explicamos cada métrica del informe. Luego genera el tuyo en el analizador.
        </p>
        <Link
          href="/login?callbackUrl=/analyze"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-[13px] font-semibold text-white shadow-sm shadow-indigo-500/25 transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
        >
          Crear informe con datos
        </Link>
      </footer>
    </main>
  );
}
