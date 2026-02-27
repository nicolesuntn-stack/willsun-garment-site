import seedData from "../../data/products.json";

import type { Locale } from "@/lib/i18n";

export type ProductCategory = "shirts" | "pants" | "outerwear";

export type LocalizedProductFields = {
  name: string;
  summary: string;
  overview: string;
  fabric: string;
  sizes: string;
  colors: string;
};

export type ProductRecord = {
  slug: string;
  category: ProductCategory;
  image: string;
  zh: LocalizedProductFields;
  en: LocalizedProductFields;
};

export type ProductStore = {
  items: ProductRecord[];
};
let memoryStore: ProductStore = {
  items: Array.isArray(seedData.items) ? (seedData.items as ProductRecord[]) : []
};

export async function getProductRecords(): Promise<ProductRecord[]> {
  return memoryStore.items;
}

export async function saveProductRecords(items: ProductRecord[]): Promise<void> {
  memoryStore = { items };
}

export function toLocalizedProduct(record: ProductRecord, locale: Locale) {
  const fields = record[locale];
  return {
    slug: record.slug,
    category: record.category,
    image: record.image,
    ...fields
  };
}
