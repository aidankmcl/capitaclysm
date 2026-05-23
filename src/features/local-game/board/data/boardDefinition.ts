import type { BoardDefinition, BoardTile } from "#/game-core";

import { locations, type Location } from "./locations";

type PurchasableLocation = Extract<
	Location,
	{ type: "property" | "railroad" | "utility" }
>;

export const dallasBoardDefinition = {
	tiles: locations.map((location, index) => {
		const tileId = getTileIdForLocation(location, index);

		return {
			id: tileId,
			kind: getTileKind(location, index),
			name: location.name,
			positionIndex: index,
			propertyId: isPurchasableLocation(location) ? tileId : undefined,
		};
	}),
	properties: locations.flatMap((location, index) => {
		if (!isPurchasableLocation(location)) {
			return [];
		}

		const propertyId = getTileIdForLocation(location, index);

		return {
			id: propertyId,
			tileId: propertyId,
			name: location.name,
			groupId: `group-${location.group}`,
			price: location.value ?? 0,
			baseRent: getBaseRent(location),
		};
	}),
} satisfies BoardDefinition;

export function getLocationForTile(tile: BoardTile): Location {
	const location = locations[tile.positionIndex];

	if (!location) {
		throw new Error(`No Dallas board location at index ${tile.positionIndex}`);
	}

	return location;
}

export function getTileIdForLocation(
	location: Location,
	positionIndex: number,
): string {
	return `${String(positionIndex).padStart(2, "0")}-${slugify(location.name)}`;
}

function getTileKind(location: Location, index: number): BoardTile["kind"] {
	if (index === 0 || location.icon === "go") {
		return "start";
	}

	return isPurchasableLocation(location) ? "property" : "rest";
}

function isPurchasableLocation(
	location: Location,
): location is PurchasableLocation {
	return (
		location.type === "property" ||
		location.type === "railroad" ||
		location.type === "utility"
	);
}

function getBaseRent(location: PurchasableLocation): number {
	switch (location.type) {
		case "property":
			return location.baseRent;
		case "railroad":
			return location.rent1;
		case "utility":
			return location.rent1Multiplier * 10;
	}
}

function slugify(value: string): string {
	return value
		.toLowerCase()
		.replace(/&/g, " and ")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}
