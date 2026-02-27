import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { isLocale, type Locale } from "@/lib/i18n";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Garment Site"
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Header locale={locale as Locale} />
      <main>{children}</main>
      <Footer locale={locale as Locale} />
    </div>
  );
}
