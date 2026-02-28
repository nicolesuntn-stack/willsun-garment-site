import Link from "next/link";

import { AddToCartButton } from "@/components/shared/AddToCartButton";
import type { ProductItem } from "@/lib/products";
import type { Locale } from "@/lib/i18n";

type ProductCardProps = {
  locale: Locale;
  product: ProductItem;
  viewLabel: string;
  quickInquiryLabel: string;
};

export function ProductCard({ locale, product, viewLabel, quickInquiryLabel }: ProductCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 h-40 rounded-lg bg-soft" />
      <h3 className="text-lg font-semibold text-ink">{product.name}</h3>
      <p className="mt-2 text-sm text-slate-600">{product.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/${locale}/products/${product.slug}`}
          className="rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary"
        >
          {viewLabel}
        </Link>
        <Link
          href={`/${locale}/contact`}
          className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white"
        >
          {quickInquiryLabel}
        </Link>
        <AddToCartButton
          item={{
            slug: product.slug,
            name: product.name,
            category: product.category
          }}
          addLabel={locale === "zh" ? "加入购物车" : "Add to Cart"}
          addedLabel={locale === "zh" ? "已加入采购车" : "Added to cart"}
          existsLabel={locale === "zh" ? "采购车中已存在" : "Already in cart"}
        />
      </div>
    </article>
  );
}
