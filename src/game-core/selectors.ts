import type {
	GameState,
	PlayerId,
	PlayerState,
	PropertyId,
	PropertyState,
	TileId,
} from './types'

export type ActionPermissions = {
	canRollDice: boolean
	canBuyProperty: boolean
	canEndTurn: boolean
}

export function getCurrentPlayer(state: GameState): PlayerState {
	return getPlayerById(state, state.currentPlayerId)
}

export function getPlayerById(
	state: GameState,
	playerId: PlayerId,
): PlayerState {
	const player = state.players.find((candidate) => candidate.id === playerId)

	if (!player) {
		throw new Error(`Unknown player: ${playerId}`)
	}

	return player
}

export function getCurrentTile(state: GameState) {
	const currentPlayer = getCurrentPlayer(state)
	const tile = state.board.tiles[currentPlayer.position]

	if (!tile) {
		throw new Error(`No tile at position ${currentPlayer.position}`)
	}

	return tile
}

export function getPropertyById(
	state: GameState,
	propertyId: PropertyId,
): PropertyState {
	const property = state.properties.find(
		(candidate) => candidate.id === propertyId,
	)

	if (!property) {
		throw new Error(`Unknown property: ${propertyId}`)
	}

	return property
}

export function getPropertyForTile(
	state: GameState,
	tileId: TileId,
): PropertyState | null {
	return (
		state.properties.find((property) => property.tileId === tileId) ?? null
	)
}

export function getPendingPurchase(state: GameState): PropertyState | null {
	if (state.phase !== 'waitingForPurchaseDecision') {
		return null
	}

	const tile = getCurrentTile(state)

	if (tile.kind !== 'property') {
		return null
	}

	const property = getPropertyForTile(state, tile.id)

	if (!property || property.ownerId !== null) {
		return null
	}

	const currentPlayer = getCurrentPlayer(state)

	if (currentPlayer.money < property.price) {
		return null
	}

	return property
}

export function getActionPermissions(state: GameState): ActionPermissions {
	return {
		canRollDice: state.phase === 'waitingForRoll',
		canBuyProperty: getPendingPurchase(state) !== null,
		canEndTurn:
			state.phase === 'waitingForPurchaseDecision' || state.phase === 'turnEnd',
	}
}

