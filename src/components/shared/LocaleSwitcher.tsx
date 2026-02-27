import Link from "next/link";

import type { Locale } from "@/lib/i18n";

type LocaleSwitcherProps = {
  locale: Locale;
  pathname: string;
};

function swapLocale(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return `/${nextLocale}`;
  }

  segments[0] = nextLocale;
  return `/${segments.join("/")}`;
}

export function LocaleSwitcher({ locale, pathname }: LocaleSwitcherProps) {
  const zhHref = swapLocale(pathname, "zh");
  const enHref = swapLocale(pathname, "en");

  return (
    <div className="flex items-center gap-2 text-sm font-semibold">
      <Link
        href={zhHref}
        className={locale === "zh" ? "text-accent" : "text-ink hover:text-primary"}
      >
        中文
      </Link>
      <span className="text-slate-300">|</span>
      <Link
        href={enHref}
        className={locale === "en" ? "text-accent" : "text-ink hover:text-primary"}
      >
        EN
      </Link>
    </div>
  );
}
