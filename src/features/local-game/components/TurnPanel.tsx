import { Dice5, ShoppingCart, SkipForward } from 'lucide-react'

import type { BoardTile, GameState, PlayerState, PropertyState } from '#/game-core'

import { formatPhase } from '../localGameView'

type TurnPermissions = {
	canRollDice: boolean
	canBuyProperty: boolean
	canEndTurn: boolean
}

type TurnPanelProps = {
	gameState: GameState
	currentPlayer: PlayerState
	currentTile: BoardTile
	pendingPurchase: PropertyState | null
	permissions: TurnPermissions
	lastError: string | null
	onRollDice: () => void
	onBuyProperty: () => void
	onEndTurn: () => void
}

export function TurnPanel({
	gameState,
	currentPlayer,
	currentTile,
	pendingPurchase,
	permissions,
	lastError,
	onRollDice,
	onBuyProperty,
	onEndTurn,
}: TurnPanelProps) {
	return (
		<section className="rounded-lg border border-(--line) bg-(--surface) p-4">
			<div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<div>
					<p className="m-0 text-xs font-bold uppercase text-(--kicker)">
						Current Turn
					</p>
					<h2 className="m-0 text-xl font-extrabold text-(--sea-ink)">
						{currentPlayer.name} at {currentTile.name}
					</h2>
				</div>
				<div className="flex flex-wrap gap-2">
					<button
						type="button"
						className="inline-flex h-10 items-center gap-2 rounded-lg bg-(--sea-ink) px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
						disabled={!permissions.canRollDice}
						onClick={onRollDice}
					>
						<Dice5 size={16} aria-hidden="true" />
						Roll
					</button>
					<button
						type="button"
						className="inline-flex h-10 items-center gap-2 rounded-lg border border-(--line) bg-(--chip-bg) px-4 text-sm font-bold text-(--sea-ink) disabled:cursor-not-allowed disabled:opacity-45"
						disabled={!permissions.canBuyProperty}
						onClick={onBuyProperty}
					>
						<ShoppingCart size={16} aria-hidden="true" />
						Buy
					</button>
					<button
						type="button"
						className="inline-flex h-10 items-center gap-2 rounded-lg border border-(--line) bg-(--chip-bg) px-4 text-sm font-bold text-(--sea-ink) disabled:cursor-not-allowed disabled:opacity-45"
						disabled={!permissions.canEndTurn}
						onClick={onEndTurn}
					>
						<SkipForward size={16} aria-hidden="true" />
						End
					</button>
				</div>
			</div>

			<div className="grid gap-3 sm:grid-cols-3">
				<StatusCell label="Phase" value={formatPhase(gameState.phase)} />
				<StatusCell
					label="Last Roll"
					value={
						gameState.lastRoll
							? `${gameState.lastRoll.dice[0]} + ${gameState.lastRoll.dice[1]}`
							: 'None'
					}
				/>
				<StatusCell
					label="Purchase"
					value={
						pendingPurchase
							? `${pendingPurchase.name} $${pendingPurchase.price}`
							: 'None'
					}
				/>
			</div>
			{lastError ? (
				<p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">
					{lastError}
				</p>
			) : null}
		</section>
	)
}

function StatusCell({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-lg border border-(--line) bg-(--chip-bg) p-3">
			<p className="m-0 text-xs font-bold uppercase text-(--sea-ink-soft)">
				{label}
			</p>
			<p className="m-0 mt-1 text-sm font-extrabold text-(--sea-ink)">
				{value}
			</p>
		</div>
	)
}
