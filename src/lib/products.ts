import type { Locale } from "@/lib/i18n";
import {
  getProductRecords,
  toLocalizedProduct,
  type ProductCategory,
  type ProductRecord
} from "@/lib/productStore";

export type { ProductCategory, ProductRecord };

export type ProductItem = {
  slug: string;
  category: ProductCategory;
  image: string;
  images: string[];
  videos: string[];
  name: string;
  summary: string;
  overview: string;
  fabric: string;
  sizes: string;
  colors: string;
};

export async function getAllProducts(locale: Locale): Promise<ProductItem[]> {
  const records = await getProductRecords();
  return records.map((record) => toLocalizedProduct(record, locale));
}

export async function getProductBySlug(
  locale: Locale,
  slug: string
): Promise<ProductItem | undefined> {
  const records = await getProductRecords();
  const found = records.find((item) => item.slug === slug);
  if (!found) {
    return undefined;
  }

  return toLocalizedProduct(found, locale);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const records = await getProductRecords();
  return records.map((record) => record.slug);
}

export async function getAllProductRecords(): Promise<ProductRecord[]> {
  return getProductRecords();
}
