import type { Fruit } from '../types/fruit'

// Australian fruit seasonality data (Southern Hemisphere)
export const FRUITS: Fruit[] = [
  // Summer fruits (Dec-Feb)
  {
    id: 'mango',
    name: 'Mango',
    emoji: '🥭',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov', 'Mar']
    },
    notes: 'Kensington Pride is the classic Australian variety',
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
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov', 'Mar']
    },
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
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov', 'Mar']
    },
    notes: 'Also called cantaloupe',
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
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov', 'Mar']
    },
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
    seasonality: {
      peak: ['Dec', 'Jan'],
      available: ['Nov', 'Feb']
    },
    notes: 'Short season - enjoy while fresh',
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
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb', 'Mar'],
      available: ['Nov', 'Apr']
    },
    notes: 'Look for wrinkled skin - means it\'s ripe',
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
    seasonality: {
      peak: ['Dec'],
      available: ['Nov', 'Jan']
    },
    notes: 'Very short season - Tasmanian cherries are premium',
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
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov', 'Mar']
    },
    nutrition: {
      calories: 57,
      vitaminC: 10,
      fiber: 2.4,
      highlights: ['Very high in antioxidants', 'Good source of fiber', 'Supports brain health']
    },
    pairings: ['lemon', 'almond', 'yogurt', 'cream', 'maple syrup'],
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
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov']
    },
    notes: 'Stone fruit season!',
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
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov']
    },
    notes: 'White and yellow varieties available',
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
    seasonality: {
      peak: ['Dec', 'Jan'],
      available: ['Nov', 'Feb']
    },
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
    seasonality: {
      peak: ['Jan', 'Feb'],
      available: ['Dec', 'Mar']
    },
    notes: 'Many varieties - from sweet to tart',
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
    seasonality: {
      peak: ['Feb', 'Mar'],
      available: ['Jan', 'Apr']
    },
    notes: 'Second crop in autumn is often sweeter',
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
    seasonality: {
      peak: ['Mar', 'Apr', 'May'],
      available: ['Feb', 'Jun']
    },
    notes: 'Pink Lady, Granny Smith, Fuji - all Australian varieties',
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
    seasonality: {
      peak: ['Mar', 'Apr', 'May'],
      available: ['Feb', 'Jun']
    },
    notes: 'Packham, Beurre Bosc, Williams',
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
    seasonality: {
      peak: ['Mar', 'Apr', 'May'],
      available: ['Feb']
    },
    notes: 'Table grapes at their best',
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
    seasonality: {
      peak: ['Apr', 'May'],
      available: ['Mar', 'Jun']
    },
    notes: 'Sweet when fully ripe',
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
    seasonality: {
      peak: ['Apr', 'May'],
      available: ['Mar']
    },
    notes: 'Must be cooked - makes beautiful paste',
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
    seasonality: {
      peak: ['Mar', 'Apr', 'May'],
      available: ['Feb']
    },
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
    seasonality: {
      peak: ['Apr', 'May'],
      available: ['Mar', 'Jun']
    },
    notes: 'Aromatic, tropical-like flavor',
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
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['May', 'Sep']
    },
    notes: 'Navel in winter, Valencia in summer',
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
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['May', 'Sep']
    },
    notes: 'Imperial, Murcott, Afourer varieties',
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
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['May', 'Sep']
    },
    notes: 'Ruby and white varieties',
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
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['May', 'Sep', 'Oct']
    },
    notes: 'Eureka and Meyer varieties',
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
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['May', 'Sep']
    },
    notes: 'Tahitian limes most common',
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
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['May', 'Sep']
    },
    notes: 'Green and gold varieties',
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
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug', 'Sep'],
      available: ['May', 'Oct']
    },
    notes: 'Hass variety most popular',
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
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['May']
    },
    notes: 'Creamy, sweet tropical flavor',
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
    seasonality: {
      peak: ['Jul', 'Aug'],
      available: ['Jun', 'Sep']
    },
    notes: 'Cross between tangerine and pomelo',
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
    seasonality: {
      peak: ['Sep', 'Oct', 'Nov'],
      available: ['Aug', 'Dec']
    },
    notes: 'Queensland strawberries start early',
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
    seasonality: {
      peak: ['Oct', 'Nov', 'Dec'],
      available: ['Sep', 'Jan']
    },
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
    seasonality: {
      peak: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      available: ['Apr', 'May', 'Jun', 'Jul', 'Aug']
    },
    notes: 'Available year-round but best in warmer months',
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
    seasonality: {
      peak: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
      available: ['Sep', 'Mar']
    },
    notes: 'Queensland pineapples are famous',
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
    seasonality: {
      peak: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
      available: ['Aug', 'Mar']
    },
    notes: 'Also called pawpaw in Australia',
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
    seasonality: {
      peak: ['Sep', 'Oct', 'Nov'],
      available: ['Aug', 'Dec']
    },
    notes: 'Technically a vegetable, but used as fruit',
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
    seasonality: {
      peak: ['Oct', 'Nov'],
      available: ['Sep', 'Dec']
    },
    notes: 'Very short season - grow your own!',
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
    seasonality: {
      peak: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      available: []
    },
    notes: 'Mostly imported, available year-round',
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
    seasonality: {
      peak: ['Jan', 'Feb', 'Nov', 'Dec'],
      available: ['Oct', 'Mar']
    },
    notes: 'Australian-grown now available',
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
    seasonality: {
      peak: ['Nov', 'Dec', 'Jan', 'Feb'],
      available: ['Oct', 'Mar']
    },
    notes: 'Tropical Queensland specialty',
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
