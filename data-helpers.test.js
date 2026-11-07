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

  assert.equal(copy.pageTitle, 'Your Daily Drain');
  assert.equal(copy.metaDescription, 'Calculate the true cost of your daily energy drink habit in hours worked.');
  assert.equal(copy.ogDescription, 'That $4 Monster actually costs you $5+ to earn. Find out exactly how many hours you\'re working for caffeine.');
  assert.equal(copy.calculatorLabel, 'YOUR HABIT');
  assert.equal(copy.salesTaxNote, 'Applied to shelf price before all calculations');
  assert.equal(copy.hoursUnit, 'HRS');
  assert.equal(copy.heroEyebrow, 'YOUR DAILY DRAIN');
  assert.equal(copy.freshnessNote, 'Retail price inputs last updated November 3, 2026.');

  copy.heroEyebrow = 'CHANGED';
  copy.pageTitle = 'Changed Title';
  copy.calculatorLabel = 'CHANGED LABEL';
  assert.equal(getSiteCopy().heroEyebrow, 'YOUR DAILY DRAIN');
  assert.equal(getSiteCopy().pageTitle, 'Your Daily Drain');
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

test('buildCaffeineIndex preserves static comparison rows and section break', () => {
  const index = buildCaffeineIndex([]);
  const divider = index.find(item => item.dividerBefore);
  const kirkland = index.find(item => item.name === 'Kirkland Energy (12oz) - Costco');

  assert.equal(divider.name, 'Red Thunder (12oz) - ALDI');
  assert.equal(kirkland.price, 0.71);
});