import { describe, expect, it } from "vitest";

import {
	applyAction,
	createInitialGame,
	getCurrentPlayer,
	getPendingPurchase,
} from "#/game-core";

import { dallasBoardDefinition, getTileIdForLocation } from "./boardDefinition";
import { locations } from "./locations";
import { waypointData } from "./helpers";

describe("Dallas sample board data", () => {
	it("creates one board tile per Dallas location and route segment", () => {
		expect(dallasBoardDefinition.tiles).toHaveLength(locations.length);
		expect(waypointData.lines).toHaveLength(locations.length);
		expect(dallasBoardDefinition.tiles[0]).toMatchObject({
			kind: "start",
			name: "GO",
			positionIndex: 0,
		});
		expect(dallasBoardDefinition.tiles.at(-1)).toMatchObject({
			name: "Boardwalk",
			positionIndex: locations.length - 1,
		});
	});

	it("keeps duplicate location names addressable with stable unique ids", () => {
		const tileIds = dallasBoardDefinition.tiles.map((tile) => tile.id);
		const propertyIds = dallasBoardDefinition.properties.map(
			(property) => property.id,
		);

		expect(new Set(tileIds).size).toBe(tileIds.length);
		expect(new Set(propertyIds).size).toBe(propertyIds.length);
		expect(tileIds).toContain(getTileIdForLocation(locations[17], 17));
		expect(tileIds).toContain(getTileIdForLocation(locations[33], 33));
	});

	it("maps properties, railroads, and utilities into purchasable game properties", () => {
		const propertyTiles = dallasBoardDefinition.tiles.filter(
			(tile) => tile.kind === "property",
		);

		expect(dallasBoardDefinition.properties).toHaveLength(propertyTiles.length);
		expect(
			dallasBoardDefinition.properties.find(
				(property) => property.name === "Boardwalk",
			),
		).toMatchObject({
			price: 400,
			baseRent: 50,
			groupId: "group-10",
		});
		expect(
			dallasBoardDefinition.properties.find(
				(property) => property.name === "Reading Railroad",
			),
		).toMatchObject({
			price: 200,
			baseRent: 25,
			groupId: "group-1",
		});
		expect(
			dallasBoardDefinition.properties.find(
				(property) => property.name === "Electric Company",
			),
		).toMatchObject({
			price: 150,
			baseRent: 40,
			groupId: "group-2",
		});
	});

	it("can run the local game loop on the Dallas board definition", () => {
		const state = createInitialGame(
			{
				playerCount: 2,
			},
			dallasBoardDefinition,
		);
		const afterRoll = applyAction(state, {
			type: "turn/rollDice",
			playerId: "player-1",
			dice: [3, 3],
		});
		const pendingPurchase = getPendingPurchase(afterRoll);

		expect(pendingPurchase?.name).toBe("Oriental Avenue");
		if (!pendingPurchase) {
			throw new Error("Expected Oriental Avenue to be available for purchase");
		}

		const afterBuy = applyAction(afterRoll, {
			type: "property/buy",
			playerId: "player-1",
			propertyId: pendingPurchase.id,
		});

		expect(getCurrentPlayer(afterBuy).ownedPropertyIds).toEqual([
			pendingPurchase.id,
		]);
	});
});
