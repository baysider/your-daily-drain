'use strict';

const getFallbackDrinks = globalThis.SiteData?.getFallbackDrinks || (() => []);
const getSiteCopy = globalThis.SiteData?.getSiteCopy || (() => ({}));
const getStrategies = globalThis.SiteData?.getStrategies || (() => []);
const fallbackDrinks = getFallbackDrinks();
const siteCopy = getSiteCopy();
const STRATEGIES = getStrategies();

/* ── CAFFEINE COST INDEX ───────────────────────────────── */
const buildCaffeineIndex = globalThis.SiteData?.buildCaffeineIndex || (() => []);
let caffeineIndex = buildCaffeineIndex(fallbackDrinks);

/* ── SAVINGS IDEAS ───────────────────────────────────────── */
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

function applyStaticCopy() {
  if (typeof siteCopy.pageTitle === 'string') {
    document.title = siteCopy.pageTitle;
  }

  const metaDescription = document.getElementById('meta-description');
  if (metaDescription && typeof siteCopy.metaDescription === 'string') {
    metaDescription.setAttribute('content', siteCopy.metaDescription);
  }

  const ogTitle = document.getElementById('og-title');
  if (ogTitle && typeof siteCopy.ogTitle === 'string') {
    ogTitle.setAttribute('content', siteCopy.ogTitle);
  }

  const ogDescription = document.getElementById('og-description');
  if (ogDescription && typeof siteCopy.ogDescription === 'string') {
    ogDescription.setAttribute('content', siteCopy.ogDescription);
  }

  const textTargets = [
    ['hero-eyebrow', siteCopy.heroEyebrow],
    ['hero-scroll-hint', siteCopy.heroScrollHint],
    ['calculator-label', siteCopy.calculatorLabel],
    ['drink-label', siteCopy.drinkLabel],
    ['stepper-label', siteCopy.cansPerDayLabel],
    ['hourly-wage-label', siteCopy.hourlyWageLabel],
    ['sales-tax-label', siteCopy.salesTaxLabel],
    ['sales-tax-min-label', siteCopy.salesTaxMinLabel],
    ['sales-tax-max-label', siteCopy.salesTaxMaxLabel],
    ['sales-tax-note', siteCopy.salesTaxNote],
    ['calculate-button-label', siteCopy.calculateButton],
    ['results-label', siteCopy.resultsLabel],
    ['per-can-register-label', siteCopy.perCanRegisterLabel],
    ['per-week-label', siteCopy.perWeekLabel],
    ['per-month-label', siteCopy.perMonthLabel],
    ['per-year-label', siteCopy.perYearLabel],
    ['annual-sub', siteCopy.annualSub],
    ['hours-per-year-label', siteCopy.hoursPerYearLabel],
    ['hours-unit-label', siteCopy.hoursUnit],
    ['weeks-unit-label', siteCopy.weeksUnit],
    ['weeks-label', siteCopy.weeksLabel],
    ['income-tax-label', siteCopy.taxRateLabel],
    ['income-tax-min-label', siteCopy.incomeTaxMinLabel],
    ['income-tax-max-label', siteCopy.incomeTaxMaxLabel],
    ['income-tax-note', siteCopy.incomeTaxNote],
    ['caff-label', siteCopy.caffeineIndexLabel],
    ['caff-subtitle', siteCopy.caffeineIndexSubtitle],
    ['alt-label', siteCopy.alternativesLabel],
    ['alt-subtitle', siteCopy.alternativesSubtitle],
    ['ideas-label', siteCopy.savingsIdeasLabel],
    ['ideas-subtitle', siteCopy.savingsIdeasSubtitle],
    ['site-freshness', siteCopy.freshnessNote],
    ['site-disclaimer', siteCopy.footerDisclaimer]
  ];

  textTargets.forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el && typeof value === 'string') {
      el.textContent = value;
    }
  });

  const heroHeadline = document.getElementById('hero-headline');
  if (heroHeadline && typeof siteCopy.heroHeadlineHtml === 'string') {
    heroHeadline.innerHTML = siteCopy.heroHeadlineHtml;
  }

  const heroSub = document.getElementById('hero-sub');
  if (heroSub && typeof siteCopy.heroSubHtml === 'string') {
    heroSub.innerHTML = siteCopy.heroSubHtml;
  }
}

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
  if (!section) return;
  if (!caffeineIndex.length) return;

  const maxCpm = caffeineIndex[0].cpm;
  const minCpm = caffeineIndex[caffeineIndex.length - 1].cpm;
  const ratio  = maxCpm / minCpm;

  /* red (#FF1A1A) → green (#00ff87); fraction 0=expensive, 1=cheap */
  function barColor(fraction) {
    const r = Math.round(255 * (1 - fraction));
    const g = Math.round(26  + 229 * fraction);
    const b = Math.round(26  + 109 * fraction);
    return `rgb(${r},${g},${b})`;
  }

  callout.innerHTML =
    `<span class="caff-callout-expensive">${caffeineIndex[0].name}</span> costs ` +
    `<span class="caff-callout-mult">${ratio.toFixed(1)}&times;</span> more per mg of caffeine than ` +
    `<span class="caff-callout-cheap">${caffeineIndex[caffeineIndex.length - 1].name}</span>`;

  chart.innerHTML = caffeineIndex.map(d => {
    const fraction  = 1 - (d.cpm - minCpm) / (maxCpm - minCpm);
    const barPct    = (d.cpm / maxCpm) * 100;
    const color     = barColor(fraction);
    const priceHtml = d.price != null
      ? `<span class="caff-can-price">$${d.price.toFixed(2)}/can</span>`
      : '';
    /* Wrap parenthesised size — e.g. "(16oz)" — in a lighter sub-label */
    const nameHtml  = d.name.replace(/(\([^)]+\))/, '<span class="caff-size">$1</span>');
    const dividerHtml = d.dividerBefore
      ? `<div class="caff-divider">
           <div class="caff-divider-line"></div>
           <span class="caff-divider-label">WAREHOUSE &amp; DISCOUNT CHANNEL</span>
           <div class="caff-divider-line"></div>
         </div>`
      : '';
    return `
      ${dividerHtml}
      <div class="caff-row">
        <div class="caff-meta">
          <span class="caff-name">${nameHtml}</span>
          ${priceHtml}
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
    caffeineIndex = buildCaffeineIndex(drinks);
  } catch (_) {
    drinks = getFallbackDrinks();
    caffeineIndex = buildCaffeineIndex(drinks);
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
  applyStaticCopy();
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
