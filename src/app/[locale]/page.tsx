import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CTAButtons } from "@/components/shared/CTAButtons";
import { getCopy } from "@/lib/copy";
import { buildPageMetadata } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export const runtime = "edge";

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  const copy = getCopy(locale);
  return buildPageMetadata({
    title: copy.home.seo.title,
    description: copy.home.seo.description,
    canonicalPath: `/${locale}`
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getCopy(locale);
  const categories = [
    { key: "shirts", label: locale === "zh" ? "衬衫" : "Shirts" },
    { key: "pants", label: locale === "zh" ? "裤装" : "Pants" },
    { key: "outerwear", label: locale === "zh" ? "外套" : "Outerwear" }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">{copy.home.hero.title}</h1>
        <p className="mt-4 max-w-3xl text-base text-slate-600">{copy.home.hero.subtitle}</p>
        <div className="mt-6">
          <CTAButtons
            whatsappLabel={copy.common.cta.whatsapp}
            emailLabel={copy.common.cta.email}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-ink">{copy.home.advantages.title}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {copy.home.advantages.items.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-ink">{copy.home.categories.title}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.key}
              href={`/${locale}/products?category=${category.key}`}
              className="rounded-xl border border-slate-200 bg-white p-5 text-center text-lg font-semibold text-ink"
            >
              {category.label}
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
