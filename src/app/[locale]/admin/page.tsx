import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPanel } from "@/components/admin/AdminPanel";
import { isLocale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

type AdminPageProps = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: AdminPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  return buildPageMetadata({
    title: locale === "zh" ? "产品后台管理" : "Product Admin",
    description: locale === "zh" ? "新增与管理产品数据" : "Add and manage product records",
    canonicalPath: `/${locale}/admin`
  });
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold text-ink">
        {locale === "zh" ? "产品后台" : "Product Admin"}
      </h1>
      <AdminPanel locale={locale} />
    </div>
  );
}
