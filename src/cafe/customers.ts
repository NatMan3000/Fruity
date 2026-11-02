// The cafe's regulars: Aussie animals with a name, a look and a way of talking.

export type Ears = 'koala' | 'pointy' | 'tall' | 'small' | 'none'
export type Nose = 'koala' | 'button' | 'snout' | 'beak' | 'bill' | 'long'
export type Extra = 'crest' | 'spikes' | 'stripe' | 'shaggy' | 'none'

export interface Customer {
  id: string
  name: string
  about: string     // shown in the sticker book
  fur: string
  face: string      // muzzle and inner ear
  ears: Ears
  nose: Nose
  extra: Extra
  accent: string    // crest, beak or nose colour
  hellos: string[]
  thanks: string[]
}

export const CUSTOMERS: Customer[] = [
  {
    id: 'koala', name: 'Koala Kev', about: 'A bit sleepy. Loves anything green.',
    fur: '#9AA4AE', face: '#E4E8EC', ears: 'koala', nose: 'koala', extra: 'none', accent: '#3A3F45',
    hellos: ["G'day! *yawn*", 'Morning, mate.'], thanks: ['Beaut, thanks!', 'Worth waking up for!'],
  },
  {
    id: 'possum', name: 'Possum Pip', about: 'Up all night. Big eyes, bigger appetite.',
    fur: '#7E706B', face: '#EFE2DA', ears: 'pointy', nose: 'button', extra: 'none', accent: '#F28BA8',
    hellos: ['Psst! Hello!', 'Hiya! Is it snack time?'], thanks: ['Ooh, yum!', 'You little ripper!'],
  },
  {
    id: 'wombat', name: 'Wombat Wendy', about: 'Square poos, round tummy. Very polite.',
    fur: '#8C6A4F', face: '#C8A88A', ears: 'small', nose: 'snout', extra: 'none', accent: '#3B2C22',
    hellos: ['Hello, dear!', 'Good afternoon!'], thanks: ['Lovely, thank you!', 'Perfect, dear!'],
  },
  {
    id: 'kangaroo', name: 'Kangaroo Kylie', about: 'Bouncy. Always in a hurry.',
    fur: '#C98B55', face: '#F1D7B8', ears: 'tall', nose: 'button', extra: 'none', accent: '#4A2E1C',
    hellos: ["G'day! Quick one, please!", 'Hop to it, mate!'], thanks: ['Bonzer!', 'Hoppin\' good!'],
  },
  {
    id: 'echidna', name: 'Echidna Ed', about: 'Spiky outside, soft inside.',
    fur: '#C7A07C', face: '#E9D2B6', ears: 'none', nose: 'long', extra: 'spikes', accent: '#5A4632',
    hellos: ['Ahem. Hello there.', "How ya goin'?"], thanks: ['Not bad at all!', 'Ripper, cheers!'],
  },
  {
    id: 'cockatoo', name: 'Cocky Coco', about: 'Loud. Very loud. Loves yellow.',
    fur: '#F7F5EF', face: '#FFFFFF', ears: 'none', nose: 'beak', extra: 'crest', accent: '#FFD23F',
    hellos: ['SQUAWK! Hello!', 'Hello hello hello!'], thanks: ['SQUAWK! Yummy!', 'Best bowl ever!'],
  },
  {
    id: 'platypus', name: 'Platypus Pat', about: 'Swims all morning. Mixed up but happy.',
    fur: '#7A5230', face: '#A47A55', ears: 'none', nose: 'bill', extra: 'none', accent: '#2F3236',
    hellos: ['Splash! Hi!', "G'day from the creek!"], thanks: ['Fin-tastic! I mean, thanks!', 'Splendid!'],
  },
  {
    id: 'kookaburra', name: 'Kookaburra Kat', about: 'Laughs at everything. Ha ha ha!',
    fur: '#F2E9D8', face: '#FFFFFF', ears: 'none', nose: 'beak', extra: 'stripe', accent: '#5B4A3A',
    hellos: ['Ha ha! Hello!', 'Kook-kook! Hi!'], thanks: ['Ha ha ha! Delicious!', 'Ha! That is great!'],
  },
  {
    id: 'quokka', name: 'Quokka Quinn', about: 'The happiest animal in the world.',
    fur: '#A87E5A', face: '#E6CCAE', ears: 'small', nose: 'button', extra: 'none', accent: '#3B2A1E',
    hellos: ['Hi hi hi!', 'What a lovely day!'], thanks: ['Best day ever!', 'Yay, thank you!'],
  },
  {
    id: 'emu', name: 'Emu Em', about: 'Tall, fast, curious about everything.',
    fur: '#6E6760', face: '#8FB3D9', ears: 'none', nose: 'beak', extra: 'shaggy', accent: '#3B3633',
    hellos: ['Oh! Hello down there!', "G'day, little chef!"], thanks: ['Em-azing!', 'Fair dinkum delicious!'],
  },
]
