'use strict';

/* ── INLINE FALLBACK ─────────────────────────────────────── */
const FALLBACK_DRINKS = [
  { id: 'red-bull-20oz',         name: 'Red Bull (20oz)',               brand: 'Red Bull',      price: 5.49, size_oz: 20,  caffeine_mg: 189 },
  { id: 'red-bull-16oz',         name: 'Red Bull (16oz)',               brand: 'Red Bull',      price: 4.89, size_oz: 16,  caffeine_mg: 160 },
  { id: 'red-bull-12oz',         name: 'Red Bull (12oz)',               brand: 'Red Bull',      price: 3.99, size_oz: 12,  caffeine_mg: 114 },
  { id: 'red-bull-regular',      name: 'Red Bull (8.4oz)',              brand: 'Red Bull',      price: 3.19, size_oz: 8.4, caffeine_mg: 80  },
  { id: 'monster-original',      name: 'Monster Original (16oz)',       brand: 'Monster',       price: 3.59, size_oz: 16,  caffeine_mg: 160 },
  { id: 'monster-ultra',         name: 'Monster Ultra (16oz)',          brand: 'Monster',       price: 3.59, size_oz: 16,  caffeine_mg: 150 },
  { id: 'monster-juice',         name: 'Monster Juice (16oz)',          brand: 'Monster',       price: 3.59, size_oz: 16,  caffeine_mg: 160 },
  { id: 'java-monster',          name: 'Java Monster (15oz)',           brand: 'Monster',       price: 3.79, size_oz: 15,  caffeine_mg: 188 },
  { id: 'celsius-original',      name: 'Celsius Original (12oz)',       brand: 'Celsius',       price: 3.29, size_oz: 12,  caffeine_mg: 200 },
  { id: 'celsius-essentials',    name: 'Celsius Essentials (16oz)',     brand: 'Celsius',       price: 3.49, size_oz: 16,  caffeine_mg: 200 },
  { id: 'alani-nu',              name: 'Alani Nu (12oz)',               brand: 'Alani Nu',      price: 3.39, size_oz: 12,  caffeine_mg: 200 },
  { id: 'ghost-energy',          name: 'Ghost Energy (16oz)',           brand: 'Ghost',         price: 3.49, size_oz: 16,  caffeine_mg: 200 },
  { id: 'prime-energy',          name: 'Prime Energy (12oz)',           brand: 'Prime',         price: 3.29, size_oz: 12,  caffeine_mg: 200 },
  { id: 'c4-energy',             name: 'C4 Energy (16oz)',              brand: 'C4',            price: 3.49, size_oz: 16,  caffeine_mg: 200 },
  { id: 'reign-total-body',      name: 'Reign Total Body (16oz)',       brand: 'Reign',         price: 3.49, size_oz: 16,  caffeine_mg: 300 },
  { id: 'reign-storm',           name: 'Reign Storm (12oz)',            brand: 'Reign',         price: 3.29, size_oz: 12,  caffeine_mg: 130 },
  { id: 'bang-energy',           name: 'Bang Energy (16oz)',            brand: 'Bang',          price: 3.29, size_oz: 16,  caffeine_mg: 300 },
  { id: 'rockstar-original',     name: 'Rockstar Original (16oz)',      brand: 'Rockstar',      price: 3.29, size_oz: 16,  caffeine_mg: 160 },
  { id: 'nos-original',          name: 'NOS Original (16oz)',           brand: 'NOS',           price: 3.29, size_oz: 16,  caffeine_mg: 160 },
  { id: 'full-throttle',         name: 'Full Throttle (16oz)',          brand: 'Full Throttle', price: 3.29, size_oz: 16,  caffeine_mg: 160 },
  { id: 'ryse-fuel',             name: 'Ryse Fuel (16oz)',              brand: 'Ryse',          price: 3.49, size_oz: 16,  caffeine_mg: 200 },
  { id: 'bucked-up',             name: 'Bucked Up (16oz)',              brand: 'Bucked Up',     price: 3.49, size_oz: 16,  caffeine_mg: 300 },
  { id: 'cstore-private-label',  name: 'C-Store Private Label (16oz)', brand: 'Private Label', price: 2.39, size_oz: 16,  caffeine_mg: 160 }
];

