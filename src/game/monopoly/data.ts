
type GameEvent = {
  name: string;
  type: 'event';
  description: string;
  color: string;
  value?: number;
}

type Property = {
  name: string;
  type: 'property';
  description: string;
  color: string;
  value: number;
  group: number;
  baseRent: number;
  rent1: number;
  rent2: number;
  rent3: number;
  rent4: number;
  rent5: number;
}

type SpecialProperty = {
  name: string;
  type: 'special-property';
  description: string;
  color: string;
  value: number;
  group: number;
}

export type LocationType = GameEvent | Property | SpecialProperty;

// type SquareType
export const locations: LocationType[] = [
  {
    name: 'GO',
    type: 'event',
    description: 'COLLECT $200 SALARY AS YOU PASS.',
    color: '#FFFFFF',
    value: 200
  },
  {
    name: 'Mediterranean Avenue',
    type: 'property',
    description: '$60',
    color: '#8B4513',
    value: 60,
    group: 3,
    baseRent: 2,
    rent1: 10,
    rent2: 30,
    rent3: 90,
    rent4: 160,
    rent5: 250
  },
  {
    name: 'Community Chest',
    type: 'event',
    description: 'FOLLOW INSTRUCTIONS ON TOP CARD',
    color: '#FFFFFF'
  },
  {
    name: 'Baltic Avenue',
    type: 'property',
    description: '$60',
    color: '#8B4513',
    value: 60,
    group: 3,
    baseRent: 4,
    rent1: 20,
    rent2: 60,
    rent3: 180,
    rent4: 320,
    rent5: 450
  },
  {
    name: 'City Tax',
    type: 'event',
    description: 'Pay $200',
    color: '#FFFFFF',
    value: -200
  },
  {
    name: 'Reading Railroad',
    type: 'special-property',
    description: '$200',
    color: '#FFFFFF',
    value: 200,
    group: 1
  },
  {
    name: 'Oriental Avenue',
    type: 'property',
    description: '$100',
    color: '#87CEEB',
    value: 100,
    group: 4,
    baseRent: 6,
    rent1: 30,
    rent2: 90,
    rent3: 270,
    rent4: 400,
    rent5: 550
  },
  {
    name: 'Chance',
    type: 'event',
    description: 'FOLLOW INSTRUCTIONS ON TOP CARD',
    color: '#FFFFFF'
  },
  {
    name: 'Vermont Avenue',
    type: 'property',
    description: '$100',
    color: '#87CEEB',
    value: 100,
    group: 4,
    baseRent: 6,
    rent1: 30,
    rent2: 90,
    rent3: 270,
    rent4: 400,
    rent5: 550
  },
  {
    name: 'Connecticut Avenue',
    type: 'property',
    description: '$120',
    color: '#87CEEB',
    value: 120,
    group: 4,
    baseRent: 8,
    rent1: 40,
    rent2: 100,
    rent3: 300,
    rent4: 450,
    rent5: 600
  },
  {
    name: 'Just Visiting',
    type: 'event',
    description: '',
    color: '#FFFFFF',
    value: 0
  },
  {
    name: 'St. Charles Place',
    type: 'property',
    description: '$140',
    color: '#FF0080',
    value: 140,
    group: 5,
    baseRent: 10,
    rent1: 50,
    rent2: 150,
    rent3: 450,
    rent4: 625,
    rent5: 750
  },
  {
    name: 'Electric Company',
    type: 'special-property',
    description: '$150',
    color: '#FFFFFF',
    value: 150,
    group: 2
  },
  {
    name: 'States Avenue',
    type: 'property',
    description: '$140',
    color: '#FF0080',
    value: 140,
    group: 5,
    baseRent: 10,
    rent1: 50,
    rent2: 150,
    rent3: 450,
    rent4: 625,
    rent5: 750
  },
  {
    name: 'Virginia Avenue',
    type: 'property',
    description: '$160',
    color: '#FF0080',
    value: 160,
    group: 5,
    baseRent: 12,
    rent1: 60,
    rent2: 180,
    rent3: 500,
    rent4: 700,
    rent5: 900
  },
  {
    name: 'Pennsylvania Railroad',
    type: 'special-property',
    description: '$200',
    color: '#FFFFFF',
    value: 200,
    group: 1
  },
  {
    name: 'St. James Place',
    type: 'property',
    description: '$180',
    color: '#FFA500',
    value: 180,
    group: 6,
    baseRent: 14,
    rent1: 70,
    rent2: 200,
    rent3: 550,
    rent4: 750,
    rent5: 950
  },
  {
    name: 'Community Chest',
    type: 'event',
    description: 'FOLLOW INSTRUCTIONS ON TOP CARD',
    color: '#FFFFFF'
  },
  {
    name: 'Tennessee Avenue',
    type: 'property',
    description: '$180',
    color: '#FFA500',
    value: 180,
    group: 6,
    baseRent: 14,
    rent1: 70,
    rent2: 200,
    rent3: 550,
    rent4: 750,
    rent5: 950
  },
  {
    name: 'New York Avenue',
    type: 'property',
    description: '$200',
    color: '#FFA500',
    value: 200,
    group: 6,
    baseRent: 16,
    rent1: 80,
    rent2: 220,
    rent3: 600,
    rent4: 800,
    rent5: 1000
  },
  {
    name: 'Free Parking',
    type: 'event',
    description: '',
    color: '#FFFFFF'
  },
  {
    name: 'Kentucky Avenue',
    type: 'property',
    description: '$220',
    color: '#FF0000',
    value: 220,
    group: 7,
    baseRent: 18,
    rent1: 90,
    rent2: 250,
    rent3: 700,
    rent4: 875,
    rent5: 1050
  },
  {
    name: 'Chance',
    type: 'event',
    description: 'FOLLOW INSTRUCTIONS ON TOP CARD',
    color: '#FFFFFF'
  },
  {
    name: 'Indiana Avenue',
    type: 'property',
    description: '$220',
    color: '#FF0000',
    value: 220,
    group: 7,
    baseRent: 18,
    rent1: 90,
    rent2: 250,
    rent3: 700,
    rent4: 875,
    rent5: 1050
  },
  {
    name: 'Illinois Avenue',
    type: 'property',
    description: '$240',
    color: '#FF0000',
    value: 240,
    group: 7,
    baseRent: 20,
    rent1: 100,
    rent2: 300,
    rent3: 750,
    rent4: 925,
    rent5: 1100
  },
  {
    name: 'B&O Railroad',
    type: 'special-property',
    description: '$200',
    color: '#FFFFFF',
    value: 200,
    group: 1
  },
  {
    name: 'Atlantic Avenue',
    type: 'property',
    description: '$260',
    color: '#FFFF00',
    value: 260,
    group: 8,
    baseRent: 22,
    rent1: 110,
    rent2: 330,
    rent3: 800,
    rent4: 975,
    rent5: 1150
  },
  {
    name: 'Ventnor Avenue',
    type: 'property',
    description: '$260',
    color: '#FFFF00',
    value: 260,
    group: 8,
    baseRent: 22,
    rent1: 110,
    rent2: 330,
    rent3: 800,
    rent4: 975,
    rent5: 1150
  },
  {
    name: 'Water Works',
    type: 'special-property',
    description: '$150',
    color: '#FFFFFF',
    value: 150,
    group: 2
  },
  {
    name: 'Marvin Gardens',
    type: 'property',
    description: '$280',
    color: '#FFFF00',
    value: 280,
    group: 8,
    baseRent: 24,
    rent1: 120,
    rent2: 360,
    rent3: 850,
    rent4: 1025,
    rent5: 1200
  },
  {
    name: 'Go to Jail',
    type: 'event',
    description: 'Go directly to Jail. Do not pass GO. Do not collect $200.',
    color: '#FFFFFF'
  },
  {
    name: 'Pacific Avenue',
    type: 'property',
    description: '$300',
    color: '#008000',
    value: 300,
    group: 9,
    baseRent: 26,
    rent1: 130,
    rent2: 390,
    rent3: 900,
    rent4: 1100,
    rent5: 1275
  },
  {
    name: 'North Carolina Avenue',
    type: 'property',
    description: '$300',
    color: '#008000',
    value: 300,
    group: 9,
    baseRent: 26,
    rent1: 130,
    rent2: 390,
    rent3: 900,
    rent4: 1100,
    rent5: 1275
  },
  {
    name: 'Community Chest',
    type: 'event',
    description: 'FOLLOW INSTRUCTIONS ON TOP CARD',
    color: '#FFFFFF'
  },
  {
    name: 'Pennsylvania Avenue',
    type: 'property',
    description: '$320',
    color: '#008000',
    value: 320,
    group: 9,
    baseRent: 28,
    rent1: 150,
    rent2: 450,
    rent3: 1000,
    rent4: 1200,
    rent5: 1400
  },
  {
    name: 'Short Line',
    type: 'special-property',
    description: '$200',
    color: '#FFFFFF',
    value: 200,
    group: 1
  },
  {
    name: 'Chance',
    type: 'event',
    description: 'FOLLOW INSTRUCTIONS ON TOP CARD',
    color: '#FFFFFF'
  },
  {
    name: 'Park Place',
    type: 'property',
    description: '$350',
    color: '#0000FF',
    value: 350,
    group: 10,
    baseRent: 35,
    rent1: 175,
    rent2: 500,
    rent3: 1100,
    rent4: 1300,
    rent5: 1500
  },
  {
    name: 'LUXURY TAX',
    type: 'event',
    description: 'Pay $100',
    color: '#FFFFFF'
  },
  {
    name: 'Boardwalk',
    type: 'property',
    description: '$400',
    color: '#0000FF',
    value: 400,
    group: 10,
    baseRent: 50,
    rent1: 200,
    rent2: 600,
    rent3: 1400,
    rent4: 1700,
    rent5: 2000
  },
];
