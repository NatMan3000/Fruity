import type { Recipe } from '../types/recipe'

// Fruity's own recipes (Phase 3 "Cook"). Ai-drafted from scratch on 2 Nov 2026 (no copied method text),
// edited for food safety (research/2026-11-02-recipes-draft.md "Check before marking reviewed"); each
// stays `reviewed: false` until a person has cooked or read it. `fruitIds[0]` is the main fruit: it
// colours the card and decides which months the recipe counts for. Australian English, metric, oven
// temperatures with their fan-forced figure. scripts/validate-data.ts fails the build on bad recipes.
// Saved, made and ticked state is the user's and lives in localStorage (src/hooks/useRecipeBox.ts).
export const RECIPES: Recipe[] = [
  {
    "id": "pork-cutlets-grilled-peaches-sage-butter",
    "name": "Pork cutlets with charred peaches and sage brown butter",
    "blurb": "Juicy cutlets, peaches caramelised on the grill and a nutty sage butter that ties it all together in 30 minutes.",
    "fruitIds": [
      "peach"
    ],
    "type": "main",
    "serves": 4,
    "minutes": {
      "prep": 10,
      "cook": 20
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "pork cutlets, about 2cm thick",
        "qty": "4 (about 250g each)"
      },
      {
        "item": "yellow peaches, halved and stoned",
        "qty": "3",
        "fruitId": "peach"
      },
      {
        "item": "olive oil",
        "qty": "1 tbsp"
      },
      {
        "item": "butter",
        "qty": "60g"
      },
      {
        "item": "sage leaves",
        "qty": "12"
      },
      {
        "item": "apple cider vinegar",
        "qty": "1 tbsp"
      },
      {
        "item": "honey",
        "qty": "1 tsp"
      },
      {
        "item": "rocket",
        "qty": "60g"
      },
      {
        "item": "salt flakes and black pepper",
        "qty": "to taste"
      }
    ],
    "steps": [
      "Take the pork out of the fridge 20 minutes before cooking. Pat dry, snip through the fat every 2cm so the cutlets stay flat, and season well.",
      "Heat a chargrill pan or large frying pan over medium-high heat. Brush the peach halves with half the oil and cook cut-side down for 3 to 4 minutes until charred and just softening. Set aside.",
      "Rub the pork with the remaining oil and cook for 4 to 5 minutes each side until cooked through (70°C in the thickest part on a meat thermometer). Stand them on their fat edge for the last minute to crisp it.",
      "Rest the pork on a warm plate for 5 minutes, loosely covered with foil.",
      "Wipe out the pan, add the butter over medium heat and cook until it foams and smells nutty. Add the sage for 30 seconds until crisp.",
      "Take the pan off the heat and stir in the vinegar and honey. Serve the cutlets with the peaches and rocket, with the sage butter spooned over."
    ],
    "tip": "Freestone peaches come away from the stone cleanly; clingstones are easier to cut into thick cheeks either side of the stone.",
    "swaps": [
      "Nectarines or plums (summer)",
      "Apple or pear wedges (autumn), charred 2 minutes longer"
    ],
    "tags": [
      "gluten-free"
    ],
    "reviewed": false
  },
  {
    "id": "prawn-mango-herb-noodle-salad",
    "name": "Prawn, mango and herb noodle salad",
    "blurb": "A tangle of rice noodles, sweet mango and fat prawns in a sour-salty lime dressing, made for hot nights.",
    "fruitIds": [
      "mango",
      "lime"
    ],
    "type": "main",
    "serves": 4,
    "minutes": {
      "prep": 25,
      "cook": 5
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "rice vermicelli noodles",
        "qty": "200g"
      },
      {
        "item": "cooked prawns, peeled and deveined",
        "qty": "500g (about 1kg whole)"
      },
      {
        "item": "mangoes, firm-ripe",
        "qty": "2",
        "fruitId": "mango"
      },
      {
        "item": "Lebanese cucumber, cut into matchsticks",
        "qty": "1"
      },
      {
        "item": "mint leaves",
        "qty": "1 cup"
      },
      {
        "item": "coriander leaves",
        "qty": "1 cup"
      },
      {
        "item": "green onions, thinly sliced",
        "qty": "2"
      },
      {
        "item": "long red chilli, thinly sliced",
        "qty": "1"
      },
      {
        "item": "roasted unsalted peanuts, chopped",
        "qty": "1/3 cup"
      },
      {
        "item": "lime juice (about 2 limes)",
        "qty": "60ml",
        "fruitId": "lime"
      },
      {
        "item": "fish sauce",
        "qty": "2 tbsp"
      },
      {
        "item": "brown or grated palm sugar",
        "qty": "1 1/2 tbsp"
      },
      {
        "item": "water",
        "qty": "2 tbsp"
      },
      {
        "item": "garlic clove, finely grated",
        "qty": "1"
      }
    ],
    "steps": [
      "Make the dressing: stir the lime juice, fish sauce, sugar and water until the sugar dissolves, then add the garlic. Taste it: it should be sour, salty and sweet in about equal measure.",
      "Cover the noodles with boiling water and stand for 3 to 5 minutes (or follow the packet) until tender. Drain, rinse under cold water and drain very well. Snip into shorter lengths with scissors.",
      "Cut the cheeks off the mangoes, peel them and slice into thin strips.",
      "Toss the noodles with the cucumber, half the herbs and a third of the dressing.",
      "Pile onto a platter and top with the prawns, mango, remaining herbs, green onion and chilli.",
      "Spoon over the rest of the dressing, scatter with peanuts and serve straight away."
    ],
    "tip": "Raw prawns work too: peel them and poach in simmering salted water for 2 to 3 minutes until just pink, then cool.",
    "swaps": [
      "Papaya or pineapple (spring)",
      "Nectarine (summer)",
      "Ruby grapefruit segments (winter)"
    ],
    "tags": [
      "gluten-free",
      "dairy-free"
    ],
    "reviewed": false
  },
  {
    "id": "watermelon-feta-mint-salad",
    "name": "Watermelon, feta and mint salad with quick-pickled onion",
    "blurb": "Cold, crunchy, salty and sweet: the salad that makes a barbecue.",
    "fruitIds": [
      "watermelon",
      "lime"
    ],
    "type": "salad",
    "serves": 4,
    "minutes": {
      "prep": 20,
      "cook": 0
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "small red onion, very thinly sliced",
        "qty": "1"
      },
      {
        "item": "red wine vinegar",
        "qty": "2 tbsp"
      },
      {
        "item": "caster sugar",
        "qty": "1/2 tsp"
      },
      {
        "item": "watermelon flesh, in 3cm chunks (about 1/4 of a medium melon)",
        "qty": "1kg",
        "fruitId": "watermelon"
      },
      {
        "item": "Lebanese cucumber",
        "qty": "1"
      },
      {
        "item": "feta",
        "qty": "150g"
      },
      {
        "item": "mint leaves",
        "qty": "1/2 cup"
      },
      {
        "item": "extra virgin olive oil",
        "qty": "2 tbsp"
      },
      {
        "item": "lime, juiced",
        "qty": "1",
        "fruitId": "lime"
      },
      {
        "item": "pepitas, toasted (optional)",
        "qty": "1/4 cup"
      },
      {
        "item": "salt and black pepper",
        "qty": "to taste"
      }
    ],
    "steps": [
      "Toss the onion with the vinegar, sugar and a pinch of salt. Leave for 10 minutes to turn pink and soften.",
      "Cut the watermelon into chunks, flicking out any black seeds, and chill while you prep the rest.",
      "Halve the cucumber lengthways and slice it on an angle.",
      "Arrange the watermelon and cucumber on a platter. Lift the onion out of its vinegar and scatter it over, then crumble on the feta.",
      "Whisk the oil and lime juice with a teaspoon of the pickling vinegar and drizzle over. Finish with mint, pepper and pepitas and serve straight away."
    ],
    "tip": "Dress it at the table: watermelon weeps once it meets salt.",
    "swaps": [
      "Rockmelon or honeydew (summer)",
      "Nectarine or peach wedges (summer)"
    ],
    "tags": [
      "no-cook",
      "vegetarian",
      "gluten-free"
    ],
    "reviewed": false
  },
  {
    "id": "cherry-clafoutis",
    "name": "Cherry clafoutis",
    "blurb": "A French farmhouse pudding: ripe cherries baked in a soft vanilla custard batter, on the table in under an hour.",
    "fruitIds": [
      "cherry"
    ],
    "type": "dessert",
    "serves": 6,
    "minutes": {
      "prep": 15,
      "cook": 40
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "butter, softened, for the dish",
        "qty": "20g"
      },
      {
        "item": "caster sugar",
        "qty": "80g plus 1 tbsp for the dish"
      },
      {
        "item": "cherries, stems off",
        "qty": "500g",
        "fruitId": "cherry"
      },
      {
        "item": "eggs",
        "qty": "3"
      },
      {
        "item": "plain flour",
        "qty": "60g"
      },
      {
        "item": "salt",
        "qty": "pinch"
      },
      {
        "item": "milk",
        "qty": "250ml"
      },
      {
        "item": "thickened cream",
        "qty": "125ml"
      },
      {
        "item": "vanilla extract",
        "qty": "1 tsp"
      },
      {
        "item": "kirsch or amaretto (optional)",
        "qty": "1 tbsp"
      },
      {
        "item": "icing sugar, to dust",
        "qty": "1 tbsp"
      }
    ],
    "steps": [
      "Preheat the oven to 180°C (160°C fan-forced). Butter a 24cm round baking dish (about 1.5 litres) and sprinkle with 1 tbsp sugar.",
      "Pit the cherries, or leave them whole the traditional way (warn everyone about the stones). Spread them over the dish.",
      "Whisk the eggs and 80g sugar until pale, then whisk in the flour and salt until smooth.",
      "Gradually whisk in the milk, cream, vanilla and liqueur. The batter should be thin, like crepe batter.",
      "Pour the batter over the cherries and bake for 40 to 45 minutes until puffed, golden and just set in the middle.",
      "Cool for 15 minutes (it sinks as it cools, which is normal), dust with icing sugar and serve warm with cream."
    ],
    "tip": "Whole cherries keep their juice in and give a faint almond flavour from the stones; pitted ones are kinder to guests.",
    "swaps": [
      "Plums, quartered (late summer)",
      "Apricots, halved (early summer)",
      "Frozen mixed berries, straight from the freezer (any time)"
    ],
    "tags": [
      "vegetarian"
    ],
    "reviewed": false
  },
  {
    "id": "apricot-almond-galette",
    "name": "Apricot and almond galette",
    "blurb": "A rustic free-form tart with buttery pastry, a hidden almond layer and apricots that go jammy in the oven.",
    "fruitIds": [
      "apricot"
    ],
    "type": "dessert",
    "serves": 8,
    "minutes": {
      "prep": 30,
      "cook": 45
    },
    "difficulty": "medium",
    "ingredients": [
      {
        "item": "plain flour",
        "qty": "250g (1 2/3 cups), plus extra for rolling"
      },
      {
        "item": "caster sugar",
        "qty": "2 tbsp for the pastry, plus 4 tbsp"
      },
      {
        "item": "salt",
        "qty": "1/4 tsp"
      },
      {
        "item": "cold butter, cubed",
        "qty": "180g"
      },
      {
        "item": "iced water",
        "qty": "4 to 5 tbsp"
      },
      {
        "item": "almond meal",
        "qty": "50g"
      },
      {
        "item": "apricots, halved and stoned (quartered if large)",
        "qty": "700g (about 12)",
        "fruitId": "apricot"
      },
      {
        "item": "vanilla extract",
        "qty": "1 tsp"
      },
      {
        "item": "egg, beaten",
        "qty": "1"
      },
      {
        "item": "raw or demerara sugar",
        "qty": "1 tbsp"
      },
      {
        "item": "flaked almonds",
        "qty": "2 tbsp"
      },
      {
        "item": "apricot jam, warmed (optional, to glaze)",
        "qty": "2 tbsp"
      }
    ],
    "steps": [
      "Make the pastry: pulse the flour, 2 tbsp caster sugar and salt in a food processor, add the butter and pulse until it looks like coarse crumbs with some pea-sized lumps. Add iced water a tablespoon at a time, pulsing, until it just clumps. Press into a disc, wrap and chill for 30 minutes.",
      "Preheat the oven to 200°C (180°C fan-forced). Roll the pastry on floured baking paper into a 35cm round about 3mm thick, then slide it, on its paper, onto a baking tray.",
      "Mix the almond meal with 2 tbsp caster sugar and spread it over the pastry, leaving a 5cm border.",
      "Toss the apricots with the remaining 2 tbsp caster sugar and the vanilla, then arrange cut-side up, slightly overlapping, on the almond layer.",
      "Fold the border up over the fruit, pleating as you go. Brush the pastry with egg and scatter with raw sugar and flaked almonds.",
      "Bake for 40 to 45 minutes until the pastry is deep golden underneath and the fruit is bubbling. Brush the fruit with warm jam and cool for 15 minutes before slicing."
    ],
    "tip": "Slightly under-ripe apricots are fine here: the oven concentrates them. The almond layer soaks up juice so the base stays crisp.",
    "swaps": [
      "Plums, peaches or nectarines (summer)",
      "Thinly sliced apples or pears (autumn)"
    ],
    "tags": [
      "vegetarian",
      "make-ahead"
    ],
    "reviewed": false
  },
  {
    "id": "blueberry-buttermilk-pancakes",
    "name": "Blueberry buttermilk pancakes",
    "blurb": "Tall, fluffy weekend pancakes with blueberries that burst into little pockets of jam.",
    "fruitIds": [
      "blueberry",
      "lemon"
    ],
    "type": "breakfast",
    "serves": 4,
    "minutes": {
      "prep": 10,
      "cook": 20
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "plain flour",
        "qty": "300g (2 cups)"
      },
      {
        "item": "baking powder",
        "qty": "2 tsp"
      },
      {
        "item": "bicarbonate of soda",
        "qty": "1/2 tsp"
      },
      {
        "item": "caster sugar",
        "qty": "2 tbsp"
      },
      {
        "item": "salt",
        "qty": "1/2 tsp"
      },
      {
        "item": "lemon, finely grated zest",
        "qty": "1",
        "fruitId": "lemon"
      },
      {
        "item": "eggs",
        "qty": "2"
      },
      {
        "item": "buttermilk",
        "qty": "500ml"
      },
      {
        "item": "butter, melted, plus extra for the pan",
        "qty": "50g"
      },
      {
        "item": "vanilla extract",
        "qty": "1 tsp"
      },
      {
        "item": "blueberries",
        "qty": "150g (1 cup), plus extra to serve",
        "fruitId": "blueberry"
      },
      {
        "item": "maple syrup and Greek yoghurt",
        "qty": "to serve"
      }
    ],
    "steps": [
      "Whisk the flour, baking powder, bicarb, sugar, salt and lemon zest in a large bowl.",
      "In a jug, whisk the eggs, buttermilk, melted butter and vanilla.",
      "Pour the wet mix into the dry and fold until just combined. Lumps are fine; overmixing makes them tough. Rest for 5 minutes.",
      "Heat a non-stick frying pan over medium-low heat and brush with butter. Pour in 1/3 cup batter per pancake and drop 8 to 10 blueberries onto each.",
      "Cook for about 2 minutes until bubbles pop on the surface and the edges look dry, then flip and cook 1 to 2 minutes more. Keep warm in a 100°C oven (80°C fan-forced) while you cook the rest.",
      "Stack and serve with maple syrup, yoghurt and extra berries."
    ],
    "tip": "No buttermilk? Stir 2 tbsp lemon juice into 500ml milk and stand for 5 minutes. Dropping the berries on top (rather than mixing them in) keeps the batter from turning grey.",
    "swaps": [
      "Raspberries (summer)",
      "Chopped strawberries (spring)",
      "Sliced banana (any time)"
    ],
    "tags": [
      "kid-friendly",
      "vegetarian"
    ],
    "reviewed": false
  },
  {
    "id": "nectarine-burrata-prosciutto-salad",
    "name": "Nectarine, burrata and prosciutto salad",
    "blurb": "Five minutes of assembly for a platter that looks like a restaurant starter.",
    "fruitIds": [
      "nectarine"
    ],
    "type": "salad",
    "serves": 4,
    "minutes": {
      "prep": 15,
      "cook": 0
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "ripe nectarines, cut into wedges",
        "qty": "4",
        "fruitId": "nectarine"
      },
      {
        "item": "burrata",
        "qty": "2 balls (about 250g total)"
      },
      {
        "item": "prosciutto",
        "qty": "8 slices (about 100g)"
      },
      {
        "item": "rocket",
        "qty": "60g"
      },
      {
        "item": "basil leaves",
        "qty": "1 cup"
      },
      {
        "item": "extra virgin olive oil",
        "qty": "2 tbsp"
      },
      {
        "item": "white balsamic vinegar",
        "qty": "1 tbsp"
      },
      {
        "item": "honey",
        "qty": "1 tsp"
      },
      {
        "item": "flaked almonds, toasted",
        "qty": "1/4 cup"
      },
      {
        "item": "salt flakes and black pepper",
        "qty": "to taste"
      }
    ],
    "steps": [
      "Whisk the oil, vinegar, honey and a pinch of salt.",
      "Toss the nectarine wedges with half the dressing.",
      "Scatter the rocket over a platter, arrange the nectarines on top and drape the prosciutto loosely in between.",
      "Tear the burrata open over the middle just before serving.",
      "Spoon over the remaining dressing and finish with basil, almonds and plenty of black pepper."
    ],
    "tip": "Take the burrata out of the fridge 20 minutes ahead: cold burrata tastes of very little.",
    "swaps": [
      "Peaches or figs (summer)",
      "Persimmon or pear (autumn)"
    ],
    "tags": [
      "no-cook",
      "gluten-free"
    ],
    "reviewed": false
  },
  {
    "id": "lychee-lime-mint-spritz",
    "name": "Lychee, lime and mint spritz",
    "blurb": "A fragrant, fizzy cooler: soda for the kids, prosecco for the grown-ups.",
    "fruitIds": [
      "lychee",
      "lime"
    ],
    "type": "drink",
    "serves": 4,
    "minutes": {
      "prep": 15,
      "cook": 0
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "fresh lychees",
        "qty": "400g (about 20)",
        "fruitId": "lychee"
      },
      {
        "item": "lime juice (about 2 limes)",
        "qty": "60ml",
        "fruitId": "lime"
      },
      {
        "item": "caster sugar",
        "qty": "1 to 2 tbsp, to taste"
      },
      {
        "item": "mint leaves",
        "qty": "1/2 cup"
      },
      {
        "item": "ice",
        "qty": "to fill 4 glasses"
      },
      {
        "item": "chilled soda water, or prosecco for adults",
        "qty": "750ml"
      },
      {
        "item": "lime slices",
        "qty": "to serve"
      }
    ],
    "steps": [
      "Peel the lychees and squeeze out the stones. Set 8 aside for the glasses.",
      "Blend the remaining lychees with the lime juice and 1 tbsp sugar until smooth. Strain through a fine sieve, pressing hard, then taste and add more sugar if needed. You should have about 1 cup.",
      "Bruise a few mint leaves in the bottom of each tall glass with the back of a spoon.",
      "Fill the glasses with ice, add 2 whole lychees and 60ml of the lychee base to each.",
      "Top each with about 180ml soda water or prosecco, stir gently and garnish with lime."
    ],
    "tip": "Make the lychee base a day ahead and keep it in the fridge. For a cocktail, add 30ml gin to each glass before topping up.",
    "swaps": [
      "Tinned lychees, using 2 tbsp of their syrup instead of the sugar (any time)",
      "Watermelon (summer)"
    ],
    "tags": [
      "no-cook",
      "kid-friendly",
      "vegan",
      "gluten-free"
    ],
    "reviewed": false
  },
  {
    "id": "five-spice-duck-plum-sauce",
    "name": "Crisp five-spice duck with fresh plum sauce",
    "blurb": "Crackling-skinned duck breast with a glossy homemade plum sauce: a restaurant favourite that is easier than it looks.",
    "fruitIds": [
      "plum"
    ],
    "type": "main",
    "serves": 4,
    "minutes": {
      "prep": 15,
      "cook": 35
    },
    "difficulty": "medium",
    "ingredients": [
      {
        "item": "dark-fleshed plums, stoned and chopped",
        "qty": "500g (about 6)",
        "fruitId": "plum"
      },
      {
        "item": "brown sugar",
        "qty": "3 tbsp"
      },
      {
        "item": "soy sauce",
        "qty": "2 tbsp"
      },
      {
        "item": "rice vinegar",
        "qty": "2 tbsp"
      },
      {
        "item": "water",
        "qty": "60ml"
      },
      {
        "item": "ginger, finely grated",
        "qty": "2cm piece"
      },
      {
        "item": "garlic clove, crushed",
        "qty": "1"
      },
      {
        "item": "star anise",
        "qty": "1"
      },
      {
        "item": "duck breasts, skin on",
        "qty": "4 (about 200g each)"
      },
      {
        "item": "Chinese five-spice",
        "qty": "1 tsp"
      },
      {
        "item": "salt flakes",
        "qty": "1 tsp"
      },
      {
        "item": "baby bok choy, halved",
        "qty": "2 bunches"
      },
      {
        "item": "steamed jasmine rice",
        "qty": "to serve"
      }
    ],
    "steps": [
      "Put the plums, sugar, soy, vinegar, water, ginger, garlic and star anise in a small saucepan. Simmer over medium-low heat for 15 to 20 minutes, stirring now and then, until the plums collapse into a jammy sauce. Fish out the star anise and mash or blitz until smooth.",
      "Score the duck skin in a fine criss-cross without cutting into the meat. Pat dry and rub all over with the five-spice and salt.",
      "Lay the duck skin-side down in a cold large frying pan, then turn the heat to medium. Cook for 12 to 15 minutes, pouring off the fat as it builds up, until the skin is deep golden and crisp.",
      "Turn the duck and cook the flesh side for 5 to 7 minutes, until a meat thermometer in the thickest part reads 75°C. Rest skin-side up for 5 minutes.",
      "While the duck rests, stir-fry the bok choy in a spoonful of the duck fat for 2 to 3 minutes.",
      "Slice the duck and serve over rice with the bok choy and the warm plum sauce."
    ],
    "tip": "Starting duck in a cold pan renders the fat slowly so the skin crisps instead of burning. Keep the fat in a jar in the fridge for roast potatoes.",
    "swaps": [
      "Cherries, pitted (December)",
      "Mandarin juice and segments with half the sugar (winter)"
    ],
    "tags": [
      "dairy-free"
    ],
    "reviewed": false
  },
  {
    "id": "spiced-plum-jam",
    "name": "Spiced plum jam",
    "blurb": "A deep ruby jam that sets on its own thanks to the plums, with a whisper of cinnamon and star anise.",
    "fruitIds": [
      "plum",
      "lemon"
    ],
    "type": "preserve",
    "makes": "4 x 250 ml jars",
    "minutes": {
      "prep": 20,
      "cook": 45
    },
    "difficulty": "medium",
    "ingredients": [
      {
        "item": "dark-fleshed plums, stoned and chopped",
        "qty": "1.5kg (about 1.35kg after stoning)",
        "fruitId": "plum"
      },
      {
        "item": "white sugar",
        "qty": "1kg"
      },
      {
        "item": "lemon juice",
        "qty": "60ml",
        "fruitId": "lemon"
      },
      {
        "item": "water",
        "qty": "125ml"
      },
      {
        "item": "cinnamon stick",
        "qty": "1"
      },
      {
        "item": "star anise (optional)",
        "qty": "2"
      },
      {
        "item": "glass jars with lids",
        "qty": "4 x 250ml"
      }
    ],
    "steps": [
      "Put 3 small saucers in the freezer for testing the set. Sterilise the jars: wash in hot soapy water, rinse, then dry upside down in a 120°C oven (100°C fan-forced) for 20 minutes. Boil the lids for 10 minutes.",
      "Put the plums, water, lemon juice and spices in a large, wide, heavy-based pot. Simmer for 10 to 15 minutes until the skins are soft.",
      "Add the sugar and stir over low heat until it has completely dissolved and the spoon no longer feels gritty.",
      "Turn the heat up and boil hard, stirring often so it does not catch, for 15 to 25 minutes until it reaches setting point (about 104°C on a sugar thermometer).",
      "Test the set: take the pot off the heat, drop a teaspoon of jam onto a cold saucer and freeze for 1 minute. If it wrinkles when you push it, it is ready. If not, boil 3 minutes more and test again.",
      "Remove the spices, skim off any foam and stand for 5 minutes.",
      "Ladle the hot jam into the hot jars, leaving a 5mm gap at the top. Wipe the rims and seal straight away. Cool, label and date, then keep in the fridge."
    ],
    "tip": "Hot jam causes serious burns: keep kids clear of the stove. A wide pot boils off water faster, so the jam sets sooner and keeps its colour.",
    "keep": "Store in the fridge; this is not a shelf-stable preserve. Sealed jars keep up to 3 months in the fridge; once opened, use within 4 weeks. Throw out any jar with mould, a bulging lid or an off smell.",
    "swaps": [
      "Apricots, with an extra 1 tbsp lemon juice (early summer)",
      "Half plums, half grated apple, which helps the set (late summer)"
    ],
    "tags": [
      "make-ahead",
      "vegan",
      "gluten-free"
    ],
    "reviewed": false
  },
  {
    "id": "fig-prosciutto-goats-cheese-salad",
    "name": "Fig, prosciutto and goat's cheese salad with honey-balsamic",
    "blurb": "Late-summer figs at their sticky best, with salty prosciutto, creamy goat's cheese and toasted walnuts.",
    "fruitIds": [
      "fig"
    ],
    "type": "salad",
    "serves": 4,
    "minutes": {
      "prep": 15,
      "cook": 5
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "fresh figs, quartered",
        "qty": "8",
        "fruitId": "fig"
      },
      {
        "item": "prosciutto",
        "qty": "100g"
      },
      {
        "item": "soft goat's cheese (chevre)",
        "qty": "100g"
      },
      {
        "item": "rocket or mixed leaves",
        "qty": "80g"
      },
      {
        "item": "walnuts",
        "qty": "1/2 cup"
      },
      {
        "item": "extra virgin olive oil",
        "qty": "2 tbsp"
      },
      {
        "item": "balsamic vinegar",
        "qty": "1 tbsp"
      },
      {
        "item": "honey",
        "qty": "2 tsp"
      },
      {
        "item": "thyme leaves (optional)",
        "qty": "1 tsp"
      },
      {
        "item": "salt and black pepper",
        "qty": "to taste"
      }
    ],
    "steps": [
      "Toast the walnuts in a dry frying pan over medium heat for 3 to 4 minutes, shaking, until fragrant. Cool and roughly chop.",
      "Whisk the oil, balsamic, honey, thyme and a pinch of salt and pepper.",
      "Toss the leaves with a third of the dressing and spread over a platter.",
      "Arrange the figs on top, tear the prosciutto in between and crumble over the goat's cheese.",
      "Drizzle with the remaining dressing, scatter with walnuts and serve."
    ],
    "tip": "Ripe figs bruise if you look at them: buy them the day you need them and keep them in a single layer.",
    "swaps": [
      "Pear or persimmon (autumn)",
      "Nectarine or peach (summer)",
      "Halved red grapes (late summer to autumn)"
    ],
    "tags": [
      "gluten-free"
    ],
    "reviewed": false
  },
  {
    "id": "chicken-grapes-rosemary-traybake",
    "name": "Roast chicken thighs with grapes and rosemary",
    "blurb": "One tray, crisp chicken skin and grapes that blister into a sweet-sharp pan sauce.",
    "fruitIds": [
      "grape"
    ],
    "type": "main",
    "serves": 4,
    "minutes": {
      "prep": 15,
      "cook": 45
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "chicken thighs, bone in and skin on",
        "qty": "8 (about 1.5kg)"
      },
      {
        "item": "red onions, cut into wedges",
        "qty": "2"
      },
      {
        "item": "garlic cloves, smashed",
        "qty": "4"
      },
      {
        "item": "rosemary sprigs",
        "qty": "3"
      },
      {
        "item": "olive oil",
        "qty": "2 tbsp"
      },
      {
        "item": "red seedless grapes, in small bunches",
        "qty": "400g",
        "fruitId": "grape"
      },
      {
        "item": "dry white wine or chicken stock",
        "qty": "125ml"
      },
      {
        "item": "red wine vinegar",
        "qty": "1 tbsp"
      },
      {
        "item": "salt and black pepper",
        "qty": "to taste"
      },
      {
        "item": "crusty bread, mash or soft polenta",
        "qty": "to serve"
      }
    ],
    "steps": [
      "Preheat the oven to 220°C (200°C fan-forced). Pat the chicken dry and season well on both sides.",
      "Toss the onion, garlic and rosemary with 1 tbsp oil in a large roasting tray. Sit the chicken on top, skin up, and rub the skin with the remaining oil.",
      "Roast for 20 minutes.",
      "Tuck the grapes around the chicken and pour the wine and vinegar into the tray (not over the skin). Roast for another 20 to 25 minutes until the skin is crisp, the grapes have blistered and the chicken is cooked through (75°C at the thickest part, juices clear).",
      "Rest for 5 minutes, then squash a few grapes into the pan juices and spoon the sauce over the chicken."
    ],
    "tip": "Use a big enough tray that nothing overlaps; crowded chicken steams instead of crisping.",
    "swaps": [
      "Plums, quartered (summer)",
      "Figs, halved and added for the last 10 minutes (late summer)",
      "Apple wedges (autumn to winter)"
    ],
    "tags": [
      "gluten-free",
      "dairy-free"
    ],
    "reviewed": false
  },
  {
    "id": "sausage-apple-fennel-traybake",
    "name": "Pork sausage, apple and fennel traybake",
    "blurb": "An autumn weeknight dinner where the apples go soft and caramelised against crisp potatoes and a mustard-maple glaze.",
    "fruitIds": [
      "apple"
    ],
    "type": "main",
    "serves": 4,
    "minutes": {
      "prep": 15,
      "cook": 45
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "baby potatoes, halved",
        "qty": "600g"
      },
      {
        "item": "fennel bulbs, cut into wedges, fronds kept",
        "qty": "2"
      },
      {
        "item": "red onion, cut into wedges",
        "qty": "1"
      },
      {
        "item": "olive oil",
        "qty": "2 tbsp"
      },
      {
        "item": "fennel seeds",
        "qty": "1 tsp"
      },
      {
        "item": "crisp apples (such as Pink Lady), cored and cut into eighths",
        "qty": "3",
        "fruitId": "apple"
      },
      {
        "item": "thick pork sausages",
        "qty": "8 (about 600g)"
      },
      {
        "item": "thyme sprigs",
        "qty": "4"
      },
      {
        "item": "wholegrain mustard",
        "qty": "1 tbsp"
      },
      {
        "item": "maple syrup or honey",
        "qty": "1 tbsp"
      },
      {
        "item": "apple cider vinegar",
        "qty": "1 tbsp"
      },
      {
        "item": "salt and black pepper",
        "qty": "to taste"
      }
    ],
    "steps": [
      "Preheat the oven to 220°C (200°C fan-forced). Toss the potatoes, fennel and onion with the oil, fennel seeds and salt on a large lined tray (use two trays if crowded). Roast for 15 minutes.",
      "Add the apples, sausages and thyme, toss the vegetables and roast for 25 minutes, turning the sausages once, until browned and cooked through.",
      "Meanwhile, mix the mustard, maple syrup and vinegar.",
      "Drizzle the glaze over the tray and roast for 5 minutes more.",
      "Scatter with fennel fronds and pepper and serve from the tray."
    ],
    "tip": "Firm apples like Pink Lady or Granny Smith hold their shape; softer ones like Red Delicious turn to mush.",
    "swaps": [
      "Firm pears (autumn)",
      "Red grapes, added for the last 15 minutes (late summer)"
    ],
    "tags": [
      "gluten-free",
      "dairy-free"
    ],
    "reviewed": false
  },
  {
    "id": "apple-bircher-muesli",
    "name": "Apple and cinnamon bircher muesli",
    "blurb": "Make it before bed, wake up to a creamy, ready-to-eat breakfast that keeps for three days.",
    "fruitIds": [
      "apple",
      "lemon"
    ],
    "type": "breakfast",
    "serves": 4,
    "minutes": {
      "prep": 10,
      "cook": 0
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "rolled oats",
        "qty": "135g (1 1/2 cups)"
      },
      {
        "item": "apples, coarsely grated with skin on",
        "qty": "2",
        "fruitId": "apple"
      },
      {
        "item": "lemon juice",
        "qty": "1 tbsp",
        "fruitId": "lemon"
      },
      {
        "item": "milk",
        "qty": "250ml"
      },
      {
        "item": "Greek yoghurt",
        "qty": "200g"
      },
      {
        "item": "honey",
        "qty": "1 tbsp"
      },
      {
        "item": "ground cinnamon",
        "qty": "1/2 tsp"
      },
      {
        "item": "sultanas",
        "qty": "2 tbsp"
      },
      {
        "item": "chia seeds (optional)",
        "qty": "2 tbsp"
      },
      {
        "item": "toasted hazelnuts or almonds, chopped",
        "qty": "1/4 cup"
      }
    ],
    "steps": [
      "Grate the apples, skin and all, and toss straight away with the lemon juice so they stay pale.",
      "Stir the oats, apple, milk, yoghurt, honey, cinnamon, sultanas and chia together in a bowl or big jar.",
      "Cover and refrigerate overnight, or for at least 4 hours.",
      "In the morning, stir and loosen with a splash of milk if it is too thick.",
      "Serve topped with the toasted nuts and extra grated apple or whatever fruit is in season."
    ],
    "tip": "Keeps 3 days in the fridge, so make a double batch on Sunday night.",
    "swaps": [
      "Pear, grated (autumn)",
      "Fold in berries or diced mango when serving (summer)"
    ],
    "tags": [
      "kid-friendly",
      "make-ahead",
      "vegetarian"
    ],
    "reviewed": false
  },
  {
    "id": "pear-ginger-upside-down-cake",
    "name": "Pear and ginger upside-down cake",
    "blurb": "A golden fan of caramelised pears on a soft, gingery cake, best served warm with cream.",
    "fruitIds": [
      "pear"
    ],
    "type": "dessert",
    "makes": "one 22 cm cake (8 slices)",
    "minutes": {
      "prep": 25,
      "cook": 55
    },
    "difficulty": "medium",
    "ingredients": [
      {
        "item": "butter",
        "qty": "50g for the topping, plus 125g softened for the cake"
      },
      {
        "item": "brown sugar",
        "qty": "80g for the topping, plus 150g (2/3 cup) for the cake"
      },
      {
        "item": "firm-ripe pears (such as Beurre Bosc), peeled, cored and cut into eighths",
        "qty": "3",
        "fruitId": "pear"
      },
      {
        "item": "eggs",
        "qty": "2"
      },
      {
        "item": "golden syrup",
        "qty": "2 tbsp"
      },
      {
        "item": "vanilla extract",
        "qty": "1 tsp"
      },
      {
        "item": "plain flour",
        "qty": "225g (1 1/2 cups)"
      },
      {
        "item": "baking powder",
        "qty": "2 tsp"
      },
      {
        "item": "ground ginger",
        "qty": "2 tsp"
      },
      {
        "item": "ground cinnamon",
        "qty": "1 tsp"
      },
      {
        "item": "salt",
        "qty": "pinch"
      },
      {
        "item": "milk",
        "qty": "160ml"
      }
    ],
    "steps": [
      "Preheat the oven to 180°C (160°C fan-forced). Grease and line the base of a 22cm round cake tin (not springform, which leaks caramel).",
      "Melt 50g butter with 80g brown sugar, pour into the tin and spread it out. Arrange the pear slices in a tight fan on top.",
      "Beat 125g butter and 150g brown sugar until pale, about 3 minutes. Beat in the eggs one at a time, then the golden syrup and vanilla.",
      "Sift the flour, baking powder, spices and salt together. Fold into the butter mixture in two lots, alternating with the milk, until just smooth.",
      "Spoon the batter over the pears, smooth the top and bake for 50 to 55 minutes until a skewer in the middle comes out clean.",
      "Stand for 10 minutes only (any longer and the caramel sticks), run a knife around the edge and turn out onto a plate. Serve warm with cream or custard."
    ],
    "tip": "Choose pears that are still firm: soft, ripe ones turn to mush under the batter.",
    "swaps": [
      "Apples (autumn to winter)",
      "Plums, halved (late summer)",
      "Pineapple rings (summer)"
    ],
    "tags": [
      "vegetarian"
    ],
    "reviewed": false
  },
  {
    "id": "lamb-quince-tagine",
    "name": "Slow-cooked lamb and quince tagine",
    "blurb": "Meltingly soft lamb and rosy quince in a honey-spiced sauce, the best reason to buy quinces.",
    "fruitIds": [
      "quince",
      "lemon"
    ],
    "type": "main",
    "serves": 6,
    "minutes": {
      "prep": 25,
      "cook": 120
    },
    "difficulty": "medium",
    "ingredients": [
      {
        "item": "boneless lamb shoulder, cut into 4cm pieces",
        "qty": "1.2kg"
      },
      {
        "item": "olive oil",
        "qty": "2 tbsp"
      },
      {
        "item": "brown onions, chopped",
        "qty": "2"
      },
      {
        "item": "garlic cloves, crushed",
        "qty": "3"
      },
      {
        "item": "ground cumin",
        "qty": "2 tsp"
      },
      {
        "item": "ground coriander",
        "qty": "2 tsp"
      },
      {
        "item": "ground ginger",
        "qty": "1 tsp"
      },
      {
        "item": "ground cinnamon",
        "qty": "1 tsp"
      },
      {
        "item": "ground turmeric",
        "qty": "1/2 tsp"
      },
      {
        "item": "chicken stock",
        "qty": "500ml"
      },
      {
        "item": "large quinces",
        "qty": "2 (about 800g)",
        "fruitId": "quince"
      },
      {
        "item": "lemon, juiced",
        "qty": "1",
        "fruitId": "lemon"
      },
      {
        "item": "honey",
        "qty": "2 tbsp"
      },
      {
        "item": "coriander leaves",
        "qty": "1/2 cup"
      },
      {
        "item": "flaked almonds, toasted",
        "qty": "1/3 cup"
      },
      {
        "item": "couscous",
        "qty": "to serve"
      }
    ],
    "steps": [
      "Season the lamb. Heat the oil in a large heavy casserole over medium-high heat and brown the lamb in batches, about 5 minutes per batch. Set aside.",
      "Lower the heat to medium, add the onions and cook for 8 minutes until soft. Add the garlic and spices and stir for 1 minute until fragrant.",
      "Return the lamb and its juices, add the stock and bring to a simmer. Cover and cook on low heat (or in a 160°C oven (140°C fan-forced)) for 1 hour.",
      "Meanwhile, peel and core the quinces, cut each into 8 wedges and drop them into a bowl of water with half the lemon juice to stop them browning.",
      "Drain the quince and stir it into the pot with the honey, pushing it under the liquid. Cover and cook for 45 to 60 minutes more until the lamb is tender and the quince is soft and blushing pink. Uncover for the last 15 minutes if the sauce is thin.",
      "Season, add the rest of the lemon juice to taste and scatter with coriander and almonds. Serve with couscous."
    ],
    "tip": "Raw quince is rock hard: use a heavy, sharp knife, cut the wedges off around the core rather than through it, and work on a damp cloth so the board does not slide. Even better the next day.",
    "swaps": [
      "Firm pears, added for the last 20 minutes only (autumn)",
      "Dried apricots, 12, added with the stock (any time)"
    ],
    "tags": [
      "dairy-free",
      "make-ahead"
    ],
    "reviewed": false
  },
  {
    "id": "quince-paste",
    "name": "Quince paste",
    "blurb": "Glowing, sliceable quince paste for your cheese board, made from a few knobbly autumn quinces and a lazy afternoon.",
    "fruitIds": [
      "quince",
      "lemon"
    ],
    "type": "preserve",
    "makes": "one 20 cm square slab (about 20 pieces)",
    "minutes": {
      "prep": 30,
      "cook": 180
    },
    "difficulty": "medium",
    "ingredients": [
      {
        "item": "quinces",
        "qty": "1.5kg (about 4 large)",
        "fruitId": "quince"
      },
      {
        "item": "white sugar",
        "qty": "about 1kg (equal to the weight of the puree)"
      },
      {
        "item": "lemon, juiced",
        "qty": "1",
        "fruitId": "lemon"
      },
      {
        "item": "vanilla bean, split (optional)",
        "qty": "1"
      }
    ],
    "steps": [
      "Rub the grey fuzz off the quinces with a cloth. Quarter them (leave the peel and core on), put them in a large pot, cover with water and simmer for 45 to 60 minutes until very soft.",
      "Drain and cool a little, then cut away the cores and seeds. Blitz the flesh and skins in a food processor until completely smooth.",
      "Weigh the puree and put it in a clean heavy-based pot with the same weight of sugar, the lemon juice and vanilla bean.",
      "Stir over low heat until the sugar dissolves, then cook over low heat, stirring often with a long-handled wooden spoon, for 1 1/2 to 2 1/2 hours. It is ready when it is thick, deep orange-red and a spoon dragged across the base leaves a clear trail.",
      "Pour into a 20cm square tin lined with baking paper and smooth the top.",
      "Dry in a 60°C oven (50°C fan-forced) for 1 to 2 hours, or leave uncovered at room temperature overnight, until firm.",
      "Cut into blocks, wrap in baking paper and keep in an airtight container in the fridge."
    ],
    "tip": "The thick paste spits like lava near the end: wear long sleeves and an oven mitt on your stirring hand, and keep kids out of the kitchen.",
    "keep": "Store in the fridge; this is not a shelf-stable preserve. Keeps up to 3 months in the fridge, wrapped. Throw it out if you see mould.",
    "swaps": [
      "Apples, cooked with skins and cores for pectin, for a paler, milder paste (autumn)"
    ],
    "tags": [
      "make-ahead",
      "vegan",
      "gluten-free"
    ],
    "reviewed": false
  },
  {
    "id": "roast-pumpkin-pomegranate-feta-salad",
    "name": "Roast pumpkin, pomegranate and feta salad",
    "blurb": "Warm roast pumpkin and chickpeas with jewel-bright pomegranate, salty feta and a sweet-sour dressing.",
    "fruitIds": [
      "pomegranate",
      "lemon"
    ],
    "type": "salad",
    "serves": 4,
    "minutes": {
      "prep": 20,
      "cook": 35
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "Kent (Jap) pumpkin, seeded, skin on, cut into 3cm wedges",
        "qty": "1kg"
      },
      {
        "item": "chickpeas, drained and rinsed",
        "qty": "400g can"
      },
      {
        "item": "olive oil",
        "qty": "2 tbsp"
      },
      {
        "item": "ground cumin",
        "qty": "1 tsp"
      },
      {
        "item": "pomegranate",
        "qty": "1",
        "fruitId": "pomegranate"
      },
      {
        "item": "baby spinach",
        "qty": "100g"
      },
      {
        "item": "feta",
        "qty": "100g"
      },
      {
        "item": "mint leaves",
        "qty": "1/2 cup"
      },
      {
        "item": "pepitas, toasted",
        "qty": "1/4 cup"
      },
      {
        "item": "extra virgin olive oil",
        "qty": "2 tbsp"
      },
      {
        "item": "pomegranate molasses",
        "qty": "1 tbsp"
      },
      {
        "item": "lemon juice",
        "qty": "1 tbsp",
        "fruitId": "lemon"
      },
      {
        "item": "honey",
        "qty": "1 tsp"
      },
      {
        "item": "salt and black pepper",
        "qty": "to taste"
      }
    ],
    "steps": [
      "Preheat the oven to 220°C (200°C fan-forced). Toss the pumpkin and chickpeas with the olive oil, cumin and salt on a lined tray. Roast for 30 to 35 minutes, turning once, until golden and tender.",
      "Halve the pomegranate across the middle. Hold each half cut-side down over a bowl and whack the back with a wooden spoon until the seeds fall out. Pick out any white pith.",
      "Whisk the extra virgin olive oil, pomegranate molasses, lemon juice, honey, salt and pepper.",
      "Toss the spinach with half the dressing and spread over a platter. Top with the warm pumpkin and chickpeas.",
      "Crumble over the feta, scatter with pomegranate seeds, mint and pepitas and drizzle with the remaining dressing."
    ],
    "tip": "Pomegranate molasses is in the Middle Eastern section of most supermarkets. No molasses? Use an extra squeeze of lemon and another teaspoon of honey.",
    "swaps": [
      "Halved red grapes (late summer to autumn)",
      "Sliced persimmon (autumn)"
    ],
    "tags": [
      "vegetarian",
      "gluten-free"
    ],
    "reviewed": false
  },
  {
    "id": "feijoa-ginger-loaf",
    "name": "Feijoa and ginger loaf",
    "blurb": "The answer to the neighbour's bag of feijoas: a moist, fragrant loaf that toasts beautifully.",
    "fruitIds": [
      "feijoa"
    ],
    "type": "snack",
    "makes": "1 loaf (10 slices)",
    "minutes": {
      "prep": 20,
      "cook": 55
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "butter, softened",
        "qty": "125g"
      },
      {
        "item": "brown sugar",
        "qty": "150g (2/3 cup)"
      },
      {
        "item": "eggs",
        "qty": "2"
      },
      {
        "item": "vanilla extract",
        "qty": "1 tsp"
      },
      {
        "item": "feijoa flesh, roughly mashed (about 10 to 12 feijoas)",
        "qty": "300g",
        "fruitId": "feijoa"
      },
      {
        "item": "plain flour",
        "qty": "250g (1 2/3 cups)"
      },
      {
        "item": "baking powder",
        "qty": "2 tsp"
      },
      {
        "item": "bicarbonate of soda",
        "qty": "1/2 tsp"
      },
      {
        "item": "ground ginger",
        "qty": "2 tsp"
      },
      {
        "item": "ground cinnamon",
        "qty": "1/2 tsp"
      },
      {
        "item": "salt",
        "qty": "pinch"
      },
      {
        "item": "crystallised ginger, chopped (optional)",
        "qty": "2 tbsp"
      },
      {
        "item": "demerara sugar",
        "qty": "1 tbsp"
      }
    ],
    "steps": [
      "Preheat the oven to 180°C (160°C fan-forced). Grease and line a 22 x 10cm loaf tin.",
      "Halve the feijoas, scoop out the flesh and mash it roughly with a fork, leaving a few chunks. Weigh out 300g.",
      "Beat the butter and brown sugar until pale, then beat in the eggs one at a time and the vanilla.",
      "Fold in the feijoa.",
      "Sift over the flour, baking powder, bicarb, spices and salt, add the crystallised ginger and fold until just combined.",
      "Spoon into the tin, sprinkle with demerara sugar and bake for 50 to 60 minutes until a skewer comes out clean. Cover loosely with foil after 40 minutes if it is browning too fast.",
      "Cool in the tin for 10 minutes, then on a rack."
    ],
    "tip": "Keeps 4 days in an airtight container and freezes well in slices. Mashed feijoa also freezes, so you can bake this out of season.",
    "swaps": [
      "Mashed banana, same weight (any time)",
      "Grated apple or pear, same weight (autumn)"
    ],
    "tags": [
      "kid-friendly",
      "make-ahead",
      "vegetarian"
    ],
    "reviewed": false
  },
  {
    "id": "orange-almond-cake",
    "name": "Whole orange and almond cake",
    "blurb": "Whole boiled oranges blitzed into a dense, fragrant, flourless cake that gets better on day two.",
    "fruitIds": [
      "orange"
    ],
    "type": "dessert",
    "makes": "one 23 cm cake (12 slices)",
    "minutes": {
      "prep": 20,
      "cook": 150
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "navel oranges",
        "qty": "2 (about 400g total)",
        "fruitId": "orange"
      },
      {
        "item": "eggs",
        "qty": "6"
      },
      {
        "item": "caster sugar",
        "qty": "220g (1 cup)"
      },
      {
        "item": "almond meal",
        "qty": "250g"
      },
      {
        "item": "gluten-free baking powder",
        "qty": "1 tsp"
      },
      {
        "item": "salt",
        "qty": "pinch"
      },
      {
        "item": "icing sugar and Greek yoghurt",
        "qty": "to serve"
      }
    ],
    "steps": [
      "Put the whole oranges in a saucepan, cover with water and simmer, covered, for 1 1/2 to 2 hours (topping up the water) until a skewer slides through easily. Drain and cool.",
      "Preheat the oven to 180°C (160°C fan-forced). Grease and line a 23cm springform tin.",
      "Cut the oranges open, pick out any seeds, then blitz them whole, skin and all, in a food processor until smooth.",
      "Add the eggs, sugar, almond meal, baking powder and salt and pulse until just combined.",
      "Pour into the tin and bake for 55 to 65 minutes until firm to the touch and a skewer comes out clean. Cover with foil after 40 minutes if it is browning too fast.",
      "Cool completely in the tin (it is fragile while warm). Dust with icing sugar and serve with yoghurt."
    ],
    "tip": "Boil the oranges the day before to split the work. The cake keeps 4 days in an airtight container.",
    "swaps": [
      "Mandarins, 3 (winter)",
      "Tangelos, 2 (winter)"
    ],
    "tags": [
      "gluten-free",
      "dairy-free",
      "make-ahead"
    ],
    "reviewed": false
  },
  {
    "id": "sticky-mandarin-soy-chicken",
    "name": "Sticky mandarin and soy chicken",
    "blurb": "A 30-minute winter weeknight stir-fry with a glossy mandarin glaze that kids love.",
    "fruitIds": [
      "mandarin"
    ],
    "type": "main",
    "serves": 4,
    "minutes": {
      "prep": 15,
      "cook": 20
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "mandarins",
        "qty": "4",
        "fruitId": "mandarin"
      },
      {
        "item": "soy sauce",
        "qty": "3 tbsp"
      },
      {
        "item": "honey",
        "qty": "2 tbsp"
      },
      {
        "item": "rice vinegar",
        "qty": "1 tbsp"
      },
      {
        "item": "garlic cloves, finely grated",
        "qty": "2"
      },
      {
        "item": "ginger, finely grated",
        "qty": "3cm piece"
      },
      {
        "item": "chicken thigh fillets, cut into 3cm pieces",
        "qty": "800g"
      },
      {
        "item": "cornflour",
        "qty": "1 tbsp"
      },
      {
        "item": "neutral oil",
        "qty": "1 tbsp"
      },
      {
        "item": "sesame oil",
        "qty": "1 tsp"
      },
      {
        "item": "broccolini",
        "qty": "2 bunches"
      },
      {
        "item": "green onions, sliced, and sesame seeds",
        "qty": "to serve"
      },
      {
        "item": "steamed rice",
        "qty": "to serve"
      }
    ],
    "steps": [
      "Finely grate the zest of 1 mandarin and juice 3 (you want about 150ml). Peel the last one and pull it into segments. Mix the zest and juice with the soy, honey, vinegar, garlic and ginger.",
      "Toss the chicken with the cornflour and a pinch of salt.",
      "Heat the oil in a large frying pan or wok over high heat and cook the chicken in two batches for 5 to 6 minutes until golden and cooked through. Return it all to the pan.",
      "Pour in the sauce and bubble for 3 to 4 minutes, tossing, until it thickens into a sticky glaze.",
      "Meanwhile, steam the broccolini for 3 minutes.",
      "Off the heat, stir in the sesame oil and mandarin segments. Serve over rice with the broccolini, green onion and sesame seeds."
    ],
    "tip": "Use tamari instead of soy sauce to make it gluten-free.",
    "swaps": [
      "Oranges or tangelos, 2 (winter)",
      "Pineapple juice and chunks (summer)"
    ],
    "tags": [
      "kid-friendly",
      "dairy-free"
    ],
    "reviewed": false
  },
  {
    "id": "lemon-delicious-pudding",
    "name": "Lemon delicious pudding",
    "blurb": "The Aussie classic that magically separates into a fluffy sponge on top and tangy lemon sauce underneath.",
    "fruitIds": [
      "lemon"
    ],
    "type": "dessert",
    "serves": 6,
    "minutes": {
      "prep": 20,
      "cook": 45
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "butter, softened",
        "qty": "60g"
      },
      {
        "item": "caster sugar",
        "qty": "165g (3/4 cup)"
      },
      {
        "item": "lemons: finely grated zest and juice",
        "qty": "2 (1 tbsp zest, 80ml juice)",
        "fruitId": "lemon"
      },
      {
        "item": "eggs, separated",
        "qty": "3"
      },
      {
        "item": "plain flour",
        "qty": "50g (1/3 cup)"
      },
      {
        "item": "baking powder",
        "qty": "1/2 tsp"
      },
      {
        "item": "milk",
        "qty": "310ml (1 1/4 cups)"
      },
      {
        "item": "icing sugar",
        "qty": "to dust"
      }
    ],
    "steps": [
      "Preheat the oven to 180°C (160°C fan-forced). Butter a 1.5 litre ovenproof dish, sit it in a roasting pan and boil the kettle.",
      "Beat the butter, sugar and lemon zest until combined (it will look sandy), then beat in the egg yolks one at a time.",
      "Sift in the flour and baking powder and mix, then gradually whisk in the milk and lemon juice. It may look curdled; that is fine.",
      "In a clean bowl, whisk the egg whites to soft peaks and gently fold them into the lemon mixture in two lots.",
      "Pour into the dish. Pour boiling water into the roasting pan to come halfway up the sides of the dish.",
      "Bake for 40 to 45 minutes until golden and springy on top. Dust with icing sugar and serve warm with cream or ice cream."
    ],
    "tip": "Spoon right to the bottom of the dish when serving so everyone gets some of the sauce.",
    "swaps": [
      "Limes, with 1 extra tbsp sugar (winter)",
      "Replace 40ml of the lemon juice with passionfruit pulp (winter or summer)"
    ],
    "tags": [
      "vegetarian"
    ],
    "reviewed": false
  },
  {
    "id": "preserved-lemons",
    "name": "Preserved lemons",
    "blurb": "Salt-cured lemons that turn soft and silky in a month, and make tagines, dressings and roast chicken sing.",
    "fruitIds": [
      "lemon"
    ],
    "type": "preserve",
    "makes": "1 x 1 litre jar",
    "minutes": {
      "prep": 20,
      "cook": 0
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "lemons, scrubbed (unwaxed if you can find them)",
        "qty": "about 1kg (5 large or 8 small)",
        "fruitId": "lemon"
      },
      {
        "item": "extra lemons, for juice",
        "qty": "about 4 (250ml juice)",
        "fruitId": "lemon"
      },
      {
        "item": "cooking salt (non-iodised) or salt flakes",
        "qty": "150g"
      },
      {
        "item": "bay leaves",
        "qty": "2"
      },
      {
        "item": "coriander seeds (optional)",
        "qty": "1 tsp"
      },
      {
        "item": "cinnamon stick (optional)",
        "qty": "1"
      },
      {
        "item": "glass jar with a non-metal or lacquered lid",
        "qty": "1 litre"
      }
    ],
    "steps": [
      "Sterilise the jar and lid: wash in hot soapy water, rinse, then dry the jar in a 120°C oven (100°C fan-forced) for 20 minutes and boil the lid for 10 minutes.",
      "Cut each lemon from the top into quarters, stopping 1cm from the base so they hold together.",
      "Open each lemon and pack about 1 tbsp salt inside, then close it up.",
      "Put 1 tbsp salt in the jar, then pack the lemons in tightly, pressing so they release their juice. Scatter the spices and remaining salt between the layers.",
      "Pour in enough fresh lemon juice to cover the lemons completely. Wedge them under with a lemon half if they float, then seal.",
      "Put the jar straight into the fridge for about 6 weeks, turning it every few days, until the rinds are soft and translucent.",
      "To use, rinse a wedge, scrape out and discard the flesh, and finely chop the rind."
    ],
    "tip": "The lemons must stay under the liquid: top up with juice if needed. Always use a clean fork to take them out.",
    "keep": "Store in the fridge; this is not a shelf-stable preserve. Once cured, use within 6 months. Throw out the jar if you see fuzzy mould or it smells off.",
    "swaps": [
      "Limes, same method (winter)",
      "Meyer lemons, for a softer, sweeter result (winter)"
    ],
    "tags": [
      "make-ahead",
      "vegan",
      "gluten-free"
    ],
    "reviewed": false
  },
  {
    "id": "grapefruit-avocado-prawn-salad",
    "name": "Ruby grapefruit, avocado and prawn salad",
    "blurb": "A bright winter salad: juicy grapefruit and creamy avocado with sweet prawns and shaved fennel.",
    "fruitIds": [
      "grapefruit",
      "avocado"
    ],
    "type": "salad",
    "serves": 4,
    "minutes": {
      "prep": 20,
      "cook": 0
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "ruby grapefruit",
        "qty": "2",
        "fruitId": "grapefruit"
      },
      {
        "item": "avocados",
        "qty": "2",
        "fruitId": "avocado"
      },
      {
        "item": "cooked prawns, peeled and deveined",
        "qty": "400g"
      },
      {
        "item": "small fennel bulb, shaved, fronds kept",
        "qty": "1"
      },
      {
        "item": "watercress or mixed leaves",
        "qty": "80g"
      },
      {
        "item": "mint leaves",
        "qty": "1/4 cup"
      },
      {
        "item": "extra virgin olive oil",
        "qty": "2 tbsp"
      },
      {
        "item": "honey",
        "qty": "1 tsp"
      },
      {
        "item": "Dijon mustard",
        "qty": "1 tsp"
      },
      {
        "item": "salt and black pepper",
        "qty": "to taste"
      }
    ],
    "steps": [
      "Segment the grapefruit: slice off the top and bottom, then cut away the peel and white pith following the curve. Working over a bowl, cut between the membranes to free the segments, then squeeze the leftover membranes for juice.",
      "Whisk 2 tbsp of the grapefruit juice with the oil, honey, mustard, salt and pepper.",
      "Toss the fennel and leaves with half the dressing.",
      "Halve, stone and slice the avocados.",
      "Arrange the leaves on plates with the grapefruit, avocado and prawns. Spoon over the remaining dressing, scatter with mint and fennel fronds and serve straight away."
    ],
    "tip": "Shave the fennel on a mandoline (use the guard) or slice it as thinly as you can with a sharp knife.",
    "swaps": [
      "Oranges, tangelos or blood oranges (winter)",
      "Mango (summer)"
    ],
    "tags": [
      "no-cook",
      "gluten-free",
      "dairy-free"
    ],
    "reviewed": false
  },
  {
    "id": "kiwifruit-green-smoothie",
    "name": "Kiwifruit, banana and spinach smoothie",
    "blurb": "A zingy green breakfast in a glass, sweet enough that kids will not notice the spinach.",
    "fruitIds": [
      "kiwifruit",
      "banana"
    ],
    "type": "drink",
    "serves": 2,
    "minutes": {
      "prep": 5,
      "cook": 0
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "ripe kiwifruit",
        "qty": "3",
        "fruitId": "kiwifruit"
      },
      {
        "item": "banana, sliced and frozen",
        "qty": "1",
        "fruitId": "banana"
      },
      {
        "item": "baby spinach",
        "qty": "1 cup (30g)"
      },
      {
        "item": "milk or coconut water",
        "qty": "250ml"
      },
      {
        "item": "Greek yoghurt",
        "qty": "125g (1/2 cup)"
      },
      {
        "item": "honey (optional)",
        "qty": "1 tsp"
      },
      {
        "item": "ice cubes",
        "qty": "4"
      }
    ],
    "steps": [
      "Halve the kiwifruit and scoop out the flesh with a spoon.",
      "Blend the milk and spinach first until completely smooth, with no leafy bits.",
      "Add the kiwifruit, banana, yoghurt, honey and ice and blend for 30 to 45 seconds until smooth. Do not over-blend: crushed kiwifruit seeds taste bitter.",
      "Taste, add a little more honey if needed, and pour."
    ],
    "tip": "Keep a bag of peeled banana chunks in the freezer for smoothies; it makes them thick and cold without much ice.",
    "swaps": [
      "Mango or pineapple (summer)",
      "Honeydew (summer)"
    ],
    "tags": [
      "kid-friendly",
      "no-cook",
      "vegetarian",
      "gluten-free"
    ],
    "reviewed": false
  },
  {
    "id": "passionfruit-slice",
    "name": "Passionfruit slice",
    "blurb": "A buttery coconut base under a tangy, wobbly passionfruit layer: the kind of slice that disappears from the tin.",
    "fruitIds": [
      "passionfruit",
      "lemon"
    ],
    "type": "snack",
    "makes": "16 squares",
    "minutes": {
      "prep": 20,
      "cook": 35
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "plain flour",
        "qty": "225g (1 1/2 cups)"
      },
      {
        "item": "desiccated coconut",
        "qty": "45g (1/2 cup)"
      },
      {
        "item": "caster sugar",
        "qty": "75g (1/3 cup)"
      },
      {
        "item": "butter, melted",
        "qty": "150g"
      },
      {
        "item": "sweetened condensed milk",
        "qty": "395g can"
      },
      {
        "item": "egg yolks",
        "qty": "3"
      },
      {
        "item": "lemon juice",
        "qty": "60ml",
        "fruitId": "lemon"
      },
      {
        "item": "passionfruit pulp (about 8 passionfruit)",
        "qty": "125ml for the filling, plus about 3 tbsp to finish",
        "fruitId": "passionfruit"
      }
    ],
    "steps": [
      "Preheat the oven to 180°C (160°C fan-forced). Line a 20 x 30cm slice tin with baking paper, leaving some overhanging the long sides.",
      "Mix the flour, coconut and sugar, stir in the melted butter and press firmly and evenly into the tin. Bake for 15 to 18 minutes until light golden. Turn the oven down to 160°C (140°C fan-forced).",
      "Whisk the condensed milk, egg yolks, lemon juice and 125ml passionfruit pulp until smooth.",
      "Pour over the warm base and bake for 15 to 18 minutes until set at the edges with a slight wobble in the middle.",
      "Cool in the tin, then refrigerate for at least 3 hours until firm.",
      "Spoon the extra passionfruit pulp over the top, lift out using the paper and cut into 16 squares with a hot knife."
    ],
    "tip": "Keeps 4 days in the fridge. Wrinkly passionfruit are the ripest and sweetest, so do not pass them over.",
    "swaps": [
      "Lemon only: use 125ml lemon juice and 2 tsp zest instead of the passionfruit (winter)",
      "Lime (winter)"
    ],
    "tags": [
      "kid-friendly",
      "make-ahead",
      "vegetarian"
    ],
    "reviewed": false
  },
  {
    "id": "smashed-avocado-feta-jammy-egg",
    "name": "Smashed avocado with lemon, chilli, feta and a jammy egg",
    "blurb": "The cafe breakfast done properly at home, in the time it takes to boil an egg.",
    "fruitIds": [
      "avocado",
      "lemon"
    ],
    "type": "breakfast",
    "serves": 2,
    "minutes": {
      "prep": 10,
      "cook": 8
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "eggs",
        "qty": "2"
      },
      {
        "item": "thick slices of sourdough",
        "qty": "4"
      },
      {
        "item": "extra virgin olive oil",
        "qty": "1 tbsp"
      },
      {
        "item": "ripe avocados",
        "qty": "2",
        "fruitId": "avocado"
      },
      {
        "item": "lemon: finely grated zest and juice",
        "qty": "1/2",
        "fruitId": "lemon"
      },
      {
        "item": "feta",
        "qty": "60g"
      },
      {
        "item": "chilli flakes",
        "qty": "1/2 tsp"
      },
      {
        "item": "mint or coriander leaves",
        "qty": "small handful"
      },
      {
        "item": "dukkah (optional)",
        "qty": "1 tbsp"
      },
      {
        "item": "salt flakes and black pepper",
        "qty": "to taste"
      }
    ],
    "steps": [
      "Bring a small saucepan of water to the boil. Gently lower in the eggs and boil for 6 1/2 minutes, then move them to a bowl of cold water and peel.",
      "Meanwhile, toast the sourdough and drizzle with the oil.",
      "Mash the avocado with the lemon zest and juice, salt and pepper using a fork, leaving it chunky.",
      "Pile the avocado onto the toast, crumble over the feta and sprinkle with chilli flakes, herbs and dukkah.",
      "Halve the eggs, sit them on top, season and serve."
    ],
    "tip": "Buy avocados firm and ripen them on the bench for 2 to 4 days; they are ready when the stem nub flicks off to show green underneath.",
    "tags": [
      "vegetarian"
    ],
    "reviewed": false
  },
  {
    "id": "strawberry-balsamic-eton-mess",
    "name": "Strawberry and balsamic Eton mess",
    "blurb": "Spring strawberries, crunchy meringue and soft cream, with a little balsamic and pepper to make the berries taste even more of themselves.",
    "fruitIds": [
      "strawberry"
    ],
    "type": "dessert",
    "serves": 6,
    "minutes": {
      "prep": 20,
      "cook": 0
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "strawberries, hulled",
        "qty": "500g",
        "fruitId": "strawberry"
      },
      {
        "item": "caster sugar",
        "qty": "1 tbsp"
      },
      {
        "item": "balsamic vinegar",
        "qty": "1 tbsp"
      },
      {
        "item": "black pepper",
        "qty": "pinch"
      },
      {
        "item": "thickened cream",
        "qty": "300ml"
      },
      {
        "item": "icing sugar",
        "qty": "1 tbsp"
      },
      {
        "item": "vanilla extract",
        "qty": "1 tsp"
      },
      {
        "item": "Greek yoghurt",
        "qty": "150g"
      },
      {
        "item": "meringue nests",
        "qty": "100g (about 6 small)"
      },
      {
        "item": "small mint or basil leaves",
        "qty": "1/4 cup"
      }
    ],
    "steps": [
      "Halve or quarter the strawberries. Set a third aside and toss the rest with the sugar, balsamic and pepper. Leave for 15 minutes until juicy.",
      "Roughly mash the reserved strawberries with a fork into a chunky sauce.",
      "Whip the cream with the icing sugar and vanilla to soft peaks, then fold in the yoghurt.",
      "Break the meringues into bite-sized pieces.",
      "Just before serving, fold the meringue, the macerated strawberries and half the mash through the cream in a few strokes so it streaks.",
      "Spoon into glasses, top with the rest of the mash and the herbs and serve straight away, before the meringue softens."
    ],
    "tip": "Use a good, syrupy balsamic: a thin, sharp one will dominate.",
    "swaps": [
      "Raspberries (summer)",
      "Mango and passionfruit (summer)",
      "Nectarines (summer)"
    ],
    "tags": [
      "no-cook",
      "vegetarian",
      "gluten-free"
    ],
    "reviewed": false
  },
  {
    "id": "rhubarb-strawberry-ginger-crumble",
    "name": "Rhubarb, strawberry and ginger crumble",
    "blurb": "Tart pink rhubarb and sweet strawberries under a crunchy oat and almond crumble: spring's best pudding.",
    "fruitIds": [
      "rhubarb",
      "strawberry",
      "orange"
    ],
    "type": "dessert",
    "serves": 6,
    "minutes": {
      "prep": 20,
      "cook": 40
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "rhubarb, trimmed and cut into 3cm lengths (about 1 bunch)",
        "qty": "500g",
        "fruitId": "rhubarb"
      },
      {
        "item": "strawberries, hulled and halved",
        "qty": "250g",
        "fruitId": "strawberry"
      },
      {
        "item": "caster sugar",
        "qty": "75g (1/3 cup)"
      },
      {
        "item": "cornflour",
        "qty": "1 tbsp"
      },
      {
        "item": "orange: finely grated zest and 2 tbsp juice",
        "qty": "1",
        "fruitId": "orange"
      },
      {
        "item": "ginger, finely grated",
        "qty": "2cm piece"
      },
      {
        "item": "plain flour",
        "qty": "100g (2/3 cup)"
      },
      {
        "item": "rolled oats",
        "qty": "60g (2/3 cup)"
      },
      {
        "item": "brown sugar",
        "qty": "80g"
      },
      {
        "item": "ground ginger",
        "qty": "1/2 tsp"
      },
      {
        "item": "salt",
        "qty": "pinch"
      },
      {
        "item": "cold butter, cubed",
        "qty": "100g"
      },
      {
        "item": "flaked almonds",
        "qty": "30g"
      }
    ],
    "steps": [
      "Preheat the oven to 190°C (170°C fan-forced).",
      "Toss the rhubarb, strawberries, caster sugar, cornflour, orange zest and juice and fresh ginger in a 1.5 to 2 litre baking dish.",
      "Rub the butter into the flour, oats, brown sugar, ground ginger and salt with your fingertips until it forms clumps. Stir in the almonds.",
      "Scatter the crumble loosely over the fruit (do not press it down).",
      "Bake for 35 to 40 minutes until the topping is golden and the fruit is bubbling up at the edges.",
      "Rest for 10 minutes and serve with custard or vanilla ice cream."
    ],
    "tip": "Only eat the stalks: rhubarb leaves are poisonous, so cut them off and throw them away. The crumble topping freezes well raw, ready for next time.",
    "swaps": [
      "Apples, 4 peeled and sliced, instead of the rhubarb (autumn to winter)",
      "Plums (late summer)",
      "Pears (autumn)"
    ],
    "tags": [
      "vegetarian",
      "make-ahead"
    ],
    "reviewed": false
  },
  {
    "id": "papaya-lime-coconut-breakfast-bowl",
    "name": "Papaya, lime and coconut breakfast bowl",
    "blurb": "Five minutes to a tropical breakfast that tastes like a holiday morning.",
    "fruitIds": [
      "papaya",
      "lime",
      "passionfruit"
    ],
    "type": "breakfast",
    "serves": 2,
    "minutes": {
      "prep": 10,
      "cook": 0
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "red papaya",
        "qty": "1/2 (about 600g)",
        "fruitId": "papaya"
      },
      {
        "item": "lime, zested and juiced",
        "qty": "1",
        "fruitId": "lime"
      },
      {
        "item": "coconut or Greek yoghurt",
        "qty": "250g"
      },
      {
        "item": "passionfruit",
        "qty": "2",
        "fruitId": "passionfruit"
      },
      {
        "item": "granola",
        "qty": "1/2 cup"
      },
      {
        "item": "toasted coconut flakes",
        "qty": "2 tbsp"
      },
      {
        "item": "honey (optional)",
        "qty": "1 tsp"
      },
      {
        "item": "mint leaves",
        "qty": "a few"
      }
    ],
    "steps": [
      "Scoop the seeds out of the papaya, peel it and cut into chunks.",
      "Squeeze the lime juice over the papaya: it lifts the flavour and balances its sweetness.",
      "Spoon the yoghurt into two bowls and top with the papaya.",
      "Spoon over the passionfruit pulp, then scatter with granola, coconut, lime zest and mint. Drizzle with honey if you like."
    ],
    "tip": "Ripe papaya gives slightly when pressed and is mostly orange-yellow. A green-tinged one ripens on the bench in a day or two.",
    "swaps": [
      "Mango or rockmelon (summer)",
      "Kiwifruit (winter)"
    ],
    "tags": [
      "no-cook",
      "vegetarian",
      "gluten-free",
      "kid-friendly"
    ],
    "reviewed": false
  },
  {
    "id": "fish-tacos-papaya-lime-salsa",
    "name": "Spiced fish tacos with papaya and lime salsa",
    "blurb": "Quick-seared fish, a sweet-hot papaya salsa and a cool lime crema: Friday night sorted.",
    "fruitIds": [
      "papaya",
      "lime"
    ],
    "type": "main",
    "serves": 4,
    "minutes": {
      "prep": 25,
      "cook": 10
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "ripe red papaya, cut into 1cm dice",
        "qty": "400g",
        "fruitId": "papaya"
      },
      {
        "item": "small red onion, finely diced",
        "qty": "1/2"
      },
      {
        "item": "long red chilli, seeded and finely chopped",
        "qty": "1"
      },
      {
        "item": "coriander, chopped",
        "qty": "1/2 cup"
      },
      {
        "item": "limes",
        "qty": "2, plus wedges to serve",
        "fruitId": "lime"
      },
      {
        "item": "sour cream",
        "qty": "150g"
      },
      {
        "item": "firm white fish fillets (flathead, ling or barramundi), skin off",
        "qty": "600g"
      },
      {
        "item": "ground cumin",
        "qty": "1 tsp"
      },
      {
        "item": "smoked paprika",
        "qty": "1 tsp"
      },
      {
        "item": "olive oil",
        "qty": "1 tbsp"
      },
      {
        "item": "red cabbage, finely shredded",
        "qty": "2 cups"
      },
      {
        "item": "small corn or flour tortillas",
        "qty": "12"
      },
      {
        "item": "salt",
        "qty": "to taste"
      }
    ],
    "steps": [
      "Mix the papaya, onion, chilli, coriander, the juice of 1 lime and a pinch of salt. Leave to stand while you cook.",
      "Stir the sour cream with the juice of half a lime and a pinch of salt.",
      "Pat the fish dry and rub with the oil, cumin, paprika and salt.",
      "Cook the fish in a hot non-stick frying pan over medium-high heat for 2 to 3 minutes each side until it just flakes. Break into chunks.",
      "Warm the tortillas in a dry pan for about 20 seconds each side and wrap in a tea towel.",
      "Fill the tortillas with cabbage, fish, salsa and crema and serve with lime wedges."
    ],
    "tip": "Corn tortillas make this gluten-free.",
    "swaps": [
      "Mango or pineapple (summer)",
      "Orange or grapefruit segments (winter)"
    ],
    "tags": [
      "kid-friendly"
    ],
    "reviewed": false
  },
  {
    "id": "pork-pineapple-skewers",
    "name": "Charred pork and pineapple skewers with chilli-lime glaze",
    "blurb": "Barbecue season starts here: sticky, charred pork and pineapple skewers with a sweet chilli and lime glaze.",
    "fruitIds": [
      "pineapple",
      "lime"
    ],
    "type": "main",
    "serves": 4,
    "minutes": {
      "prep": 30,
      "cook": 12
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "pork scotch fillet (neck), cut into 3cm cubes",
        "qty": "600g"
      },
      {
        "item": "soy sauce",
        "qty": "2 tbsp"
      },
      {
        "item": "brown sugar",
        "qty": "1 tbsp"
      },
      {
        "item": "lime juice",
        "qty": "2 tbsp",
        "fruitId": "lime"
      },
      {
        "item": "garlic cloves, finely grated",
        "qty": "2"
      },
      {
        "item": "ginger, finely grated",
        "qty": "2cm piece"
      },
      {
        "item": "neutral oil",
        "qty": "1 tbsp, plus extra for the grill"
      },
      {
        "item": "pineapple flesh, cut into 3cm chunks (about 1/2 pineapple)",
        "qty": "500g",
        "fruitId": "pineapple"
      },
      {
        "item": "red capsicum, cut into 3cm pieces",
        "qty": "1"
      },
      {
        "item": "red onion, cut into wedges",
        "qty": "1"
      },
      {
        "item": "sweet chilli sauce",
        "qty": "2 tbsp"
      },
      {
        "item": "bamboo or metal skewers",
        "qty": "8"
      },
      {
        "item": "steamed jasmine rice, coriander and lime wedges",
        "qty": "to serve"
      }
    ],
    "steps": [
      "If you are using bamboo skewers, soak them in water for 30 minutes.",
      "Mix the soy sauce, brown sugar, 1 tbsp lime juice, garlic, ginger and oil. Toss the pork through and marinate for 20 minutes (or up to overnight in the fridge).",
      "Thread the pork, pineapple, capsicum and onion onto the skewers.",
      "Heat a barbecue or chargrill pan to medium-high and oil the grill. Cook the skewers for 10 to 12 minutes, turning every few minutes, until the pork is cooked through and the pineapple is charred.",
      "Mix the sweet chilli sauce with the remaining 1 tbsp lime juice and brush it over the skewers for the last 2 minutes.",
      "Serve with rice, coriander and lime wedges."
    ],
    "tip": "Use tamari instead of soy and check the sweet chilli sauce label to make it gluten-free.",
    "swaps": [
      "Firm mango cheeks, grilled briefly (summer)",
      "Peaches, thick wedges (summer)"
    ],
    "tags": [
      "dairy-free",
      "kid-friendly"
    ],
    "reviewed": false
  },
  {
    "id": "banana-bread",
    "name": "Brown-sugar banana bread",
    "blurb": "The best use for spotty bananas: moist, caramelly and even better toasted with butter.",
    "fruitIds": [
      "banana"
    ],
    "type": "snack",
    "makes": "1 loaf (10 slices)",
    "minutes": {
      "prep": 15,
      "cook": 60
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "very ripe bananas, plus 1 extra for the top (optional)",
        "qty": "3 (about 350g peeled)",
        "fruitId": "banana"
      },
      {
        "item": "butter, melted",
        "qty": "125g"
      },
      {
        "item": "brown sugar, firmly packed",
        "qty": "150g (2/3 cup)"
      },
      {
        "item": "eggs",
        "qty": "2"
      },
      {
        "item": "vanilla extract",
        "qty": "1 tsp"
      },
      {
        "item": "Greek yoghurt",
        "qty": "60g (1/4 cup)"
      },
      {
        "item": "plain flour",
        "qty": "300g (2 cups)"
      },
      {
        "item": "bicarbonate of soda",
        "qty": "1 tsp"
      },
      {
        "item": "baking powder",
        "qty": "1 tsp"
      },
      {
        "item": "ground cinnamon",
        "qty": "1 tsp"
      },
      {
        "item": "salt",
        "qty": "1/2 tsp"
      },
      {
        "item": "walnuts or dark choc chips (optional)",
        "qty": "1/2 cup"
      }
    ],
    "steps": [
      "Preheat the oven to 180°C (160°C fan-forced). Grease and line a 22 x 10cm loaf tin.",
      "Mash the bananas well in a large bowl.",
      "Whisk in the melted butter, brown sugar, eggs, vanilla and yoghurt.",
      "Sift over the flour, bicarb, baking powder, cinnamon and salt, add the walnuts or choc chips and fold until no dry streaks remain.",
      "Spoon into the tin. If using, halve the extra banana lengthways and lay it on top, cut side up. Bake for 55 to 65 minutes until a skewer comes out clean, covering loosely with foil after 40 minutes.",
      "Cool in the tin for 10 minutes, then on a rack."
    ],
    "tip": "Freeze overripe bananas in their skins until you have three; thaw them in a bowl (they go dark and slippery, which is perfect).",
    "swaps": [
      "Feijoa flesh, 300g (autumn)",
      "Grated apple, 300g, with 1 tsp mixed spice (autumn to winter)"
    ],
    "tags": [
      "kid-friendly",
      "make-ahead",
      "vegetarian"
    ],
    "reviewed": false
  },
  {
    "id": "roasted-rhubarb-yoghurt-oat-crunch",
    "name": "Roasted rhubarb with yoghurt and oat crunch",
    "blurb": "Tart pink rhubarb roasted with orange and honey until just tender, over thick yoghurt with a crunchy oat topping. Make it on Sunday and breakfast is sorted for days.",
    "fruitIds": [
      "rhubarb",
      "orange"
    ],
    "type": "breakfast",
    "serves": 4,
    "minutes": {
      "prep": 10,
      "cook": 15
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "rhubarb, leaves cut off, stalks cut into 5cm lengths",
        "qty": "400g (about 1 bunch)",
        "fruitId": "rhubarb"
      },
      {
        "item": "orange, zested and juiced",
        "qty": "1",
        "fruitId": "orange"
      },
      {
        "item": "honey",
        "qty": "2 tbsp for the rhubarb, plus 1 tbsp for the oats"
      },
      {
        "item": "vanilla extract",
        "qty": "1 tsp"
      },
      {
        "item": "rolled oats",
        "qty": "100g (1 cup)"
      },
      {
        "item": "flaked almonds",
        "qty": "30g"
      },
      {
        "item": "butter, melted",
        "qty": "20g"
      },
      {
        "item": "ground cinnamon",
        "qty": "1/2 tsp"
      },
      {
        "item": "thick Greek-style yoghurt",
        "qty": "500g (2 cups)"
      }
    ],
    "steps": [
      "Heat the oven to 200°C (180°C fan-forced) and line two baking trays with baking paper.",
      "Lay the rhubarb in a single layer on one tray. Drizzle with 2 tbsp honey, the orange zest and juice and the vanilla, and toss gently.",
      "Mix the oats, almonds, melted butter, cinnamon and the last 1 tbsp honey on the second tray and spread them out.",
      "Roast both trays for 12 to 15 minutes, stirring the oats halfway, until the rhubarb is just tender but holds its shape and the oats are golden. Watch the oats near the end.",
      "Cool the oats on the tray so they crisp up. Spoon the yoghurt into bowls and top with the warm or cold rhubarb, its pink syrup and the oat crunch."
    ],
    "tip": "Only the stalks are eaten: rhubarb leaves are poisonous, so cut them off and throw them away. Thinner, redder stalks give the prettiest colour. The rhubarb keeps 4 days in the fridge and the oat crunch a week in a sealed jar.",
    "swaps": [
      "Strawberries, halved, roasted for only 8 minutes (spring)",
      "Plums, halved and stoned (late summer)"
    ],
    "tags": [
      "kid-friendly",
      "vegetarian",
      "make-ahead"
    ],
    "reviewed": false
  },
  {
    "id": "strawberry-haloumi-cucumber-salad",
    "name": "Strawberry, haloumi and cucumber salad with mint",
    "blurb": "Squeaky golden haloumi with sweet spring strawberries, crunchy cucumber and a honey-lime dressing. A fresh, bright lunch in 20 minutes.",
    "fruitIds": [
      "strawberry",
      "lime"
    ],
    "type": "salad",
    "serves": 4,
    "minutes": {
      "prep": 15,
      "cook": 5
    },
    "difficulty": "easy",
    "ingredients": [
      {
        "item": "strawberries, hulled and halved",
        "qty": "500g (2 punnets)",
        "fruitId": "strawberry"
      },
      {
        "item": "haloumi, cut into 1cm slices",
        "qty": "250g"
      },
      {
        "item": "Lebanese cucumbers, sliced into half-moons",
        "qty": "2"
      },
      {
        "item": "baby spinach",
        "qty": "60g"
      },
      {
        "item": "mint leaves",
        "qty": "small handful"
      },
      {
        "item": "roasted pistachios, roughly chopped",
        "qty": "40g"
      },
      {
        "item": "lime, juiced",
        "qty": "1",
        "fruitId": "lime"
      },
      {
        "item": "honey",
        "qty": "2 tsp"
      },
      {
        "item": "extra virgin olive oil",
        "qty": "3 tbsp"
      },
      {
        "item": "salt flakes and black pepper",
        "qty": "to taste"
      }
    ],
    "steps": [
      "Whisk the lime juice, honey and 2 tbsp of the oil with a pinch of salt and pepper.",
      "Spread the spinach, cucumber and strawberries over a big platter.",
      "Pat the haloumi dry. Heat the last 1 tbsp oil in a large frying pan over medium-high heat and cook the haloumi for 1 to 2 minutes each side until golden.",
      "Lay the hot haloumi over the salad, drizzle with the dressing and scatter with the mint and pistachios. Serve straight away, while the haloumi is warm and soft."
    ],
    "tip": "Haloumi turns rubbery as it cools, so cook it last. Pick strawberries that are red right up to the green top, and wash them only just before you hull them.",
    "swaps": [
      "Nectarines or peaches, sliced (summer)",
      "Orange segments (winter)"
    ],
    "tags": [
      "vegetarian",
      "gluten-free"
    ],
    "reviewed": false
  },
]