/* ── PURCHASING STRATEGIES ───────────────────────────────── */
const STRATEGIES = [
  {
    id: 'costco',
    label: 'COSTCO',
    options: [
      { name: 'Kirkland Energy',          price: 0.71 },
      { name: 'Ghost Energy (18-pack)',   price: 1.53 }
    ],
    tip: 'Buy a pack once a month and you\'re done. Kirkland at $0.71 is the lowest per-can cost available anywhere.',
    linkText: 'Find a Costco near you',
    href: 'https://www.costco.com/s?keyword=energy%20drinks'
  },
  {
    id: 'sams-club',
    label: "SAM'S CLUB",
    options: [
      { name: 'Liquid Death Energy (12oz)',    price: 1.22 },
      { name: 'Aspire Energy',                 price: 1.22 },
      { name: 'Celsius',                       price: 1.33 },
      { name: 'Alani Nu',                      price: 1.26 },
      { name: 'Alani Nu Mini',                 price: 0.94 }
    ],
    tip: "Sam's Club carries a wide multi-brand lineup. Alani Mini at $0.94 is one of the sharpest value cans in the market.",
    linkText: "Find a Sam's Club near you",
    href: 'https://www.samsclub.com/search?q=energy+drink'
  },
  {
    id: 'discount-grocery',
    label: 'DISCOUNT GROCERY',
    useAltPrices: true,
    options: [
      {
        name: 'Summit Gridlock', size: '16oz', price: 1.45,
        altOf: 'Monster',        altPrice: 3.59,
        altNote: 'Name-brand Monster at ALDI itself: $2.95 — still cheaper than a c-store'
      },
      {
        name: 'Summit Waves',    size: '12oz', price: 1.35,
        altOf: 'Celsius / Alani Nu', altPrice: 3.29,
        altNote: 'Celsius at ALDI: $2.15 vs up to $3.29 at convenience stores'
      },
      {
        name: 'Red Thunder',     size: '12oz', price: 0.91,
        altOf: 'Red Bull',       altPrice: 3.99,
        altNote: "ALDI's Red Bull dupe — sold as a 4-pack ($3.65 total), best per-can value in this tier"
      }
    ],
    tip: "ALDI private-label cans are consistent quality with no membership required. Prices are shelf-stable — no need to wait for a sale.",
    linkText: 'Find an ALDI near you',
    href: 'https://www.aldi.us/store-locator'
  },
  {
    id: 'dollar-closeout',
    label: 'DOLLAR TREE & CLOSEOUT',
    options: [
      { name: 'Dollar Tree Energy Closeouts', price: 1.25, note: 'Rotating name-brand closeouts — Celsius, Monster, Rockstar, Bang and others. Not a private label. Stock varies by location and week.' },
      { name: 'Venom Energy',                 price: 0.99, note: 'Available at major grocery and convenience stores — $0.99 to $1.49 per can.',
        optLink: { text: 'Find Venom at Walmart', href: 'https://www.walmart.com/search?q=venom+energy+drink' } }
    ],
    tip: 'Closeout stores and Grocery Outlet occasionally stock name brands at deep discount — worth a look every visit.',
    linkText: 'Find Dollar Tree near you',
    href: 'https://locations.dollartree.com/store-locator#?callerURL=www.dollartree.com&dest=/drinks/sport-energy-drinks'
  }
];

