import { NextResponse } from "next/server";

import {
  getProductRecords,
  saveProductRecords,
  type LocalizedProductFields,
  type ProductCategory,
  type ProductRecord
} from "@/lib/productStore";

const allowedCategories: ProductCategory[] = ["shirts", "pants", "outerwear"];

function isAuthed(request: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return false;
  }

  const provided = request.headers.get("x-admin-password");
  return provided === expected;
}

function validateFields(value: unknown): value is LocalizedProductFields {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;
  return ["name", "summary", "overview", "fabric", "sizes", "colors"].every(
    (key) => typeof payload[key] === "string" && payload[key].trim().length > 0
  );
}

function normalizeSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET(request: Request) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await getProductRecords();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<ProductRecord>;

  if (!body.category || !allowedCategories.includes(body.category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  if (!validateFields(body.en) || !validateFields(body.zh)) {
    return NextResponse.json({ error: "Invalid localized fields" }, { status: 400 });
  }

  const slugBase = body.slug?.trim() || normalizeSlug(body.en.name);
  if (!slugBase) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const items = await getProductRecords();
  const exists = items.some((item) => item.slug === slugBase);
  if (exists) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
  }

  const next: ProductRecord = {
    slug: slugBase,
    category: body.category,
    image: body.image?.trim() || "/images/products/product-placeholder.jpg",
    en: body.en,
    zh: body.zh
  };

  items.push(next);
  await saveProductRecords(items);

  return NextResponse.json({ ok: true, item: next });
}
