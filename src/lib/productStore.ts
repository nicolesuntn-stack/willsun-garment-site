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
  images: string[];
  videos: string[];
  isActive: boolean;
  zh: LocalizedProductFields;
  en: LocalizedProductFields;
};

type ProductRow = {
  slug: string;
  category: ProductCategory;
  image: string;
  images_json?: string | null;
  videos_json?: string | null;
  is_active: number;
  zh_name: string;
  zh_summary: string;
  zh_overview: string;
  zh_fabric: string;
  zh_sizes: string;
  zh_colors: string;
  en_name: string;
  en_summary: string;
  en_overview: string;
  en_fabric: string;
  en_sizes: string;
  en_colors: string;
};

type D1Result<T> = {
  results: T[];
};

type D1Prepared = {
  all: <T>() => Promise<D1Result<T>>;
  bind: (...values: Array<string | number>) => {
    all: <T>() => Promise<D1Result<T>>;
    run: () => Promise<unknown>;
    first: <T>() => Promise<T | null>;
  };
};

type D1Database = {
  prepare: (query: string) => D1Prepared;
};

type RequestContextEnv = {
  DB?: D1Database;
};

let memoryStore: ProductRecord[] = Array.isArray(seedData.items)
  ? (seedData.items as Array<Omit<ProductRecord, "isActive">>).map((item) => ({
      ...item,
      images: "images" in item && Array.isArray((item as { images?: unknown }).images)
        ? ((item as { images: string[] }).images)
        : [item.image],
      videos: "videos" in item && Array.isArray((item as { videos?: unknown }).videos)
        ? ((item as { videos: string[] }).videos)
        : [],
      isActive: true
    }))
  : [];

function safeJsonArray(raw: string | null | undefined): string[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((entry) => typeof entry === "string") as string[];
  } catch {
    return [];
  }
}

function toRecord(row: ProductRow): ProductRecord {
  const images = safeJsonArray(row.images_json);
  const videos = safeJsonArray(row.videos_json);

  return {
    slug: row.slug,
    category: row.category,
    image: images[0] ?? row.image,
    images: images.length ? images : [row.image],
    videos,
    isActive: row.is_active === 1,
    zh: {
      name: row.zh_name,
      summary: row.zh_summary,
      overview: row.zh_overview,
      fabric: row.zh_fabric,
      sizes: row.zh_sizes,
      colors: row.zh_colors
    },
    en: {
      name: row.en_name,
      summary: row.en_summary,
      overview: row.en_overview,
      fabric: row.en_fabric,
      sizes: row.en_sizes,
      colors: row.en_colors
    }
  };
}

function safeGetDb(): D1Database | null {
  try {
    const moduleName = "@cloudflare/" + "next-on-pages";
    const req = Function("return require")() as (id: string) => unknown;
    const module = req(moduleName) as {
      getRequestContext?: () => { env: RequestContextEnv };
    };

    const getRequestContext = module.getRequestContext;
    if (!getRequestContext) {
      return null;
    }

    const context = getRequestContext();
    return context?.env?.DB ?? null;
  } catch {
    return null;
  }
}

export async function getProductRecords(options?: {
  includeInactive?: boolean;
}): Promise<ProductRecord[]> {
  const includeInactive = Boolean(options?.includeInactive);
  const db = safeGetDb();

  if (!db) {
    return includeInactive ? memoryStore : memoryStore.filter((item) => item.isActive);
  }

  const query = includeInactive
    ? `SELECT * FROM products ORDER BY rowid DESC`
    : `SELECT * FROM products WHERE is_active = 1 ORDER BY rowid DESC`;

  const result = await db.prepare(query).all<ProductRow>();
  if (!result.results.length) {
    return includeInactive ? memoryStore : memoryStore.filter((item) => item.isActive);
  }

  return result.results.map(toRecord);
}

export async function createProductRecord(record: ProductRecord): Promise<void> {
  const db = safeGetDb();

  if (!db) {
    memoryStore = [record, ...memoryStore];
    return;
  }

  await db
    .prepare(
      `INSERT INTO products (
        slug, category, image, images_json, videos_json, is_active,
        zh_name, zh_summary, zh_overview, zh_fabric, zh_sizes, zh_colors,
        en_name, en_summary, en_overview, en_fabric, en_sizes, en_colors,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
    )
    .bind(
      record.slug,
      record.category,
      record.images[0] ?? record.image,
      JSON.stringify(record.images),
      JSON.stringify(record.videos),
      record.isActive ? 1 : 0,
      record.zh.name,
      record.zh.summary,
      record.zh.overview,
      record.zh.fabric,
      record.zh.sizes,
      record.zh.colors,
      record.en.name,
      record.en.summary,
      record.en.overview,
      record.en.fabric,
      record.en.sizes,
      record.en.colors
    )
    .run();
}

export async function updateProductRecord(record: ProductRecord): Promise<boolean> {
  const db = safeGetDb();

  if (!db) {
    const index = memoryStore.findIndex((item) => item.slug === record.slug);
    if (index < 0) {
      return false;
    }

    memoryStore[index] = record;
    return true;
  }

  const existing = await db
    .prepare(`SELECT slug FROM products WHERE slug = ?`)
    .bind(record.slug)
    .first<{ slug: string }>();

  if (!existing) {
    return false;
  }

  await db
    .prepare(
      `UPDATE products
       SET category = ?, image = ?, images_json = ?, videos_json = ?, is_active = ?,
           zh_name = ?, zh_summary = ?, zh_overview = ?, zh_fabric = ?, zh_sizes = ?, zh_colors = ?,
           en_name = ?, en_summary = ?, en_overview = ?, en_fabric = ?, en_sizes = ?, en_colors = ?,
           updated_at = datetime('now')
       WHERE slug = ?`
    )
    .bind(
      record.category,
      record.images[0] ?? record.image,
      JSON.stringify(record.images),
      JSON.stringify(record.videos),
      record.isActive ? 1 : 0,
      record.zh.name,
      record.zh.summary,
      record.zh.overview,
      record.zh.fabric,
      record.zh.sizes,
      record.zh.colors,
      record.en.name,
      record.en.summary,
      record.en.overview,
      record.en.fabric,
      record.en.sizes,
      record.en.colors,
      record.slug
    )
    .run();

  return true;
}

export async function setProductActive(slug: string, isActive: boolean): Promise<boolean> {
  const db = safeGetDb();

  if (!db) {
    const index = memoryStore.findIndex((item) => item.slug === slug);
    if (index < 0) {
      return false;
    }

    memoryStore[index] = {
      ...memoryStore[index],
      isActive
    };
    return true;
  }

  const existing = await db
    .prepare(`SELECT slug FROM products WHERE slug = ?`)
    .bind(slug)
    .first<{ slug: string }>();

  if (!existing) {
    return false;
  }

  await db
    .prepare(`UPDATE products SET is_active = ?, updated_at = datetime('now') WHERE slug = ?`)
    .bind(isActive ? 1 : 0, slug)
    .run();

  return true;
}

export function toLocalizedProduct(record: ProductRecord, locale: Locale) {
  const fields = record[locale];
  return {
    slug: record.slug,
    category: record.category,
    image: record.images[0] ?? record.image,
    images: record.images,
    videos: record.videos,
    ...fields
  };
}
