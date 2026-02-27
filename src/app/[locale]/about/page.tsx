import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCopy } from "@/lib/copy";
import { isLocale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  const copy = getCopy(locale);
  return buildPageMetadata({
    title: copy.about.seo.title,
    description: copy.about.seo.description,
    canonicalPath: `/${locale}/about`
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getCopy(locale);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-ink">{copy.about.title}</h1>
      <div className="mt-5 space-y-4 text-slate-600">
        {copy.about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-ink">{copy.about.videoTitle}</h2>
        <div className="mt-4 flex h-64 items-center justify-center rounded-lg bg-soft text-slate-500">
          Video Placeholder
        </div>
      </section>

      <Link
        href={`/${locale}/contact`}
        className="mt-8 inline-block rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white"
      >
        {copy.about.cta}
      </Link>
    </div>
  );
}
