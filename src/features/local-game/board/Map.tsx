import { lazy, Suspense, useEffect, useState } from "react";

import {
	getPropertyForTile,
	type BoardTile,
	type GameState,
	type PlayerState,
} from "#/game-core";

import { formatOwner } from "../localGameView";
import { getLocationForTile } from "./data";

const LeafletBoardMap = lazy(() =>
	import("./LeafletBoardMap").then((module) => ({
		default: module.LeafletBoardMap,
	})),
);

export type DallasRouteMapProps = {
	gameState: GameState;
	currentPlayer: PlayerState;
	playersByPosition: ReadonlyMap<number, PlayerState[]>;
};

export function DallasRouteMap({
	gameState,
	currentPlayer,
	playersByPosition,
}: DallasRouteMapProps) {
	const isClient = useIsClient();
	const currentTile = gameState.board.tiles[currentPlayer.position];

	if (!currentTile) {
		throw new Error(`No tile at position ${currentPlayer.position}`);
	}

	const currentLocation = getLocationForTile(currentTile);
	const currentProperty = getPropertyForTile(gameState, currentTile.id);
	const currentTilePlayers =
		playersByPosition.get(currentTile.positionIndex) ?? [];

	return (
		<section className="overflow-hidden rounded-lg border border-(--line) bg-(--surface)">
			<div className="flex flex-col gap-3 border-b border-(--line) p-4 md:flex-row md:items-end md:justify-between">
				<div>
					<p className="m-0 text-xs font-bold uppercase text-(--kicker)">
						Dallas Route
					</p>
					<h2 className="m-0 text-2xl font-extrabold text-(--sea-ink)">
						{currentPlayer.name} is at {currentTile.name}
					</h2>
				</div>
				<div className="flex flex-wrap gap-2 text-xs font-bold uppercase text-(--sea-ink-soft)">
					<span className="rounded-md border border-(--line) bg-(--chip-bg) px-2 py-1">
						Stop {currentTile.positionIndex + 1}/{gameState.board.tiles.length}
					</span>
					<span className="rounded-md border border-(--line) bg-(--chip-bg) px-2 py-1">
						Ride hop{" "}
						{gameState.lastRoll
							? `${gameState.lastRoll.fromPosition + 1} -> ${
									gameState.lastRoll.toPosition + 1
								}`
							: "ready"}
					</span>
				</div>
			</div>

			<div className="h-[560px] overflow-hidden bg-[#edf3f1] sm:h-[620px]">
				{isClient ? (
					<Suspense fallback={<MapLoading />}>
						<LeafletBoardMap
							gameState={gameState}
							currentPlayer={currentPlayer}
							playersByPosition={playersByPosition}
						/>
					</Suspense>
				) : (
					<MapLoading />
				)}
			</div>

			<MapStopDetails
				currentLocationType={currentLocation.type}
				currentPropertyValue={
					currentProperty ? `$${currentProperty.price}` : currentLocation.type
				}
				currentTile={currentTile}
				description={currentLocation.description || "Short-stay stop"}
				owner={
					currentProperty
						? formatOwner(gameState.players, currentProperty.ownerId)
						: "None"
				}
				playersHere={
					currentTilePlayers.length
						? currentTilePlayers.map((player) => player.name).join(", ")
						: "None"
				}
			/>
		</section>
	);
}

function MapStopDetails({
	currentLocationType,
	currentPropertyValue,
	currentTile,
	description,
	owner,
	playersHere,
}: {
	currentLocationType: string;
	currentPropertyValue: string;
	currentTile: BoardTile;
	description: string;
	owner: string;
	playersHere: string;
}) {
	return (
		<div className="grid gap-4 border-t border-(--line) p-4 md:grid-cols-[minmax(0,1.5fr)_minmax(220px,0.8fr)]">
			<div>
				<p className="m-0 text-xs font-bold uppercase text-(--sea-ink-soft)">
					Current stop
				</p>
				<h3 className="m-0 mt-1 text-lg font-extrabold text-(--sea-ink)">
					{currentTile.name}
				</h3>
				<p className="m-0 mt-1 text-sm text-(--sea-ink-soft)">{description}</p>
			</div>

			<div className="grid gap-2 text-sm text-(--sea-ink-soft)">
				<DetailRow label="Value" value={currentPropertyValue} />
				<DetailRow label="Owner" value={owner} />
				<DetailRow label="Players here" value={playersHere} />
				<DetailRow label="Stop type" value={currentLocationType} />
			</div>
		</div>
	);
}

function DetailRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between gap-3 border-b border-(--line) pb-2 last:border-b-0 last:pb-0">
			<span className="font-bold uppercase">{label}</span>
			<span className="text-right font-extrabold text-(--sea-ink)">
				{value}
			</span>
		</div>
	);
}

function MapLoading() {
	return (
		<div className="flex h-full items-center justify-center bg-[#edf3f1] text-sm font-bold text-(--sea-ink-soft)">
			Loading Dallas map...
		</div>
	);
}

function useIsClient() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return isClient;
}
