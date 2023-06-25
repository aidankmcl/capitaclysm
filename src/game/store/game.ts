import store from 'store';
import { v4 } from 'uuid';

type GameData = {
  id: string;
  created: number;
  playerIDs: string[];
  propertyIDs: string[];
}

const GAME_KEY = 'games';
const ACTIVE_GAME_KEY = `${GAME_KEY}-activeGameID`;

export class GameStore {
  games: GameData[];
  activeGameID: string | undefined;

  constructor() {
    this.games = store.get(GAME_KEY, []);
    this.activeGameID = store.get(ACTIVE_GAME_KEY);
  }

  newGame = () => {
    const game: GameData = {
      id: v4(),
      created: Date.now(),
      playerIDs: [],
      propertyIDs: []
    };

    this.games.push(game);
    store.set(GAME_KEY, this.games);

    this.activeGameID = game.id;
    store.set(ACTIVE_GAME_KEY, game.id);

    return game;
  };

  deleteGame = (gameID: string) => {
    this.games = this.games.filter(game => game.id !== gameID);
    store.set(GAME_KEY, this.games);
  };

  addPlayers = (playerIDs: string[]) => {
    const gameIndex = this.getActiveGameIndex();
    this.games[gameIndex].playerIDs.concat(playerIDs);
    store.set(GAME_KEY, this.games);
  };

  getActiveGameIndex = () => this.games.findIndex(game => game.id === this.activeGameID);
}
