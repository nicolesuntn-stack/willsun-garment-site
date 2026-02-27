import Link from "next/link";

import { CONTACT_EMAIL, getWhatsappLink } from "@/lib/contact";

type CTAButtonsProps = {
  whatsappLabel: string;
  emailLabel: string;
};

export function CTAButtons({ whatsappLabel, emailLabel }: CTAButtonsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href={getWhatsappLink()}
        target="_blank"
        rel="noreferrer"
        className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
      >
        {whatsappLabel}
      </Link>
      <Link
        href={`mailto:${CONTACT_EMAIL}`}
        className="rounded-full border border-primary px-5 py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-white"
      >
        {emailLabel}
      </Link>
    </div>
  );
}
