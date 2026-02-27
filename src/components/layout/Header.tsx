"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";
import { getCopy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";

type HeaderProps = {
  locale: Locale;
};

export function Header({ locale }: HeaderProps) {
  const copy = getCopy(locale);
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}`} className="text-lg font-bold tracking-wide text-primary">
          {copy.common.brandName}
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-ink md:flex">
          <Link href={`/${locale}`}>{copy.common.navigation.home}</Link>
          <Link href={`/${locale}/products`}>{copy.common.navigation.products}</Link>
          <Link href={`/${locale}/about`}>{copy.common.navigation.about}</Link>
          <Link href={`/${locale}/contact`}>{copy.common.navigation.contact}</Link>
        </nav>

        <LocaleSwitcher locale={locale} pathname={pathname} />
      </div>
    </header>
  );
}
