export const locales = ["zh", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getPreferredLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) {
    return defaultLocale;
  }

  const lowered = acceptLanguage.toLowerCase();
  if (lowered.includes("zh")) {
    return "zh";
  }

  return "en";
}
