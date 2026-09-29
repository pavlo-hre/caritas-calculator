# Caritas Zaporizhzhia — home care cost calculator

Monthly cost calculator for the Caritas Zaporizhzhia home care centre. Users pick services and
quantities, see the running total and can download the estimate as a PDF.

Built with React 19, TypeScript and Vite.

## Scripts

```sh
npm install
npm run dev      # dev server
npm run build    # type-check + production build to dist/
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
- `src/index.css` — palette variables (`--cz-*`) and base styles for the standalone build.
