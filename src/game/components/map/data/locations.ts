
type LocationType = 'event' | 'property' | 'railroad' | 'utility';
export type IconKey = 'go' | 'community' | 'chance' | 'jail' | 'go-to-jail' | 'free-parking' | 'city-tax' | 'luxury-tax' | 'property' | 'railroad' | 'water-utility' | 'electric-utility';

export type Coordinate = [number, number]; // lat, lon

type Base = {
  name: string;
  type: LocationType;
  description: string;
  icon: IconKey;
  position: Coordinate,
  color: string;
  value?: number;
}

type GameEvent = Base & {
  type: 'event';
}

type Property = Base & {
  type: 'property';
  group: number;
  baseRent: number;
  rent1: number;
  rent2: number;
  rent3: number;
  rent4: number;
  rent5: number;
}

type Railroad = Base & {
  type: 'railroad';
  group: number;
  rent1: number;
  rent2: number;
  rent3: number;
  rent4: number;
}

type Utility = Base & {
  type: 'utility';
  group: number;
  rent1Multiplier: number;
  rent2Multiplier: number;
}

export type Location = GameEvent | Property | Railroad | Utility;

const group8Color = '#FFDC2E';

export const locations: Location[] = [
  {
    name: 'GO',
    type: 'event',
    icon: 'go',
    description: 'COLLECT $200 SALARY AS YOU PASS.',
    position: [32.84144389358572, -96.69918712829472],
    color: '#000',
    value: -200
  },
  {
    name: 'Mediterranean Avenue',
    type: 'property',
    icon: 'property',
    description: '$60',
    position: [32.854, -96.67554017421492],
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
    icon: 'community',
    description: 'FOLLOW INSTRUCTIONS ON TOP CARD',
    position: [32.847, -96.676],
    color: '#5821A6'
  },
  {
    name: 'Baltic Avenue',
    type: 'property',
    icon: 'property',
    description: '$60',
    position: [32.8342353158061, -96.67589630906136],
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
    icon: 'city-tax',
    description: 'Pay $200',
    position: [32.8197146779401, -96.68190549422076],
    color: '#EA302A',
    value: 200
  },
  {
    name: 'Reading Railroad',
    type: 'railroad',
    icon: 'railroad',
    description: '$200',
    position: [32.816, -96.70527772865958],
    color: '#FEBB15',
    value: 200,
    group: 1,
    rent1: 25,
    rent2: 50,
    rent3: 100,
    rent4: 200
  },
  {
    name: 'Oriental Avenue',
    type: 'property',
    icon: 'property',
    description: '$100',
    position: [32.79998679963467, -96.70943545364756],
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
    icon: 'chance',
    description: 'FOLLOW INSTRUCTIONS ON TOP CARD',
    position: [32.80337103208447, -96.69669926169684],
    color: '#5821A6'
  },
  {
    name: 'Vermont Avenue',
    type: 'property',
    icon: 'property',
    description: '$100',
    position: [32.79062796772461, -96.69155248779917],
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
    icon: 'property',
    description: '$120',
    position: [32.787360907269246, -96.71693609039536],
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
    name: 'Jail',
    type: 'event',
    icon: 'jail',
    description: '',
    position: [32.785955998819034, -96.74443270663782],
    color: '#fff',
    value: 0
  },
  {
    name: 'St. Charles Place',
    type: 'property',
    icon: 'property',
    description: '$140',
    position: [32.78965792415137, -96.75373272858596],
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
    type: 'utility',
    icon: 'electric-utility',
    description: '$150',
    position: [32.779585676182165, -96.75137571786499],
    color: '#000',
    value: 150,
    group: 2,
    rent1Multiplier: 4,
    rent2Multiplier: 10
  },
  {
    name: 'States Avenue',
    type: 'property',
    icon: 'property',
    description: '$140',
    position: [32.7730402256438, -96.74751520156862],
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
    icon: 'property',
    description: '$160',
    position: [32.76611297599828, -96.75077226158022],
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
    type: 'railroad',
    icon: 'railroad',
    description: '$200',
    position: [32.765, -96.72032307199436],
    color: '#FEBB15',
    value: 200,
    group: 1,
    rent1: 25,
    rent2: 50,
    rent3: 100,
    rent4: 200
  },
  {
    name: 'St. James Place',
    type: 'property',
    icon: 'property',
    description: '$180',
    position: [32.764341255536436, -96.70045759672442],
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
    icon: 'community',
    description: 'FOLLOW INSTRUCTIONS ON TOP CARD',
    position: [32.77224637102328, -96.69977188110353],
    color: '#5821A6'
  },
  {
    name: 'Tennessee Avenue',
    type: 'property',
    icon: 'property',
    description: '$180',
    position: [32.767797905945464, -96.68343983514943],
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
    icon: 'property',
    description: '$200',
    position: [32.74948074018299, -96.6859062884929],
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
    icon: 'free-parking',
    description: '',
    position: [32.7535312131756, -96.74254849744091],
    color: '#5821A6'
  },
  {
    name: 'Kentucky Avenue',
    type: 'property',
    icon: 'property',
    description: '$220',
    position: [32.75804323503459, -96.77458458825143],
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
    icon: 'chance',
    description: 'FOLLOW INSTRUCTIONS ON TOP CARD',
    position: [32.74656857378066, -96.78905725479127],
    color: '#5821A6'
  },
  {
    name: 'Indiana Avenue',
    type: 'property',
    icon: 'property',
    description: '$220',
    position: [32.75236883270208, -96.80112088987319],
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
    icon: 'property',
    description: '$240',
    position: [32.75305697976702, -96.816360176947],
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
    type: 'railroad',
    icon: 'railroad',
    description: '$200',
    position: [32.78130311007206, -96.76614046096803],
    color: '#FEBB15',
    value: 200,
    group: 1,
    rent1: 25,
    rent2: 50,
    rent3: 100,
    rent4: 200
  },
  {
    name: 'Atlantic Avenue',
    type: 'property',
    icon: 'property',
    description: '$260',
    position: [32.79281213735871, -96.76146268844606],
    color: group8Color,
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
    icon: 'property',
    description: '$260',
    position: [32.8034539563083, -96.74270868301393],
    color: group8Color,
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
    type: 'utility',
    icon: 'water-utility',
    description: '$150',
    position: [32.814142872620586, -96.72736587122796],
    color: '#000',
    value: 150,
    group: 2,
    rent1Multiplier: 4,
    rent2Multiplier: 10
  },
  {
    name: 'Marvin Gardens',
    type: 'property',
    icon: 'property',
    description: '$280',
    position: [32.813605114382774, -96.74336428512862],
    color: group8Color,
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
    icon: 'go-to-jail',
    description: 'Go directly to Jail. Do not pass GO. Do not collect $200.',
    position: [32.79157451341802, -96.80478127449553],
    color: '#FFF'
  },
  {
    name: 'Pacific Avenue',
    type: 'property',
    icon: 'property',
    description: '$300',
    position: [32.804751505079416, -96.79619984096325],
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
    icon: 'property',
    description: '$300',
    position: [32.822907339606004, -96.79485946478111],
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
    icon: 'community',
    description: 'FOLLOW INSTRUCTIONS ON TOP CARD',
    position: [32.81828249290803, -96.811180114746],
    color: '#5821A6'
  },
  {
    name: 'Pennsylvania Avenue',
    type: 'property',
    icon: 'property',
    description: '$320',
    position: [32.849371700881, -96.79345905835048],
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
    type: 'railroad',
    icon: 'railroad',
    description: '$200',
    position: [32.838209837369476, -96.77497617125411],
    color: '#FEBB15',
    value: 200,
    group: 1,
    rent1: 25,
    rent2: 50,
    rent3: 100,
    rent4: 200
  },
  {
    name: 'Chance',
    type: 'event',
    icon: 'chance',
    description: 'FOLLOW INSTRUCTIONS ON TOP CARD',
    position: [32.82381296521746, -96.76995954456181],
    color: '#5821A6'
  },
  {
    name: 'Park Place',
    type: 'property',
    icon: 'property',
    description: '$350',
    position: [32.83437380179909, -96.7273735094769],
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
    icon: 'luxury-tax',
    description: 'Pay $100',
    position: [32.840616479149965, -96.73493895327103],
    color: '#EA302A',
    value: 100
  },
  {
    name: 'Boardwalk',
    type: 'property',
    icon: 'property',
    description: '$400',
    position: [32.849584882579656, -96.73064190777116],
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

type LocationsByName = { [K: string]: Location };

export const locationsByName: { [K: string]: Location } = locations.reduce((acc, next) => {
  acc[next.name] = next;
  return acc;
}, {} as LocationsByName);
