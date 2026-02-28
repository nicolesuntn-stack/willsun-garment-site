import { NextResponse } from "next/server";

import {
  createProductRecord,
  getProductRecords,
  setProductActive,
  updateProductRecord,
  type LocalizedProductFields,
  type ProductCategory,
  type ProductRecord
} from "@/lib/productStore";

export const runtime = "edge";

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

function normalizeMediaArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export async function GET(request: Request) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await getProductRecords({ includeInactive: true });
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

  const items = await getProductRecords({ includeInactive: true });
  const exists = items.some((item) => item.slug === slugBase);
  if (exists) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
  }

  const next: ProductRecord = {
    slug: slugBase,
    category: body.category,
    image: body.image?.trim() || "/images/products/product-placeholder.jpg",
    images: normalizeMediaArray(body.images),
    videos: normalizeMediaArray(body.videos),
    en: body.en,
    zh: body.zh,
    isActive: body.isActive ?? true
  };

  if (!next.images.length) {
    next.images = [next.image];
  }
  next.image = next.images[0];

  await createProductRecord(next);

  return NextResponse.json({ ok: true, item: next });
}

export async function PUT(request: Request) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<ProductRecord>;

  if (!body.slug?.trim()) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  if (!body.category || !allowedCategories.includes(body.category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  if (!validateFields(body.en) || !validateFields(body.zh)) {
    return NextResponse.json({ error: "Invalid localized fields" }, { status: 400 });
  }

  const next: ProductRecord = {
    slug: body.slug.trim(),
    category: body.category,
    image: body.image?.trim() || "/images/products/product-placeholder.jpg",
    images: normalizeMediaArray(body.images),
    videos: normalizeMediaArray(body.videos),
    en: body.en,
    zh: body.zh,
    isActive: body.isActive ?? true
  };

  if (!next.images.length) {
    next.images = [next.image];
  }
  next.image = next.images[0];

  const updated = await updateProductRecord(next);
  if (!updated) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, item: next });
}

export async function PATCH(request: Request) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    slug?: string;
    isActive?: boolean;
  };

  if (!body.slug?.trim() || typeof body.isActive !== "boolean") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const updated = await setProductActive(body.slug.trim(), body.isActive);
  if (!updated) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
