import {
	getPropertyForTile,
	type BoardTile,
	type GameState,
	type PlayerState,
} from '#/game-core'

import { formatOwner } from '../localGameView'

type BoardGridProps = {
	gameState: GameState
	currentPlayer: PlayerState
	playersByPosition: ReadonlyMap<number, PlayerState[]>
}

export function BoardGrid({
	gameState,
	currentPlayer,
	playersByPosition,
}: BoardGridProps) {
	return (
		<section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
			{gameState.board.tiles.map((tile) => (
				<BoardTileCard
					key={tile.id}
					tile={tile}
					gameState={gameState}
					tilePlayers={playersByPosition.get(tile.positionIndex) ?? []}
					isCurrentTile={tile.positionIndex === currentPlayer.position}
				/>
			))}
		</section>
	)
}

type BoardTileCardProps = {
	tile: BoardTile
	gameState: GameState
	tilePlayers: PlayerState[]
	isCurrentTile: boolean
}

function BoardTileCard({
	tile,
	gameState,
	tilePlayers,
	isCurrentTile,
}: BoardTileCardProps) {
	const property = getPropertyForTile(gameState, tile.id)

	return (
		<article
			className={`min-h-36 rounded-lg border p-3 ${
				isCurrentTile
					? 'border-(--lagoon-deep) bg-(--surface-strong) shadow-md'
					: 'border-(--line) bg-(--surface)'
			}`}
		>
			<div className="flex items-start justify-between gap-2">
				<div>
					<p className="m-0 text-xs font-bold text-(--sea-ink-soft)">
						#{tile.positionIndex}
					</p>
					<h3 className="m-0 text-sm font-extrabold text-(--sea-ink)">
						{tile.name}
					</h3>
				</div>
				<span className="rounded-md border border-(--line) px-2 py-1 text-[0.68rem] font-bold uppercase text-(--sea-ink-soft)">
					{tile.kind}
				</span>
			</div>

			{property ? (
				<div className="mt-3 text-xs text-(--sea-ink-soft)">
					<p className="m-0">Price ${property.price}</p>
					<p className="m-0">
						Owner {formatOwner(gameState.players, property.ownerId)}
					</p>
				</div>
			) : null}

			<div className="mt-4 flex flex-wrap gap-1">
				{tilePlayers.map((player) => (
					<span
						key={player.id}
						className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border-2 border-white px-2 text-xs font-black text-white shadow-sm"
						style={{ backgroundColor: player.color }}
						title={player.name}
					>
						{player.name.slice(0, 1)}
					</span>
				))}
			</div>
		</article>
	)
}
