import type { Coordinate } from "./locations";

import waypointJson from "./route.json";

export type RouteLine = {
	points: Coordinate[];
	color: string;
	type: "event" | "property" | "railroad" | "utility";
	name: string;
};

export type RouteData = {
	lines: RouteLine[];
	bounds: {
		topLeft: Coordinate;
		bottomRight: Coordinate;
	};
};

export const waypointData = waypointJson as RouteData;

export const getCoordsFromLocationIndex = (
	locationIndex: number,
): Coordinate => {
	const routeLine = waypointData.lines[locationIndex];

	if (!routeLine) {
		throw new Error(`No route line at location index ${locationIndex}`);
	}

	const [firstPoint] = routeLine.points;

	if (!firstPoint) {
		throw new Error(`Route line ${locationIndex} has no points`);
	}

	return firstPoint;
};

export const getWaypointsBetweenLocations = (
	startLocationIndex: number,
	endLocationIndex: number,
): Coordinate[] => {
	if (startLocationIndex === endLocationIndex) {
		return [];
	}

	const lines = waypointData.lines;
	const visitedIndexes = getRouteLineIndexesBetween(
		startLocationIndex,
		endLocationIndex,
		lines.length,
	);

	return visitedIndexes.flatMap((index) => lines[index]?.points ?? []);
};

function getRouteLineIndexesBetween(
	startLocationIndex: number,
	endLocationIndex: number,
	lineCount: number,
): number[] {
	const indexes: number[] = [];
	let currentIndex = startLocationIndex;

	while (currentIndex !== endLocationIndex) {
		indexes.push(currentIndex);
		currentIndex = (currentIndex + 1) % lineCount;
	}

	return indexes;
}
