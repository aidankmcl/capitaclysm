import type { GameState, PlayerState } from '#/game-core'

export function groupPlayersByPosition(players: PlayerState[]) {
	const playersByPosition = new Map<number, PlayerState[]>()

	for (const player of players) {
		const playersAtPosition = playersByPosition.get(player.position) ?? []
		playersByPosition.set(player.position, [...playersAtPosition, player])
	}

	return playersByPosition
}

export function formatPhase(phase: GameState['phase']) {
	return phase
		.replace(/([A-Z])/g, ' $1')
		.replace(/^./, (character) => character.toUpperCase())
}

export function formatOwner(players: PlayerState[], ownerId: string | null) {
	if (!ownerId) {
		return 'Unowned'
	}

	return players.find((player) => player.id === ownerId)?.name ?? 'Unknown'
}
