import "leaflet/dist/leaflet.css";

import { divIcon } from "leaflet";
import {
	CircleMarker,
	MapContainer,
	Marker,
	Polyline,
	Popup,
	TileLayer,
} from "react-leaflet";

import {
	getPropertyForTile,
	type BoardTile,
	type PlayerState,
} from "#/game-core";

import { formatOwner } from "../localGameView";
import {
	getLocationForTile,
	getWaypointsBetweenLocations,
	type Coordinate,
	type Location,
	waypointData,
} from "./data";
import type { DallasRouteMapProps } from "./Map";

const DALLAS_CENTER: Coordinate = [32.8, -96.755];
const ROUTE_BOUNDS: [Coordinate, Coordinate] = [
	[
		waypointData.bounds.topLeft[0] + 0.006,
		waypointData.bounds.topLeft[1] - 0.008,
	],
	[
		waypointData.bounds.bottomRight[0] - 0.006,
		waypointData.bounds.bottomRight[1] + 0.008,
	],
];
const DEFAULT_ROUTE_COLOR = "#5f6f78";

export function LeafletBoardMap({
	gameState,
	currentPlayer,
	playersByPosition,
}: DallasRouteMapProps) {
	const lastTripPoints = gameState.lastRoll
		? getWaypointsBetweenLocations(
				gameState.lastRoll.fromPosition,
				gameState.lastRoll.toPosition,
			)
		: [];

	return (
		<MapContainer
			attributionControl={false}
			bounds={ROUTE_BOUNDS}
			center={DALLAS_CENTER}
			className="h-full w-full"
			maxBounds={ROUTE_BOUNDS}
			maxBoundsViscosity={0.7}
			maxZoom={17}
			minZoom={11}
			scrollWheelZoom
			zoomSnap={0.25}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				maxNativeZoom={19}
        url="http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
			/>

			{gameState.board.tiles.map((tile) => {
				const line = waypointData.lines[tile.positionIndex];

				return line ? (
					<Polyline
						key={`${tile.id}-route-base`}
						pathOptions={{
							color: "#ffffff",
							opacity: 0.88,
							weight: 13,
						}}
						positions={line.points}
					/>
				) : null;
			})}

			{gameState.board.tiles.map((tile) => {
				const line = waypointData.lines[tile.positionIndex];

				return line ? (
					<Polyline
						key={`${tile.id}-route`}
						pathOptions={{
							color: getRouteColor(tile.positionIndex),
							lineCap: "round",
							lineJoin: "round",
							opacity: 0.86,
							weight: 7,
						}}
						positions={line.points}
					/>
				) : null;
			})}

			{lastTripPoints.length ? (
				<Polyline
					pathOptions={{
						color: currentPlayer.color,
						dashArray: "12 10",
						lineCap: "round",
						lineJoin: "round",
						opacity: 0.95,
						weight: 8,
					}}
					positions={lastTripPoints}
				/>
			) : null}

			{gameState.board.tiles.map((tile) => (
				<LocationMarker
					key={tile.id}
					currentPlayer={currentPlayer}
					gameState={gameState}
					isCurrent={tile.positionIndex === currentPlayer.position}
					tile={tile}
				/>
			))}

			{gameState.players.map((player) => (
				<PlayerMarker
					key={player.id}
					isCurrent={player.id === currentPlayer.id}
					player={player}
					playersAtPosition={playersByPosition.get(player.position) ?? []}
					tile={gameState.board.tiles[player.position]}
				/>
			))}
		</MapContainer>
	);
}

