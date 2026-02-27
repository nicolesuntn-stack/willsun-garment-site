import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

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

type ProductStore = {
  items: ProductRecord[];
};

const dataPath = path.join(process.cwd(), "data", "products.json");

async function readStore(): Promise<ProductStore> {
  const file = await fs.readFile(dataPath, "utf8");
  const parsed = JSON.parse(file) as ProductStore;

  if (!Array.isArray(parsed.items)) {
    return { items: [] };
  }

  return parsed;
}

export async function getProductRecords(): Promise<ProductRecord[]> {
  const store = await readStore();
  return store.items;
}

export async function saveProductRecords(items: ProductRecord[]): Promise<void> {
  const payload: ProductStore = { items };
  await fs.writeFile(dataPath, JSON.stringify(payload, null, 2), "utf8");
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
