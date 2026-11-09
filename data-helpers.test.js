const test = require('node:test');
const assert = require('node:assert/strict');

const { buildCaffeineIndex, getFallbackDrinks, getSiteCopy, getStrategies } = require('./site-data.js');

test('getFallbackDrinks returns the shared fallback drink catalog', () => {
  const drinks = getFallbackDrinks();
  const redBull20 = drinks.find(drink => drink.id === 'red-bull-20oz');

  assert.ok(Array.isArray(drinks));
  assert.equal(redBull20.price, 4.99);

  drinks[0].price = 999;
  assert.equal(getFallbackDrinks()[0].price, 4.99);
});

test('getSiteCopy returns cloned homepage copy content', () => {
  const copy = getSiteCopy();

  assert.equal(copy.pageTitle, 'Your Daily Drain – How Much Does Your Energy Drink Habit Really Cost?');
  assert.equal(copy.metaDescription, 'One Monster a day costs $1,389 a year to earn after tax. Calculate the true cost of your energy drink habit — per can, per week, per year, in hours of work.');
  assert.equal(copy.ogDescription, 'That $3 Monster actually costs you nearly $5 to earn. Find out exactly how many hours you\'re working for caffeine.');
  assert.equal(copy.calculatorLabel, 'YOUR HABIT');
  assert.equal(copy.salesTaxNote, 'Applied to shelf price before all calculations');
  assert.equal(copy.hoursUnit, 'HRS');
  assert.equal(copy.heroEyebrow, 'YOUR DAILY DRAIN');
  assert.equal(copy.freshnessNote, 'Retail price inputs last updated November 7, 2026.');

  copy.heroEyebrow = 'CHANGED';
  copy.pageTitle = 'Changed Title';
  copy.calculatorLabel = 'CHANGED LABEL';
  assert.equal(getSiteCopy().heroEyebrow, 'YOUR DAILY DRAIN');
  assert.equal(getSiteCopy().pageTitle, 'Your Daily Drain – How Much Does Your Energy Drink Habit Really Cost?');
  assert.equal(getSiteCopy().calculatorLabel, 'YOUR HABIT');
});

test('getStrategies returns cloned cheaper-hit card data', () => {
  const strategies = getStrategies();
  const costco = strategies.find(strategy => strategy.id === 'costco');
  const dollar = strategies.find(strategy => strategy.id === 'dollar-closeout');

  assert.ok(Array.isArray(strategies));
  assert.equal(costco.tip.includes('20%+ off'), true);
  assert.equal(dollar.options[1].name, 'Bang (12oz)');

  costco.options[0].price = 99;
  assert.equal(getStrategies().find(strategy => strategy.id === 'costco').options[0].price, 0.71);
});

test('buildCaffeineIndex derives overlapping drink prices from the drinks dataset', () => {
  const drinks = [
    { id: 'red-bull-regular', name: 'Red Bull (8.4oz)', price: 2.99, caffeine_mg: 80 },
    { id: 'red-bull-12oz', name: 'Red Bull (12oz)', price: 3.99, caffeine_mg: 114 },
    { id: 'red-bull-16oz', name: 'Red Bull (16oz)', price: 3.99, caffeine_mg: 160 },
    { id: 'red-bull-20oz', name: 'Red Bull (20oz)', price: 4.99, caffeine_mg: 189 },
    { id: 'monster-original', name: 'Monster Original (16oz)', price: 3.59, caffeine_mg: 160 }
  ];

  const index = buildCaffeineIndex(drinks);
  const regular = index.find(item => item.name === 'Red Bull (8.4oz)');
  const sixteen = index.find(item => item.name === 'Red Bull (16oz)');
  const monster = index.find(item => item.name === 'Monster (16oz)');

  assert.equal(regular.price, 2.99);
  assert.equal(regular.cpm, 0.37);
  assert.equal(sixteen.price, 3.99);
  assert.equal(sixteen.cpm, 0.25);
  assert.equal(monster.price, 3.59);
  assert.equal(monster.cpm, 0.22);
});

