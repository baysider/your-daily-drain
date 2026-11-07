# Price Update Guide — Your Daily Drain

Update prices about twice a year, or whenever a drink changes price.
Last updated: November 7, 2026.

## The one rule

**`drinks.json` is the master list.** Change a price there first.
Everything else that matters follows from it automatically, or is listed
in step 2 below so you don't miss a copy.

## Step 1 — Update the master list: `drinks.json`

Each drink has: `id`, `name`, `brand`, `price` (shelf price, before tax),
`size_oz`, `caffeine_mg`.

Current master list (Nov 7, 2026):

| Drink | Size | Caffeine | Price |
|---|---|---|---|
| Red Bull (8.4oz) | 8.4oz | 80mg | $2.99 |
| Red Bull (12oz) | 12oz | 114mg | $3.99 |
| Red Bull (16oz) | 16oz | 160mg | $3.99 |
| Red Bull (20oz) | 20oz | 189mg | $4.99 |
| Monster Original (16oz) | 16oz | 160mg | $3.59 |
| Monster Ultra (16oz) | 16oz | 150mg | $3.59 |
| Monster Juice (16oz) | 16oz | 160mg | $3.59 |
| Java Monster (15oz) | 15oz | 188mg | $3.99 |
| Celsius Original (12oz) | 12oz | 200mg | $3.29 |
| Celsius Essentials (16oz) | 16oz | 200mg | $3.49 |
| Alani Nu (12oz) | 12oz | 200mg | $3.39 |
| Ghost Energy (16oz) | 16oz | 200mg | $3.49 |
| Prime Energy (12oz) | 12oz | 200mg | $3.29 |
| C4 Energy (16oz) | 16oz | 200mg | $3.49 |
| Reign Total Body (16oz) | 16oz | 300mg | $3.49 |
| Storm (12oz) | 12oz | 130mg | $3.29 |
| Bang Energy (16oz) | 16oz | 300mg | $3.29 |
| Rockstar Original (16oz) | 16oz | 160mg | $3.29 |
| NOS Original (16oz) | 16oz | 160mg | $3.29 |
| Full Throttle (16oz) | 16oz | 160mg | $3.29 |
| Ryse Fuel (16oz) | 16oz | 200mg | $3.49 |
| Bucked Up (16oz) | 16oz | 300mg | $3.49 |
| C-Store Private Label (16oz) | 16oz | 160mg | $2.39 |
| Kirkland Energy (12oz) | 12oz | 180mg | $0.71 |
| Red Thunder (12oz) | 12oz | 80mg | $0.91 |
| Venom (16oz) | 16oz | 160mg | $0.99 |
| Bang (12oz) | 12oz | 225mg | $1.25 |
| Summit Waves (12oz) | 12oz | 200mg | $1.35 |
| Summit Gridlock (16oz) | 16oz | 150mg | $1.45 |
| Solimo (16oz) | 16oz | 200mg | $1.59 |

## Step 2 — Update the copies (same values, same order)

These are the only other places a drink price appears. They must match
`drinks.json` exactly, or the site will show two different prices for
the same drink.

1. **`site-data.js` → `FALLBACK_DRINKS`** — the same list as `drinks.json`,
   used when `drinks.json` fails to load. Copy the price, size and
   caffeine mg over, drink by drink.
2. **`site-data.js` → `STRATEGIES`** — the Cheaper Hits cards. Prices here
   are the *cheaper* options, not the full catalog:
   - Costco: Kirkland Energy $0.71, Ghost 18-pack $1.53/can
   - Sam's Club: Liquid Death $1.22, Celsius $1.33, Alani Nu $1.26,
     Alani Nu Mini (8.4oz) $0.94
   - Discount Grocery: Summit Gridlock $1.45, Summit Waves $1.35,
     Red Thunder $0.91
   - Dollar Tree & Closeout: Bang (12oz) $1.25, Rockstar (12oz) $1.25,
     Venom $0.99. Dollar Tree is $1.25 a can right now — do not add
     other Dollar Tree prices.
   - If a strategy price changes, change it here only. The savings
     math (vs the drink the user picked) is calculated in `app.js`,
     so you never hand-calculate a saving.
3. **`site-data.js` → `SITE_COPY.freshnessNote`** and the same line in
   `index.html` footer — change the date to the day you updated prices,
   e.g. "Retail price inputs last updated May 2027."

What you do **not** need to touch:
- The Caffeine Cost Index — it is built from the drink catalog, so a
  price or caffeine change in `drinks.json` / `FALLBACK_DRINKS`
  updates it automatically. Its order in `site-data.js`
  (`DYNAMIC_CAFFEINE_INDEX_CONFIG`) is most to least expensive per
  10mg of caffeine; only reorder it if a price change flips two drinks.
- The calculator math in `app.js` — weekly is annual / 52, monthly is
  annual / 12, annual is daily cost x 365. No price is hard-coded there.
- The Redirect the Cash cards in `app.js` (`SAVINGS_IDEAS`) — they use
  the cheapest strategy price automatically. Only change an
  `annual_cost` there if the *item* (coffee maker, protein, etc.)
  changes price.

## Step 3 — Check it

```bash
node --test data-helpers.test.js
```

All tests must pass. The tests check that the fallback catalog, the
strategies and the caffeine index agree with each other — if a price
was updated in one place and not the other, a test will fail and name
the drink.

Then open the site locally and check one drink end to end:

```bash
python -m http.server 4173
# open http://127.0.0.1:4173/index.html
```

- Default drink is Monster Original ($3.59), $3.81 at the register,
  $1,389 a year at 1 can a day.
- Cheaper Hits and Redirect the Cash show the same best saving
  ($1,114 a year to Kirkland at current prices).
- 0 cans shows "You'd keep $1,389 a year."

## Step 4 — Ship it

Commit, push to the branch you want Vercel to deploy, and check the
live site shows the new date in the footer.
