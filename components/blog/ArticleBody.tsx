import Link from "next/link";

import type { BlogBodyBlock } from "@/lib/content/blog";

export function ArticleBody({ blocks }: { blocks: BlogBodyBlock[] }) {
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-p:text-[15px] prose-p:leading-relaxed prose-li:text-[15px] prose-li:leading-relaxed">
      {blocks.map((b, i) => {
        if (b.type === "h2") {
          return (
            <h2
              key={i}
              className="mt-10 text-xl font-semibold tracking-tight text-[var(--foreground)] first:mt-0 sm:text-2xl"
            >
              {b.text}
            </h2>
          );
        }
        if (b.type === "p") {
          return (
            <p key={i} className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
              {b.text}
            </p>
          );
        }
        if (b.type === "ul") {
          return (
            <ul
              key={i}
              className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-[var(--muted)]"
            >
              {b.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }
        if (b.type === "cta") {
          return (
            <div
              key={i}
              className="not-prose mt-8 rounded-2xl border border-[var(--border)] bg-gradient-to-br from-indigo-500/[0.07] to-violet-500/[0.05] p-6 sm:p-8"
            >
              <p className="text-lg font-semibold text-[var(--foreground)]">{b.title}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--muted)]">{b.text}</p>
              <Link
                href={b.href}
                className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-[13px] font-semibold text-white shadow-sm shadow-indigo-500/25 transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
              >
                {b.buttonLabel}
              </Link>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
