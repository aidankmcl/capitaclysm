import type { PlayerState } from '#/game-core'

type PlayerPanelProps = {
	players: PlayerState[]
	currentPlayerId: string
}

export function PlayerPanel({ players, currentPlayerId }: PlayerPanelProps) {
	return (
		<section className="rounded-lg border border-(--line) bg-(--surface) p-4">
			<h2 className="m-0 mb-3 text-lg font-extrabold text-(--sea-ink)">
				Players
			</h2>
			<div className="space-y-3">
				{players.map((player) => (
					<PlayerRow
						key={player.id}
						player={player}
						isCurrent={player.id === currentPlayerId}
					/>
				))}
			</div>
		</section>
	)
}

function PlayerRow({
	player,
	isCurrent,
}: {
	player: PlayerState
	isCurrent: boolean
}) {
	return (
		<div
			className={`rounded-lg border p-3 ${
				isCurrent
					? 'border-(--lagoon-deep) bg-(--surface-strong)'
					: 'border-(--line) bg-(--chip-bg)'
			}`}
		>
			<div className="flex items-center justify-between gap-3">
				<div className="flex min-w-0 items-center gap-2">
					<span
						className="h-3 w-3 shrink-0 rounded-full"
						style={{ backgroundColor: player.color }}
					/>
					<p className="m-0 truncate text-sm font-extrabold text-(--sea-ink)">
						{player.name}
					</p>
				</div>
				<p className="m-0 text-sm font-bold text-(--sea-ink)">
					${player.money}
				</p>
			</div>
			<p className="m-0 mt-2 text-xs text-(--sea-ink-soft)">
				Position {player.position} · Properties {player.ownedPropertyIds.length}
			</p>
		</div>
	)
}
