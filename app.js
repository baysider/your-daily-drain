/* Your Daily Drain — app.js */

let drinksData = null;

async function init() {
  try {
    const res = await fetch('drinks.json');
    drinksData = await res.json();
  } catch (e) {
    console.error('Failed to load drinks.json', e);
    return;
  }

  populateDropdown();
  renderCaffeineIndex();

  document.getElementById('calcForm').addEventListener('submit', handleCalculate);

  document.getElementById('taxSlider').addEventListener('input', function () {
    document.getElementById('taxDisplay').textContent = this.value + '%';
  });
}

function populateDropdown() {
  const select = document.getElementById('drinkSelect');
  drinksData.nameBrands.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.id;
    opt.textContent = `${d.name} ${d.size_oz}oz — $${d.price_convenience.toFixed(2)}`;
    select.appendChild(opt);
  });
}

function getDrinkById(id) {
  return [...drinksData.nameBrands, ...drinksData.valueAlternatives].find(d => d.id === id);
}

function handleCalculate(e) {
  e.preventDefault();

  const drinkId = document.getElementById('drinkSelect').value;
  const rawCustom = document.getElementById('customPrice').value.trim();
  const cansPerDay = parseFloat(document.getElementById('cansPerDay').value);
  const hourlyWage = parseFloat(document.getElementById('hourlyWage').value);
  const taxRate = parseInt(document.getElementById('taxSlider').value, 10);

  if (!drinkId) {
    document.getElementById('drinkSelect').focus();
    return;
  }
  if (!cansPerDay || cansPerDay <= 0) return;
  if (!hourlyWage || hourlyWage <= 0) return;

  const drink = getDrinkById(drinkId);
  const pricePerCan = rawCustom !== '' ? parseFloat(rawCustom) : drink.price_convenience;

  if (isNaN(pricePerCan) || pricePerCan <= 0) return;

  const results = compute(pricePerCan, cansPerDay, hourlyWage, taxRate);
  renderResults(results, drink, pricePerCan);
  renderCheaperHits(drink, pricePerCan, cansPerDay, taxRate);
  renderRedirectCash(results.annualCost);

  document.getElementById('results').classList.remove('hidden');
  document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function compute(pricePerCan, cansPerDay, hourlyWage, taxRate) {
  const annualCost = pricePerCan * cansPerDay * 365;
  const weeklyCost = pricePerCan * cansPerDay * 7;
  const preTaxMultiplier = 1 / (1 - taxRate / 100);
  const preTaxAnnual = annualCost * preTaxMultiplier;
  const hoursWorked = preTaxAnnual / hourlyWage;
  const preTaxPerCan = pricePerCan * preTaxMultiplier;
  return { annualCost, weeklyCost, preTaxAnnual, hoursWorked, preTaxPerCan };
}

function renderResults(results, drink, pricePerCan) {
  document.getElementById('pretaxHeadline').textContent =
    `That $${pricePerCan.toFixed(2)} ${drink.name} cost you $${results.preTaxPerCan.toFixed(2)} to earn.`;

  animateCounter('annualCost', results.annualCost, '$');
  document.getElementById('weeklyCost').textContent = '$' + fmt(results.weeklyCost);
  document.getElementById('hoursWorked').textContent = Math.round(results.hoursWorked) + ' hrs';
}

function animateCounter(elId, target, prefix) {
  const el = document.getElementById(elId);
  const duration = 1400;
  const start = performance.now();

  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = target * eased;
    el.textContent = prefix + commas(Math.round(val));
    if (p < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function fmt(n) {
  return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function commas(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/* =========================================
   CHEAPER HITS
   ========================================= */

function renderCheaperHits(selectedDrink, selectedPrice, cansPerDay, taxRate) {
  const section = document.getElementById('cheaperHits');
  const container = document.getElementById('cheaperHitsCards');
  const labelEl = document.getElementById('selectedDrinkLabel');

  labelEl.textContent = `${selectedDrink.name} ${selectedDrink.size_oz}oz at $${selectedPrice.toFixed(2)}/can`;

  container.innerHTML = '';

  const cards = buildCards(selectedDrink, selectedPrice, cansPerDay, taxRate);
  cards.forEach(card => container.appendChild(card));

  section.classList.remove('hidden');
}

function annualSavings(selectedPrice, altPrice, cansPerDay) {
  const s = (selectedPrice - altPrice) * cansPerDay * 365;
  return s > 0 ? s : 0;
}

function savingsBar(savings) {
  if (savings <= 0) return '';
  return `
    <div class="hit-savings-bar">
      <span class="hit-savings-label">Annual savings vs your current drink</span>
      <span class="hit-savings-value">$${commas(Math.round(savings))}</span>
    </div>`;
}

function buildCards(selectedDrink, selectedPrice, cansPerDay, taxRate) {
  const cards = [];

  /* --- Venom card --- */
  const venom = getDrinkById('venom-16');
  if (venom && selectedPrice > venom.price_convenience) {
    const sv = annualSavings(selectedPrice, venom.price_convenience, cansPerDay);
    cards.push(makeCard({
      title: 'Venom Energy',
      channel: 'Convenience / Grocery',
      channelClass: '',
      body: `
        <div class="hit-product-row">
          <div>
            <div class="hit-product-name">Venom ${venom.size_oz}oz</div>
            <div class="hit-product-meta">${venom.caffeine_mg}mg caffeine &bull; ${venom.sugar_g}g sugar</div>
          </div>
          <div class="hit-product-price">
            <div class="hit-price-main">$${venom.price_convenience.toFixed(2)}</div>
            <div class="hit-price-sub">per can</div>
          </div>
        </div>
        ${savingsBar(sv)}
      `,
      cta: { label: 'Find Venom', href: venom.buy_link }
    }));
  }

  /* --- Dollar Tree Closeouts --- */
  const bang12 = getDrinkById('bang-12-dt');
  const rock12 = getDrinkById('rockstar-12-dt');
  const dtSavings = bang12 ? annualSavings(selectedPrice, bang12.price_convenience, cansPerDay) : 0;
  cards.push(makeCard({
    title: 'Dollar Tree Closeouts',
    channel: 'Dollar Tree / Dollar General',
    channelClass: '',
    body: `
      <div class="hit-product-row">
        <div>
          <div class="hit-product-name">Bang ${bang12 ? bang12.size_oz : 12}oz</div>
          <div class="hit-product-meta">${bang12 ? bang12.caffeine_mg : 300}mg caffeine &bull; zero sugar</div>
          <span class="exclusive-tag">Dollar Tree exclusive format</span>
        </div>
        <div class="hit-product-price">
          <div class="hit-price-main">$${bang12 ? bang12.price_convenience.toFixed(2) : '1.25'}</div>
          <div class="hit-price-sub">per can</div>
        </div>
      </div>
      <div class="hit-product-row">
        <div>
          <div class="hit-product-name">Rockstar ${rock12 ? rock12.size_oz : 12}oz</div>
          <div class="hit-product-meta">${rock12 ? rock12.caffeine_mg : 160}mg caffeine &bull; ${rock12 ? rock12.sugar_g : 24}g sugar</div>
          <span class="exclusive-tag">Dollar Tree and Dollar General exclusive format</span>
        </div>
        <div class="hit-product-price">
          <div class="hit-price-main">$${rock12 ? rock12.price_convenience.toFixed(2) : '1.25'}</div>
          <div class="hit-price-sub">per can</div>
        </div>
      </div>
      ${savingsBar(dtSavings)}
    `,
    cta: null
  }));

  /* --- Sam's Club --- */
  const samsBulkPrice = 1.69;
  const samsSavings = annualSavings(selectedPrice, samsBulkPrice, cansPerDay);
  cards.push(makeCard({
    title: "Sam's Club Bulk",
    channel: "Sam's Club",
    channelClass: 'accent',
    body: `
      <div class="hit-product-row">
        <div>
          <div class="hit-product-name">Monster 24-pack case</div>
          <div class="hit-product-meta">~$1.79/can &bull; 160mg caffeine</div>
        </div>
      </div>
      <div class="hit-product-row">
        <div>
          <div class="hit-product-name">Bang 24-pack case</div>
          <div class="hit-product-meta">~$1.49/can &bull; 300mg caffeine</div>
        </div>
      </div>
      <div class="hit-product-row">
        <div>
          <div class="hit-product-name">Reign 24-pack case</div>
          <div class="hit-product-meta">~$1.59/can &bull; 300mg caffeine</div>
        </div>
      </div>
      ${savingsBar(samsSavings)}
      <p class="card-disclaimer">Rotating availability and geographic differences apply. Stock varies by location and season.</p>
    `,
    cta: { label: "Shop Sam's Club", href: 'https://www.samsclub.com/s/energy%20drinks' }
  }));

  /* --- Costco --- */
  const kirkland = getDrinkById('kirkland-16');
  const costcoPrice = kirkland ? kirkland.price_convenience : 1.29;
  const costcoSavings = annualSavings(selectedPrice, costcoPrice, cansPerDay);
  cards.push(makeCard({
    title: 'Costco',
    channel: 'Costco',
    channelClass: 'accent',
    body: `
      <div class="hit-product-row">
        <div>
          <div class="hit-product-name">Kirkland Energy ${kirkland ? kirkland.size_oz : 16}oz</div>
          <div class="hit-product-meta">${kirkland ? kirkland.caffeine_mg : 160}mg caffeine &bull; Costco store brand</div>
        </div>
        <div class="hit-product-price">
          <div class="hit-price-main">$${costcoPrice.toFixed(2)}</div>
          <div class="hit-price-sub">per can</div>
        </div>
      </div>
      ${savingsBar(costcoSavings)}
      <div class="pro-tip">
        <div class="pro-tip-label">Pro tip</div>
        <div class="pro-tip-text">During Costco MVM coupon book events, energy drink cases are typically 20% or more off regular price. Stock up then for maximum savings.</div>
      </div>
      <p class="card-disclaimer">Rotating availability and geographic differences apply. Stock varies by location and season.</p>
    `,
    cta: { label: 'Shop Costco', href: 'https://www.costco.com/energy-drinks.html' }
  }));

  /* --- Amazon Subscribe & Save --- */
  const c4 = getDrinkById('c4-16');
  const solimo = getDrinkById('solimo-16');
  const amzPrice = c4 ? c4.price_retail : 1.49;
  const amzSavings = annualSavings(selectedPrice, amzPrice, cansPerDay);
  cards.push(makeCard({
    title: 'Amazon Subscribe & Save',
    channel: 'Amazon',
    channelClass: '',
    body: `
      <div class="hit-product-row">
        <div>
          <div class="hit-product-name">C4 ${c4 ? c4.size_oz : 16}oz (bulk case)</div>
          <div class="hit-product-meta">${c4 ? c4.caffeine_mg : 200}mg caffeine &bull; zero sugar</div>
        </div>
        <div class="hit-product-price">
          <div class="hit-price-main">~$${amzPrice.toFixed(2)}</div>
          <div class="hit-price-sub">per can, Subscribe & Save</div>
        </div>
      </div>
      <div class="hit-product-row">
        <div>
          <div class="hit-product-name">Solimo ${solimo ? solimo.size_oz : 16}oz (Amazon brand)</div>
          <div class="hit-product-meta">${solimo ? solimo.caffeine_mg : 160}mg caffeine &bull; ${solimo ? solimo.sugar_g : 54}g sugar</div>
        </div>
        <div class="hit-product-price">
          <div class="hit-price-main">~$${solimo ? solimo.price_retail.toFixed(2) : '1.29'}</div>
          <div class="hit-price-sub">per can, Subscribe & Save</div>
        </div>
      </div>
      ${savingsBar(amzSavings)}
    `,
    cta: { label: 'Shop Amazon', href: 'https://www.amazon.com/s?k=c4+energy+drink+bulk+subscribe+save' }
  }));

  /* --- ALDI --- */
  const aldi = getDrinkById('aldi-gridline-16');
  const aldiSavings = aldi ? annualSavings(selectedPrice, aldi.price_convenience, cansPerDay) : 0;
  if (aldi && selectedPrice > aldi.price_convenience) {
    cards.push(makeCard({
      title: 'ALDI Gridline',
      channel: 'ALDI',
      channelClass: '',
      body: `
        <div class="hit-product-row">
          <div>
            <div class="hit-product-name">Gridline ${aldi.size_oz}oz</div>
            <div class="hit-product-meta">${aldi.caffeine_mg}mg caffeine &bull; ${aldi.sugar_g}g sugar</div>
          </div>
          <div class="hit-product-price">
            <div class="hit-price-main">$${aldi.price_convenience.toFixed(2)}</div>
            <div class="hit-price-sub">per can at ALDI</div>
          </div>
        </div>
        ${savingsBar(aldiSavings)}
      `,
      cta: { label: 'Find an ALDI', href: 'https://www.aldi.us/store-locator/' }
    }));
  }

  /* --- Liquid Death (caffeinated tea alternatives) --- */
  const ldSellOut = getDrinkById('liquid-death-sell-out');
  const ldConvicted = getDrinkById('liquid-death-convicted');
  if (ldSellOut) {
    cards.push(makeCard({
      title: 'Liquid Death Caffeinated Tea',
      channel: 'Caffeinated Tea',
      channelClass: 'tea',
      body: `
        <div class="tea-note">These are caffeinated iced teas — not energy drinks. Caffeine comes from green tea at much lower levels (30mg per can). Listed here for variety, not as a like-for-like energy swap.</div>
        <div class="hit-product-row" style="margin-top:12px">
          <div>
            <div class="hit-product-name">Sell Out ${ldSellOut.size_oz}oz</div>
            <div class="hit-product-meta">${ldSellOut.caffeine_mg}mg caffeine &bull; iced tea with caffeine</div>
            <span class="hit-product-tea-tag">Caffeinated Tea</span>
          </div>
          <div class="hit-product-price">
            <div class="hit-price-main">$${ldSellOut.price_convenience.toFixed(2)}</div>
            <div class="hit-price-sub">per can</div>
          </div>
        </div>
        <div class="hit-product-row">
          <div>
            <div class="hit-product-name">Convicted ${ldConvicted ? ldConvicted.size_oz : 19.2}oz</div>
            <div class="hit-product-meta">${ldConvicted ? ldConvicted.caffeine_mg : 30}mg caffeine &bull; iced tea with caffeine</div>
            <span class="hit-product-tea-tag">Caffeinated Tea</span>
          </div>
          <div class="hit-product-price">
            <div class="hit-price-main">$${ldConvicted ? ldConvicted.price_convenience.toFixed(2) : '2.99'}</div>
            <div class="hit-price-sub">per can</div>
          </div>
        </div>
      `,
      cta: { label: 'Shop Liquid Death', href: ldSellOut.buy_link }
    }));
  }

  return cards;
}

function makeCard({ title, channel, channelClass, body, cta }) {
  const card = document.createElement('div');
  card.className = 'hit-card';
  card.innerHTML = `
    <div class="hit-card-header">
      <span class="hit-card-title">${title}</span>
      <span class="channel-badge ${channelClass}">${channel}</span>
    </div>
    <div class="hit-card-body">
      ${body}
      ${cta && cta.href ? `<a class="hit-cta" href="${cta.href}" target="_blank" rel="noopener">${cta.label} &rarr;</a>` : ''}
    </div>
  `;
  return card;
}

/* =========================================
   CAFFEINE COST INDEX
   ========================================= */

function renderCaffeineIndex() {
  const tbody = document.getElementById('indexBody');
  tbody.innerHTML = '';

  const all = [
    ...drinksData.nameBrands.map(d => ({ ...d, tier: 'name' })),
    ...drinksData.valueAlternatives.map(d => ({ ...d, tier: 'value' }))
  ];

  all.sort((a, b) => {
    const mgA = a.caffeine_mg / a.price_convenience;
    const mgB = b.caffeine_mg / b.price_convenience;
    return mgB - mgA;
  });

  all.forEach(d => {
    const mgPerDollar = d.caffeine_mg / d.price_convenience;
    const mgClass = mgPerDollar >= 100 ? 'high' : mgPerDollar >= 50 ? 'mid' : 'low';

    const isValueTier = d.tier === 'value';
    const isTea = d.category === 'caffeinated-tea';

    let nameBadge = '';
    if (isTea) {
      nameBadge = '<span class="index-category-badge badge-tea">Tea</span>';
    } else if (isValueTier) {
      nameBadge = '<span class="index-category-badge badge-value">Value</span>';
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="index-drink-name">${d.name}${nameBadge}</td>
      <td class="num">${d.size_oz}oz</td>
      <td class="num">${d.caffeine_mg}mg</td>
      <td class="num">$${d.price_convenience.toFixed(2)}</td>
      <td class="num index-mg-value ${mgClass}">${mgPerDollar.toFixed(1)}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* =========================================
   REDIRECT THE CASH
   ========================================= */

const REDIRECT_TIERS = [
  {
    min: 0,
    max: 150,
    items: [
      { icon: '🎵', label: 'Spotify Premium', desc: '12 months of ad-free listening', cost: 120 },
      { icon: '📚', label: 'Book haul', desc: 'A solid stack of used paperbacks or Kindle credits', cost: 60 },
      { icon: '🎬', label: 'A proper movie night setup', desc: 'Popcorn, snacks, a Blu-ray or two', cost: 50 }
    ]
  },
  {
    min: 150,
    max: 400,
    items: [
      { icon: '🎟️', label: 'Concert ticket', desc: 'GA floor for a show you actually want to see', cost: 120 },
      { icon: '🎮', label: 'Steam game sale haul', desc: 'Fill out your backlog during a sale', cost: 100 },
      { icon: '🎧', label: 'Mid-range headphones', desc: 'Sony WH-CH720N or similar — real audio upgrade', cost: 150 }
    ]
  },
  {
    min: 400,
    max: 750,
    items: [
      { icon: '🏕️', label: 'Weekend camping trip', desc: 'Gas, site fees, and camp food for two nights', cost: 200 },
      { icon: '🎪', label: 'Festival day pass', desc: 'One day at a major music or food festival', cost: 150 },
      { icon: '👟', label: 'New running shoes', desc: 'A proper pair — Brooks, Hoka, ASICS', cost: 140 }
    ]
  },
  {
    min: 750,
    max: 1200,
    items: [
      { icon: '✈️', label: 'Domestic flight', desc: 'Return ticket to anywhere in the US you have not been', cost: 280 },
      { icon: '🎮', label: 'New gaming setup', desc: 'Controller upgrade, games, and a year of Game Pass', cost: 250 },
      { icon: '💪', label: 'Real training for a year', desc: 'Gym membership plus a solid programming subscription', cost: 200 }
    ]
  },
  {
    min: 1200,
    max: Infinity,
    items: [
      { icon: '🌍', label: 'Weekend in a city you have never visited', desc: 'Flights + hotel + food budget for two nights', cost: 600 },
      { icon: '💻', label: 'Laptop upgrade fund', desc: 'Meaningful contribution toward something that actually matters', cost: 500 },
      { icon: '🏄', label: 'A full vacation', desc: 'Beach, mountains, international — you pick', cost: 800 }
    ]
  }
];

function renderRedirectCash(annualCost) {
  const section = document.getElementById('redirectCash');
  const grid = document.getElementById('redirectGrid');
  const label = document.getElementById('annualSavingsLabel');

  label.textContent = '$' + commas(Math.round(annualCost));

  const tier = REDIRECT_TIERS.find(t => annualCost >= t.min && annualCost < t.max)
    || REDIRECT_TIERS[REDIRECT_TIERS.length - 1];

  grid.innerHTML = '';
  tier.items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'redirect-card';
    card.innerHTML = `
      <div class="redirect-icon">${item.icon}</div>
      <div class="redirect-content">
        <div class="redirect-item-label">${item.label}</div>
        <div class="redirect-item-desc">${item.desc}</div>
        <div class="redirect-item-cost">~$${commas(item.cost)}</div>
      </div>
    `;
    grid.appendChild(card);
  });

  section.classList.remove('hidden');
}

/* ---- Boot ---- */
document.addEventListener('DOMContentLoaded', init);
