import type { Fruit } from '../types/fruit'

// Australian fruit seasonality data (Southern Hemisphere)
export const FRUITS: Fruit[] = [
  // Summer fruits (Dec-Feb)
  {
    id: 'mango',
    name: 'Mango',
    emoji: '🥭',
    image: '/images/fruits/mango.jpg',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov', 'Mar']
    },
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
    image: '/images/fruits/watermelon.jpg',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov', 'Mar']
    },
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
    image: '/images/fruits/rockmelon.jpg',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov', 'Mar']
    },
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
    image: '/images/fruits/honeydew.jpg',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov', 'Mar']
    },
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
    image: '/images/fruits/lychee.jpg',
    seasonality: {
      peak: ['Dec', 'Jan'],
      available: ['Nov', 'Feb']
    },
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
    image: '/images/fruits/passionfruit.jpg',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb', 'Mar'],
      available: ['Nov', 'Apr']
    },
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
    image: '/images/fruits/cherry.jpg',
    seasonality: {
      peak: ['Dec'],
      available: ['Nov', 'Jan']
    },
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
    image: '/images/fruits/blueberry.jpg',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov', 'Mar']
    },
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
    image: '/images/fruits/nectarine.jpg',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov']
    },
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
    image: '/images/fruits/peach.jpg',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov']
    },
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
    image: '/images/fruits/apricot.jpg',
    seasonality: {
      peak: ['Dec', 'Jan'],
      available: ['Nov', 'Feb']
    },
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
    image: '/images/fruits/plum.jpg',
    seasonality: {
      peak: ['Jan', 'Feb'],
      available: ['Dec', 'Mar']
    },
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
    image: '/images/fruits/fig.jpg',
    seasonality: {
      peak: ['Feb', 'Mar'],
      available: ['Jan', 'Apr']
    },
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
    image: '/images/fruits/apple.jpg',
    seasonality: {
      peak: ['Mar', 'Apr', 'May'],
      available: ['Feb', 'Jun']
    },
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
    image: '/images/fruits/pear.jpg',
    seasonality: {
      peak: ['Mar', 'Apr', 'May'],
      available: ['Feb', 'Jun']
    },
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
    image: '/images/fruits/grape.jpg',
    seasonality: {
      peak: ['Mar', 'Apr', 'May'],
      available: ['Feb']
    },
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
    image: '/images/fruits/persimmon.jpg',
    seasonality: {
      peak: ['Apr', 'May'],
      available: ['Mar', 'Jun']
    },
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
    image: '/images/fruits/quince.jpg',
    seasonality: {
      peak: ['Apr', 'May'],
      available: ['Mar']
    },
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
    image: '/images/fruits/pomegranate.jpg',
    seasonality: {
      peak: ['Mar', 'Apr', 'May'],
      available: ['Feb']
    },
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
    image: '/images/fruits/feijoa.jpg',
    seasonality: {
      peak: ['Apr', 'May'],
      available: ['Mar', 'Jun']
    },
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
    image: '/images/fruits/orange.jpg',
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['May', 'Sep']
    },
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
    image: '/images/fruits/mandarin.jpg',
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['May', 'Sep']
    },
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
    image: '/images/fruits/grapefruit.jpg',
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['May', 'Sep']
    },
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
    image: '/images/fruits/lemon.jpg',
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['May', 'Sep', 'Oct']
    },
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
    image: '/images/fruits/lime.jpg',
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['May', 'Sep']
    },
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
    image: '/images/fruits/kiwifruit.jpg',
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['May', 'Sep']
    },
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
    image: '/images/fruits/avocado.jpg',
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug', 'Sep'],
      available: ['May', 'Oct']
    },
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
    image: '/images/fruits/custard-apple.jpg',
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['May']
    },
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
    image: '/images/fruits/tangelo.jpg',
    seasonality: {
      peak: ['Jul', 'Aug'],
      available: ['Jun', 'Sep']
    },
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
    image: '/images/fruits/strawberry.jpg',
    seasonality: {
      peak: ['Sep', 'Oct', 'Nov'],
      available: ['Aug', 'Dec']
    },
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
    image: '/images/fruits/raspberry.jpg',
    seasonality: {
      peak: ['Oct', 'Nov', 'Dec'],
      available: ['Sep', 'Jan']
    },
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
    image: '/images/fruits/banana.jpg',
    seasonality: {
      peak: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      available: ['Apr', 'May', 'Jun', 'Jul', 'Aug']
    },
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
    image: '/images/fruits/pineapple.jpg',
    seasonality: {
      peak: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
      available: ['Sep', 'Mar']
    },
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
    image: '/images/fruits/papaya.jpg',
    seasonality: {
      peak: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
      available: ['Aug', 'Mar']
    },
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
    image: '/images/fruits/rhubarb.jpg',
    seasonality: {
      peak: ['Sep', 'Oct', 'Nov'],
      available: ['Aug', 'Dec']
    },
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
    image: '/images/fruits/mulberry.jpg',
    seasonality: {
      peak: ['Oct', 'Nov'],
      available: ['Sep', 'Dec']
    },
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
    image: '/images/fruits/coconut.jpg',
    seasonality: {
      peak: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      available: []
    },
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
    image: '/images/fruits/dragon-fruit.jpg',
    seasonality: {
      peak: ['Jan', 'Feb', 'Nov', 'Dec'],
      available: ['Oct', 'Mar']
    },
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
    image: '/images/fruits/starfruit.jpg',
    seasonality: {
      peak: ['Nov', 'Dec', 'Jan', 'Feb'],
      available: ['Oct', 'Mar']
    },
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
