# Web therapist1

Stack: Next.js 14 (App Router) • Tailwind • Decap CMS • Netlify Forms • i18n (en/ru/uk)

## Local dev
```bash
npm i
npm run dev
```

Open http://localhost:3000/ru (default locale can be changed).

## CMS (Decap)
- Deploy to Netlify
- Enable **Identity** + **Git Gateway**
- Visit `/admin` and log in

## Content
- Site settings per locale: `content/settings/siteSettings.<locale>.json`
- Pages as MDX in `content/pages/*.mdx`
- Blog posts in `content/posts/*.mdx`

## Forms
Contact form posts to Netlify Forms. Add a page section with:
```html
<form name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact" />
  <!-- your fields -->
</form>
```

## Payments (later)
Add Stripe/PayPal via client SDK + Netlify Functions for secure webhooks (e.g., `/netlify/functions/checkout`).
