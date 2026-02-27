import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CTAButtons } from "@/components/shared/CTAButtons";
import { getCopy } from "@/lib/copy";
import { isLocale } from "@/lib/i18n";
import { getProductBySlug } from "@/lib/products";
import { buildPageMetadata } from "@/lib/seo";

type ProductDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  const product = await getProductBySlug(locale, slug);
  if (!product) {
    return {};
  }

  return buildPageMetadata({
    title: `${product.name} | ${locale === "zh" ? "服装供应" : "Garment Supply"}`,
    description: product.summary,
    canonicalPath: `/${locale}/products/${slug}`
  });
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const product = await getProductBySlug(locale, slug);
  if (!product) {
    notFound();
  }

  const copy = getCopy(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
      <Link href={`/${locale}/products`} className="text-sm text-primary underline">
        {locale === "zh" ? "返回产品中心" : "Back to Products"}
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-6 h-64 rounded-lg bg-soft" />
          <h1 className="text-3xl font-bold text-ink">{product.name}</h1>
          <p className="mt-3 text-slate-600">{product.summary}</p>

          <dl className="mt-8 space-y-4">
            <div>
              <dt className="text-sm font-semibold text-ink">
                {locale === "zh" ? "产品简介" : "Product Overview"}
              </dt>
              <dd className="mt-1 text-sm text-slate-600">{product.overview}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-ink">
                {locale === "zh" ? "面料成分" : "Fabric Composition"}
              </dt>
              <dd className="mt-1 text-sm text-slate-600">{product.fabric}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-ink">
                {locale === "zh" ? "尺码" : "Available Sizes"}
              </dt>
              <dd className="mt-1 text-sm text-slate-600">{product.sizes}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-ink">
                {locale === "zh" ? "颜色" : "Available Colors"}
              </dt>
              <dd className="mt-1 text-sm text-slate-600">{product.colors}</dd>
            </div>
          </dl>
        </article>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-ink">
            {locale === "zh" ? "询价此产品" : "Inquire About This Product"}
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            {locale === "zh"
              ? "告诉我们您的采购需求，我们将尽快回复报价与打样建议。"
              : "Share your sourcing requirements and we will reply with quotation and sampling suggestions."}
          </p>
          <div className="mt-4">
            <CTAButtons
              whatsappLabel={copy.common.cta.whatsapp}
              emailLabel={copy.common.cta.email}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