function LocationMarker({
	currentPlayer,
	gameState,
	isCurrent,
	tile,
}: {
	currentPlayer: PlayerState;
	gameState: DallasRouteMapProps["gameState"];
	isCurrent: boolean;
	tile: BoardTile;
}) {
	const location = getLocationForTile(tile);
	const property = getPropertyForTile(gameState, tile.id);
	const color = normalizeMarkerColor(location.color);

	return (
		<CircleMarker
			center={location.position}
			pathOptions={{
				color: isCurrent ? currentPlayer.color : "#ffffff",
				fillColor: color,
				fillOpacity: 0.94,
				opacity: 1,
				weight: isCurrent ? 4 : 2,
			}}
			radius={isCurrent ? 10 : 7}
		>
			<Popup>
				<div className="min-w-44">
					<p className="m-0 text-xs font-bold uppercase text-(--sea-ink-soft)">
						Stop {tile.positionIndex + 1}
					</p>
					<h3 className="m-0 mt-1 text-base font-extrabold text-(--sea-ink)">
						{location.name}
					</h3>
					<p className="m-0 mt-1 text-sm text-(--sea-ink-soft)">
						{location.description || location.type}
					</p>
					{property ? (
						<div className="mt-2 text-sm text-(--sea-ink-soft)">
							<p className="m-0">Value ${property.price}</p>
							<p className="m-0">
								Owner {formatOwner(gameState.players, property.ownerId)}
							</p>
						</div>
					) : null}
				</div>
			</Popup>
		</CircleMarker>
	);
}

function PlayerMarker({
	isCurrent,
	player,
	playersAtPosition,
	tile,
}: {
	isCurrent: boolean;
	player: PlayerState;
	playersAtPosition: PlayerState[];
	tile: BoardTile | undefined;
}) {
	if (!tile) {
		return null;
	}

	const location = getLocationForTile(tile);
	const playerIndex = Math.max(
		0,
		playersAtPosition.findIndex((candidate) => candidate.id === player.id),
	);
	const offset = getStackOffset(playerIndex, playersAtPosition.length);

	return (
		<Marker
			icon={createPlayerIcon(player, isCurrent, offset)}
			position={location.position}
			zIndexOffset={isCurrent ? 900 : 700}
		>
			<Popup>{player.name}</Popup>
		</Marker>
	);
}

function getRouteColor(index: number): string {
	const line = waypointData.lines[index];
	const nextLine = waypointData.lines[(index + 1) % waypointData.lines.length];
	const followingLine =
		waypointData.lines[(index + 2) % waypointData.lines.length];

	if (!line) {
		return DEFAULT_ROUTE_COLOR;
	}

	if (line.type === "property") {
		if (nextLine?.type === "property") {
			return line.color;
		}

		if (
			followingLine?.type === "property" &&
			followingLine.color === line.color
		) {
			return line.color;
		}
	}

	if (line.type === "railroad") {
		return "#c58a12";
	}

	return DEFAULT_ROUTE_COLOR;
}

function createPlayerIcon(
	player: PlayerState,
	isCurrent: boolean,
	offset: { x: number; y: number },
) {
	const ring = isCurrent ? "0 0 0 4px rgba(255, 255, 255, 0.72)," : "";

	return divIcon({
		className: "",
		html: `<div style="${[
			"align-items:center",
			`background:${player.color}`,
			"border:2px solid white",
			"border-radius:999px",
			`box-shadow:${ring}0 10px 24px rgba(23,58,64,0.28)`,
			"box-sizing:border-box",
			"color:white",
			"display:flex",
			"font-family:Manrope,ui-sans-serif,system-ui,sans-serif",
			"font-size:13px",
			"font-weight:900",
			"height:34px",
			"justify-content:center",
			"line-height:1",
			`transform:translate(${offset.x}px, ${offset.y}px)`,
			"width:34px",
		].join(";")}">${escapeHtml(player.name.slice(0, 1))}</div>`,
		iconAnchor: [17, 17],
		iconSize: [34, 34],
		popupAnchor: [0, -18],
	});
}

function getStackOffset(index: number, total: number) {
	if (total <= 1) {
		return { x: 0, y: -22 };
	}

	const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
	const radius = 20;

	return {
		x: Math.cos(angle) * radius,
		y: Math.sin(angle) * radius - 22,
	};
}

function normalizeMarkerColor(color: Location["color"]): string {
	return color.toLowerCase() === "#fff" ? "#ffffff" : color;
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}
