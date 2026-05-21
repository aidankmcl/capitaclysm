import { Dice5, Play, RotateCcw, ShoppingCart, SkipForward } from 'lucide-react'
import { useMemo, useState } from 'react'

import {
	applyAction,
	createInitialGame,
	getActionPermissions,
	getCurrentPlayer,
	getCurrentTile,
	getPendingPurchase,
	getPropertyForTile,
	type DiceRoll,
	type GameAction,
	type GameState,
	type PlayerState,
} from '#/game-core'

const playerCountOptions = [2, 3, 4] as const

export function LocalGameSandbox() {
	const [playerCount, setPlayerCount] = useState<(typeof playerCountOptions)[number]>(
		2,
	)
	const [gameState, setGameState] = useState<GameState>(() =>
		createInitialGame({
			playerCount: 2,
		}),
	)
	const [lastError, setLastError] = useState<string | null>(null)
	const currentPlayer = getCurrentPlayer(gameState)
	const currentTile = getCurrentTile(gameState)
	const pendingPurchase = getPendingPurchase(gameState)
	const permissions = getActionPermissions(gameState)
	const playersByPosition = useMemo(
		() => groupPlayersByPosition(gameState.players),
		[gameState.players],
	)

	function startLocalGame() {
		setGameState(
			createInitialGame({
				playerCount,
				gameId: `local-${playerCount}-player-sandbox`,
			}),
		)
		setLastError(null)
	}

	function dispatchGameAction(action: GameAction) {
		try {
			setGameState(applyAction(gameState, action))
			setLastError(null)
		} catch (error) {
			setLastError(error instanceof Error ? error.message : 'Action failed.')
		}
	}

	function rollDice() {
		dispatchGameAction({
			type: 'turn/rollDice',
			playerId: currentPlayer.id,
			dice: createLocalDiceRoll(),
		})
	}

	function buyProperty() {
		if (!pendingPurchase) {
			return
		}

		dispatchGameAction({
			type: 'property/buy',
			playerId: currentPlayer.id,
			propertyId: pendingPurchase.id,
		})
	}

	function endTurn() {
		dispatchGameAction({
			type: 'turn/end',
			playerId: currentPlayer.id,
		})
	}

	return (
		<main className="page-wrap px-4 pb-10 pt-10">
			<header className="mb-7 flex flex-col gap-4 border-b border-[var(--line)] pb-5 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<p className="island-kicker mb-2">Local Sandbox</p>
					<h1 className="display-title m-0 text-4xl font-bold text-[var(--sea-ink)]">
						Rent Party Prototype
					</h1>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<div className="flex rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] p-1">
						{playerCountOptions.map((option) => (
							<button
								key={option}
								type="button"
								className={`h-9 min-w-10 rounded-md px-3 text-sm font-bold ${
									playerCount === option
										? 'bg-[var(--sea-ink)] text-white'
										: 'text-[var(--sea-ink-soft)] hover:bg-[var(--link-bg-hover)]'
								}`}
								onClick={() => setPlayerCount(option)}
							>
								{option}
							</button>
						))}
					</div>
					<button
						type="button"
						className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--lagoon-deep)] px-4 text-sm font-bold text-white shadow-sm hover:brightness-105"
						onClick={startLocalGame}
					>
						<Play size={16} aria-hidden="true" />
						Start
					</button>
					<button
						type="button"
						className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] px-4 text-sm font-bold text-[var(--sea-ink)] hover:bg-[var(--link-bg-hover)]"
						onClick={startLocalGame}
					>
						<RotateCcw size={16} aria-hidden="true" />
						Reset
					</button>
				</div>
			</header>

			<section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
				<div className="space-y-5">
					<section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
						<div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
							<div>
								<p className="m-0 text-xs font-bold uppercase text-[var(--kicker)]">
									Current Turn
								</p>
								<h2 className="m-0 text-xl font-extrabold text-[var(--sea-ink)]">
									{currentPlayer.name} at {currentTile.name}
								</h2>
							</div>
							<div className="flex flex-wrap gap-2">
								<button
									type="button"
									className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--sea-ink)] px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
									disabled={!permissions.canRollDice}
									onClick={rollDice}
								>
									<Dice5 size={16} aria-hidden="true" />
									Roll
								</button>
								<button
									type="button"
									className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] px-4 text-sm font-bold text-[var(--sea-ink)] disabled:cursor-not-allowed disabled:opacity-45"
									disabled={!permissions.canBuyProperty}
									onClick={buyProperty}
								>
									<ShoppingCart size={16} aria-hidden="true" />
									Buy
								</button>
								<button
									type="button"
									className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] px-4 text-sm font-bold text-[var(--sea-ink)] disabled:cursor-not-allowed disabled:opacity-45"
									disabled={!permissions.canEndTurn}
									onClick={endTurn}
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

					<section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
						{gameState.board.tiles.map((tile) => {
							const property = getPropertyForTile(gameState, tile.id)
							const tilePlayers = playersByPosition.get(tile.positionIndex) ?? []
							const isCurrentTile = tile.positionIndex === currentPlayer.position

							return (
								<article
									key={tile.id}
									className={`min-h-36 rounded-lg border p-3 ${
										isCurrentTile
											? 'border-[var(--lagoon-deep)] bg-[var(--surface-strong)] shadow-md'
											: 'border-[var(--line)] bg-[var(--surface)]'
									}`}
								>
									<div className="flex items-start justify-between gap-2">
										<div>
											<p className="m-0 text-xs font-bold text-[var(--sea-ink-soft)]">
												#{tile.positionIndex}
											</p>
											<h3 className="m-0 text-sm font-extrabold text-[var(--sea-ink)]">
												{tile.name}
											</h3>
										</div>
										<span className="rounded-md border border-[var(--line)] px-2 py-1 text-[0.68rem] font-bold uppercase text-[var(--sea-ink-soft)]">
											{tile.kind}
										</span>
									</div>

									{property ? (
										<div className="mt-3 text-xs text-[var(--sea-ink-soft)]">
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
						})}
					</section>
				</div>

				<aside className="space-y-5">
					<section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
						<h2 className="m-0 mb-3 text-lg font-extrabold text-[var(--sea-ink)]">
							Players
						</h2>
						<div className="space-y-3">
							{gameState.players.map((player) => (
								<PlayerRow
									key={player.id}
									player={player}
									isCurrent={player.id === currentPlayer.id}
								/>
							))}
						</div>
					</section>

					<section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
						<h2 className="m-0 mb-3 text-lg font-extrabold text-[var(--sea-ink)]">
							Action Log
						</h2>
						<div className="max-h-[28rem] space-y-2 overflow-auto pr-1">
							{gameState.actionLog.length === 0 ? (
								<p className="m-0 text-sm text-[var(--sea-ink-soft)]">
									No actions yet.
								</p>
							) : (
								gameState.actionLog
									.slice()
									.reverse()
									.map((entry) => (
										<div
											key={entry.index}
											className="rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] p-3"
										>
											<p className="m-0 text-xs font-bold text-[var(--kicker)]">
												#{entry.index}
											</p>
											<pre className="m-0 mt-1 whitespace-pre-wrap text-xs text-[var(--sea-ink)]">
												{JSON.stringify(entry.action, null, 2)}
											</pre>
										</div>
									))
							)}
						</div>
					</section>
				</aside>
			</section>
		</main>
	)
}

function StatusCell({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] p-3">
			<p className="m-0 text-xs font-bold uppercase text-[var(--sea-ink-soft)]">
				{label}
			</p>
			<p className="m-0 mt-1 text-sm font-extrabold text-[var(--sea-ink)]">
				{value}
			</p>
		</div>
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
					? 'border-[var(--lagoon-deep)] bg-[var(--surface-strong)]'
					: 'border-[var(--line)] bg-[var(--chip-bg)]'
			}`}
		>
			<div className="flex items-center justify-between gap-3">
				<div className="flex min-w-0 items-center gap-2">
					<span
						className="h-3 w-3 shrink-0 rounded-full"
						style={{ backgroundColor: player.color }}
					/>
					<p className="m-0 truncate text-sm font-extrabold text-[var(--sea-ink)]">
						{player.name}
					</p>
				</div>
				<p className="m-0 text-sm font-bold text-[var(--sea-ink)]">
					${player.money}
				</p>
			</div>
			<p className="m-0 mt-2 text-xs text-[var(--sea-ink-soft)]">
				Position {player.position} · Properties {player.ownedPropertyIds.length}
			</p>
		</div>
	)
}

function createLocalDiceRoll(): DiceRoll {
	return [rollDie(), rollDie()]
}

function rollDie() {
	return Math.floor(Math.random() * 6) + 1
}

function groupPlayersByPosition(players: PlayerState[]) {
	const playersByPosition = new Map<number, PlayerState[]>()

	for (const player of players) {
		const playersAtPosition = playersByPosition.get(player.position) ?? []
		playersByPosition.set(player.position, [...playersAtPosition, player])
	}

	return playersByPosition
}

function formatPhase(phase: GameState['phase']) {
	return phase
		.replace(/([A-Z])/g, ' $1')
		.replace(/^./, (character) => character.toUpperCase())
}

function formatOwner(players: PlayerState[], ownerId: string | null) {
	if (!ownerId) {
		return 'Unowned'
	}

	return players.find((player) => player.id === ownerId)?.name ?? 'Unknown'
}
