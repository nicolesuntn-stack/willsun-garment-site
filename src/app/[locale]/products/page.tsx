import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { isLocale } from "@/lib/i18n";
import { getAllProducts, type ProductCategory } from "@/lib/products";
import { buildPageMetadata } from "@/lib/seo";

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export const dynamic = "force-dynamic";

const allowedCategories: ProductCategory[] = ["shirts", "pants", "outerwear"];

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  return buildPageMetadata({
    title:
      locale === "zh"
        ? "服装产品中心｜衬衫/裤装/外套｜Willsun"
        : "Woven Clothing Products | Shirts Pants Outerwear | Willsun",
    description:
      locale === "zh"
        ? "按品类浏览服装并快速发起询盘。"
        : "Browse woven clothing categories and start your inquiry.",
    canonicalPath: `/${locale}/products`
  });
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = await params;
  const { category } = await searchParams;

  if (!isLocale(locale)) {
    notFound();
  }

  const allProducts = await getAllProducts(locale);
  const activeCategory =
    category && allowedCategories.includes(category as ProductCategory)
      ? (category as ProductCategory)
      : "all";

  const filtered =
    activeCategory === "all"
      ? allProducts
      : allProducts.filter((item) => item.category === activeCategory);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-ink">
        {locale === "zh" ? "产品中心" : "Products"}
      </h1>
      <p className="mt-3 text-slate-600">
        {locale === "zh"
          ? "按品类浏览服装，选择目标款式后可直接发起询盘。"
          : "Browse garments by category and start your inquiry directly from each product."}
      </p>

      <div className="mt-6">
        <ProductFilters
          options={[
            { value: "all", label: locale === "zh" ? "全部" : "All" },
            { value: "shirts", label: locale === "zh" ? "衬衫" : "Shirts" },
            { value: "pants", label: locale === "zh" ? "裤装" : "Pants" },
            { value: "outerwear", label: locale === "zh" ? "外套" : "Outerwear" }
          ]}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard
            key={product.slug}
            locale={locale}
            product={product}
            viewLabel={locale === "zh" ? "查看详情" : "View Details"}
            quickInquiryLabel={locale === "zh" ? "快速询价" : "Quick Inquiry"}
          />
        ))}
      </div>

      <p className="mt-6 text-sm text-slate-500">
        {locale === "zh"
          ? "产品库数量不设上限，可随时新增。"
          : "Product library has no fixed limit and can be expanded anytime."}
      </p>
    </div>
  );
}
