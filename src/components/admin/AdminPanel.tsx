"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";

import type { ProductCategory, ProductRecord } from "@/lib/productStore";
import type { Locale } from "@/lib/i18n";

type AdminPanelProps = {
  locale: Locale;
};

type FormState = {
  slug: string;
  category: ProductCategory;
  image: string;
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
  zh: { name: "", summary: "", overview: "", fabric: "", sizes: "", colors: "" },
  en: { name: "", summary: "", overview: "", fabric: "", sizes: "", colors: "" }
};

export function AdminPanel({ locale }: AdminPanelProps) {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);

  const t = useMemo(
    () =>
      locale === "zh"
        ? {
            title: "产品后台",
            loginTip: "输入后台密码后可查看和新增产品",
            password: "后台密码",
            login: "进入后台",
            current: "当前产品",
            add: "新增产品",
            submit: "保存产品",
            category: "品类",
            slug: "Slug（可留空自动生成）",
            image: "图片路径",
            zhBlock: "中文内容",
            enBlock: "英文内容",
            fieldName: "名称",
            fieldSummary: "简介",
            fieldOverview: "产品介绍",
            fieldFabric: "面料成分",
            fieldSizes: "尺码",
            fieldColors: "颜色"
          }
        : {
            title: "Product Admin",
            loginTip: "Enter admin password to manage products",
            password: "Admin Password",
            login: "Enter",
            current: "Current Products",
            add: "Add Product",
            submit: "Save Product",
            category: "Category",
            slug: "Slug (optional)",
            image: "Image Path",
            zhBlock: "Chinese Content",
            enBlock: "English Content",
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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password
      },
      body: JSON.stringify(form)
    });

    const data = (await response.json()) as { error?: string };

    if (!response.ok) {
      setMessage(data.error ?? "Failed");
      setLoading(false);
      return;
    }

    setForm(initialForm);
    await fetchProducts(password);
    setMessage(locale === "zh" ? "保存成功" : "Saved");
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
                <li key={item.slug} className="rounded-lg bg-soft px-3 py-2">
                  {item.slug} · {item.category} · {item.zh.name} / {item.en.name}
                </li>
              ))}
            </ul>
          </section>

          <form onSubmit={onSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-ink">{t.add}</h2>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <label className="text-sm font-medium text-ink">
                {t.slug}
                <input
                  value={form.slug}
                  onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
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
                {t.image}
                <input
                  value={form.image}
                  onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
            </div>

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
              {loading ? "..." : t.submit}
            </button>
            {message ? <p className="mt-3 text-sm text-primary">{message}</p> : null}
          </form>
        </>
      )}
    </div>
  );
}
