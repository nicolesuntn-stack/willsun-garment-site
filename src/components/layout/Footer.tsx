import Link from "next/link";

import { CONTACT_EMAIL, WHATSAPP_NUMBER, getWhatsappLink } from "@/lib/contact";
import { getCopy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";

type FooterProps = {
  locale: Locale;
};

export function Footer({ locale }: FooterProps) {
  const copy = getCopy(locale);

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 sm:px-6 lg:px-8">
        <p>{copy.common.footer.tagline}</p>
        <div className="flex flex-wrap gap-4">
          <Link href={getWhatsappLink()} target="_blank" rel="noreferrer">
            WhatsApp: {WHATSAPP_NUMBER}
          </Link>
          <Link href={`mailto:${CONTACT_EMAIL}`}>Email: {CONTACT_EMAIL}</Link>
        </div>
        <p>
          {copy.common.brandName} {new Date().getFullYear()} · {copy.common.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