/* ── SAVINGS IDEAS ───────────────────────────────────────── */
/* Order determines 2-column pairing on desktop */
const SAVINGS_IDEAS = [
  /* pair 1 */
  {
    icon: '☕',
    tag: 'UPGRADE',
    name: 'Premium Coffee Maker',
    desc: 'Pay once. Drink forever. The only purchase that pays you back every single day.',
    annual_cost: 150,
    cta: 'Shop coffee makers',
    href: 'https://amzn.to/4o0VuB5'
  },
  {
    icon: '💪',
    tag: 'FITNESS',
    name: 'Protein Powder',
    desc: "A full year's supply of high-quality whey. Actually useful fuel.",
    annual_cost: 420,
    cta: 'Shop protein',
    href: 'https://amzn.to/49vmBy7'
  },
  /* pair 2 */
  {
    icon: '🗺️',
    tag: 'EXPERIENCES',
    name: 'Viator Experiences',
    desc: 'Tours, adventures, and activities in any city. Spend it on memories, not cans.',
    annual_cost: 450,
    cta: 'Browse experiences',
    href: 'https://viator.com'
  },
  {
    icon: '🎟️',
    tag: 'LOCAL',
    name: 'Groupon Deals',
    desc: 'Local restaurants, spas, events, and activities at deep discount.',
    annual_cost: 300,
    cta: 'See local deals',
    href: 'https://groupon.com'
  },
  /* pair 3 */
  {
    icon: '₿',
    tag: 'CRYPTO',
    name: 'Coinbase',
    desc: 'Start building a crypto position with what you would have wasted.',
    annual_cost: 0,
    freeToStart: true,
    cta: 'Start with crypto',
    href: 'https://coinbase.com'
  },
  {
    icon: '📊',
    tag: 'INVEST',
    name: 'Robinhood',
    desc: 'Put your savings to work in stocks, ETFs, and options — free to start.',
    annual_cost: 0,
    freeToStart: true,
    cta: 'Open a free account',
    href: 'https://robinhood.com'
  },
  /* pair 4 */
  {
    icon: '📦',
    tag: 'SHOPPING',
    name: 'Amazon',
    desc: 'Whatever you actually want — your habit savings cover it.',
    annual_cost: 500,
    cta: 'Shop Amazon',
    href: 'https://amzn.to/4ucr14y'
  },
  {
    icon: '🛒',
    tag: 'SHOPPING',
    name: 'Walmart',
    desc: 'Groceries, gear, and everyday essentials. Your savings go further here.',
    annual_cost: 450,
    cta: 'Shop Walmart',
    href: 'https://walmart.com'
  },
  /* pair 5 */
  {
    icon: '🏨',
    tag: 'TRAVEL',
    name: 'Booking.com',
    desc: 'Book hotels, vacation rentals, and flights. Use your savings for a real trip.',
    annual_cost: 400,
    cta: 'Book a trip',
    href: 'https://booking.com'
  },
  {
    icon: '🏃',
    tag: 'FITNESS',
    name: 'ClassPass',
    desc: 'Access thousands of gyms and studios with no commitment. Try everything.',
    annual_cost: 720,
    cta: 'Try ClassPass',
    href: 'https://classpass.com'
  }
];

/* ── STATE ───────────────────────────────────────────────── */
let drinks        = [];
let currentDrink  = null;
let cansPerDay    = 1;
let taxRate       = 0.25;
let salesTaxRate  = 0.06;
let resultsVisible = false;

/* ── HELPERS ─────────────────────────────────────────────── */
const fmt2 = n => '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const fmt0 = n => '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const fmtN = (n, d) => n.toFixed(d);

const isDesktop = () => window.matchMedia('(min-width: 900px)').matches;

