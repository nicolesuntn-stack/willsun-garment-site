"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";
import { CART_UPDATED_EVENT, readCart } from "@/lib/cart";
import { getCopy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";

type HeaderProps = {
  locale: Locale;
};

export function Header({ locale }: HeaderProps) {
  const copy = getCopy(locale);
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => setCartCount(readCart().length);
    updateCount();

    window.addEventListener("storage", updateCount);
    window.addEventListener(CART_UPDATED_EVENT, updateCount);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener(CART_UPDATED_EVENT, updateCount);
    };
  }, []);

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

        <div className="flex items-center gap-4">
          <Link
            href={`/${locale}/contact`}
            className="flex items-center gap-2 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-ink"
          >
            <span>{copy.common.navigation.cart}</span>
            <span className="rounded-full bg-accent px-2 py-0.5 text-white">{cartCount}</span>
          </Link>
          <LocaleSwitcher locale={locale} pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
