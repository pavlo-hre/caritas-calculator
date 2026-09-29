# Caritas Zaporizhzhia — home care cost calculator

Monthly cost calculator for the Caritas Zaporizhzhia home care centre. Users pick services and
quantities, see the running total and can download the estimate as a PDF.

Built with React 19, TypeScript and Vite.

## Scripts

```sh
npm install
npm run dev      # dev server
npm run build    # type-check + production build to dist/
npm run build:wp    # WordPress build into wp-plugin/caritas-calculator/build/
npm run package:wp  # build:wp + caritas-calculator.zip, ready to upload in WP admin
npm run preview  # serve the production build
npm run lint
```

## Where things live

- `price.json` — the price list (sections → services → optional sub-items with `code`, `name`,
  `time` in minutes, `price` in UAH and `defaultQty` used when a service is first added).
  Edit prices here; no code changes needed.
- `src/components/ServiceCalculator.tsx` — state, totals and PDF export (jsPDF/html2canvas are
  loaded lazily on click).
- `src/styles/ServiceCalculator.module.css` — all calculator styles. Font sizes are in `em` so the
  site's accessibility text-size panel scales the calculator correctly; see the comment at the top
  of the file before changing sizes.
- `src/styles/theme.css` — palette variables (`--cz-*`) and base element styles, scoped to the
  `.cz-calc` root so they don't leak into the WordPress theme.
- `src/index.css` — page-level styles for the standalone build only.

## WordPress

The calculator ships as a plugin (`wp-plugin/caritas-calculator/`) that renders inline in the page
(no iframe), so the site's accessibility text-size panel reaches it.

1. `npm run package:wp` → `caritas-calculator.zip`.
2. WP admin → Plugins → Add New → Upload Plugin → activate *Caritas Calculator*.
3. Put the shortcode `[caritas_calculator]` on a page (Shortcode block in Gutenberg).

To update, rebuild the zip and upload it again (WP offers to replace the installed version).
Asset URLs are versioned by file time, so caches pick up the new build. Entry points:
`src/wp.tsx` (mounts into `.caritas-calculator-root`) and `vite.wp.config.ts`.

If the theme has a sticky header, offset the sticky totals panel with e.g.
`.caritas-calculator-root { --cz-sticky-top: 100px; }` in Appearance → Customize → Additional CSS.
