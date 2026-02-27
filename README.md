# Woven Garment Bilingual Site (MVP)

This is a bilingual (Chinese/English) B2B product showcase site for woven garments.

## Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS

## Pages
- `/:locale` Home
- `/:locale/products` Product list (category filter)
- `/:locale/products/:slug` Product detail
- `/:locale/about` About
- `/:locale/contact` Contact + inquiry form
- `/:locale/admin` Product admin (password protected via env)

## Local Development
1. Install Node.js 20+
2. Install dependencies:
   - `npm install`
3. Copy environment template:
   - `cp .env.example .env.local`
4. Start dev server:
   - `npm run dev`

## Environment Variables
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `INQUIRY_WEBHOOK_URL`
- `ADMIN_PASSWORD`

Inquiry API runs on edge runtime and forwards payloads to `INQUIRY_WEBHOOK_URL` when configured.

## Content
- Chinese content: `src/content/zh`
- English content: `src/content/en`

Product data is currently file-based and CMS-ready for next phase integration.
In edge deployment, admin write APIs are read-only by default unless you add a persistent store (D1/KV/R2).

## Cloudflare Pages Deployment
- Framework preset: `None`
- Build command: `npm run pages:build`
- Build output directory: `.vercel/output/static`

If you deploy with Cloudflare Pages and set output directory to `out`, deployment will fail because this app uses Next.js server functions/routes.
