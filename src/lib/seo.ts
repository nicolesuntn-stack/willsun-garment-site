import type { Metadata } from "next";

export function buildPageMetadata(params: {
  title: string;
  description: string;
  canonicalPath: string;
}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    title: params.title,
    description: params.description,
    alternates: {
      canonical: `${siteUrl}${params.canonicalPath}`
    },
    openGraph: {
      title: params.title,
      description: params.description,
      url: `${siteUrl}${params.canonicalPath}`,
      type: "website"
    }
  };
}
