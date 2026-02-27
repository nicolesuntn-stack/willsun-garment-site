import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { InquiryForm } from "@/components/forms/InquiryForm";
import { CONTACT_EMAIL, WHATSAPP_NUMBER, getWhatsappLink } from "@/lib/contact";
import { getCopy } from "@/lib/copy";
import { isLocale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export const runtime = "edge";

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  const copy = getCopy(locale);

  return buildPageMetadata({
    title: copy.contact.seo.title,
    description: copy.contact.seo.description,
    canonicalPath: `/${locale}/contact`
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getCopy(locale);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-ink">{copy.contact.title}</h1>
      <p className="mt-3 text-slate-600">{copy.contact.description}</p>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-ink">{copy.contact.directTitle}</h2>
        <div className="mt-4 space-y-2 text-sm text-slate-700">
          <p>
            <Link href={getWhatsappLink()} target="_blank" rel="noreferrer" className="underline">
              WhatsApp: {WHATSAPP_NUMBER}
            </Link>
          </p>
          <p>
            <Link href={`mailto:${CONTACT_EMAIL}`} className="underline">
              Email: {CONTACT_EMAIL}
            </Link>
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-ink">{copy.contact.formTitle}</h2>
        <InquiryForm
          labels={{
            companyName: locale === "zh" ? "公司名称" : "Company Name",
            managerContact: locale === "zh" ? "采购经理联系方式" : "Purchasing Manager Contact",
            category: locale === "zh" ? "采购品类" : "Product Category",
            quantity: locale === "zh" ? "预计数量" : "Estimated Quantity",
            targetPrice: locale === "zh" ? "目标价格" : "Target Price",
            submit: copy.common.cta.form,
            success: copy.contact.success
          }}
        />
      </section>
    </div>
  );
}
