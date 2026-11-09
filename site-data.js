(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.SiteData = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const SITE_COPY = {
    pageTitle: 'Your Daily Drain',
    metaDescription: 'Calculate the true cost of your daily energy drink habit in hours worked.',
    ogTitle: 'Your Daily Drain - The True Cost of Your Energy Habit',
    ogDescription: 'That $3 Monster actually costs you nearly $5 to earn. Find out exactly how many hours you\'re working for caffeine.',
    heroEyebrow: 'YOUR DAILY DRAIN',
    heroHeadlineHtml: 'That <span class="hl">$3</span> Monster<br>actually costs you <span class="hl">nearly $5</span><br>to earn.',
    heroSubHtml: 'Every can costs more than the price tag.<br>Find out what your habit is really taking from you.',
    heroScrollHint: '↓ CALCULATE BELOW',
    calculatorLabel: 'YOUR HABIT',
    drinkLabel: 'YOUR POISON',
    cansPerDayLabel: 'CANS PER DAY',
    hourlyWageLabel: 'YOUR HOURLY WAGE',
    salesTaxLabel: 'SALES TAX RATE',
    salesTaxMinLabel: '0%',
    salesTaxMaxLabel: '10%',
    salesTaxNote: 'Applied to shelf price before all calculations',
    calculateButton: 'CALCULATE MY DRAIN',
    resultsLabel: 'THE DAMAGE',
    perCanRegisterLabel: 'PER CAN AT REGISTER',
    perWeekLabel: 'PER WEEK',
    perMonthLabel: 'PER MONTH',
    perYearLabel: 'PER YEAR',
    annualSub: 'gone. every single year.',
    hoursPerYearLabel: 'HOURS OF WORK / YEAR',
    hoursUnit: 'HRS',
    weeksUnit: 'WKS',
    weeksLabel: 'of work every year — 40 hrs/week, at your after-tax wage',
    taxRateLabel: 'INCOME TAX RATE',
    incomeTaxMinLabel: '15%',
    incomeTaxMaxLabel: '40%',
    incomeTaxNote: 'Drag to match your bracket',
    caffeineIndexLabel: 'CAFFEINE COST INDEX',
    caffeineIndexSubtitle: 'Cost per 10mg of caffeine for every drink - sorted most to least expensive.',
    alternativesLabel: 'CHEAPER HITS',
    alternativesSubtitle: 'Four ways to buy smarter and keep the caffeine.',
    savingsIdeasLabel: 'REDIRECT THE CASH',
    savingsIdeasSubtitle: 'What your savings could actually buy you.',
    freshnessNote: 'Retail price inputs last updated November 7, 2026.',
    footerDisclaimer: 'Prices are US retail list prices. Results are estimates for illustrative purposes. Affiliate links may earn a commission.'
  };

  const FALLBACK_DRINKS = [
    { id: 'red-bull-20oz', name: 'Red Bull (20oz)', brand: 'Red Bull', price: 4.99, size_oz: 20, caffeine_mg: 189 },
    { id: 'red-bull-16oz', name: 'Red Bull (16oz)', brand: 'Red Bull', price: 3.99, size_oz: 16, caffeine_mg: 160 },
    { id: 'red-bull-12oz', name: 'Red Bull (12oz)', brand: 'Red Bull', price: 3.99, size_oz: 12, caffeine_mg: 114 },
    { id: 'red-bull-regular', name: 'Red Bull (8.4oz)', brand: 'Red Bull', price: 2.99, price_grocery: 2.79, size_oz: 8.4, caffeine_mg: 80 },
    { id: 'monster-original', name: 'Monster Original (16oz)', brand: 'Monster', price: 3.59, price_grocery: 2.89, size_oz: 16, caffeine_mg: 160 },
    { id: 'monster-ultra', name: 'Monster Ultra (16oz)', brand: 'Monster', price: 3.59, price_grocery: 2.89, size_oz: 16, caffeine_mg: 150 },
    { id: 'monster-juice', name: 'Monster Juice (16oz)', brand: 'Monster', price: 3.59, price_grocery: 2.89, size_oz: 16, caffeine_mg: 160 },
    { id: 'java-monster', name: 'Java Monster (15oz)', brand: 'Monster', price: 3.99, size_oz: 15, caffeine_mg: 188 },
    { id: 'celsius-original', name: 'Celsius Original (12oz)', brand: 'Celsius', price: 3.29, price_grocery: 2.59, size_oz: 12, caffeine_mg: 200 },
    { id: 'celsius-essentials', name: 'Celsius Essentials (16oz)', brand: 'Celsius', price: 3.59, size_oz: 16, caffeine_mg: 200 },
    { id: 'alani-nu', name: 'Alani Nu (12oz)', brand: 'Alani Nu', price: 3.39, size_oz: 12, caffeine_mg: 200 },
    { id: 'ghost-energy', name: 'Ghost Energy (16oz)', brand: 'Ghost', price: 3.49, size_oz: 16, caffeine_mg: 200 },
    { id: 'prime-energy', name: 'Prime Energy (12oz)', brand: 'Prime', price: 3.29, size_oz: 12, caffeine_mg: 200 },
    { id: 'c4-energy', name: 'C4 Energy (16oz)', brand: 'C4', price: 3.49, size_oz: 16, caffeine_mg: 200 },
    { id: 'reign-total-body', name: 'Reign Total Body (16oz)', brand: 'Reign', price: 3.49, size_oz: 16, caffeine_mg: 300 },
    { id: 'reign-storm', name: 'Reign Storm (12oz)', brand: 'Reign', price: 3.29, size_oz: 12, caffeine_mg: 130 },
    { id: 'bang-energy', name: 'Bang Energy (16oz)', brand: 'Bang', price: 3.29, size_oz: 16, caffeine_mg: 300 },
    { id: 'rockstar-original', name: 'Rockstar Original (16oz)', brand: 'Rockstar', price: 3.29, price_grocery: 1.89, size_oz: 16, caffeine_mg: 160 },
    { id: 'nos-original', name: 'NOS Original (16oz)', brand: 'NOS', price: 3.29, size_oz: 16, caffeine_mg: 160 },
    { id: 'full-throttle', name: 'Full Throttle (16oz)', brand: 'Full Throttle', price: 3.29, size_oz: 16, caffeine_mg: 160 },
    { id: 'ryse-fuel', name: 'Ryse Fuel (16oz)', brand: 'Ryse', price: 3.49, size_oz: 16, caffeine_mg: 200 },
    { id: 'bucked-up', name: 'Bucked Up (16oz)', brand: 'Bucked Up', price: 3.49, size_oz: 16, caffeine_mg: 300 },
    { id: 'cstore-private-label', name: 'C-Store Private Label (16oz)', brand: 'Private Label', price: 2.39, size_oz: 16, caffeine_mg: 160 },
    { id: 'kirkland-energy', name: 'Kirkland Energy (12oz)', brand: 'Kirkland', price: 0.71, size_oz: 12, caffeine_mg: 180 },
    { id: 'red-thunder', name: 'Red Thunder (12oz)', brand: 'Red Thunder', price: 0.91, size_oz: 12, caffeine_mg: 80 },
    { id: 'venom-energy', name: 'Venom (16oz)', brand: 'Venom', price: 0.99, size_oz: 16, caffeine_mg: 160 },
    { id: 'bang-12oz', name: 'Bang (12oz)', brand: 'Bang', price: 1.25, size_oz: 12, caffeine_mg: 225 },
    { id: 'summit-waves', name: 'Summit Waves (12oz)', brand: 'Summit', price: 1.35, size_oz: 12, caffeine_mg: 200 },
    { id: 'summit-gridlock', name: 'Summit Gridlock (16oz)', brand: 'Summit', price: 1.45, size_oz: 16, caffeine_mg: 150 },
    { id: 'solimo-energy', name: 'Solimo (16oz)', brand: 'Solimo', price: 1.59, size_oz: 16, caffeine_mg: 200 }
  ];

  const DYNAMIC_CAFFEINE_INDEX_CONFIG = [
    { drinkId: 'red-bull-regular' },
    { drinkId: 'red-bull-12oz' },
    { drinkId: 'red-bull-16oz' },
    { drinkId: 'red-bull-20oz' },
    { drinkId: 'monster-original', name: 'Monster (16oz)' },
    { drinkId: 'nos-original', name: 'NOS (16oz)' },
    { drinkId: 'rockstar-original', name: 'Rockstar (16oz)' },
    { drinkId: 'full-throttle', name: 'Full Throttle (16oz)' },
    { drinkId: 'bucked-up', name: 'Bucked Up (16oz)' },
    { drinkId: 'alani-nu' },
    { drinkId: 'ghost-energy', name: 'Ghost (16oz)' },
    { drinkId: 'c4-energy', name: 'C4 Energy (16oz)' },
    { drinkId: 'ryse-fuel', name: 'Ryse Fuel (16oz)' },
    { drinkId: 'celsius-original', name: 'Celsius (12oz)' },
    { drinkId: 'prime-energy', name: 'Prime (12oz)' },
    { drinkId: 'reign-storm', name: 'Reign Storm (12oz)' },
    { drinkId: 'reign-total-body', name: 'Reign (16oz)' },
    { drinkId: 'bang-energy', name: 'Bang (16oz)' },
    { drinkId: 'red-thunder', name: 'Red Thunder (12oz) - ALDI', dividerBefore: true },
    { drinkId: 'summit-gridlock', name: 'Summit Gridlock (16oz) - ALDI' },
    { drinkId: 'solimo-energy', name: 'Solimo (16oz) - Amazon' },
    { drinkId: 'summit-waves', name: 'Summit Waves (12oz) - ALDI' },
    { drinkId: 'venom-energy', name: 'Venom (16oz)' },
    { drinkId: 'bang-12oz', name: 'Bang (12oz, Dollar Tree only)' },
    { drinkId: 'kirkland-energy', name: 'Kirkland Energy (12oz) - Costco' }
  ];

  /* No separate static index rows any more: every index row now comes
     from the drink catalog above (drinks.json / FALLBACK_DRINKS), so a
     price or caffeine change in one place updates the index too.
     See PRICE_UPDATE_GUIDE.md. */
  const STATIC_CAFFEINE_INDEX_ENTRIES = [];

  const STRATEGIES = [
    {
      id: 'costco',
      label: 'COSTCO',
      options: [
        { name: 'Kirkland Energy (12oz)', price: 0.71 },
        { name: 'Ghost (18-pack / 16oz)', price: 1.53 }
      ],
      tip: 'Kirkland at $0.71 is the lowest per-can cost on this page. Costco also often runs a rotating monthly energy drink deal at 20%+ off.',
      linkText: 'Find a Costco near you',
      href: 'https://www.costco.com/s?keyword=energy%20drinks'
    },
    {
      id: 'sams-club',
      label: "SAM'S CLUB",
      options: [
        { name: 'Liquid Death Energy (12oz)', price: 1.22 },
        { name: 'Celsius (12oz)', price: 1.33 },
        { name: 'Alani Nu (12oz)', price: 1.26 },
        { name: 'Alani Nu Mini (8.4oz)', price: 0.94 }
      ],
      tip: "Sam's Club carries a wide multi-brand lineup. Alani Mini (8.4oz) at $0.94 is one of the sharpest value cans in the market — note it's a smaller 8.4oz can.",
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
          altNote: 'Name-brand Monster at ALDI itself: $2.95 — still cheaper than a convenience store'
        },
        {
          name: 'Summit Waves', size: '12oz', price: 1.35,
          altNote: 'Celsius at ALDI: $2.15 vs up to $3.29 at convenience stores'
        },
        {
          name: 'Red Thunder', size: '12oz', price: 0.91,
          altNote: "ALDI's Red Bull dupe - sold as a 4-pack ($3.65 total), best per-can value in this tier"
        }
      ],
      tip: 'ALDI private-label cans are consistent quality with no membership required. Prices are shelf-stable — no need to wait for a sale.',
      linkText: 'Find an ALDI near you',
      href: 'https://www.aldi.us/store-locator'
    },
    {
      id: 'dollar-closeout',
      label: 'DOLLAR TREE & CLOSEOUT',
      options: [
        {
          name: 'Dollar Tree Energy Closeouts',
          price: 1.25,
          note: 'Rotating name-brand closeouts - Celsius, Monster, Rockstar, Bang and others. Not a private label. Stock varies by location and week.'
        },
        { name: 'Bang (12oz)', price: 1.25 },
        { name: 'Rockstar (12oz)', price: 1.25 },
        { name: 'Venom', price: 0.99, note: 'Available at Dollar General, not Dollar Tree.' }
      ],
      tip: 'Closeout stores and Grocery Outlet occasionally stock name brands at deep discount - worth a look every visit. Dollar Tree stock rotates by location and week, and $1.25 cans are usually room temperature, not chilled — this is a stock-up price, not a grab-a-cold-one price.',
      linkText: 'Find Dollar Tree near you',
      href: 'https://locations.dollartree.com/store-locator#?callerURL=www.dollartree.com&dest=/drinks/sport-energy-drinks'
    }
  ];

  function cloneDrink(drink) {
    return { ...drink };
  }

  function cloneSiteCopy() {
    return { ...SITE_COPY };
  }

  function cloneStrategyOption(option) {
    return {
      ...option,
      ...(option.optLink ? { optLink: { ...option.optLink } } : {})
    };
  }

  function cloneStrategy(strategy) {
    return {
      ...strategy,
      options: Array.isArray(strategy.options) ? strategy.options.map(cloneStrategyOption) : []
    };
  }

  function getFallbackDrinks() {
    return FALLBACK_DRINKS.map(cloneDrink);
  }

  function getSiteCopy() {
    return cloneSiteCopy();
  }

  function getStrategies() {
    return STRATEGIES.map(cloneStrategy);
  }

  function roundToHundredth(value) {
    return Math.round(value * 100) / 100;
  }

  function computeCpm(price, caffeineMg) {
    if (!Number.isFinite(price) || !Number.isFinite(caffeineMg) || caffeineMg <= 0) {
      return null;
    }

    return roundToHundredth((price * 10) / caffeineMg);
  }

  function buildCaffeineIndex(drinks) {
    const drinksById = new Map((Array.isArray(drinks) ? drinks : []).map(drink => [drink.id, drink]));

    const dynamicEntries = DYNAMIC_CAFFEINE_INDEX_CONFIG
      .map(config => {
        const drink = drinksById.get(config.drinkId);
        if (!drink) return null;

        return {
          name: config.name || drink.name,
          cpm: computeCpm(drink.price, drink.caffeine_mg),
          price: drink.price,
          caffeine_mg: drink.caffeine_mg,
          ...(config.dividerBefore ? { dividerBefore: true } : {})
        };
      })
      .filter(Boolean);

    // Most expensive per 10mg first, so the rendered list matches the
    // "sorted most to least expensive" subtitle. Stable sort keeps the
    // config order for ties; dividerBefore travels with its entry.
    const sorted = [...dynamicEntries, ...STATIC_CAFFEINE_INDEX_ENTRIES]
      .sort((a, b) => (b.cpm ?? -Infinity) - (a.cpm ?? -Infinity));
    return sorted;
  }

  return {
    buildCaffeineIndex,
    computeCpm,
    getFallbackDrinks,
    getSiteCopy,
    getStrategies
  };
});