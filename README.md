# Your Daily Drain

Static website for `yourdailydrain.com`.

## Project Files

- `index.html`: page structure and markup
- `style.css`: site styling
- `app.js`: calculator behavior, UI updates, and rendering logic
- `drinks.json`: drink catalog and price data loaded by the calculator — this is the master price list
- `site-data.js`: centralized editable copy, shared fallback drink data, and strategy data
- `PRICE_UPDATE_GUIDE.md`: how to update prices (about twice a year) — start here, it lists every place a price lives
- `vercel.json`: Vercel headers and caching config
- `data-helpers.test.js`: lightweight regression tests for shared data helpers

## Run Locally

1. From the project folder, start a simple static server:
   `python -m http.server 4173`
2. Open:
   `http://127.0.0.1:4173/index.html`

## Deploy

This project is linked to Vercel (`your-daily-drain`).

Typical deploy flow:

1. Commit changes locally.
2. Push to the tracked GitHub branch.
3. If Vercel Git integration is enabled for this repo/branch, Vercel will automatically build and deploy the update.

If Git auto-deploy is not enabled in Vercel, deploys would need to be triggered from the Vercel dashboard or CLI.