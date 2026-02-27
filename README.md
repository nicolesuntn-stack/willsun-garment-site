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
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `INQUIRY_TO_EMAIL`, `INQUIRY_FROM_EMAIL`
- `ADMIN_PASSWORD`

If SMTP is not configured, inquiry API still accepts payload and returns `saved_without_email`.

## Content
- Chinese content: `src/content/zh`
- English content: `src/content/en`

Product data is currently file-based and CMS-ready for next phase integration.
Admin-added products are saved to `data/products.json` and reflected on product pages.
