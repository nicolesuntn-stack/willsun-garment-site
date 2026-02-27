import type { Metadata } from "next";
import Script from "next/script";

import { GA_MEASUREMENT_ID, isAnalyticsEnabled } from "@/lib/analytics";

import "./globals.css";

export const metadata: Metadata = {
  title: "Woven Garment Website",
  description: "Bilingual woven garment B2B website MVP"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        {isAnalyticsEnabled() ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-tracker" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_MEASUREMENT_ID}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
