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
    notes: 'Kensington Pride is the classic Australian variety'
  },
  {
    id: 'watermelon',
    name: 'Watermelon',
    emoji: '🍉',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov', 'Mar']
    }
  },
  {
    id: 'rockmelon',
    name: 'Rockmelon',
    emoji: '🍈',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov', 'Mar']
    },
    notes: 'Also called cantaloupe'
  },
  {
    id: 'honeydew',
    name: 'Honeydew',
    emoji: '🍈',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov', 'Mar']
    }
  },
  {
    id: 'lychee',
    name: 'Lychee',
    emoji: '🔴',
    seasonality: {
      peak: ['Dec', 'Jan'],
      available: ['Nov', 'Feb']
    },
    notes: 'Short season - enjoy while fresh'
  },
  {
    id: 'passionfruit',
    name: 'Passionfruit',
    emoji: '💜',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb', 'Mar'],
      available: ['Nov', 'Apr']
    },
    notes: 'Look for wrinkled skin - means it\'s ripe'
  },
  {
    id: 'cherry',
    name: 'Cherry',
    emoji: '🍒',
    seasonality: {
      peak: ['Dec'],
      available: ['Nov', 'Jan']
    },
    notes: 'Very short season - Tasmanian cherries are premium'
  },
  {
    id: 'blueberry',
    name: 'Blueberry',
    emoji: '🫐',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov', 'Mar']
    }
  },
  {
    id: 'nectarine',
    name: 'Nectarine',
    emoji: '🍑',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov']
    },
    notes: 'Stone fruit season!'
  },
  {
    id: 'peach',
    name: 'Peach',
    emoji: '🍑',
    seasonality: {
      peak: ['Dec', 'Jan', 'Feb'],
      available: ['Nov']
    },
    notes: 'White and yellow varieties available'
  },
  {
    id: 'apricot',
    name: 'Apricot',
    emoji: '🍑',
    seasonality: {
      peak: ['Dec', 'Jan'],
      available: ['Nov', 'Feb']
    }
  },
  {
    id: 'plum',
    name: 'Plum',
    emoji: '🟣',
    seasonality: {
      peak: ['Jan', 'Feb'],
      available: ['Dec', 'Mar']
    },
    notes: 'Many varieties - from sweet to tart'
  },
  {
    id: 'fig',
    name: 'Fig',
    emoji: '🟤',
    seasonality: {
      peak: ['Feb', 'Mar'],
      available: ['Jan', 'Apr']
    },
    notes: 'Second crop in autumn is often sweeter'
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
    notes: 'Pink Lady, Granny Smith, Fuji - all Australian varieties'
  },
  {
    id: 'pear',
    name: 'Pear',
    emoji: '🍐',
    seasonality: {
      peak: ['Mar', 'Apr', 'May'],
      available: ['Feb', 'Jun']
    },
    notes: 'Packham, Beurre Bosc, Williams'
  },
  {
    id: 'grape',
    name: 'Grape',
    emoji: '🍇',
    seasonality: {
      peak: ['Mar', 'Apr', 'May'],
      available: ['Feb']
    },
    notes: 'Table grapes at their best'
  },
  {
    id: 'persimmon',
    name: 'Persimmon',
    emoji: '🍊',
    seasonality: {
      peak: ['Apr', 'May'],
      available: ['Mar', 'Jun']
    },
    notes: 'Sweet when fully ripe'
  },
  {
    id: 'quince',
    name: 'Quince',
    emoji: '🍐',
    seasonality: {
      peak: ['Apr', 'May'],
      available: ['Mar']
    },
    notes: 'Must be cooked - makes beautiful paste'
  },
  {
    id: 'pomegranate',
    name: 'Pomegranate',
    emoji: '❤️',
    seasonality: {
      peak: ['Mar', 'Apr', 'May'],
      available: ['Feb']
    }
  },
  {
    id: 'feijoa',
    name: 'Feijoa',
    emoji: '🥝',
    seasonality: {
      peak: ['Apr', 'May'],
      available: ['Mar', 'Jun']
    },
    notes: 'Aromatic, tropical-like flavor'
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
    notes: 'Navel in winter, Valencia in summer'
  },
  {
    id: 'mandarin',
    name: 'Mandarin',
    emoji: '🍊',
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['May', 'Sep']
    },
    notes: 'Imperial, Murcott, Afourer varieties'
  },
  {
    id: 'grapefruit',
    name: 'Grapefruit',
    emoji: '🍊',
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['May', 'Sep']
    },
    notes: 'Ruby and white varieties'
  },
  {
    id: 'lemon',
    name: 'Lemon',
    emoji: '🍋',
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['May', 'Sep', 'Oct']
    },
    notes: 'Eureka and Meyer varieties'
  },
  {
    id: 'lime',
    name: 'Lime',
    emoji: '🍋',
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['May', 'Sep']
    },
    notes: 'Tahitian limes most common'
  },
  {
    id: 'kiwifruit',
    name: 'Kiwifruit',
    emoji: '🥝',
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['May', 'Sep']
    },
    notes: 'Green and gold varieties'
  },
  {
    id: 'avocado',
    name: 'Avocado',
    emoji: '🥑',
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug', 'Sep'],
      available: ['May', 'Oct']
    },
    notes: 'Hass variety most popular'
  },
  {
    id: 'custard-apple',
    name: 'Custard Apple',
    emoji: '💚',
    seasonality: {
      peak: ['Jun', 'Jul', 'Aug'],
      available: ['May']
    },
    notes: 'Creamy, sweet tropical flavor'
  },
  {
    id: 'tangelo',
    name: 'Tangelo',
    emoji: '🍊',
    seasonality: {
      peak: ['Jul', 'Aug'],
      available: ['Jun', 'Sep']
    },
    notes: 'Cross between tangerine and pomelo'
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
    notes: 'Queensland strawberries start early'
  },
  {
    id: 'raspberry',
    name: 'Raspberry',
    emoji: '🔴',
    seasonality: {
      peak: ['Oct', 'Nov', 'Dec'],
      available: ['Sep', 'Jan']
    }
  },
  {
    id: 'banana',
    name: 'Banana',
    emoji: '🍌',
    seasonality: {
      peak: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      available: ['Apr', 'May', 'Jun', 'Jul', 'Aug']
    },
    notes: 'Available year-round but best in warmer months'
  },
  {
    id: 'pineapple',
    name: 'Pineapple',
    emoji: '🍍',
    seasonality: {
      peak: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
      available: ['Sep', 'Mar']
    },
    notes: 'Queensland pineapples are famous'
  },
  {
    id: 'papaya',
    name: 'Papaya',
    emoji: '🧡',
    seasonality: {
      peak: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
      available: ['Aug', 'Mar']
    },
    notes: 'Also called pawpaw in Australia'
  },
  {
    id: 'rhubarb',
    name: 'Rhubarb',
    emoji: '🌿',
    seasonality: {
      peak: ['Sep', 'Oct', 'Nov'],
      available: ['Aug', 'Dec']
    },
    notes: 'Technically a vegetable, but used as fruit'
  },
  {
    id: 'mulberry',
    name: 'Mulberry',
    emoji: '🫐',
    seasonality: {
      peak: ['Oct', 'Nov'],
      available: ['Sep', 'Dec']
    },
    notes: 'Very short season - grow your own!'
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
    notes: 'Mostly imported, available year-round'
  },
  {
    id: 'dragon-fruit',
    name: 'Dragon Fruit',
    emoji: '🩷',
    seasonality: {
      peak: ['Jan', 'Feb', 'Nov', 'Dec'],
      available: ['Oct', 'Mar']
    },
    notes: 'Australian-grown now available'
  },
  {
    id: 'starfruit',
    name: 'Starfruit',
    emoji: '⭐',
    seasonality: {
      peak: ['Nov', 'Dec', 'Jan', 'Feb'],
      available: ['Oct', 'Mar']
    },
    notes: 'Tropical Queensland specialty'
  }
]
