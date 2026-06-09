# Al-Khobaraa — الخبراء

Landing page for **Al-Khobaraa for Import & Distribution of Medicines and Medical Supplies** (الخبراء لاستيراد وتوزيع الأدوية والمستلزمات الطبية).

Bilingual (Arabic-first RTL / English LTR) single-page site built with:

- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS v4** (theme tokens in `src/index.css`)
- **Framer Motion** for entrance animations
- **react-i18next** for Arabic/English switching (persisted to `localStorage`, flips `<html dir>`)
- **Lucide** icons

## Project structure

```
.
├── index.html              # Entry HTML (Arabic-first, loads fonts)
├── public/                 # Static assets (favicon, icons)
├── src/
│   ├── main.tsx            # App bootstrap
│   ├── App.tsx             # Page shell
│   ├── i18n.ts             # i18next setup + ar/en translations
│   ├── index.css           # Tailwind v4 theme tokens + base styles
│   └── components/
│       ├── navbar.tsx
│       ├── hero.tsx
│       └── footer.tsx
└── vercel.json             # Vercel SPA config
```

## Development

```bash
npm install
npm run dev       # start dev server
npm run build     # type-check + production build (dist/)
npm run preview   # serve the production build locally
npm run lint      # eslint
```

## Deploying to Vercel

The repo is zero-config for Vercel — `vercel.json` pins the Vite framework preset, `dist` output, and an SPA rewrite.

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com/new), import the repository.
3. Accept the detected settings (Framework: Vite) and deploy.

Every push to `main` deploys to production; other branches get preview URLs.