test('buildCaffeineIndex derives cheap rows from the drink catalog, with section break', () => {
  const index = buildCaffeineIndex(getFallbackDrinks());
  const divider = index.find(item => item.dividerBefore);
  const kirkland = index.find(item => item.name === 'Kirkland Energy (12oz) - Costco');
  const redThunder = index.find(item => item.name === 'Red Thunder (12oz) - ALDI');

  assert.equal(divider.name, 'Red Thunder (12oz) - ALDI');
  assert.equal(kirkland.price, 0.71);
  assert.equal(kirkland.caffeine_mg, 180);
  assert.equal(redThunder.price, 0.91);
  // No separate static rows: the index is the catalog, most to least expensive.
  assert.ok(index.every(item => Number.isFinite(item.cpm)));
});

test('fallback drinks include the cheap swaps with caffeine mg', () => {
  const drinks = getFallbackDrinks();
  const kirkland = drinks.find(drink => drink.id === 'kirkland-energy');
  const bang12 = drinks.find(drink => drink.id === 'bang-12oz');

  assert.equal(kirkland.price, 0.71);
  assert.equal(kirkland.caffeine_mg, 180);
  assert.equal(bang12.caffeine_mg, 225);
});

test('discount grocery options no longer carry a fixed comparator price', () => {
  const strategies = getStrategies();
  const discount = strategies.find(strategy => strategy.id === 'discount-grocery');

  assert.ok(discount.options.every(option => option.altPrice === undefined && option.altOf === undefined));
});

test('caffeine index entries carry caffeine mg', () => {
  const index = buildCaffeineIndex(getFallbackDrinks());
  const monster = index.find(item => item.name === 'Monster (16oz)');
  const kirkland = index.find(item => item.name === 'Kirkland Energy (12oz) - Costco');

  assert.equal(monster.caffeine_mg, 160);
  assert.equal(kirkland.caffeine_mg, 180);
});

test('strategy prices match the drink catalog where they overlap', () => {
  const drinks = getFallbackDrinks();
  const priceByName = new Map(drinks.map(drink => [drink.name, drink.price]));
  const strategies = getStrategies();

  const checks = [
    ['Kirkland Energy (12oz)', 0.71],
    ['Summit Gridlock (16oz)', 1.45],
    ['Summit Waves (12oz)', 1.35],
    ['Red Thunder (12oz)', 0.91],
    ['Venom (16oz)', 0.99],
    ['Bang (12oz)', 1.25],
    ['Solimo (16oz)', 1.59],
  ];
  for (const [name, price] of checks) {
    assert.equal(priceByName.get(name), price, name);
  }
  // And the strategy cards themselves carry those same prices.
  const allStrategyOptions = strategies.flatMap(strategy => strategy.options);
  assert.equal(allStrategyOptions.find(o => o.name === 'Kirkland Energy (12oz)').price, 0.71);
  assert.equal(allStrategyOptions.find(o => o.name === 'Red Thunder').price, 0.91);
});
test('grocery prices exist only where verified, convenience price unchanged', () => {
  const drinks = getFallbackDrinks();
  const byId = new Map(drinks.map(drink => [drink.id, drink]));

  // Target single-can prices, verified November 2026.
  assert.equal(byId.get('monster-original').price, 3.59);
  assert.equal(byId.get('monster-original').price_grocery, 2.89);
  assert.equal(byId.get('monster-ultra').price_grocery, 2.89);
  assert.equal(byId.get('monster-juice').price_grocery, 2.89);
  assert.equal(byId.get('red-bull-regular').price, 2.99);
  assert.equal(byId.get('red-bull-regular').price_grocery, 2.79);
  assert.equal(byId.get('rockstar-original').price, 3.29);
  assert.equal(byId.get('rockstar-original').price_grocery, 1.89);
  assert.equal(byId.get('celsius-original').price, 3.29);
  assert.equal(byId.get('celsius-original').price_grocery, 2.59);

  // Every other drink has no separate grocery price yet, so the
  // channel toggle leaves it unchanged.
  assert.equal(byId.get('java-monster').price_grocery, undefined);
  assert.equal(byId.get('kirkland-energy').price_grocery, undefined);
});
