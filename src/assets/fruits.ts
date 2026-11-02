import type { Fruit } from '../types/fruit'

// Australian fruit seasonality data (Southern Hemisphere)
export const FRUITS: Fruit[] = [
  // Summer fruits (Dec-Feb)
  {
    id: 'mango',
    name: 'Mango',
    emoji: '🥭',
    colour: '#FF9F1C',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Oct', 'Nov', 'Mar']
    },
    stateOverrides: {
      NT: { peak: ['Oct', 'Nov'], available: ['Sep', 'Dec'] }
    },
    variesByState: true,
    stateNote: 'NT mangoes start around Aug-Sep and Qld from late Oct, so Darwin and Brisbane shops have mangoes earlier and longer than Melbourne. Vic shops sell Qld and NT fruit; Mildura grows a little Kensington Pride.',
    pick: 'Heavy for its size, fruity smell at the stem end, gives slightly under your thumb. Skip very hard or wrinkled ones.',
    storage: 'Ripen on the bench, then fridge for up to about 5 days.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Australian Mango Industry Association, Our Industry', url: 'https://www.industry.mangoes.net.au/our-industry', says: 'Harvest starts NT July/August, WA Sept/Oct, Qld Oct/Nov; season ends around March/April.' },
      { name: 'Queensland Government (hw.qld.gov.au) mango article', url: 'https://hw.qld.gov.au/?p=26175', says: 'Qld mango season late October to early April (via search summary; page not opened).' },
      { name: 'Melbourne Market report (The Happy Apple), 28 Oct 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/asia/article/9886925/nothing-beats-stuff-that-s-grown-in-your-own-country/', says: '28 Oct 2026: mangoes (Kensington Pride and R2E2) in season and volume building.' },
      { name: 'Melbourne Market report, 3 Mar 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9816014/persimmons-and-shepard-avocados-arrive-at-melbourne-market/', says: '3 Mar 2026: Keitt mangoes from Childers finishing; Mildura Kensington Pride in limited volumes.' },
    ],
    notes: 'Kensington Pride is the classic Australian variety',
    origin: 'South Asia (India, Myanmar)',
    history: 'Cultivated for over 4,000 years in India, mangoes spread along trade routes to Southeast Asia and eventually reached Australia in the 1800s. The "Kensington Pride" (also called Bowen) was developed in Queensland and is now Australia\'s most popular variety.',
    nutrition: {
      calories: 60,
      vitaminC: 36,
      fiber: 1.6,
      highlights: ['High in Vitamin A', 'Good source of Vitamin C', 'Contains antioxidants']
    },
    pairings: ['lime', 'coconut', 'chili', 'mint', 'sticky rice'],
    recipes: [
      { name: 'Mango Lassi', type: 'smoothie', description: 'Blend mango with yogurt, honey, and cardamom' },
      { name: 'Mango Salsa', type: 'salad', description: 'Diced mango with red onion, cilantro, lime and jalapeño' },
      { name: 'Mango Sticky Rice', type: 'dessert', description: 'Thai-style coconut sticky rice topped with fresh mango' }
    ]
  },
  {
    id: 'watermelon',
    name: 'Watermelon',
    emoji: '🍉',
    colour: '#F25C6E',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov', 'Mar', 'Apr']
    },
    pick: 'Heavy for its size, a creamy-yellow patch where it sat on the ground, a hollow thud when tapped.',
    storage: 'Whole on the bench for a few days; cut pieces in the fridge, 3 days.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Melons Australia via FreshPlaza: melon production spans 12 months', url: 'https://www.freshplaza.com/africa/article/9613040/this-wide-reaching-approach-to-production-allows-for-12-months-of-the-year-production/', says: 'Melons Australia says melons are produced in every month (so Vic availability is wider than the best-quality window).' },
      { name: 'Melbourne Market report, 3 Mar 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9816014/persimmons-and-shepard-avocados-arrive-at-melbourne-market/', says: '3 Mar 2026: watermelon, rockmelon and papaya performing well.' },
      { name: 'Brisbane Markets produce report, 1 Dec 2023', url: 'https://brisbanemarkets.com.au/brisbane-produce-report-1-december/', says: 'Watermelon growing well and priced for daily purchase (north Qld), Dec 2023.' },
      { name: 'Sydney Markets weekly report 23-29-february-2026', url: 'https://www.sydneymarkets.com.au/recipes-and-produce/market-report/23-29-february-2026', says: 'Seedless watermelon described as at its juicy best in late summer. (read via search summary; the site page would not load)' },
    ],
    origin: 'Northeast Africa (Kalahari Desert)',
    history: 'Ancient Egyptians cultivated watermelons over 4,000 years ago, depicted in hieroglyphics. Travelers valued them as natural canteens in the desert. Seeds spread along trade routes to the Mediterranean, India, and China before reaching the Americas with enslaved Africans.',
    nutrition: {
      calories: 30,
      vitaminC: 8,
      highlights: ['Very hydrating (92% water)', 'Low in calories', 'Contains lycopene antioxidant']
    },
    pairings: ['feta cheese', 'mint', 'lime', 'cucumber', 'basil'],
    recipes: [
      { name: 'Watermelon Feta Salad', type: 'salad', description: 'Cubed watermelon with crumbled feta, mint, and lime' },
      { name: 'Watermelon Agua Fresca', type: 'smoothie', description: 'Blend watermelon with lime juice and mint for refreshing drink' },
      { name: 'Watermelon Granita', type: 'dessert', description: 'Freeze blended watermelon for a light, icy dessert' }
    ]
  },
  {
    id: 'rockmelon',
    name: 'Rockmelon',
    emoji: '🍈',
    colour: '#F7A35C',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Sep', 'Oct', 'Nov', 'Mar', 'Apr']
    },
    pick: 'Sweet smell at the stem end, a smooth round scar where the stem came off, slight give at the other end.',
    storage: 'Bench to ripen, then fridge; cut pieces 3 days.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Melbourne Market report, 24 Sep 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/north-america/article/9768596/strawberries-and-blueberries-from-queensland-victorian-asparagus-season-has-begun/', says: '24 Sep 2025: Bowen (Qld) rockmelons starting to come through; Kununurra (NT) rockmelons finishing.' },
      { name: 'Melbourne Market report, 3 Mar 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9816014/persimmons-and-shepard-avocados-arrive-at-melbourne-market/', says: '3 Mar 2026: rockmelon performing well.' },
      { name: 'Queensland rockmelons at peak supply heading into spring (FreshPlaza)', url: 'https://www.freshplaza.com/north-america/article/9353816/queensland-rockmelons-hit-peak-supply-just-in-time-for-spring/', says: 'A Qld wholesaler reported rockmelon at peak supply heading into spring (via search summary).' },
    ],
    notes: 'Also called cantaloupe',
    origin: 'Persia (modern-day Iran)',
    history: 'Named "cantaloupe" after Cantalupo, Italy, where it was first cultivated for European popes. Australians call it "rockmelon" due to its rough, rock-like skin texture. It was brought to the Americas by Columbus on his second voyage in 1494.',
    nutrition: {
      calories: 34,
      vitaminC: 37,
      fiber: 0.9,
      highlights: ['Excellent source of Vitamin A', 'High in Vitamin C', 'Contains beta-carotene']
    },
    pairings: ['prosciutto', 'lime', 'ginger', 'mint', 'yogurt'],
    recipes: [
      { name: 'Rockmelon Prosciutto', type: 'snack', description: 'Wrap rockmelon slices with prosciutto for classic combo' },
      { name: 'Rockmelon Smoothie', type: 'smoothie', description: 'Blend with yogurt, lime, and mint for breakfast' },
      { name: 'Rockmelon Sorbet', type: 'dessert', description: 'Freeze blended rockmelon with lime for summer treat' }
    ]
  },
  {
    id: 'honeydew',
    name: 'Honeydew',
    emoji: '🍈',
    colour: '#B8E07A',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Sep', 'Oct', 'Nov', 'Mar', 'Apr']
    },
    pick: 'Creamy-yellow, slightly waxy skin, heavy for its size, slight give at the blossom end.',
    storage: 'Bench to ripen, then fridge; cut pieces 3 days.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Melbourne Market report, 24 Sep 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/north-america/article/9768596/strawberries-and-blueberries-from-queensland-victorian-asparagus-season-has-begun/', says: '24 Sep 2025: honeydew from north Qld in good supply, very good quality.' },
      { name: 'Melbourne Market report, 3 Mar 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9816014/persimmons-and-shepard-avocados-arrive-at-melbourne-market/', says: '3 Mar 2026: melons strong at Melbourne Market (honeydew not named separately).' },
      { name: 'Melons Australia via FreshPlaza: 12-month melon production', url: 'https://www.freshplaza.com/africa/article/9613040/this-wide-reaching-approach-to-production-allows-for-12-months-of-the-year-production/', says: 'Melon production spans every month.' },
    ],
    origin: 'Middle East / Southern France',
    history: 'The honeydew melon was prized in ancient Egypt and featured in Renaissance European gardens. Its name comes from its sweet, honey-like flavor. The smooth, pale green variety we know today was developed in Algerian oases before spreading to France and beyond.',
    nutrition: {
      calories: 36,
      vitaminC: 18,
      highlights: ['Good source of Vitamin C', 'Low in calories', 'Contains potassium']
    },
    pairings: ['mint', 'lime', 'cucumber', 'ginger', 'coconut'],
    recipes: [
      { name: 'Honeydew Mint Smoothie', type: 'smoothie', description: 'Blend honeydew with fresh mint, lime, and coconut water' },
      { name: 'Honeydew Fruit Salad', type: 'salad', description: 'Toss with cucumber, mint, and lime dressing' },
      { name: 'Honeydew Sorbet', type: 'dessert', description: 'Freeze blended honeydew with lime juice for refreshing dessert' }
    ]
  },
  {
    id: 'lychee',
    name: 'Lychee',
    emoji: '🔴',
    colour: '#E8607A',
    seasonality: {
      peak: ['Dec', 'Jan'],
      available: ['Nov', 'Feb']
    },
    pick: 'Bright red to pink, firm, with a dry stem and no brown patches. Skin browns quickly, flavour stays good.',
    storage: 'Fridge in a bag, up to about a week.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Australian Lychee Growers Association, via Fruitnet', url: 'https://www.fruitnet.com/asiafruit/tough-season-for-australian-lychees/9025.article', says: 'ALGA: late October to late March, the longest lychee season in the world (via search summary).' },
      { name: 'The Express (Nov 2025) lychee growers', url: 'https://www.theexpressnewspaper.com.au/lychee-growers-confident-despite-sporatic-flowering-2025-11-15', says: 'Season starts mid-October in Far North Qld and ends late March in northern NSW (via search summary).' },
    ],
    notes: 'Short season - enjoy while fresh',
    origin: 'Southern China (Guangdong, Fujian)',
    history: 'Cultivated in China for over 2,000 years, lychees were so prized that Emperor Xuanzong had fresh fruit rushed 1,000km by horseback for his consort Yang Guifei. The fruit reached Australia in the 1850s with Chinese gold miners and is now grown commercially in Queensland.',
    nutrition: {
      calories: 66,
      vitaminC: 72,
      highlights: ['Excellent source of Vitamin C', 'Contains antioxidants', 'Good source of copper']
    },
    pairings: ['rose water', 'ginger', 'coconut', 'lime', 'mint'],
    recipes: [
      { name: 'Lychee Rose Cocktail', type: 'smoothie', description: 'Blend lychees with rose water, lime, and sparkling water' },
      { name: 'Lychee Sorbet', type: 'dessert', description: 'Freeze blended lychees with lime for elegant dessert' },
      { name: 'Lychee Fruit Salad', type: 'salad', description: 'Mix with other tropical fruits, mint, and lime' }
    ]
  },
  {
    id: 'passionfruit',
    name: 'Passionfruit',
    emoji: '💜',
    colour: '#8E4FA8',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb', 'Jun', 'Jul', 'Aug'],
      available: ['Nov', 'Mar', 'Apr', 'May']
    },
    pick: 'Heavy for its size; wrinkled skin means ripe and sweet, smooth means less sweet but still fine.',
    storage: 'Bench until wrinkled, then fridge up to a week.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Passionfruit Australia, Horticulture Statistics Handbook 2022/23', url: 'https://passionfruitaustralia.org.au/wp-content/uploads/2025/05/Horticulture-Stats-Handbook-2022-23-Passionfruit.pdf', says: 'Seasonality by state chart; industry summary gives two supply peaks, Dec-Feb and Jun-Aug (peaks via search summary; the PDF heat map colours were not machine-readable).' },
      { name: 'Melbourne Market report, 31 Mar 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9718974/grapes-pineapples-and-golden-sweet-potatoes-best-of-the-bunch-at-melbourne-market/', says: '31 Mar 2025: pineapple and passionfruit from the Qld/NSW border in prime condition.' },
      { name: 'Melbourne Market report, 24 Sep 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/north-america/article/9768596/strawberries-and-blueberries-from-queensland-victorian-asparagus-season-has-begun/', says: '24 Sep 2025: passionfruit limited, between seasons (some growers supply year-round).' },
      { name: 'Melbourne Market report, 1 Apr 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/north-america/article/9825496/autumn-shift-brings-new-produce-to-australian-market/', says: '1 Apr 2026: Panama passionfruit available.' },
    ],
    notes: 'Look for wrinkled skin - means it\'s ripe',
    origin: 'South America (Brazil, Paraguay, Argentina)',
    history: 'Spanish missionaries in South America named it "passion fruit" because the flower reminded them of the crucifixion - the corona resembling the crown of thorns. It arrived in Australia in the 1800s and became iconic in Australian desserts, especially the pavlova.',
    nutrition: {
      calories: 97,
      vitaminC: 30,
      fiber: 10.4,
      highlights: ['Excellent source of fiber', 'High in Vitamin C', 'Contains antioxidants']
    },
    pairings: ['coconut', 'mango', 'vanilla', 'white chocolate', 'cream'],
    recipes: [
      { name: 'Passionfruit Pavlova', type: 'dessert', description: 'Top meringue with cream and fresh passionfruit pulp' },
      { name: 'Passionfruit Curd', type: 'preserve', description: 'Cook passionfruit pulp with butter, sugar, and eggs' },
      { name: 'Passionfruit Mousse', type: 'dessert', description: 'Fold passionfruit pulp into whipped cream and set' }
    ]
  },
  {
    id: 'cherry',
    name: 'Cherry',
    emoji: '🍒',
    colour: '#C8213A',
    seasonality: {
      peak: ['Dec'],
      available: ['Nov', 'Jan', 'Feb']
    },
    stateOverrides: {
      TAS: { peak: ['Jan'], available: ['Dec', 'Feb'] }
    },
    stateNote: 'Tas cherries run later (late Jan-Feb); NSW and SA start earlier (Oct-Nov).',
    pick: 'Glossy, firm, with green fresh stems. Skip soft, split or wrinkled ones.',
    storage: 'Fridge, loose or in a bag, 3-5 days.',
    confidence: 'high',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Melbourne Market report (The Happy Apple), 28 Oct 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/asia/article/9886925/nothing-beats-stuff-that-s-grown-in-your-own-country/', says: '28 Oct 2026: cherries not yet in season; NSW first, then Victoria, about two weeks away.' },
      { name: 'Brisbane Markets produce report, 1 Dec 2023', url: 'https://brisbanemarkets.com.au/brisbane-produce-report-1-december/', says: '1 Dec 2023: cherry season in full swing from NSW, SA and Victoria.' },
      { name: 'Sydney Markets weekly report 12-18-january-2026', url: 'https://www.sydneymarkets.com.au/recipes-and-produce/market-report/12-18-january-2026', says: 'Late-season cherries mostly from Tasmania in January. (read via search summary; the site page would not load)' },
    ],
    notes: 'Very short season - Tasmanian cherries are premium',
    origin: 'Turkey / Black Sea region',
    history: 'The Roman general Lucullus is credited with introducing cherries to Europe from the Turkish town of Giresun in 74 BC. Cherries arrived in Australia with the First Fleet in 1788. Tasmania\'s cool climate produces world-class cherries, exported as far as Asia.',
    nutrition: {
      calories: 50,
      vitaminC: 7,
      fiber: 1.6,
      highlights: ['Rich in antioxidants', 'Contains melatonin', 'Anti-inflammatory properties']
    },
    pairings: ['chocolate', 'almond', 'vanilla', 'cream', 'kirsch'],
    recipes: [
      { name: 'Cherry Clafoutis', type: 'dessert', description: 'Bake cherries in custardy batter for French classic' },
      { name: 'Cherry Compote', type: 'preserve', description: 'Simmer pitted cherries with sugar and vanilla' },
      { name: 'Cherry Chocolate Tart', type: 'dessert', description: 'Fill chocolate tart shell with fresh cherries and ganache' }
    ]
  },
  {
    id: 'blueberry',
    name: 'Blueberry',
    emoji: '🫐',
    colour: '#4F6BD8',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Sep', 'Oct', 'Nov', 'Mar']
    },
    variesByState: true,
    stateNote: 'NSW and Qld blueberries peak roughly Aug-Dec; Tas Jan-Feb; Vic harvest Dec-Feb.',
    pick: 'Dusty blue bloom, plump and firm, no leaking or wrinkly ones in the punnet.',
    storage: 'Fridge in the punnet, up to about a week. Wash just before eating.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Austrade, Blueberries industry capability report', url: 'https://international.austrade.gov.au/content/dam/austrade-assets/international/documents/reports/horticulture-capability-reports/blueberries-austrade-industry-capability-report.pdf', says: 'Lists Victoria harvest as December to February (via search summary).' },
      { name: 'Tasmanian Government blueberry profile (2014)', url: 'https://nre.tas.gov.au/Documents/Blueberry%20Profile%20updated%20March%202014.pdf', says: 'Fresh Australian blueberries available about 10 months, July to April, main crop NSW.' },
      { name: 'Melbourne Market report, 24 Sep 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/north-america/article/9768596/strawberries-and-blueberries-from-queensland-victorian-asparagus-season-has-begun/', says: '24 Sep 2025: Qld blueberries supply increasing.' },
      { name: 'Melbourne Market report, 13 Jun 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9740919/winter-produce-peaks-at-melbourne-market/', says: '13 Jun 2025: blueberries in limited supply.' },
    ],
    origin: 'North America',
    history: 'Native Americans called them "star berries" because of the star-shaped calyx. They used blueberries for food, medicine, and dye for centuries before European settlement. Commercial cultivation only began in 1916 in New Jersey. Australian production started in the 1970s in Victoria.',
    nutrition: {
      calories: 57,
      vitaminC: 10,
      fiber: 2.4,
      highlights: ['Very high in antioxidants', 'Good source of fiber', 'Supports brain health']
    },
    pairings: ['lemon', 'almond', 'yogurt', 'honey', 'cinnamon'],
    recipes: [
      { name: 'Blueberry Muffins', type: 'breakfast', description: 'Fold fresh blueberries into buttermilk muffin batter' },
      { name: 'Blueberry Smoothie Bowl', type: 'smoothie', description: 'Blend frozen blueberries with banana and top with granola' },
      { name: 'Blueberry Pancakes', type: 'breakfast', description: 'Add fresh blueberries to pancake batter while cooking' }
    ]
  },
  {
    id: 'nectarine',
    name: 'Nectarine',
    emoji: '🍑',
    colour: '#F4763B',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov', 'Mar']
    },
    pick: 'Smells sweet, gives slightly near the stem. Skip rock-hard or bruised.',
    storage: 'Bench to ripen, then fridge 3-5 days.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Melbourne Market report, 6 Mar 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9711422/grapes-and-victorian-plums-pick-of-the-bunch-at-melbourne-wholesale-market/', says: '6 Mar 2025: Victorian peaches and nectarines finishing, last supplies in 1-2 weeks.' },
      { name: 'Melbourne Market report, 1 Apr 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/north-america/article/9825496/autumn-shift-brings-new-produce-to-australian-market/', says: '1 Apr 2026: nectarines almost finished.' },
      { name: 'Melbourne Market report, 31 Aug 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9867999/queensland-strawberries-peak-as-australian-spring-produce-arrives/', says: '31 Aug 2026: stone fruit not yet in season, about 5-6 weeks away (so about mid-Oct).' },
      { name: 'Sydney Markets weekly report 12-18-january-2026', url: 'https://www.sydneymarkets.com.au/recipes-and-produce/market-report/12-18-january-2026', says: 'Peaches and nectarines at their sweetest in January. (read via search summary; the site page would not load)' },
    ],
    notes: 'Stone fruit season!',
    origin: 'China (natural mutation of peach)',
    history: 'Nectarines are essentially fuzz-less peaches, a natural genetic mutation. The name comes from "nectar," the drink of the Greek gods. First described in England in 1616, they were initially considered inferior to peaches but gained popularity for their smooth skin.',
    nutrition: {
      calories: 44,
      vitaminC: 5.4,
      fiber: 1.7,
      highlights: ['Good source of Vitamins A and C', 'Contains antioxidants', 'Low in calories']
    },
    pairings: ['basil', 'honey', 'almond', 'burrata', 'prosciutto'],
    recipes: [
      { name: 'Nectarine Caprese Salad', type: 'salad', description: 'Layer sliced nectarine with mozzarella, basil, and balsamic' },
      { name: 'Grilled Nectarine with Honey', type: 'dessert', description: 'Grill halved nectarines and drizzle with honey and almonds' },
      { name: 'Nectarine Tart', type: 'dessert', description: 'Arrange sliced nectarines on almond cream in pastry shell' }
    ]
  },
  {
    id: 'peach',
    name: 'Peach',
    emoji: '🍑',
    colour: '#FFA27A',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov', 'Mar']
    },
    pick: 'Sweet smell, a golden or creamy background colour (not green), gives slightly near the stem.',
    storage: 'Bench to ripen, then fridge 3-5 days.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Melbourne Market report, 6 Mar 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9711422/grapes-and-victorian-plums-pick-of-the-bunch-at-melbourne-wholesale-market/', says: '6 Mar 2025: Victorian peaches finishing within 1-2 weeks.' },
      { name: 'Melbourne Market report, 1 Apr 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/north-america/article/9825496/autumn-shift-brings-new-produce-to-australian-market/', says: '1 Apr 2026: peaches almost finished, late yellow clingstones remain.' },
      { name: 'Brisbane Markets produce report, 1 Dec 2023', url: 'https://brisbanemarkets.com.au/brisbane-produce-report-1-december/', says: '1 Dec 2023: Victorian peaches plentiful.' },
      { name: 'Sydney Markets weekly report 12-18-january-2026', url: 'https://www.sydneymarkets.com.au/recipes-and-produce/market-report/12-18-january-2026', says: 'Peaches and nectarines at their sweetest in January. (read via search summary; the site page would not load)' },
    ],
    notes: 'White and yellow varieties available',
    origin: 'Northwestern China',
    history: 'Cultivated in China for over 4,000 years, peaches were symbols of immortality. They traveled west along the Silk Road to Persia, which is why the scientific name is Prunus persica. Spanish explorers brought peaches to the Americas in the 1500s.',
    nutrition: {
      calories: 39,
      vitaminC: 6.6,
      fiber: 1.5,
      highlights: ['Good source of Vitamins A and C', 'Contains potassium', 'Supports skin health']
    },
    pairings: ['cream', 'vanilla', 'cinnamon', 'raspberry', 'almond'],
    recipes: [
      { name: 'Peach Cobbler', type: 'dessert', description: 'Top sliced peaches with buttery biscuit dough and bake' },
      { name: 'Grilled Peaches', type: 'dessert', description: 'Grill halved peaches and serve with vanilla ice cream' },
      { name: 'Peach Bellini', type: 'smoothie', description: 'Blend peaches with prosecco for classic Italian cocktail' }
    ]
  },
  {
    id: 'apricot',
    name: 'Apricot',
    emoji: '🍑',
    colour: '#FFA94D',
    seasonality: {
      peak: ['Dec', 'Jan'],
      available: ['Nov', 'Feb']
    },
    pick: 'Orange all over with a sweet smell, slight give. Skip pale green or hard ones.',
    storage: 'Bench to ripen, then fridge 2-3 days.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Prima Fresh (Tatura, Vic) apricot brand via FreshPlaza', url: 'https://www.freshplaza.com/oceania/article/9677885/australia-s-apricot-brand-that-helped-bring-life-to-the-category-is-back-for-a-bigger-season-this-summer/', says: 'Season runs mid-November to late January (via search summary).' },
      { name: 'Brisbane Markets produce report, 1 Dec 2023', url: 'https://brisbanemarkets.com.au/brisbane-produce-report-1-december/', says: '1 Dec 2023: Victorian apricots plentiful.' },
      { name: 'Sydney Markets weekly report 1-7-december-2025', url: 'https://www.sydneymarkets.com.au/recipes-and-produce/market-report/1-7-december-2025', says: 'December described as the peak of the apricot season. (read via search summary; the site page would not load)' },
    ],
    origin: 'Armenia / China',
    history: 'The scientific name Prunus armeniaca means "Armenian plum," though it likely originated in China over 4,000 years ago. Alexander the Great reportedly brought apricots to Greece. They thrive in Australia\'s dry inland climates, with the Riverland region being a major producer.',
    nutrition: {
      calories: 48,
      vitaminC: 10,
      fiber: 2,
      highlights: ['Excellent source of Vitamin A', 'Good source of fiber', 'Contains beta-carotene']
    },
    pairings: ['almond', 'honey', 'cardamom', 'pistachios', 'vanilla'],
    recipes: [
      { name: 'Apricot Jam', type: 'preserve', description: 'Cook apricots with sugar and lemon for classic preserve' },
      { name: 'Apricot Tart', type: 'dessert', description: 'Arrange halved apricots on almond cream in pastry' },
      { name: 'Apricot Chicken Tagine', type: 'salad', description: 'Braise chicken with dried apricots and Moroccan spices' }
    ]
  },
  {
    id: 'plum',
    name: 'Plum',
    emoji: '🟣',
    colour: '#7B3F8C',
    seasonality: {
      peak: ['Jan', 'Feb', 'Mar'],
      available: ['Dec', 'Apr']
    },
    pick: 'Slight give at the tip, a dusty bloom on the skin, a sweet smell.',
    storage: 'Bench to ripen, then fridge up to a week.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Melbourne Market report, 6 Mar 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9711422/grapes-and-victorian-plums-pick-of-the-bunch-at-melbourne-wholesale-market/', says: '6 Mar 2025: Victorian plums plentiful (Swan Hill, Shepparton, Cobram).' },
      { name: 'Melbourne Market report, 3 Mar 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9816014/persimmons-and-shepard-avocados-arrive-at-melbourne-market/', says: '3 Mar 2026: plums and grapes in peak or strong supply.' },
      { name: 'Melbourne Market report, 30 Apr 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/latin-america/article/9833986/autumn-shift-brings-apples-citrus-and-winter-vegetables-to-melbourne/', says: '30 Apr 2026: black plums ending.' },
      { name: 'Brisbane Markets produce report, 1 Dec 2023', url: 'https://brisbanemarkets.com.au/brisbane-produce-report-1-december/', says: '1 Dec 2023: plums plentiful (Stanthorpe and Victoria).' },
    ],
    notes: 'Many varieties - from sweet to tart',
    origin: 'China, Caucasus Mountains, and Europe',
    history: 'Plums have three distinct origins: Asian plums from China (cultivated for 3,000 years), European plums from the Caucasus, and American plums native to North America. They were one of the first fruits domesticated by humans.',
    nutrition: {
      calories: 46,
      vitaminC: 9.5,
      fiber: 1.4,
      highlights: ['Good source of fiber', 'Contains antioxidants', 'Supports digestive health']
    },
    pairings: ['cinnamon', 'ginger', 'port', 'star anise', 'vanilla'],
    recipes: [
      { name: 'Plum Crumble', type: 'dessert', description: 'Top sliced plums with oat crumble and bake until golden' },
      { name: 'Plum Chutney', type: 'preserve', description: 'Cook plums with vinegar, sugar, and spices for tangy condiment' },
      { name: 'Plum Compote', type: 'preserve', description: 'Simmer plums with cinnamon and port for elegant sauce' }
    ]
  },
  {
    id: 'fig',
    name: 'Fig',
    emoji: '🟤',
    colour: '#8A4E7D',
    seasonality: {
      peak: ['Feb', 'Mar'],
      available: ['Jan', 'Apr']
    },
    pick: 'Soft, plump and a little droopy at the neck, a bit of sugar syrup at the base is fine. Skip hard or sour-smelling ones.',
    storage: 'Very perishable: fridge, eat within 2 days.',
    confidence: 'high',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Melbourne Market report, 1 Apr 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/north-america/article/9825496/autumn-shift-brings-new-produce-to-australian-market/', says: '1 Apr 2026: figs have two to three weeks left, usually until mid-April.' },
      { name: 'Melbourne Market report, 30 Apr 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/latin-america/article/9833986/autumn-shift-brings-apples-citrus-and-winter-vegetables-to-melbourne/', says: '30 Apr 2026: figs ending.' },
      { name: 'ALDI Australia fresh figs', url: 'https://aldi.com.au/groceries/fresh-produce/figs', says: 'Aussie figs on shelves February to April (via search summary).' },
    ],
    notes: 'Second crop in autumn is often sweeter',
    origin: 'Western Asia (modern-day Turkey)',
    history: 'Figs are one of the earliest cultivated fruits, dating back to 9400 BC in the Jordan Valley - predating wheat and barley cultivation. They\'re mentioned extensively in ancient texts including the Bible. Every fig "fruit" is actually an inverted flower.',
    nutrition: {
      calories: 74,
      fiber: 2.9,
      highlights: ['Excellent source of fiber', 'High in minerals', 'Contains antioxidants']
    },
    pairings: ['honey', 'goat cheese', 'prosciutto', 'balsamic', 'walnuts'],
    recipes: [
      { name: 'Fig Jam', type: 'preserve', description: 'Cook figs with sugar, lemon, and vanilla for rich preserve' },
      { name: 'Fig and Goat Cheese Salad', type: 'salad', description: 'Toss fresh figs with rocket, goat cheese, and honey' },
      { name: 'Fig Tart', type: 'dessert', description: 'Arrange halved figs on almond cream in pastry shell' }
    ]
  },

  // Autumn fruits (Mar-May)
  {
    id: 'apple',
    name: 'Apple',
    emoji: '🍎',
    colour: '#E23B3B',
    seasonality: {
      peak: ['Mar', 'Apr', 'May'],
      available: ['Jan', 'Feb', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yearRound: 'stored',
    pick: 'Firm and heavy, tight shiny skin, no soft spots. Skip any that feel spongy.',
    storage: 'Fridge crisper, weeks. Keep away from other fruit as apples speed up ripening.',
    confidence: 'high',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Apple and Pear Australia via FreshPlaza: year-round supply depends on cold storage', url: 'https://www.freshplaza.com/oceania/article/9804203/year-round-fruit-supply-in-australia-depends-on-cold-storage/', says: 'Growers store apples in cold or controlled-atmosphere rooms for up to about 12 months, which is why they are sold year-round (via search summary).' },
      { name: 'Queen Victoria Market, seasonal produce guide (Seasonal Fruits table)', url: 'https://qvm.com.au/?p=72383', says: 'Apples peak season March to May.' },
      { name: 'Melbourne Market report, 30 Apr 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/latin-america/article/9833986/autumn-shift-brings-apples-citrus-and-winter-vegetables-to-melbourne/', says: '30 Apr 2026: apples and pears at peak harvest.' },
      { name: 'Melbourne Market report, 5 May 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9728918/melbourne-market-may-fresh-produce-report/', says: '5 May 2025: Pink Lady new-season fruit a top pick.' },
    ],
    notes: 'Pink Lady, Granny Smith, Fuji - all Australian varieties',
    origin: 'Central Asia (Kazakhstan)',
    history: 'Wild apples still grow in the Tien Shan mountains of Kazakhstan. The Silk Road spread apples westward. Australia\'s own "Granny Smith" was discovered in 1868 by Maria Ann Smith in Sydney, grown from a chance seedling. Pink Lady was bred in Western Australia in 1973.',
    nutrition: {
      calories: 52,
      vitaminC: 4.6,
      fiber: 2.4,
      highlights: ['Excellent source of fiber', 'Contains antioxidants', 'Supports heart health']
    },
    pairings: ['cinnamon', 'caramel', 'cheese', 'pork', 'walnuts'],
    recipes: [
      { name: 'Apple Crumble', type: 'dessert', description: 'Bake sliced apples with cinnamon and oat crumble topping' },
      { name: 'Apple Pie', type: 'dessert', description: 'Classic double-crust pie with spiced apple filling' },
      { name: 'Apple Sauce', type: 'preserve', description: 'Cook apples with cinnamon until soft and mash' }
    ]
  },
  {
    id: 'pear',
    name: 'Pear',
    emoji: '🍐',
    colour: '#B5CC3A',
    seasonality: {
      peak: ['Mar', 'Apr', 'May'],
      available: ['Jan', 'Feb', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yearRound: 'stored',
    pick: 'Check the neck: if it gives slightly near the stem it is ripe. Buy firm ones and ripen at home.',
    storage: 'Ripen on the bench, then fridge 3-5 days.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Queen Victoria Market, seasonal produce guide (Seasonal Fruits table)', url: 'https://qvm.com.au/?p=72383', says: 'Pears peak season March to May.' },
      { name: 'Melbourne Market report, 1 Apr 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/north-america/article/9825496/autumn-shift-brings-new-produce-to-australian-market/', says: '1 Apr 2026: new-season Victorian pears arriving.' },
      { name: 'Melbourne Market report, 30 Apr 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/latin-america/article/9833986/autumn-shift-brings-apples-citrus-and-winter-vegetables-to-melbourne/', says: '30 Apr 2026: pears at peak harvest.' },
      { name: 'Environment Victoria, Guide to Seasonal Food (2009, season-level lists only)', url: 'https://environmentvictoria.org.au/wp-content/uploads/2016/06/seasonal-food-calendar.pdf', says: 'Pears listed as in season in summer, autumn and winter lists.' },
    ],
    notes: 'Packham, Beurre Bosc, Williams',
    origin: 'Western China and Europe',
    history: 'Pears have been cultivated for 3,000 years. Homer called them "gifts of the gods." There are over 3,000 varieties worldwide. Australia\'s Packham pear was developed by Charles Packham in Molong, NSW in 1896 and remains one of the most popular green varieties.',
    nutrition: {
      calories: 57,
      vitaminC: 4.3,
      fiber: 3.1,
      highlights: ['Excellent source of fiber', 'Low in calories', 'Contains antioxidants']
    },
    pairings: ['blue cheese', 'honey', 'walnut', 'chocolate', 'vanilla'],
    recipes: [
      { name: 'Poached Pears', type: 'dessert', description: 'Simmer pears in red wine with spices until tender' },
      { name: 'Pear Tart', type: 'dessert', description: 'Arrange sliced pears on almond cream in pastry shell' },
      { name: 'Pear and Blue Cheese Salad', type: 'salad', description: 'Toss sliced pears with rocket, blue cheese, and walnuts' }
    ]
  },
  {
    id: 'grape',
    name: 'Grape',
    emoji: '🍇',
    colour: '#7E57C2',
    seasonality: {
      peak: ['Feb', 'Mar', 'Apr'],
      available: ['Dec', 'Jan', 'May', 'Jun']
    },
    yearRound: 'imported',
    stateNote: 'Qld and WA table grapes start in Nov; Vic (Mildura) peaks Feb-Apr.',
    pick: 'Plump, firmly attached to a green flexible stem, with a frosty bloom. Skip wrinkled or sticky ones.',
    storage: 'Fridge in a bag, up to a week. Wash before eating.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Melbourne Market report, 6 Mar 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9711422/grapes-and-victorian-plums-pick-of-the-bunch-at-melbourne-wholesale-market/', says: '6 Mar 2025: Mildura grapes at peak, good supply until about June.' },
      { name: 'Melbourne Market report, 31 Mar 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9718974/grapes-pineapples-and-golden-sweet-potatoes-best-of-the-bunch-at-melbourne-market/', says: '31 Mar 2025: Australian grapes at peak.' },
      { name: 'Melbourne Market report, 30 Apr 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/latin-america/article/9833986/autumn-shift-brings-apples-citrus-and-winter-vegetables-to-melbourne/', says: '30 Apr 2026: grapes eating well, volumes tightening, Adora last of the season.' },
      { name: 'Australian table grape industry report via FreshPlaza/FreshFruitPortal', url: 'https://www.freshfruitportal.com/news/2026/08/11/australian-table-grape-26/', says: 'Industry report: production starts in November, peaks in February and March, concludes in May (via search summary).' },
    ],
    notes: 'Table grapes at their best',
    origin: 'Near East (Caucasus region)',
    history: 'Grapes are one of the oldest cultivated fruits, grown for at least 8,000 years. They spread from the Caucasus region throughout the ancient world. Australia\'s grape industry began with the First Fleet in 1788, initially for wine but now also for quality table grapes.',
    nutrition: {
      calories: 69,
      vitaminC: 3.2,
      highlights: ['Rich in antioxidants', 'Contains resveratrol', 'Supports heart health']
    },
    pairings: ['cheese', 'walnut', 'chicken', 'fennel', 'rosemary'],
    recipes: [
      { name: 'Roasted Grapes', type: 'salad', description: 'Roast grapes with thyme and olive oil as savory side' },
      { name: 'Grape Chicken Salad', type: 'salad', description: 'Mix grapes with chicken, celery, and walnuts in mayo' },
      { name: 'Frozen Grapes', type: 'snack', description: 'Freeze grapes for healthy summer snack' }
    ]
  },
  {
    id: 'persimmon',
    name: 'Persimmon',
    emoji: '🍊',
    colour: '#F27A1A',
    seasonality: {
      peak: ['Apr', 'May'],
      available: ['Mar', 'Jun']
    },
    stateNote: 'Qld persimmons arrive first (early Mar), Vic/SA fruit later (Apr-May).',
    pick: 'Sweet Fuyu types are eaten firm like an apple. Pointy astringent types must be completely soft and jelly-like.',
    storage: 'Firm Fuyu on the bench or fridge, 1-2 weeks; soft ones fridge, 2-3 days.',
    confidence: 'high',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Australian persimmon season, harvest March to June (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9823269/australian-persimmon-season-starts-with-harvest-from-march-to-june/', says: 'Fresh fruit expected in markets from March through late June.' },
      { name: 'Melbourne Market report, 3 Mar 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9816014/persimmons-and-shepard-avocados-arrive-at-melbourne-market/', says: '3 Mar 2026: Qld persimmons arriving first; Victorian fruit later.' },
      { name: 'Melbourne Market report, 5 May 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9728918/melbourne-market-may-fresh-produce-report/', says: '5 May 2025: local persimmons still good but supply ending.' },
    ],
    notes: 'Sweet when fully ripe',
    origin: 'China and Japan',
    history: 'Known as the "apple of the Orient," persimmons have been cultivated in Asia for over 2,000 years. The word persimmon comes from the Algonquian word "putchamin." The Fuyu (non-astringent) and Hachiya (astringent) are the main varieties found in Australia.',
    nutrition: {
      calories: 70,
      vitaminC: 7.5,
      fiber: 3.6,
      highlights: ['High in Vitamin A', 'Excellent source of fiber', 'Contains antioxidants']
    },
    pairings: ['cinnamon', 'honey', 'yogurt', 'nuts', 'vanilla'],
    recipes: [
      { name: 'Persimmon Pudding', type: 'dessert', description: 'Bake persimmon pulp into moist spiced pudding' },
      { name: 'Persimmon Salad', type: 'salad', description: 'Slice persimmon with rocket, pomegranate, and walnuts' },
      { name: 'Persimmon Smoothie', type: 'smoothie', description: 'Blend ripe persimmon with yogurt, honey, and cinnamon' }
    ]
  },
  {
    id: 'quince',
    name: 'Quince',
    emoji: '🍐',
    colour: '#E8C33A',
    seasonality: {
      peak: ['Apr', 'May', 'Jun'],
      available: ['Mar', 'Jul']
    },
    pick: 'Large, hard, golden-yellow with a strong perfume. Skip green or bruised ones.',
    storage: 'Bench (they scent the room), then fridge a few weeks. Always cooked.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Melbourne Market report, 1 Jun 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9842628/winter-citrus-and-queensland-vegetables-shift-melbourne-market-supply/', says: '1 Jun 2026: quinces (Victoria) listed in season/peak.' },
      { name: 'Sydney Markets March 2024 report (quince season is here)', url: 'https://www.sydneymarkets.com.au/recipes-and-produce/market-report/11-17-march-2024', says: 'Quince season here in March (via search summary).' },
    ],
    notes: 'Must be cooked - makes beautiful paste',
    origin: 'Caucasus region (Iran, Turkey)',
    history: 'The quince was the original "apple" of ancient Greek mythology - the golden apple of Aphrodite. Before sugar became common, quinces were the main ingredient for preserves and marmalades. When cooked, quince transforms from pale and hard to ruby-red and tender.',
    nutrition: {
      calories: 57,
      vitaminC: 15,
      fiber: 1.9,
      highlights: ['Good source of fiber', 'High in Vitamin C', 'Contains antioxidants']
    },
    pairings: ['vanilla', 'cinnamon', 'cheese', 'lamb', 'honey'],
    recipes: [
      { name: 'Quince Paste', type: 'preserve', description: 'Cook quinces with sugar until thick and ruby-red' },
      { name: 'Quince Jelly', type: 'preserve', description: 'Strain cooked quinces for delicate pink jelly' },
      { name: 'Poached Quince', type: 'dessert', description: 'Simmer quince in vanilla syrup until tender and pink' }
    ]
  },
  {
    id: 'pomegranate',
    name: 'Pomegranate',
    emoji: '❤️',
    colour: '#C2183B',
    seasonality: {
      peak: ['Apr', 'May'],
      available: ['Mar', 'Jun', 'Jul']
    },
    pick: 'Heavy for its size with firm, slightly angular skin. Skip cracked or soft ones.',
    storage: 'Bench or fridge, 1-2 weeks or more.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Melbourne Market report, 5 May 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9728918/melbourne-market-may-fresh-produce-report/', says: '5 May 2025: pomegranates now in stores (WA, SA, Vic, NSW).' },
      { name: 'Melbourne Market report, 30 Apr 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/latin-america/article/9833986/autumn-shift-brings-apples-citrus-and-winter-vegetables-to-melbourne/', says: '30 Apr 2026: pomegranates first arrivals.' },
      { name: 'Melbourne Market report, 13 Jun 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9740919/winter-produce-peaks-at-melbourne-market/', says: '13 Jun 2025: Mildura pomegranates finishing.' },
      { name: 'Melbourne Market report, 1 Jun 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9842628/winter-citrus-and-queensland-vegetables-shift-melbourne-market-supply/', says: '1 Jun 2026: pomegranates in good supply.' },
    ],
    origin: 'Iran to northern India',
    history: 'One of the oldest cultivated fruits, pomegranates appear in ancient Egyptian, Greek, and Roman texts. The fruit contains exactly 613 seeds according to Jewish tradition, matching the number of commandments in the Torah. The grenade weapon is named after its resemblance to the fruit.',
    nutrition: {
      calories: 83,
      vitaminC: 10.2,
      fiber: 4,
      highlights: ['Very high in antioxidants', 'Excellent source of fiber', 'Anti-inflammatory properties']
    },
    pairings: ['mint', 'orange', 'lamb', 'walnuts', 'feta'],
    recipes: [
      { name: 'Pomegranate Molasses', type: 'preserve', description: 'Reduce pomegranate juice to thick, tangy syrup' },
      { name: 'Pomegranate Salad', type: 'salad', description: 'Scatter seeds over salad with feta, mint, and walnuts' },
      { name: 'Jeweled Rice', type: 'salad', description: 'Mix pomegranate seeds into Persian-style rice pilaf' }
    ]
  },
  {
    id: 'feijoa',
    name: 'Feijoa',
    emoji: '🥝',
    colour: '#6BA539',
    seasonality: {
      peak: ['Apr', 'May'],
      available: ['Mar', 'Jun']
    },
    pick: 'Soft to a gentle squeeze, a sweet smell. Cut open and scoop with a spoon.',
    storage: 'Fridge, 3-5 days.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Feijoa sales in Australia, NZ season early March to end of May (FreshPlaza)', url: 'https://www.freshplaza.com/north-america/article/9315843/australians-get-a-taste-for-new-zealand-s-feijoa/', says: 'NZ feijoa season runs early March to end of May/early June (via search summary).' },
      { name: 'Adelaide Central Market, in season autumn', url: 'https://adelaidecentralmarket.com.au/in-season-autumn/', says: 'Feijoa listed among autumn fruit (via search summary).' },
      { name: 'Queen Victoria Market, feijoa autumn article', url: 'https://qvm.com.au/?p=76426', says: 'What to cook with feijoa this autumn (via search summary).' },
    ],
    notes: 'Aromatic, tropical-like flavor',
    origin: 'South America (Brazil, Uruguay, Argentina)',
    history: 'Named after Portuguese botanist João da Silva Feijó, this fruit is beloved in New Zealand where it\'s almost a national icon. It arrived in Australia and New Zealand in the late 1800s. Its flavor is often described as a combination of pineapple, guava, and mint.',
    nutrition: {
      calories: 55,
      vitaminC: 33,
      fiber: 6.4,
      highlights: ['Excellent source of Vitamin C', 'Very high in fiber', 'Contains antioxidants']
    },
    pairings: ['apple', 'lime', 'ginger', 'vanilla', 'coconut'],
    recipes: [
      { name: 'Feijoa Smoothie', type: 'smoothie', description: 'Blend feijoas with apple, yogurt, and honey' },
      { name: 'Feijoa Crumble', type: 'dessert', description: 'Bake scooped feijoas with oat crumble topping' },
      { name: 'Feijoa Chutney', type: 'preserve', description: 'Cook feijoas with ginger, vinegar, and sugar' }
    ]
  },

  // Winter fruits (Jun-Aug)
  {
    id: 'orange',
    name: 'Orange',
    emoji: '🍊',
    colour: '#FF8A1E',
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['Apr', 'May', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
    },
    yearRound: 'grown',
    stateNote: 'Navels are Apr/May-Sep; Valencias Sep-Mar (different variety in the shop each half of the year).',
    pick: 'Heavy for its size with a firm, fine-grained skin. Skip puffy, soft ones.',
    storage: 'Bench a week, fridge 2-3 weeks.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Melbourne Market report, 5 May 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9728918/melbourne-market-may-fresh-produce-report/', says: '5 May 2025: Victorian navels starting, prime quality mid-May.' },
      { name: 'Melbourne Market report, 1 Jun 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9842628/winter-citrus-and-queensland-vegetables-shift-melbourne-market-supply/', says: '1 Jun 2026: navels (Griffith, SA Riverland) in season/peak.' },
      { name: 'Melbourne Market report, 24 Sep 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/north-america/article/9768596/strawberries-and-blueberries-from-queensland-victorian-asparagus-season-has-begun/', says: '24 Sep 2025: navels finishing, Valencias starting (Vic and SA).' },
      { name: 'Melbourne Market report, 30 Apr 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/latin-america/article/9833986/autumn-shift-brings-apples-citrus-and-winter-vegetables-to-melbourne/', says: '30 Apr 2026: Valencias last of the season; first Navelina and M7 arrivals.' },
      { name: 'Environment Victoria, Guide to Seasonal Food (2009, season-level lists only)', url: 'https://environmentvictoria.org.au/wp-content/uploads/2016/06/seasonal-food-calendar.pdf', says: 'Valencias listed in summer and autumn lists; navels in winter.' },
    ],
    notes: 'Navel in winter, Valencia in summer',
    origin: 'Southeast Asia (China, India)',
    history: 'Sweet oranges originated in China and reached Europe via the Silk Road. The word "orange" comes from Sanskrit "nāranga." Australia\'s citrus industry began in the 1800s, with the Riverina and Mildura regions now producing most of the country\'s oranges.',
    nutrition: {
      calories: 47,
      vitaminC: 53,
      fiber: 2.4,
      highlights: ['Excellent source of Vitamin C', 'Good source of fiber', 'Contains flavonoids']
    },
    pairings: ['chocolate', 'cranberry', 'rosemary', 'almond', 'duck'],
    recipes: [
      { name: 'Orange Marmalade', type: 'preserve', description: 'Cook oranges with sugar for classic bitter-sweet spread' },
      { name: 'Orange Salad', type: 'salad', description: 'Slice oranges with fennel, olives, and olive oil' },
      { name: 'Orange Cake', type: 'dessert', description: 'Bake whole boiled oranges into moist almond cake' }
    ]
  },
  {
    id: 'mandarin',
    name: 'Mandarin',
    emoji: '🍊',
    colour: '#FF9A2E',
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['Apr', 'May', 'Sep', 'Oct']
    },
    stateNote: 'Qld Imperials arrive Apr (Vic fruit about a month later); Mildura mandarins early winter.',
    pick: 'Heavy for its size, bright loose skin that smells citrusy. Skip dull, puffy ones.',
    storage: 'Bench a week, fridge 2-3 weeks.',
    confidence: 'high',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Melbourne Market report, 5 May 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9728918/melbourne-market-may-fresh-produce-report/', says: '5 May 2025: Imperial/Afourer mandarins peak, Qld abundant, NSW arriving.' },
      { name: 'Melbourne Market report, 1 Apr 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/north-america/article/9825496/autumn-shift-brings-new-produce-to-australian-market/', says: '1 Apr 2026: new-season Imperial mandarins from Qld.' },
      { name: 'Melbourne Market report, 30 Apr 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/latin-america/article/9833986/autumn-shift-brings-apples-citrus-and-winter-vegetables-to-melbourne/', says: '30 Apr 2026: Qld mandarins first arrivals; local Vic mandarins about a month away.' },
      { name: 'Melbourne Market report, 13 Jun 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9740919/winter-produce-peaks-at-melbourne-market/', says: '13 Jun 2025: Mildura mandarins an early winter standout.' },
      { name: 'Melbourne Market report, 24 Sep 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/north-america/article/9768596/strawberries-and-blueberries-from-queensland-victorian-asparagus-season-has-begun/', says: '24 Sep 2025: Afourer mandarins winding down.' },
    ],
    notes: 'Imperial, Murcott, Afourer varieties',
    origin: 'China',
    history: 'Named after the Mandarin Chinese officials who traditionally received these fruits as gifts. They\'ve been cultivated in China for over 3,000 years. The easy-peel fruit became popular in the West in the 1800s. Australia grows several varieties including the Imperial, developed locally.',
    nutrition: {
      calories: 53,
      vitaminC: 27,
      fiber: 1.8,
      highlights: ['Excellent source of Vitamin C', 'Good source of fiber', 'Easy to digest']
    },
    pairings: ['ginger', 'honey', 'almond', 'chicken', 'soy'],
    recipes: [
      { name: 'Mandarin Salad', type: 'salad', description: 'Toss mandarin segments with rocket, almonds, and honey' },
      { name: 'Mandarin Syrup', type: 'preserve', description: 'Simmer mandarin peel with sugar for cocktail syrup' },
      { name: 'Mandarin Chicken', type: 'salad', description: 'Glaze chicken with mandarin juice, soy, and ginger' }
    ]
  },
  {
    id: 'grapefruit',
    name: 'Grapefruit',
    emoji: '🍊',
    colour: '#FF7A6B',
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['Apr', 'May', 'Sep']
    },
    pick: 'Heavy for its size with thin, smooth skin. Skip puffy, soft ones.',
    storage: 'Fridge, 2-3 weeks.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Queen Victoria Market, seasonal produce guide (Seasonal Fruits table)', url: 'https://qvm.com.au/?p=72383', says: 'Grapefruit peak season June to September.' },
      { name: 'Woolworths citrus guide', url: 'https://www.woolworths.com.au/shop/explore/fruit-veg/guides/citrus', says: 'Grapefruit June to August (via search summary; page blocked).' },
      { name: 'Melbourne Market report, 30 Apr 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/latin-america/article/9833986/autumn-shift-brings-apples-citrus-and-winter-vegetables-to-melbourne/', says: '30 Apr 2026: grapefruit in supply.' },
      { name: 'Environment Victoria, Guide to Seasonal Food (2009, season-level lists only)', url: 'https://environmentvictoria.org.au/wp-content/uploads/2016/06/seasonal-food-calendar.pdf', says: 'Grapefruit appears in all four seasonal lists.' },
    ],
    notes: 'Ruby and white varieties',
    origin: 'Barbados (natural hybrid)',
    history: 'The grapefruit is a relatively recent fruit, a natural hybrid of pomelo and sweet orange that occurred in Barbados in the 1700s. It got its name because the fruit grows in grape-like clusters. The ruby red variety was discovered as a mutation in Texas in 1929.',
    nutrition: {
      calories: 42,
      vitaminC: 31,
      fiber: 1.6,
      highlights: ['Excellent source of Vitamin C', 'Low in calories', 'Contains lycopene (ruby)']
    },
    pairings: ['honey', 'mint', 'avocado', 'seafood', 'basil'],
    recipes: [
      { name: 'Grapefruit Salad', type: 'salad', description: 'Segment grapefruit with avocado, mint, and olive oil' },
      { name: 'Grapefruit Marmalade', type: 'preserve', description: 'Cook grapefruit with sugar for tangy preserve' },
      { name: 'Grapefruit Brûlée', type: 'dessert', description: 'Top halved grapefruit with sugar and torch until caramelized' }
    ]
  },
  {
    id: 'lemon',
    name: 'Lemon',
    emoji: '🍋',
    colour: '#FFD93B',
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['Apr', 'May', 'Sep', 'Oct']
    },
    pick: 'Heavy for its size, thin glossy skin. Skip hard, thick-skinned ones.',
    storage: 'Fridge, 2-4 weeks.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Melbourne Market report, 1 Jun 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9842628/winter-citrus-and-queensland-vegetables-shift-melbourne-market-supply/', says: '1 Jun 2026: Victorian lemons in season/peak.' },
      { name: 'Melbourne Market report, 30 Apr 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/latin-america/article/9833986/autumn-shift-brings-apples-citrus-and-winter-vegetables-to-melbourne/', says: '30 Apr 2026: lemons first arrivals from Qld.' },
      { name: 'Melbourne Market report, 24 Sep 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/north-america/article/9768596/strawberries-and-blueberries-from-queensland-victorian-asparagus-season-has-begun/', says: '24 Sep 2025: lemons good value.' },
      { name: 'Environment Victoria, Guide to Seasonal Food (2009, season-level lists only)', url: 'https://environmentvictoria.org.au/wp-content/uploads/2016/06/seasonal-food-calendar.pdf', says: 'Lemons listed in winter and spring lists.' },
    ],
    notes: 'Eureka and Meyer varieties',
    origin: 'Northeast India (Assam region)',
    history: 'Lemons spread from India to the Middle East, then to Europe via Arab traders around 1000 AD. Columbus brought them to the Americas. British sailors were called "limeys" for eating citrus to prevent scurvy. The Meyer lemon, a lemon-orange hybrid, was introduced from China in 1908.',
    nutrition: {
      calories: 29,
      vitaminC: 53,
      highlights: ['Excellent source of Vitamin C', 'Alkalizing properties', 'Supports immune system']
    },
    pairings: ['garlic', 'thyme', 'seafood', 'chicken', 'olive oil'],
    recipes: [
      { name: 'Lemon Curd', type: 'preserve', description: 'Cook lemon juice with butter, sugar, and eggs until thick' },
      { name: 'Preserved Lemons', type: 'preserve', description: 'Salt-cure lemon quarters for North African cooking' },
      { name: 'Lemon Tart', type: 'dessert', description: 'Fill pastry shell with tangy lemon curd' }
    ]
  },
  {
    id: 'lime',
    name: 'Lime',
    emoji: '🍋',
    colour: '#8BC34A',
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['May', 'Sep']
    },
    yearRound: 'grown',
    variesByState: true,
    stateNote: 'Citrus Australia (second-hand) says best Aussie limes Jan-Apr; Melbourne reports show Qld limes finishing in June. Sources disagree.',
    pick: 'Heavy, glossy, firm; yellowing is fine for flavour. Skip dry, hard ones.',
    storage: 'Fridge, 2-3 weeks.',
    confidence: 'low',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Limes grown year-round in Australia, peaks and troughs (via Citrus Australia, search summary)', url: 'https://citrusaustralia.com.au/uncategorised/season', says: 'Domestic lime supply is 12 months with peaks and troughs; best limes January to April (via a bartender source quoting Citrus Australia; the page itself had only headings).' },
      { name: 'Melbourne Market report, 13 Jun 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9740919/winter-produce-peaks-at-melbourne-market/', says: '13 Jun 2025: Qld limes finishing.' },
      { name: 'Environment Victoria, Guide to Seasonal Food (2009, season-level lists only)', url: 'https://environmentvictoria.org.au/wp-content/uploads/2016/06/seasonal-food-calendar.pdf', says: 'Limes in winter and spring lists.' },
    ],
    notes: 'Tahitian limes most common',
    origin: 'Southeast Asia (Indonesia, Malaysia)',
    history: 'Limes originated in Southeast Asia and spread via Arab traders to Africa and the Mediterranean. The British navy famously used lime juice to prevent scurvy, leading to the nickname "limeys." The Australian native finger lime is gaining international recognition as a gourmet "caviar lime."',
    nutrition: {
      calories: 30,
      vitaminC: 29,
      highlights: ['Excellent source of Vitamin C', 'Contains antioxidants', 'Alkalizing properties']
    },
    pairings: ['chili', 'coconut', 'cilantro', 'mint', 'fish'],
    recipes: [
      { name: 'Lime Pickle', type: 'preserve', description: 'Cure lime wedges in salt and spices for Indian condiment' },
      { name: 'Lime Cheesecake', type: 'dessert', description: 'Make no-bake cheesecake with lime zest and juice' },
      { name: 'Lime Marinade', type: 'salad', description: 'Mix lime juice with fish sauce, chili, and garlic for seafood' }
    ]
  },
  {
    id: 'kiwifruit',
    name: 'Kiwifruit',
    emoji: '🥝',
    colour: '#8DB33A',
    seasonality: {
      peak: ['May', 'Jun', 'Jul'],
      available: ['Mar', 'Apr', 'Aug', 'Sep', 'Oct']
    },
    pick: 'Gives slightly to a gentle squeeze like a ripe avocado. Skip very hard (ripen on bench) or mushy.',
    storage: 'Bench to ripen, then fridge, 1-3 weeks.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Seeka Australia (Shepparton, Vic)', url: 'https://www.freshplaza.com/north-america/article/9634842/seeka-completes-2024-australian-harvest/', says: 'Main Australian kiwifruit harvest February to June, supplies the market until August (via search summary).' },
      { name: 'Melbourne Market report, 13 Jun 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9740919/winter-produce-peaks-at-melbourne-market/', says: '13 Jun 2025: Yarra Valley kiwifruit in peak condition.' },
      { name: 'Melbourne Market report, 30 Jun 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9852347/winter-produce-fills-melbourne-market-as-citrus-season-peaks/', says: '30 Jun 2026: kiwifruit in good supply, NZ and Goulburn Valley.' },
      { name: 'Queen Victoria Market, seasonal produce guide (Seasonal Fruits table)', url: 'https://qvm.com.au/?p=72383', says: 'Kiwifruit peak season May to October.' },
    ],
    notes: 'Green and gold varieties',
    origin: 'China (Yangtze River Valley)',
    history: 'Originally called "Chinese gooseberry," the fruit was renamed "kiwifruit" by New Zealand exporters in the 1950s after their national bird. It had been grown in China for centuries as "yang tao." New Zealand dominates global production, with the gold variety bred there in 1991.',
    nutrition: {
      calories: 61,
      vitaminC: 93,
      fiber: 3,
      highlights: ['Very high in Vitamin C', 'Excellent source of fiber', 'Contains digestive enzymes']
    },
    pairings: ['strawberry', 'banana', 'coconut', 'lime', 'mint'],
    recipes: [
      { name: 'Kiwi Smoothie', type: 'smoothie', description: 'Blend kiwifruit with banana, coconut water, and spinach' },
      { name: 'Kiwi Pavlova', type: 'dessert', description: 'Top meringue with cream and sliced kiwifruit' },
      { name: 'Kiwi Fruit Salad', type: 'salad', description: 'Mix sliced kiwi with other tropical fruits and lime' }
    ]
  },
  {
    id: 'avocado',
    name: 'Avocado',
    emoji: '🥑',
    colour: '#5E8A2F',
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug', 'Sep'],
      available: ['Feb', 'Mar', 'Apr', 'May', 'Oct', 'Nov', 'Dec', 'Jan']
    },
    yearRound: 'grown',
    variesByState: true,
    stateNote: 'Shepard (Qld) Feb-Apr; Hass from Qld/NSW/Vic in winter, WA in summer. Seasons differ by state source.',
    pick: 'Ripe when it gives slightly to a gentle squeeze at the stem end; flick the stem cap: green underneath means ripe. Buy hard and ripen at home.',
    storage: 'Bench to ripen, then fridge 2-3 days once ripe.',
    confidence: 'low',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Melbourne Market report, 3 Mar 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9816014/persimmons-and-shepard-avocados-arrive-at-melbourne-market/', says: '3 Mar 2026: Shepard avocados from FNQ arriving; Hass limited.' },
      { name: 'Melbourne Market report, 31 Mar 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9718974/grapes-pineapples-and-golden-sweet-potatoes-best-of-the-bunch-at-melbourne-market/', says: '31 Mar 2025: Shepards fill the gap between Hass seasons until about Anzac Day.' },
      { name: 'Good Fruit and Vegetables: Shepard fills the gap between Hass seasons', url: 'https://www.goodfruitandvegetables.com.au/story/8956492/shepard-avocados-hyped-up-as-more-than-filling-a-gap-between-hass', says: 'Shepard (Qld) covers roughly February to April; Hass is the main variety (via search summary, exporters quote Hass roughly May to January).' },
      { name: 'Queen Victoria Market, seasonal produce guide (Seasonal Fruits table)', url: 'https://qvm.com.au/?p=72383', says: 'Avocados peak season September to March.' },
    ],
    notes: 'Hass variety most popular',
    origin: 'Central Mexico',
    history: 'Avocados have been cultivated in Mexico for over 5,000 years. The Aztecs called them "ahuacatl" (meaning a body part, due to its shape). The Hass variety, now 80% of worldwide production, grew from a single mother tree in California planted by postman Rudolph Hass in 1926.',
    nutrition: {
      calories: 160,
      fiber: 6.7,
      highlights: ['High in healthy fats', 'Excellent source of fiber', 'Contains potassium']
    },
    pairings: ['lime', 'tomato', 'chili', 'cilantro', 'eggs'],
    recipes: [
      { name: 'Avocado Toast', type: 'breakfast', description: 'Mash avocado on toast with lemon, salt, and chili' },
      { name: 'Guacamole', type: 'salad', description: 'Mash avocado with lime, tomato, onion, and cilantro' },
      { name: 'Avocado Smoothie', type: 'smoothie', description: 'Blend avocado with banana, honey, and almond milk' }
    ]
  },
  {
    id: 'custard-apple',
    name: 'Custard Apple',
    emoji: '💚',
    colour: '#9CC77A',
    seasonality: {
      peak: ['May', 'Jun', 'Jul'],
      available: ['Mar', 'Apr', 'Aug', 'Sep']
    },
    pick: 'Heavy, with skin that looks full and slightly wrinkling; yields to gentle pressure. Skip black or cracked.',
    storage: 'Ripen on the bench, then fridge 2 days.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Queensland Country Life: custard apple season Feb-Aug', url: 'https://www.queenslandcountrylife.com.au/story/8390603/out-of-season-custard-apple-harvest-in-full-swing-at-sunshine-coast/', says: 'Traditional season February to August (via search summary).' },
      { name: 'food.com.au custard apple guide', url: 'https://food.com.au/custard-apples', says: 'Season March to October; first fruit from Yeppoon in March, Sunshine Coast most volume mid-season (via search summary).' },
      { name: 'Melbourne Market report, 3 Mar 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9816014/persimmons-and-shepard-avocados-arrive-at-melbourne-market/', says: '3 Mar 2026: custard apples arriving.' },
      { name: 'Melbourne Market report, 30 Apr 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/latin-america/article/9833986/autumn-shift-brings-apples-citrus-and-winter-vegetables-to-melbourne/', says: '30 Apr 2026: custard apples from Qld.' },
    ],
    notes: 'Creamy, sweet tropical flavor',
    origin: 'Central America and Caribbean',
    history: 'Despite its name, custard apples are tropical fruits native to the Americas, brought to Asia by Spanish and Portuguese traders. Mark Twain called the related cherimoya "the most delicious fruit known to men." Australia grows several varieties including the Pinks Mammoth.',
    nutrition: {
      calories: 94,
      vitaminC: 19,
      fiber: 2.4,
      highlights: ['Good source of Vitamin C', 'Contains B vitamins', 'Rich in antioxidants']
    },
    pairings: ['lime', 'coconut', 'mint', 'cream', 'mango'],
    recipes: [
      { name: 'Custard Apple Smoothie', type: 'smoothie', description: 'Blend custard apple flesh with coconut milk and lime' },
      { name: 'Custard Apple Ice Cream', type: 'dessert', description: 'Fold custard apple pulp into vanilla ice cream base' },
      { name: 'Custard Apple Mousse', type: 'dessert', description: 'Mix custard apple pulp with whipped cream and set' }
    ]
  },
  {
    id: 'tangelo',
    name: 'Tangelo',
    emoji: '🍊',
    colour: '#FF7F2A',
    seasonality: {
      peak: ['Jul', 'Aug'],
      available: ['Jun', 'Sep']
    },
    pick: 'Heavy with loose-fitting skin and a citrus smell.',
    storage: 'Fridge, 2-3 weeks.',
    confidence: 'low',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Melbourne Market report, 5 May 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9728918/melbourne-market-may-fresh-produce-report/', says: '5 May 2025: clementines and tangelos due in stores soon.' },
      { name: 'NSW Love Food Hate Waste, pocket guide to seasonal fruit (winter)', url: 'https://www.lovefoodhatewaste.nsw.gov.au/sites/default/files/2020-09/0648%20DL%20Seasonal%20Food%202020%20V4%20230920.pdf', says: 'Tangelos listed under winter fruit.' },
    ],
    notes: 'Cross between tangerine and pomelo',
    origin: 'United States (Florida)',
    history: 'Tangelos are a 20th-century hybrid of tangerines and pomelos (or grapefruits), first bred in Florida in 1911. The Minneola tangelo is recognizable by its distinctive "bell" shape. They combine the best of both parents: easy peeling with a sweet-tart flavor.',
    nutrition: {
      calories: 47,
      vitaminC: 53,
      fiber: 1.9,
      highlights: ['Excellent source of Vitamin C', 'Good source of fiber', 'Contains folate']
    },
    pairings: ['honey', 'ginger', 'seafood', 'fennel', 'vanilla'],
    recipes: [
      { name: 'Tangelo Marmalade', type: 'preserve', description: 'Cook tangelos with sugar for sweet citrus preserve' },
      { name: 'Tangelo Salad', type: 'salad', description: 'Segment tangelos with fennel, olives, and herbs' },
      { name: 'Tangelo Sorbet', type: 'dessert', description: 'Freeze tangelo juice with sugar for refreshing dessert' }
    ]
  },

  // Spring fruits (Sep-Nov)
  {
    id: 'strawberry',
    name: 'Strawberry',
    emoji: '🍓',
    colour: '#E8344E',
    seasonality: {
      peak: ['Sep', 'Oct', 'Nov', 'Dec'],
      available: ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug']
    },
    stateOverrides: {
      QLD: { peak: ['Jul', 'Aug', 'Sep', 'Oct'], available: ['May', 'Jun', 'Nov'] }
    },
    variesByState: true,
    stateNote: 'QLD winter season May-Oct (peak Aug-Oct); VIC Oct-Apr (Oct 2026: peak Vic fruit); WA and TAS in summer. Shops have a gap about mid-May to early June.',
    pick: 'Bright red to the top, shiny, with fresh green caps. Smell them. Skip any with white shoulders or leaking punnets.',
    storage: 'Fridge unwashed, 2-3 days. Wash just before eating.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Melbourne Market report (The Happy Apple), 28 Oct 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/asia/article/9886925/nothing-beats-stuff-that-s-grown-in-your-own-country/', says: '28 Oct 2026: Victorian strawberries (Yarra Valley, Mornington) at peak, WA earlier, Qld finished early.' },
      { name: 'Melbourne Market report, 5 May 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9728918/melbourne-market-may-fresh-produce-report/', says: '5 May 2025: strawberries limited: Vic finishing, Qld not yet started, recovery in 2-3 weeks.' },
      { name: 'Melbourne Market report, 31 Aug 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9867999/queensland-strawberries-peak-as-australian-spring-produce-arrives/', says: '31 Aug 2026: strawberries at peak from the Qld Sunshine Coast.' },
      { name: 'Melbourne Market report, 30 Jun 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9852347/winter-produce-fills-melbourne-market-as-citrus-season-peaks/', says: '30 Jun 2026: strawberries recovering, Victorian season finished, Qld underway.' },
      { name: 'ISHS abstract: Victoria strawberry production October to April (via search summary)', url: 'https://ishs.org/ishs-article/265_123/', says: 'Victoria production extends October through April.' },
      { name: 'Queen Victoria Market, seasonal produce guide (Seasonal Fruits table)', url: 'https://qvm.com.au/?p=72383', says: 'Strawberries peak season September to January.' },
    ],
    notes: 'Queensland strawberries start early',
    origin: 'France (hybrid of American species)',
    history: 'The garden strawberry we eat today was accidentally created in France around 1750 when two American species cross-pollinated. Wild strawberries had been enjoyed for millennia. The name comes from the Old English practice of placing straw around plants to protect the fruit.',
    nutrition: {
      calories: 32,
      vitaminC: 59,
      fiber: 2,
      highlights: ['Excellent source of Vitamin C', 'Good source of fiber', 'High in antioxidants']
    },
    pairings: ['cream', 'balsamic', 'chocolate', 'basil', 'black pepper'],
    recipes: [
      { name: 'Strawberry Pavlova', type: 'dessert', description: 'Top meringue with cream and fresh strawberries' },
      { name: 'Strawberry Jam', type: 'preserve', description: 'Cook strawberries with sugar and lemon for classic jam' },
      { name: 'Strawberry Smoothie', type: 'smoothie', description: 'Blend strawberries with yogurt, honey, and vanilla' }
    ]
  },
  {
    id: 'raspberry',
    name: 'Raspberry',
    emoji: '🔴',
    colour: '#D6336C',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb', 'Mar'],
      available: ['Nov', 'Apr', 'May']
    },
    yearRound: 'grown',
    variesByState: true,
    stateNote: 'Vic and Tas peak summer and autumn (Tas Nov-May); winter and spring supply comes from northern NSW and Qld.',
    pick: 'Plump, dry and deeply coloured, with no mould or crushed ones in the punnet. Check the bottom.',
    storage: 'Fridge, 1-2 days. Very short life.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Tasmanian Government raspberry profile (2014)', url: 'https://nre.tas.gov.au/Documents/Raspberry%20Profile%20updated%20March%202014.pdf', says: 'Fresh raspberries all year; peak summer and autumn; Victoria 54 per cent of production; winter and spring from northern NSW and south-west Qld (via search summary).' },
      { name: 'Tasmanian Fruit Growers: raspberries and blackberries hit shelves', url: 'https://fruitgrowerstas.org.au/news/tasmanian-raspberries-blackberries-hit-local-shelves', says: 'Tasmanian raspberry and blackberry season runs November to May (via search summary).' },
      { name: 'Sydney Markets weekly report 23-29-february-2026', url: 'https://www.sydneymarkets.com.au/recipes-and-produce/market-report/23-29-february-2026', says: 'Tasmanian raspberries among berries in the report (via search summary). (read via search summary; the site page would not load)' },
    ],
    origin: 'Europe and Northern Asia',
    history: 'Wild raspberries were gathered by cave dwellers. Cultivation began in the 1600s in Europe. The raspberry\'s botanical name "Rubus idaeus" refers to Mount Ida in Turkey. Each "berry" is actually a cluster of tiny fruits called drupelets, each with its own seed.',
    nutrition: {
      calories: 52,
      vitaminC: 26,
      fiber: 6.5,
      highlights: ['Excellent source of fiber', 'High in Vitamin C', 'Rich in antioxidants']
    },
    pairings: ['chocolate', 'lemon', 'cream', 'vanilla', 'almond'],
    recipes: [
      { name: 'Raspberry Coulis', type: 'preserve', description: 'Strain cooked raspberries for smooth dessert sauce' },
      { name: 'Raspberry Tart', type: 'dessert', description: 'Fill pastry shell with cream and top with fresh raspberries' },
      { name: 'Raspberry Chia Jam', type: 'preserve', description: 'Mix mashed raspberries with chia seeds for quick jam' }
    ]
  },
  {
    id: 'banana',
    name: 'Banana',
    emoji: '🍌',
    colour: '#FFD84D',
    seasonality: {
      peak: [],
      available: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yearRound: 'grown',
    pick: 'Firm and yellow with a green tinge at the stem for keeping; brown speckles mean sweeter and softer. Skip split or black skin.',
    storage: 'Bench, not the fridge. Peel and freeze when spotty.',
    confidence: 'high',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Australian Banana Growers Council, Our Industry', url: 'https://abgc.org.au/our-industry/', says: 'About 369,000 tonnes of fresh bananas in 2023/24, 94 per cent from Far North Qld (via search summary).' },
      { name: 'Queen Victoria Market, seasonal produce guide (Seasonal Fruits table)', url: 'https://qvm.com.au/?p=72383', says: 'Bananas: all year.' },
      { name: 'Melbourne Market report, 31 Aug 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9867999/queensland-strawberries-peak-as-australian-spring-produce-arrives/', says: '31 Aug 2026: standard bananas steady after winter; ladyfinger tighter.' },
    ],
    notes: 'Available year-round but best in warmer months',
    origin: 'Papua New Guinea and Southeast Asia',
    history: 'Bananas are one of the oldest cultivated crops, domesticated over 7,000 years ago in Papua New Guinea. The banana plant is technically an herb, not a tree. Nearly all commercial bananas are clones of the Cavendish variety. Cyclone devastated Queensland crops in 2006 and 2011.',
    nutrition: {
      calories: 89,
      vitaminC: 8.7,
      fiber: 2.6,
      highlights: ['Excellent source of potassium', 'Good source of fiber', 'Quick energy source']
    },
    pairings: ['chocolate', 'peanut butter', 'cinnamon', 'caramel', 'coconut'],
    recipes: [
      { name: 'Banana Bread', type: 'breakfast', description: 'Bake mashed bananas into moist, spiced loaf' },
      { name: 'Banana Smoothie', type: 'smoothie', description: 'Blend frozen banana with milk and peanut butter' },
      { name: 'Banana Nice Cream', type: 'dessert', description: 'Blend frozen bananas until creamy for healthy ice cream' }
    ]
  },
  {
    id: 'pineapple',
    name: 'Pineapple',
    emoji: '🍍',
    colour: '#F6C431',
    seasonality: {
      peak: ['Nov', 'Dec', 'Jan'],
      available: ['Sep', 'Oct', 'Feb', 'Mar', 'Apr']
    },
    pick: 'Sweet smell at the base, heavy for its size, golden colour creeping up from the bottom, fresh green leaves. Skip a fermented smell or soft spots.',
    storage: 'Bench 1-2 days, then fridge cut or whole, 3-5 days.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Piñata Farms, Mareeba harvest and Christmas peak (via search summary)', url: 'https://www.pinata.com.au/chatter/2024/10/28/sweet-season-ahead-for-mareeba', says: 'Mareeba harvests until March with peak production in November and December.' },
      { name: 'Melbourne Market report, 31 Mar 2025 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9718974/grapes-pineapples-and-golden-sweet-potatoes-best-of-the-bunch-at-melbourne-market/', says: '31 Mar 2025: Qld pineapples in prime condition.' },
      { name: 'Melbourne Market report, 1 Apr 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/north-america/article/9825496/autumn-shift-brings-new-produce-to-australian-market/', says: '1 Apr 2026: Carnival pineapples from Qld arriving.' },
      { name: 'Winter pineapple shortage in Mareeba (2026) via FreshPlaza', url: 'https://www.freshplaza.com/asia/article/9885940/australian-pineapple-harvest-resumes-in-mareeba-after-winter-shortage/', says: 'Winter 2026 shortage, harvest resumed in Mareeba (via search summary).' },
    ],
    notes: 'Queensland pineapples are famous',
    origin: 'South America (Paraguay, Brazil)',
    history: 'Christopher Columbus encountered pineapples in Guadeloupe in 1493. The fruit became a symbol of hospitality and wealth in Europe, where only the rich could afford them. Captain James Cook brought pineapples to Australia in 1770. Queensland now produces nearly all Australian pineapples.',
    nutrition: {
      calories: 50,
      vitaminC: 48,
      fiber: 1.4,
      highlights: ['Excellent source of Vitamin C', 'Contains bromelain enzyme', 'Aids digestion']
    },
    pairings: ['coconut', 'chili', 'ham', 'rum', 'mint'],
    recipes: [
      { name: 'Pineapple Salsa', type: 'salad', description: 'Dice pineapple with red onion, cilantro, and jalapeño' },
      { name: 'Pineapple Upside-Down Cake', type: 'dessert', description: 'Bake pineapple rings in caramel under cake batter' },
      { name: 'Grilled Pineapple', type: 'dessert', description: 'Grill pineapple slices and serve with rum caramel' }
    ]
  },
  {
    id: 'papaya',
    name: 'Papaya',
    emoji: '🧡',
    colour: '#FF8F4C',
    seasonality: {
      peak: ['Mar', 'Apr', 'May', 'Sep', 'Oct', 'Nov'],
      available: ['Jan', 'Feb', 'Jun', 'Jul', 'Aug', 'Dec']
    },
    yearRound: 'grown',
    pick: 'Skin yellowing about half way, slight give; ripen on the bench. Skip very green, bruised or leaking ones.',
    storage: 'Bench to ripen, then fridge 3-5 days.',
    confidence: 'high',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Papaya Australia, Year-round deliciousness', url: 'https://www.australianpapaya.com.au/?p=33', says: 'Available all year with increased supply in autumn and spring.' },
      { name: 'Melbourne Market report, 3 Mar 2026 (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9816014/persimmons-and-shepard-avocados-arrive-at-melbourne-market/', says: '3 Mar 2026: papaya performing well at Melbourne Market.' },
      { name: 'Australian papaya growers set for bumper crop (FreshPlaza)', url: 'https://www.freshplaza.com/oceania/article/9023713/australian-papaya-growers-set-for-bumper-crop/', says: 'Spring is the traditional peak with an autumn flush (via search summary).' },
    ],
    notes: 'Also called pawpaw in Australia',
    origin: 'Central America (Mexico)',
    history: 'Called "fruit of the angels" by Christopher Columbus. Spanish and Portuguese traders spread papaya throughout the tropics in the 1500s. The enzyme papain, extracted from papayas, is used as a meat tenderizer. In Australia, "pawpaw" typically refers to the rounder red-fleshed variety.',
    nutrition: {
      calories: 43,
      vitaminC: 61,
      fiber: 1.7,
      highlights: ['Excellent source of Vitamin C', 'High in Vitamin A', 'Contains papain enzyme']
    },
    pairings: ['lime', 'chili', 'ginger', 'mint', 'coconut'],
    recipes: [
      { name: 'Papaya Smoothie', type: 'smoothie', description: 'Blend papaya with lime, coconut water, and ginger' },
      { name: 'Green Papaya Salad', type: 'salad', description: 'Shred unripe papaya with chili, lime, and fish sauce' },
      { name: 'Papaya Salsa', type: 'salad', description: 'Dice papaya with red onion, cilantro, and lime' }
    ]
  },
  {
    id: 'rhubarb',
    name: 'Rhubarb',
    emoji: '🌿',
    colour: '#D94F6B',
    seasonality: {
      peak: ['Sep', 'Oct', 'Nov'],
      available: ['Aug', 'Dec']
    },
    pick: 'Crisp, firm stalks with glossy colour. Skip floppy or stringy ones. Never eat the leaves.',
    storage: 'Fridge wrapped in a damp cloth, up to a week.',
    confidence: 'low',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Queen Victoria Market, seasonal produce guide (Seasonal Fruits table)', url: 'https://qvm.com.au/?p=72383', says: 'Rhubarb peak season April to September.' },
      { name: 'Environment Victoria, Guide to Seasonal Food (2009, season-level lists only)', url: 'https://environmentvictoria.org.au/wp-content/uploads/2016/06/seasonal-food-calendar.pdf', says: 'Rhubarb in summer, autumn, winter and spring lists (season-level only).' },
      { name: 'SBS The Seasonal Cook: rhubarb', url: 'https://www.sbs.com.au/food/article/the-seasonal-cook-rhubarb/qndltulqp', says: 'Best eating late summer and autumn (via search summary).' },
    ],
    notes: 'Technically a vegetable, but used as fruit',
    origin: 'China and Tibet',
    history: 'Rhubarb was used medicinally in China for thousands of years before being used as food. It\'s technically a vegetable (we eat the stalks), but a 1947 US court ruled it a fruit for trade purposes. The leaves are poisonous due to high oxalic acid content.',
    nutrition: {
      calories: 21,
      vitaminC: 8,
      fiber: 1.8,
      highlights: ['Good source of fiber', 'Low in calories', 'Contains calcium']
    },
    pairings: ['strawberry', 'ginger', 'vanilla', 'orange', 'custard'],
    recipes: [
      { name: 'Rhubarb Crumble', type: 'dessert', description: 'Bake chopped rhubarb with oat crumble topping' },
      { name: 'Rhubarb Compote', type: 'preserve', description: 'Stew rhubarb with sugar and vanilla for breakfast topping' },
      { name: 'Rhubarb Cordial', type: 'smoothie', description: 'Simmer rhubarb with sugar and strain for refreshing drink' }
    ]
  },
  {
    id: 'mulberry',
    name: 'Mulberry',
    emoji: '🫐',
    colour: '#6B2D5C',
    seasonality: {
      peak: ['Dec', 'Jan'],
      available: ['Nov', 'Feb']
    },
    pick: 'Plump, deep black-purple and dry. They bruise easily, so buy only if they look fresh.',
    storage: 'Fridge, eat within 1-2 days, or freeze.',
    confidence: 'low',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Victorian pick-your-own listing (Geelong area)', url: 'https://pickyourown.org/mulberry-orchards/AUstralia-Victoria-mulberries.php', says: 'Mulberry picking December to early January (via search summary).' },
      { name: 'Rare Fruit Council of Australia archive, mulberry', url: 'https://growables.org/information/TropicalFruit/MulberryArcRFC.htm', says: 'Backyard mulberry; fruit spoils within days (via search summary).' },
    ],
    notes: 'Very short season - grow your own!',
    origin: 'China (white mulberry) and Persia (black mulberry)',
    history: 'Mulberries have been cultivated for over 4,000 years, originally to feed silkworms. The Silk Road is named for the silk trade that mulberries enabled. Black mulberries stain everything they touch, which is why commercial production is limited despite their delicious flavor.',
    nutrition: {
      calories: 43,
      vitaminC: 36,
      fiber: 1.7,
      highlights: ['High in Vitamin C', 'Rich in antioxidants', 'Contains iron']
    },
    pairings: ['lemon', 'vanilla', 'yogurt', 'almond', 'apple'],
    recipes: [
      { name: 'Mulberry Jam', type: 'preserve', description: 'Cook mulberries with sugar and lemon for rich jam' },
      { name: 'Mulberry Sorbet', type: 'dessert', description: 'Freeze blended mulberries with sugar for vibrant dessert' },
      { name: 'Mulberry Smoothie', type: 'smoothie', description: 'Blend mulberries with yogurt, banana, and honey' }
    ]
  },

  // Year-round with peak seasons
  {
    id: 'coconut',
    name: 'Coconut',
    emoji: '🥥',
    colour: '#A87A56',
    seasonality: {
      peak: [],
      available: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yearRound: 'imported',
    pick: 'Heavy with lots of liquid sloshing when shaken; eyes (the three dots) dry, not mouldy.',
    storage: 'Whole on the bench a few weeks; opened, fridge 4-5 days.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'IndexBox, Australia coconut market', url: 'https://www.indexbox.io/store/australia-coconut-market-analysis-forecast-size-trends-and-insights/', says: 'Domestic coconut production is negligible, under 1 per cent of consumption (via search summary).' },
      { name: 'Vietnamese wax coconuts enter Australian market (FreshPlaza)', url: 'https://www.freshplaza.com/latin-america/article/9369262/vietnamese-wax-coconuts-enter-australian-market/', says: 'Fresh coconuts reach Australia as imports (via search summary).' },
    ],
    notes: 'Mostly imported, available year-round',
    origin: 'Indo-Pacific region',
    history: 'Coconuts are remarkable travelers - they can float across oceans and germinate on distant shores. They\'ve been used for over 4,000 years across the Pacific. The name comes from Spanish "coco" meaning skull or goblin face (due to the three holes). Every part of the coconut palm is useful.',
    nutrition: {
      calories: 354,
      fiber: 9,
      highlights: ['High in healthy fats', 'Excellent source of fiber', 'Contains medium-chain triglycerides']
    },
    pairings: ['lime', 'curry', 'mango', 'pineapple', 'chocolate'],
    recipes: [
      { name: 'Coconut Curry', type: 'salad', description: 'Use coconut milk as base for Thai or Indian curry' },
      { name: 'Coconut Smoothie', type: 'smoothie', description: 'Blend coconut water with tropical fruits' },
      { name: 'Coconut Macaroons', type: 'dessert', description: 'Bake shredded coconut with egg whites and sugar' }
    ]
  },
  {
    id: 'dragon-fruit',
    name: 'Dragon Fruit',
    emoji: '🩷',
    colour: '#E8378E',
    seasonality: {
      peak: ['Jan', 'Feb'],
      available: ['Oct', 'Nov', 'Dec', 'Mar', 'Apr']
    },
    pick: 'Vivid skin with fresh-looking green wing tips, slight give. Skip dry, shrivelled skin.',
    storage: 'Fridge, up to a week.',
    confidence: 'medium',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Northern Territory Government: Pitaya (dragon fruit)', url: 'https://nt.gov.au/environment/home-gardens/growing-vegetables-at-home/pitaya-dragon-fruit', says: 'NT fruits September to March; Darwin season October to April (via search summary).' },
      { name: 'ABC Rural via ITFnet: NT dragon fruit season', url: 'https://www.itfnet.org/v1/2015/01/australia-dragon-fruit-season-fires-up-in-the-northern-territory/', says: 'NT harvest ramps up after Australia Day, runs to April (via search summary).' },
    ],
    notes: 'Australian-grown now available',
    origin: 'Central America',
    history: 'Also known as pitaya, dragon fruit comes from a climbing cactus. French missionaries brought it to Vietnam in the 1800s, where it became enormously popular. The dramatic name comes from its flame-like scales. The white and red-fleshed varieties come from different cactus species.',
    nutrition: {
      calories: 60,
      vitaminC: 3,
      fiber: 3,
      highlights: ['Excellent source of fiber', 'Contains antioxidants', 'Low in calories']
    },
    pairings: ['lime', 'coconut', 'mango', 'kiwi', 'mint'],
    recipes: [
      { name: 'Dragon Fruit Smoothie Bowl', type: 'smoothie', description: 'Blend dragon fruit with banana and top with granola' },
      { name: 'Dragon Fruit Salad', type: 'salad', description: 'Cube dragon fruit with other tropical fruits and lime' },
      { name: 'Dragon Fruit Sorbet', type: 'dessert', description: 'Freeze blended dragon fruit for vibrant pink dessert' }
    ]
  },
  {
    id: 'starfruit',
    name: 'Starfruit',
    emoji: '⭐',
    colour: '#F2C230',
    seasonality: {
      peak: ['Nov', 'Dec', 'Jan', 'Feb'],
      available: ['Oct', 'Mar']
    },
    pick: 'Firm, yellow with slight brown on the ridge edges (that is ripe). Skip green or soft.',
    storage: 'Bench to ripen, then fridge about a week.',
    confidence: 'low',
    checkedOn: '2026-11-02',
    sources: [
      { name: 'Rare Fruit Council of Australia archive, carambola', url: 'https://growables.org/information/TropicalFruit/CaramArcRFC5.htm', says: 'North Qld peaks Dec-Feb and Jun-Aug; southern Qld/northern NSW Feb-Mar (via search summary).' },
      { name: 'Daleys Fruit, carambola', url: 'https://daleysfruit.com.au/buy/carambola-kary-seedling-tree.htm', says: 'Harvest March to September (via search summary).' },
    ],
    notes: 'Tropical Queensland specialty',
    origin: 'Sri Lanka and Indonesia',
    history: 'Also called carambola, starfruit has been cultivated in Southeast Asia for centuries. Its distinctive five-pointed star shape when sliced makes it popular for garnishes. The entire fruit is edible, including the waxy skin. It\'s related to the wood sorrel flower family.',
    nutrition: {
      calories: 31,
      vitaminC: 34,
      fiber: 2.8,
      highlights: ['Good source of Vitamin C', 'Low in calories', 'Contains antioxidants']
    },
    pairings: ['lime', 'ginger', 'seafood', 'chili', 'mint'],
    recipes: [
      { name: 'Starfruit Salad', type: 'salad', description: 'Slice starfruit into Asian-style salad with lime dressing' },
      { name: 'Starfruit Garnish', type: 'snack', description: 'Slice thinly for beautiful star-shaped cocktail garnish' },
      { name: 'Starfruit Chutney', type: 'preserve', description: 'Cook starfruit with ginger, vinegar, and spices' }
    ]
  }
]
