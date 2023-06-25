import { v4 } from 'uuid';

import { LocationType, locations } from '../monopoly/data';

type Owner = {
  playerID: string;
  percentOwnership: number;
}

type LocationData = {
  id: string;
  gameID: string;
  type: LocationType['type'];
  locationIndex: number;
  created: number;
  name: string;
  description: string;
  rent?: number;
  price?: number;
  owners: Owner[];
}

const LOCATION_PREFIX = 'locations';
const getLocationKey = (gameID: string) => `${LOCATION_PREFIX}-${gameID}`;

export class LocationStore {
  locations: LocationData[];
  gameID: string;

  constructor(gameID: string) {
    this.gameID = gameID;
    this.locations = store.get(getLocationKey(gameID), []);
  }

  newGame = (gameID: string) => {
    this.locations = locations.map((location, i) => ({
      id: v4(),
      gameID,
      type: location.type,
      locationIndex: i,
      created: Date.now(),
      name: location.name,
      description: location.description,
      rent: location.type === 'property' ? location.baseRent : 0,
      price: location.value,
      owners: []
    }));

    store.set(getLocationKey(this.gameID), this.locations);

    return this.locations;
  };

  getOwnedProperties = (playerID: string) => {
    return this.locations.filter(location =>
      location.type in ['property', 'special-property'] && location.owners.some(owner => owner.playerID === playerID)
    );
  };
}
