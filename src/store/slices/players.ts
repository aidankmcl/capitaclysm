import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { actions as sharedActions } from "./shared";

import { generateRadialBackground } from "~/utils";

import { actions as stockActions } from "./stocks";
import { locations } from "../../data/locations";

export type PlayerData = {
  id: string;
  created: number;
  name: string;
  active: boolean;
  money: number;
  color: string;
  locationIndex: number;
  icon: "car" | "iron" | "snake";
  ownedPropertyIndices: number[];
}

// Define a type for the slice state
interface PlayerState {
  items: Record<string, PlayerData>;
  playerIDs: string[];
  activePlayerID: string | undefined;
  clientPlayerID: string | undefined;
}

// Define the initial state using that type
const initialState: PlayerState = {
  items: {},
  playerIDs: [],
  activePlayerID: undefined,
  clientPlayerID: undefined
};

const rollDice = (numDice = 2): number => new Array(numDice)
  .fill(0)
  .reduce((acc) => acc + Math.ceil(Math.random() * 6), 0);

export const playerSlice = createSlice({
  name: "players",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(sharedActions.syncState, (state, action) => {
        const payload = action.payload as any;
        // Handle both full state sync and partial updates
        if (payload.players) {
          return {
            ...payload.players,
            clientPlayerID: state.clientPlayerID
          };
        }
        return state; // No players data in partial update
      })
      .addCase(sharedActions.finalizeTrade, (state, action) => {
        const { playerAId, playerBId, playerAItems, playerBItems } = action.payload;

        const playerA = state.items[playerAId];
        const playerB = state.items[playerBId];

        // 1. Handle Money Transfer
        playerA.money = playerA.money - playerAItems.money + playerBItems.money;
        playerB.money = playerB.money - playerBItems.money + playerAItems.money;

        // 2. Handle Property Transfer
        // Remove properties from givers
        playerA.ownedPropertyIndices = playerA.ownedPropertyIndices.filter(
          (index) => !playerAItems.propertyIndices.includes(index)
        );
        playerB.ownedPropertyIndices = playerB.ownedPropertyIndices.filter(
          (index) => !playerBItems.propertyIndices.includes(index)
        );

        // Add properties to receivers
        playerA.ownedPropertyIndices.push(...playerBItems.propertyIndices);
        playerB.ownedPropertyIndices.push(...playerAItems.propertyIndices);
      })
      .addCase(sharedActions.purchaseProperty, (state, action) => {
        const { playerID, price } = action.payload;
        const player = state.items[playerID];
        if (player) {
          player.money -= price;
        }
      })
      .addCase(stockActions.buyStock, (state, action) => {
        const { playerID, shares, price } = action.payload;
        const totalCost = shares * price;
        
        if (state.items[playerID] && state.items[playerID].money >= totalCost) {
          state.items[playerID].money -= totalCost;
          console.log(`Player ${playerID} bought ${shares} shares for $${totalCost}`);
        }
      })
      .addCase(stockActions.sellStock, (state, action) => {
        const { playerID, symbol, shares, price } = action.payload;
        
        const totalProceeds = shares * price;
        
        if (state.items[playerID]) {
          state.items[playerID].money += totalProceeds;
          console.log(`Player ${playerID} sold ${shares} shares of ${symbol} for $${totalProceeds}`);
        }
      });
  },
  reducers: {
    addPlayer: (state, action: PayloadAction<{ connectionID: string, name: string }>) => {
      const { connectionID, name } = action.payload;
    
      const player: PlayerData = {
        id: connectionID,
        created: Date.now(),
        active: true,
        name,
        icon: Math.random() > 0.5 ? "car" : "iron",
        color: generateRadialBackground(),
        money: 1500,
        locationIndex: 0,
        ownedPropertyIndices: []
      };

      state.items[player.id] = player;
      if (!state.playerIDs.includes(player.id)) state.playerIDs.push(player.id);
      if (!state.activePlayerID) state.activePlayerID = player.id;
    },
    togglePlayer: (state, action: PayloadAction<{ connectionID: string, active: boolean }>) => {
      const { connectionID, active } = action.payload;
      if (state.items[connectionID]) {
        state.items[connectionID].active = active;
      }
    },
    setClientPlayer: (state, action: PayloadAction<string>) => {
      const playerID = action.payload;
      state.clientPlayerID = playerID;
    },
    setActivePlayer: (state, action: PayloadAction<string>) => {
      const playerID = action.payload;
      state.activePlayerID = playerID;
    },
    movePlayer: {
      reducer: (state, action: PayloadAction<{ playerID: string, steps: number}>) => {
        const { playerID, steps } = action.payload;
  
        const player = state.items[playerID]; 
        state.items[playerID].locationIndex = ((player.locationIndex + steps) % locations.length);
      },
      prepare: (payload: { playerID: string, steps?: number }) => {
        const steps = payload.steps || rollDice();
        return {
          payload: {
            ...payload,
            steps
          }
        };
      }
    },
    endTurn: (state) => {
      const currentActivePlayerID = state.activePlayerID;
      const activePlayerIndex = state.playerIDs.findIndex(playerID => currentActivePlayerID === playerID);
      const nextPlayerIndex = (activePlayerIndex + 1) % state.playerIDs.length;
      console.log("next player?", currentActivePlayerID, activePlayerIndex, nextPlayerIndex, state.playerIDs);
      state.activePlayerID = state.playerIDs[nextPlayerIndex];
    }
  },
});

export const actions = playerSlice.actions;

export default playerSlice.reducer;