/* ── COUNTUP ANIMATION ───────────────────────────────────── */
function animateValue(el, to, duration, formatter) {
  let startTs = null;
  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
  function step(ts) {
    if (!startTs) startTs = ts;
    const progress = Math.min((ts - startTs) / duration, 1);
    el.textContent = formatter(to * easeOutQuart(progress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ── SLIDER TRACK FILL ───────────────────────────────────── */
function updateSliderFill(slider) {
  const pct = ((parseFloat(slider.value) - parseFloat(slider.min)) /
               (parseFloat(slider.max)   - parseFloat(slider.min))) * 100;
  slider.style.background =
    `linear-gradient(to right, #00ff87 0%, #00ff87 ${pct}%, #222 ${pct}%, #222 100%)`;
}

/* ── MATH ────────────────────────────────────────────────── */
function computeCosts() {
  const wage        = parseFloat(document.getElementById('hourly-wage').value) || 20;
  const canPrice    = currentDrink.price * (1 + salesTaxRate);
  const daily       = canPrice * cansPerDay;
  const weekly      = daily * 7;
  const monthly     = daily * 30.44;
  const annual      = daily * 365;
  const gross       = annual / (1 - taxRate);
  const hoursWorked = gross / wage;
  const truePerCan  = (gross / 365) / cansPerDay;
  const weeksWorked = hoursWorked / 40;
  return { wage, canPrice, daily, weekly, monthly, annual, hoursWorked, truePerCan, weeksWorked };
}

function buildSubline(canPrice, truePerCan) {
  if (salesTaxRate > 0) {
    const pct = (salesTaxRate * 100).toFixed(0);
    return `$${currentDrink.price.toFixed(2)} shelf + ${pct}% sales tax = $${canPrice.toFixed(2)} at the register. After income tax, each can costs you $${truePerCan.toFixed(2)} to earn.`;
  }
  return `At your wage & tax rate, that $${currentDrink.price.toFixed(2)} can actually costs you $${truePerCan.toFixed(2)} to earn.`;
}

/* ── WEEKS CONTEXT ───────────────────────────────────────── */
function updateHoursContext() {
  const el = document.getElementById('weeks-count');
  if (!el || !currentDrink) return;
  const { weeksWorked } = computeCosts();
  el.textContent = weeksWorked.toFixed(1);
}

/* ── RENDER STRATEGY CARDS ───────────────────────────────── */
function renderStrategies(annualCost) {
  const section = document.getElementById('alternatives');
  const grid    = document.getElementById('alt-grid');

  grid.innerHTML = '';

  STRATEGIES.forEach(strategy => {
    let badgeText, annualText, optionsHTML;

    if (strategy.useAltPrices) {
      /* ALDI mode: each option compares against its own name-brand c-store price */
      const savingsArr       = strategy.options.map(o => (o.altPrice - o.price) * (1 + salesTaxRate));
      const maxSavingsPerCan = Math.max(...savingsArr);
      const maxAnnualSavings = maxSavingsPerCan * cansPerDay * 365;
      const bestOption       = strategy.options[savingsArr.indexOf(maxSavingsPerCan)];

      badgeText  = `Up to ${fmt2(maxSavingsPerCan)}/can saved`;
      annualText = `Best deal: ${bestOption.name} saves you ${fmt0(maxAnnualSavings)}/yr at your pace`;

      optionsHTML = strategy.options.map(o => {
        const perCanSavings  = (o.altPrice - o.price) * (1 + salesTaxRate);
        const annualSavings  = perCanSavings * cansPerDay * 365;
        const noteHtml       = o.altNote
          ? `<div class="strategy-item-note">${o.altNote}</div>`
          : '';
        return `
          <div class="strategy-item strategy-item--detailed">
            <div class="strategy-item-info">
              <div class="strategy-item-name">${o.name} <span class="strategy-item-size">${o.size}</span></div>
              <div class="strategy-item-vs">Saves ${fmt2(perCanSavings)}/can vs ${o.altOf} at a c-store · ${fmt0(annualSavings)}/yr</div>
              ${noteHtml}
            </div>
            <div class="strategy-item-price">$${o.price.toFixed(2)}<span class="strategy-item-unit">/can</span></div>
          </div>
        `;
      }).join('');

    } else {
      /* Standard mode: savings vs the currently selected drink */
      const bestPrice      = Math.min(...strategy.options.map(o => o.price));
      const savingsPerCan  = (currentDrink.price - bestPrice) * (1 + salesTaxRate);
      const savingsPerYear = savingsPerCan * cansPerDay * 365;

      if (savingsPerCan <= 0) {
        badgeText  = 'Already cheaper';
        annualText = `You're already in this price range with ${currentDrink.name}.`;
      } else {
        badgeText  = `Save ${fmt2(savingsPerCan)}/can`;
        annualText = `Save ${fmt0(savingsPerYear)}/year vs. ${currentDrink.brand}`;
      }

      optionsHTML = strategy.options.map(o => {
        if (o.note) {
          const optLinkHtml = o.optLink
            ? `<a href="${o.optLink.href}" class="strategy-opt-link" target="_blank" rel="noopener noreferrer">${o.optLink.text}</a>`
            : '';
          return `
            <div class="strategy-item strategy-item--detailed">
              <div class="strategy-item-info">
                <span class="strategy-item-name">${o.name}</span>
                <div class="strategy-item-note">${o.note}</div>
                ${optLinkHtml}
              </div>
              <span class="strategy-item-price">$${o.price.toFixed(2)}<span class="strategy-item-unit">/can</span></span>
            </div>
          `;
        }
        return `
          <div class="strategy-item">
            <span class="strategy-item-name">${o.name}</span>
            <span class="strategy-item-price">$${o.price.toFixed(2)}<span class="strategy-item-unit">/can</span></span>
          </div>
        `;
      }).join('');
    }

    const card = document.createElement('div');
    card.className = 'strategy-card';
    card.innerHTML = `
      <div class="strategy-header">
        <div class="strategy-label">${strategy.label}</div>
        <div class="strategy-savings-badge">${badgeText}</div>
      </div>
      <div class="strategy-options">${optionsHTML}</div>
      <div class="strategy-annual">${annualText}</div>
      <p class="strategy-tip">${strategy.tip}</p>
      <a href="${strategy.href}" class="strategy-link" target="_blank" rel="noopener noreferrer">${strategy.linkText}</a>
    `;
    grid.appendChild(card);
  });

  section.classList.remove('hidden');
  section.classList.add('reveal');
}

/* ── RENDER SAVINGS IDEAS ────────────────────────────────── */
function renderSavingsIdeas(annualCost) {
  const section    = document.getElementById('savings-ideas');
  const grid       = document.getElementById('ideas-grid');

  /* Use cheapest strategy option as baseline, tax-inclusive */
  const cheapestStrategyPrice = Math.min(
    ...STRATEGIES.flatMap(s => s.options.map(o => o.price))
  );
  const minAnnual  = cheapestStrategyPrice * (1 + salesTaxRate) * cansPerDay * 365;
  const maxSavings = Math.max(0, annualCost - minAnnual);

  grid.innerHTML = '';

  SAVINGS_IDEAS.forEach(idea => {
    const canAfford = maxSavings >= idea.annual_cost;
    const multiple  = idea.annual_cost > 0 ? Math.floor(maxSavings / idea.annual_cost) : 0;
    const shortfall = idea.annual_cost - maxSavings;

    let amountText;
    if (idea.freeToStart) {
      amountText = maxSavings > 0
        ? `Put your ${fmt0(maxSavings)} in annual savings to work here — free to start.`
        : `Free to open — redirect your habit savings here.`;
    } else if (maxSavings <= 0) {
      amountText = `Switch to a cheaper option to unlock this.`;
    } else if (canAfford) {
      amountText = multiple > 1
        ? `Your ${fmt0(maxSavings)} savings covers this ${multiple}× over.`
        : `Your ${fmt0(maxSavings)} savings covers this entirely.`;
    } else {
      const pct = Math.round((maxSavings / idea.annual_cost) * 100);
      amountText = `Your ${fmt0(maxSavings)} gets you ${pct}% there — just ${fmt0(shortfall)} short.`;
    }

    const card = document.createElement('a');
    card.href      = idea.href;
    card.className = 'idea-card';
    card.setAttribute('target', '_blank');
    card.setAttribute('rel', 'noopener noreferrer');
    card.innerHTML = `
      <div class="idea-card-top">
        <span class="idea-icon" aria-hidden="true">${idea.icon}</span>
        <span class="idea-tag">${idea.tag}</span>
      </div>
      <div class="idea-name">${idea.name}</div>
      <div class="idea-desc">${idea.desc}</div>
      <div class="idea-amount">${amountText}</div>
      <div class="idea-cta">${idea.cta}</div>
    `;
    grid.appendChild(card);
  });

  section.classList.remove('hidden');
  section.classList.add('reveal');
}

/* ── CAFFEINE COST INDEX ─────────────────────────────────── */
function renderCaffeineIndex() {
  const section = document.getElementById('caffeine-index');
  const chart   = document.getElementById('caff-chart');
  const callout = document.getElementById('caff-callout');
  if (!section || !drinks.length) return;

  /* Cost per 10mg, tax-inclusive */
  const withCpm = drinks.map(d => ({
    ...d,
    taxPrice: d.price * (1 + salesTaxRate),
    cpm: (d.price * (1 + salesTaxRate) * 10) / d.caffeine_mg
  }));

  /* Sort most expensive → cheapest */
  const sorted = [...withCpm].sort((a, b) => b.cpm - a.cpm);
  const maxCpm = sorted[0].cpm;
  const minCpm = sorted[sorted.length - 1].cpm;
  const ratio  = maxCpm / minCpm;

  /* Interpolate red (#FF1A1A) → green (#00ff87) */
  function barColor(fraction) {
    /* fraction 0 = most expensive (red), 1 = cheapest (green) */
    const r = Math.round(255 * (1 - fraction));
    const g = Math.round(26  + 229 * fraction);
    const b = Math.round(26  + 109 * fraction);
    return `rgb(${r},${g},${b})`;
  }

  /* Dynamic callout */
  callout.innerHTML =
    `<span class="caff-callout-expensive">${sorted[0].name}</span> costs ` +
    `<span class="caff-callout-mult">${ratio.toFixed(1)}&times;</span> more per mg of caffeine than ` +
    `<span class="caff-callout-cheap">${sorted[sorted.length - 1].name}</span>`;

  /* Bar rows — fraction 0=most expensive(red) 1=cheapest(green) */
  chart.innerHTML = sorted.map(d => {
    const fraction = 1 - (d.cpm - minCpm) / (maxCpm - minCpm);
    const barPct   = (d.cpm / maxCpm) * 100;
    const color    = barColor(fraction);
    return `
      <div class="caff-row">
        <div class="caff-meta">
          <span class="caff-name">${d.name}</span>
          <span class="caff-can-price">$${d.price.toFixed(2)}/can</span>
        </div>
        <div class="caff-bar-row">
          <div class="caff-bar-track">
            <div class="caff-bar" style="width:${barPct.toFixed(1)}%;background:${color}"></div>
          </div>
          <span class="caff-cpm">$${d.cpm.toFixed(2)}/10mg</span>
        </div>
      </div>
    `;
  }).join('');

  section.classList.remove('hidden');
  section.classList.add('reveal');
}

/* ── LOAD DRINKS ─────────────────────────────────────────── */
async function loadDrinks() {
  try {
    const res = await fetch('drinks.json');
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    drinks = data.drinks;
  } catch (_) {
    drinks = FALLBACK_DRINKS;
  }
  populateDropdown();
}

/* Ordered optgroups — most popular to least popular */
const DRINK_GROUPS = [
  {
    label: 'Red Bull',
    ids: ['red-bull-regular', 'red-bull-12oz', 'red-bull-16oz', 'red-bull-20oz']
  },
  {
    label: 'Monster',
    ids: ['monster-original', 'monster-ultra', 'monster-juice', 'java-monster']
  },
  {
    label: 'Performance',
    ids: ['celsius-original', 'celsius-essentials', 'alani-nu', 'ghost-energy',
          'prime-energy', 'c4-energy', 'reign-total-body', 'reign-storm', 'bang-energy']
  },
  {
    label: 'Legacy',
    ids: ['rockstar-original', 'nos-original', 'full-throttle', 'ryse-fuel', 'bucked-up']
  },
  {
    label: 'Value',
    ids: ['cstore-private-label']
  }
];

function populateDropdown() {
  const sel = document.getElementById('drink-select');
  sel.innerHTML = '';

  let firstDrink = null;

  DRINK_GROUPS.forEach(group => {
    const optgroup = document.createElement('optgroup');
    optgroup.label = group.label;

    group.ids.forEach(id => {
      const d = drinks.find(drink => drink.id === id);
      if (!d) return;
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = `${d.name} — $${d.price.toFixed(2)}`;
      optgroup.appendChild(opt);
      if (!firstDrink) firstDrink = d;
    });

    if (optgroup.children.length > 0) sel.appendChild(optgroup);
  });

  currentDrink = firstDrink || drinks[0];
  updateDrinkMeta();

  if (isDesktop()) liveUpdate();
}

function updateDrinkMeta() {
  if (!currentDrink) return;
  const base = `${currentDrink.size_oz}oz · ${currentDrink.caffeine_mg}mg caffeine · $${currentDrink.price.toFixed(2)}/can`;
  const canPrice = currentDrink.price * (1 + salesTaxRate);
  const taxPart  = salesTaxRate > 0
    ? ` · $${canPrice.toFixed(2)} w/ ${(salesTaxRate * 100).toFixed(0)}% tax`
    : '';
  document.getElementById('drink-meta').textContent = base + taxPart;
}

/* ── SHOW / UPDATE RESULTS ───────────────────────────────── */

/* Desktop: live update on every input change */
function liveUpdate() {
  if (!currentDrink) return;

  const { canPrice, weekly, monthly, annual, hoursWorked, truePerCan } = computeCosts();
  const resultsEl = document.getElementById('results');
  const annualEl  = document.getElementById('annual-cost');
  const hoursEl   = document.getElementById('hours-worked');

  const firstShow = resultsEl.classList.contains('hidden');

  resultsEl.classList.remove('hidden');

  if (firstShow) {
    void resultsEl.offsetWidth;
    resultsEl.classList.add('reveal');
    animateValue(annualEl, annual,       1200, fmt0);
    animateValue(hoursEl,  hoursWorked,  1200, n => fmtN(n, 1));
  } else {
    annualEl.textContent = fmt0(annual);
    hoursEl.textContent  = fmtN(hoursWorked, 1);
  }

  document.getElementById('results-subline').textContent = buildSubline(canPrice, truePerCan);
  document.getElementById('price-per-can').textContent   = fmt2(canPrice);
  document.getElementById('weekly-cost').textContent     = fmt2(weekly);
  document.getElementById('monthly-cost').textContent    = fmt2(monthly);

  updateSliderFill(document.getElementById('tax-slider'));
  updateHoursContext();
  renderCaffeineIndex();
  renderStrategies(annual);
  renderSavingsIdeas(annual);

  resultsVisible = true;
}

/* Mobile: button-triggered with animation + scroll */
function calculate() {
  if (!currentDrink) return;

  const { canPrice, weekly, monthly, annual, hoursWorked, truePerCan } = computeCosts();
  const resultsEl = document.getElementById('results');

  resultsEl.classList.remove('hidden');
  void resultsEl.offsetWidth;
  resultsEl.classList.add('reveal');

  document.getElementById('results-subline').textContent = buildSubline(canPrice, truePerCan);
  document.getElementById('price-per-can').textContent   = fmt2(canPrice);
  document.getElementById('weekly-cost').textContent     = fmt2(weekly);
  document.getElementById('monthly-cost').textContent    = fmt2(monthly);

  animateValue(document.getElementById('annual-cost'),  annual,      1500, fmt0);
  animateValue(document.getElementById('hours-worked'), hoursWorked, 1500, n => fmtN(n, 1));

  updateSliderFill(document.getElementById('tax-slider'));
  updateHoursContext();

  setTimeout(() => {
    renderCaffeineIndex();
    renderStrategies(annual);
    renderSavingsIdeas(annual);
  }, 120);

  setTimeout(() => {
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 80);

  resultsVisible = true;
}

/* Mobile: full no-animation recalc (income tax or sales tax slider change) */
function recalcAll() {
  if (!resultsVisible || !currentDrink) return;
  const { canPrice, weekly, monthly, annual, hoursWorked, truePerCan } = computeCosts();
  document.getElementById('price-per-can').textContent   = fmt2(canPrice);
  document.getElementById('weekly-cost').textContent     = fmt2(weekly);
  document.getElementById('monthly-cost').textContent    = fmt2(monthly);
  document.getElementById('annual-cost').textContent     = fmt0(annual);
  document.getElementById('hours-worked').textContent    = fmtN(hoursWorked, 1);
  document.getElementById('results-subline').textContent = buildSubline(canPrice, truePerCan);
  updateHoursContext();
  renderCaffeineIndex();
  renderStrategies(annual);
  renderSavingsIdeas(annual);
}

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadDrinks();

  document.getElementById('stepper-minus').addEventListener('click', () => {
    if (cansPerDay > 1) {
      cansPerDay--;
      document.getElementById('stepper-value').textContent = cansPerDay;
      if (isDesktop()) liveUpdate();
    }
  });

  document.getElementById('stepper-plus').addEventListener('click', () => {
    if (cansPerDay < 6) {
      cansPerDay++;
      document.getElementById('stepper-value').textContent = cansPerDay;
      if (isDesktop()) liveUpdate();
    }
  });

  document.getElementById('drink-select').addEventListener('change', e => {
    currentDrink = drinks.find(d => d.id === e.target.value) || null;
    updateDrinkMeta();
    if (isDesktop()) liveUpdate();
  });

  document.getElementById('hourly-wage').addEventListener('input', () => {
    if (isDesktop()) liveUpdate();
  });

  document.getElementById('hourly-wage').addEventListener('keydown', e => {
    if (e.key === 'Enter') calculate();
  });

  document.getElementById('calc-btn').addEventListener('click', calculate);

  const taxSlider  = document.getElementById('tax-slider');
  const taxDisplay = document.getElementById('tax-display');

  updateSliderFill(taxSlider);

  taxSlider.addEventListener('input', e => {
    const val = parseInt(e.target.value, 10);
    taxRate   = val / 100;
    taxDisplay.textContent = `${val}%`;
    taxSlider.setAttribute('aria-valuenow', val);
    updateSliderFill(taxSlider);
    if (isDesktop()) liveUpdate();
    else recalcAll();
  });

  const salesTaxSlider  = document.getElementById('sales-tax-slider');
  const salesTaxDisplay = document.getElementById('sales-tax-display');

  updateSliderFill(salesTaxSlider);

  salesTaxSlider.addEventListener('input', e => {
    const val    = parseFloat(e.target.value);
    salesTaxRate = val / 100;
    salesTaxDisplay.textContent = `${val % 1 === 0 ? val.toFixed(0) : val}%`;
    salesTaxSlider.setAttribute('aria-valuenow', val);
    updateSliderFill(salesTaxSlider);
    updateDrinkMeta();
    if (isDesktop()) liveUpdate();
    else recalcAll();
  });
});
