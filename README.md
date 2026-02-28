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
- `ADMIN_HOST` (required in production for front/admin domain separation)
- `OPENAI_API_KEY` (optional, for admin auto-translation)
- `OPENAI_TRANSLATE_MODEL` (optional)

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

## D1 Product Admin Setup
1. Create a D1 database in Cloudflare dashboard.
2. Apply migration `migrations/0001_create_products.sql`.
3. Apply migration `migrations/0002_add_media_columns.sql`.
4. In Cloudflare Pages project settings, bind the D1 database with variable name `DB`.
5. Set `ADMIN_PASSWORD` in Pages environment variables (Preview + Production).
6. Optional: set `OPENAI_API_KEY` to enable Chinese-to-English auto translation in admin.
7. Admin URLs:
   - `https://<your-domain>/zh/admin`
   - `https://<your-domain>/en/admin`

## Front/Admin Domain Separation
Recommended setup:
- Frontend domain: `www.your-domain.com`
- Admin domain: `admin.your-domain.com`

Set `ADMIN_HOST=admin.your-domain.com` in Cloudflare Pages environment variables.

Behavior after configuration:
- Accessing `/zh/admin` or `/api/admin/*` on frontend domain is blocked.
- Admin domain redirects non-admin pages to `/<locale>/admin`.
- In local development (`localhost`), both frontend and admin routes stay available.

With D1 binding configured, admin supports create, edit, publish, and unpublish operations, plus multiple image/video URLs per product.
