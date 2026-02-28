import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getPreferredLocale, isLocale } from "@/lib/i18n";

function isAdminPagePath(pathname: string): boolean {
  return /^\/(zh|en)\/admin(\/|$)/.test(pathname);
}

function isAdminApiPath(pathname: string): boolean {
  return pathname.startsWith("/api/admin");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host")?.split(":")[0] ?? "";
  const configuredAdminHost = process.env.ADMIN_HOST ?? "";
  const isLocalDevHost = host === "localhost" || host === "127.0.0.1";
  const isAdminHost = configuredAdminHost ? host === configuredAdminHost : false;
  const adminPagePath = isAdminPagePath(pathname);
  const adminApiPath = isAdminApiPath(pathname);

  if ((adminPagePath || adminApiPath) && !isAdminHost && !isLocalDevHost) {
    if (adminApiPath) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const locale = getPreferredLocale(request.headers.get("accept-language"));
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  if (
    pathname.startsWith("/_next") ||
    (pathname.startsWith("/api") && !adminApiPath) ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (isAdminHost && !isLocalDevHost) {
    if (adminApiPath || adminPagePath) {
      return NextResponse.next();
    }

    const locale = getPreferredLocale(request.headers.get("accept-language"));
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/admin`;
    return NextResponse.redirect(url);
  }

  const segments = pathname.split("/").filter(Boolean);
  const localeInPath = segments[0];

  if (localeInPath && isLocale(localeInPath)) {
    return NextResponse.next();
  }

  const locale = getPreferredLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"]
};
