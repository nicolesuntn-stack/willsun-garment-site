import type { MetadataRoute } from "next";

import { locales } from "@/lib/i18n";
import { getAllProductSlugs } from "@/lib/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const staticPaths = ["", "/products", "/about", "/contact"];

  const staticEntries = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date()
    }))
  );

  const productSlugs = await getAllProductSlugs();
  const productEntries = locales.flatMap((locale) =>
    productSlugs.map((slug) => ({
      url: `${siteUrl}/${locale}/products/${slug}`,
      lastModified: new Date()
    }))
  );

  return [...staticEntries, ...productEntries];
}
