"use client";

import { useMemo, useState, type FormEvent } from "react";

import type { ProductCategory, ProductRecord } from "@/lib/productStore";
import type { Locale } from "@/lib/i18n";

type AdminPanelProps = {
  locale: Locale;
};

type FormState = {
  slug: string;
  category: ProductCategory;
  image: string;
  images: string[];
  videos: string[];
  isActive: boolean;
  zh: {
    name: string;
    summary: string;
    overview: string;
    fabric: string;
    sizes: string;
    colors: string;
  };
  en: {
    name: string;
    summary: string;
    overview: string;
    fabric: string;
    sizes: string;
    colors: string;
  };
};

const initialForm: FormState = {
  slug: "",
  category: "shirts",
  image: "/images/products/product-placeholder.jpg",
  images: ["/images/products/product-placeholder.jpg"],
  videos: [],
  isActive: true,
  zh: { name: "", summary: "", overview: "", fabric: "", sizes: "", colors: "" },
  en: { name: "", summary: "", overview: "", fabric: "", sizes: "", colors: "" }
};

function toMultiline(items: string[]): string {
  return items.join("\n");
}

function parseMultiline(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function AdminPanel({ locale }: AdminPanelProps) {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [imagesInput, setImagesInput] = useState(toMultiline(initialForm.images));
  const [videosInput, setVideosInput] = useState("");

  const t = useMemo(
    () =>
      locale === "zh"
        ? {
            loginTip: "输入后台密码后可查看、新增、编辑、上下架产品，并支持多图/视频",
            password: "后台密码",
            login: "进入后台",
            current: "当前产品",
            add: "新增产品",
            edit: "编辑产品",
            submitCreate: "保存产品",
            submitEdit: "更新产品",
            cancelEdit: "取消编辑",
            category: "品类",
            slug: "Slug（新增可留空自动生成）",
            image: "主图URL（可留空，自动取首张图片）",
            images: "图片URL（每行一条，不限数量）",
            videos: "视频URL（每行一条，可为空）",
            autoTranslate: "中文自动翻译英文",
            status: "状态",
            onShelf: "上架",
            offShelf: "下架",
            setOn: "设为上架",
            setOff: "设为下架",
            editBtn: "编辑",
            zhBlock: "中文内容",
            enBlock: "英文内容（可手动改）",
            fieldName: "名称",
            fieldSummary: "简介",
            fieldOverview: "产品介绍",
            fieldFabric: "面料成分",
            fieldSizes: "尺码",
            fieldColors: "颜色"
          }
        : {
            loginTip: "Enter admin password to create/edit/publish products with multiple images and videos",
            password: "Admin Password",
            login: "Enter",
            current: "Current Products",
            add: "Create Product",
            edit: "Edit Product",
            submitCreate: "Save Product",
            submitEdit: "Update Product",
            cancelEdit: "Cancel Edit",
            category: "Category",
            slug: "Slug (optional for create)",
            image: "Primary image URL (optional)",
            images: "Image URLs (one per line, unlimited)",
            videos: "Video URLs (one per line, optional)",
            autoTranslate: "Auto-translate Chinese to English",
            status: "Status",
            onShelf: "Published",
            offShelf: "Unpublished",
            setOn: "Publish",
            setOff: "Unpublish",
            editBtn: "Edit",
            zhBlock: "Chinese Content",
            enBlock: "English Content (editable)",
            fieldName: "Name",
            fieldSummary: "Summary",
            fieldOverview: "Overview",
            fieldFabric: "Fabric",
            fieldSizes: "Sizes",
            fieldColors: "Colors"
          },
    [locale]
  );

  async function fetchProducts(pwd: string) {
    const response = await fetch("/api/admin/products", {
      headers: { "x-admin-password": pwd }
    });

    if (!response.ok) {
      throw new Error("Unauthorized");
    }

    const data = (await response.json()) as { items: ProductRecord[] };
    setProducts(data.items);
  }

  async function onLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await fetchProducts(password);
      setAuthed(true);
      setMessage(locale === "zh" ? "登录成功" : "Logged in");
    } catch {
      setMessage(locale === "zh" ? "密码错误或未配置ADMIN_PASSWORD" : "Invalid password or missing ADMIN_PASSWORD");
    } finally {
      setLoading(false);
    }
  }

  function updateLocaleField(lang: "zh" | "en", key: keyof FormState["zh"], value: string) {
    setForm((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [key]: value
      }
    }));
  }

  async function translateZhToEn() {
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password
      },
      body: JSON.stringify({ zh: form.zh })
    });

    const data = (await response.json()) as {
      en?: FormState["en"];
      warning?: string;
      error?: string;
      fallback?: FormState["en"];
    };

    if (response.ok && data.en) {
      setForm((prev) => ({ ...prev, en: data.en as FormState["en"] }));
      setMessage(data.warning ?? (locale === "zh" ? "已自动翻译，可手动修改。" : "Translated. You can edit manually."));
      setLoading(false);
      return;
    }

    if (data.fallback) {
      setForm((prev) => ({ ...prev, en: data.fallback as FormState["en"] }));
    }

    setMessage(data.error ?? (locale === "zh" ? "翻译失败" : "Translation failed"));
    setLoading(false);
  }

  function startEdit(item: ProductRecord) {
    setMode("edit");
    setForm({
      slug: item.slug,
      category: item.category,
      image: item.image,
      images: item.images?.length ? item.images : [item.image],
      videos: item.videos ?? [],
      isActive: item.isActive,
      zh: { ...item.zh },
      en: { ...item.en }
    });
    setImagesInput(toMultiline(item.images?.length ? item.images : [item.image]));
    setVideosInput(toMultiline(item.videos ?? []));
    setMessage("");
  }

  function cancelEdit() {
    setMode("create");
    setForm(initialForm);
    setImagesInput(toMultiline(initialForm.images));
    setVideosInput("");
    setMessage("");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const parsedImages = parseMultiline(imagesInput);
    const parsedVideos = parseMultiline(videosInput);
    const payload: FormState = {
      ...form,
      images: parsedImages,
      videos: parsedVideos,
      image: form.image.trim() || parsedImages[0] || "/images/products/product-placeholder.jpg"
    };

    const method = mode === "create" ? "POST" : "PUT";
    const response = await fetch("/api/admin/products", {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password
      },
      body: JSON.stringify(payload)
    });

    const data = (await response.json()) as { error?: string };

    if (!response.ok) {
      setMessage(data.error ?? "Failed");
      setLoading(false);
      return;
    }

    await fetchProducts(password);
    setForm(initialForm);
    setImagesInput(toMultiline(initialForm.images));
    setVideosInput("");
    setMode("create");
    setMessage(locale === "zh" ? "保存成功" : "Saved");
    setLoading(false);
  }

  async function toggleShelf(item: ProductRecord, isActive: boolean) {
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password
      },
      body: JSON.stringify({ slug: item.slug, isActive })
    });

    if (!response.ok) {
      setMessage(locale === "zh" ? "状态更新失败" : "Failed to update status");
      setLoading(false);
      return;
    }

    await fetchProducts(password);
    setMessage(locale === "zh" ? "状态已更新" : "Status updated");
    setLoading(false);
  }

  const fields: Array<{ key: keyof FormState["zh"]; label: string }> = [
    { key: "name", label: t.fieldName },
    { key: "summary", label: t.fieldSummary },
    { key: "overview", label: t.fieldOverview },
    { key: "fabric", label: t.fieldFabric },
    { key: "sizes", label: t.fieldSizes },
    { key: "colors", label: t.fieldColors }
  ];

  return (
    <div className="space-y-6">
      {!authed ? (
        <form onSubmit={onLogin} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-3 text-sm text-slate-600">{t.loginTip}</p>
          <label className="block text-sm font-medium text-ink">
            {t.password}
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <button className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white" disabled={loading}>
            {loading ? "..." : t.login}
          </button>
          {message ? <p className="mt-3 text-sm text-primary">{message}</p> : null}
        </form>
      ) : (
        <>
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-ink">{t.current}</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {products.map((item) => (
                <li key={item.slug} className="rounded-lg bg-soft px-3 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span>
                      {item.slug} · {item.category} · {item.zh.name} / {item.en.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          item.isActive ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {item.isActive ? t.onShelf : t.offShelf}
                      </span>
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="rounded-full border border-primary px-3 py-1 text-xs font-semibold text-primary"
                      >
                        {t.editBtn}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleShelf(item, !item.isActive)}
                        className="rounded-full border border-ink px-3 py-1 text-xs font-semibold text-ink"
                      >
                        {item.isActive ? t.setOff : t.setOn}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <form onSubmit={onSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-ink">
                {mode === "create" ? t.add : t.edit}
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={translateZhToEn}
                  disabled={loading}
                  className="rounded-full border border-primary px-3 py-1 text-xs font-semibold text-primary"
                >
                  {t.autoTranslate}
                </button>
                {mode === "edit" ? (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-full border border-slate-400 px-3 py-1 text-xs font-semibold text-slate-700"
                  >
                    {t.cancelEdit}
                  </button>
                ) : null}
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <label className="text-sm font-medium text-ink md:col-span-2">
                {t.slug}
                <input
                  required={mode === "edit"}
                  disabled={mode === "edit"}
                  value={form.slug}
                  onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
                />
              </label>
              <label className="text-sm font-medium text-ink">
                {t.category}
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, category: event.target.value as ProductCategory }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  <option value="shirts">shirts</option>
                  <option value="pants">pants</option>
                  <option value="outerwear">outerwear</option>
                </select>
              </label>
              <label className="text-sm font-medium text-ink">
                {t.status}
                <select
                  value={form.isActive ? "active" : "inactive"}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, isActive: event.target.value === "active" }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  <option value="active">{t.onShelf}</option>
                  <option value="inactive">{t.offShelf}</option>
                </select>
              </label>
            </div>

            <label className="mt-4 block text-sm font-medium text-ink">
              {t.image}
              <input
                value={form.image}
                onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="mt-4 block text-sm font-medium text-ink">
              {t.images}
              <textarea
                value={imagesInput}
                onChange={(event) => setImagesInput(event.target.value)}
                rows={5}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="mt-4 block text-sm font-medium text-ink">
              {t.videos}
              <textarea
                value={videosInput}
                onChange={(event) => setVideosInput(event.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-ink">{t.zhBlock}</h3>
                <div className="space-y-3">
                  {fields.map((field) => (
                    <label key={`zh-${field.key}`} className="block text-sm font-medium text-ink">
                      {field.label}
                      <input
                        required
                        value={form.zh[field.key]}
                        onChange={(event) => updateLocaleField("zh", field.key, event.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-ink">{t.enBlock}</h3>
                <div className="space-y-3">
                  {fields.map((field) => (
                    <label key={`en-${field.key}`} className="block text-sm font-medium text-ink">
                      {field.label}
                      <input
                        required
                        value={form.en[field.key]}
                        onChange={(event) => updateLocaleField("en", field.key, event.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button disabled={loading} className="mt-6 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white">
              {loading ? "..." : mode === "create" ? t.submitCreate : t.submitEdit}
            </button>
            {message ? <p className="mt-3 text-sm text-primary">{message}</p> : null}
          </form>
        </>
      )}
    </div>
  );
}
