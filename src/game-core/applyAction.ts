import { START_BONUS } from './board'
import {
	getCurrentPlayer,
	getCurrentTile,
	getPendingPurchase,
	getPropertyById,
} from './selectors'
import type {
	DiceRoll,
	GameAction,
	GameState,
	PlayerState,
	PropertyState,
	ValidationResult,
} from './types'

export function validateAction(
	state: GameState,
	action: GameAction,
): ValidationResult {
	if (action.playerId !== state.currentPlayerId) {
		return {
			valid: false,
			reason: 'Only the current player can act.',
		}
	}

	switch (action.type) {
		case 'turn/rollDice':
			return validateRollDice(state, action.dice)
		case 'property/buy':
			return validateBuyProperty(state, action.propertyId)
		case 'turn/end':
			return validateEndTurn(state)
	}
}

export function applyAction(state: GameState, action: GameAction): GameState {
	const validation = validateAction(state, action)

	if (!validation.valid) {
		throw new Error(validation.reason)
	}

	const nextState = applyValidatedAction(state, action)

	return {
		...nextState,
		actionIndex: state.actionIndex + 1,
		actionLog: [
			...state.actionLog,
			{
				index: state.actionIndex,
				action,
			},
		],
	}
}

function validateRollDice(
	state: GameState,
	dice: DiceRoll,
): ValidationResult {
	if (state.phase !== 'waitingForRoll') {
		return {
			valid: false,
			reason: 'Dice can only be rolled at the start of a turn.',
		}
	}

	if (!dice.every((die) => Number.isInteger(die) && die >= 1 && die <= 6)) {
		return {
			valid: false,
			reason: 'Dice values must be integers from 1 to 6.',
		}
	}

	return {
		valid: true,
	}
}

function validateBuyProperty(
	state: GameState,
	propertyId: string,
): ValidationResult {
	const pendingPurchase = getPendingPurchase(state)

	if (!pendingPurchase) {
		return {
			valid: false,
			reason: 'There is no available property to buy.',
		}
	}

	if (pendingPurchase.id !== propertyId) {
		return {
			valid: false,
			reason: 'The current player can only buy the property they landed on.',
		}
	}

	return {
		valid: true,
	}
}

function validateEndTurn(state: GameState): ValidationResult {
	if (state.phase !== 'waitingForPurchaseDecision' && state.phase !== 'turnEnd') {
		return {
			valid: false,
			reason: 'The turn cannot end from the current phase.',
		}
	}

	return {
		valid: true,
	}
}

function applyValidatedAction(
	state: GameState,
	action: GameAction,
): GameState {
	switch (action.type) {
		case 'turn/rollDice':
			return applyRollDice(state, action.dice)
		case 'property/buy':
			return applyBuyProperty(state, action.propertyId)
		case 'turn/end':
			return applyEndTurn(state)
	}
}

function applyRollDice(state: GameState, dice: DiceRoll): GameState {
	const currentPlayer = getCurrentPlayer(state)
	const total = dice[0] + dice[1]
	const boardSize = state.board.tiles.length
	const toPosition = (currentPlayer.position + total) % boardSize
	const passedStart = currentPlayer.position + total >= boardSize
	const movedPlayer = {
		...currentPlayer,
		position: toPosition,
		money: currentPlayer.money + (passedStart ? START_BONUS : 0),
	}
	const movedState = {
		...state,
		players: replacePlayer(state.players, movedPlayer),
		lastRoll: {
			playerId: currentPlayer.id,
			dice,
			total,
			fromPosition: currentPlayer.position,
			toPosition,
			passedStart,
		},
	}
	const landedTile = getCurrentTile(movedState)
	const landedProperty =
		landedTile.kind === 'property'
			? movedState.properties.find(
					(property) => property.tileId === landedTile.id,
				)
			: null

	return {
		...movedState,
		phase:
			landedProperty?.ownerId === null
				? 'waitingForPurchaseDecision'
				: 'turnEnd',
	}
}

function applyBuyProperty(
	state: GameState,
	propertyId: string,
): GameState {
	const currentPlayer = getCurrentPlayer(state)
	const property = getPropertyById(state, propertyId)
	const nextPlayer = {
		...currentPlayer,
		money: currentPlayer.money - property.price,
		ownedPropertyIds: [...currentPlayer.ownedPropertyIds, property.id],
	}
	const nextProperty = {
		...property,
		ownerId: currentPlayer.id,
	}

	return {
		...state,
		phase: 'turnEnd',
		players: replacePlayer(state.players, nextPlayer),
		properties: replaceProperty(state.properties, nextProperty),
	}
}

function applyEndTurn(state: GameState): GameState {
	const currentPlayer = getCurrentPlayer(state)
	const nextPlayerIndex =
		(currentPlayer.turnOrderIndex + 1) % state.players.length
	const nextPlayer = state.players.find(
		(player) => player.turnOrderIndex === nextPlayerIndex,
	)

	if (!nextPlayer) {
		throw new Error(`No player at turn order index ${nextPlayerIndex}`)
	}

	return {
		...state,
		phase: 'waitingForRoll',
		currentPlayerId: nextPlayer.id,
		lastRoll: null,
	}
}

function replacePlayer(
	players: PlayerState[],
	nextPlayer: PlayerState,
): PlayerState[] {
	return players.map((player) =>
		player.id === nextPlayer.id ? nextPlayer : player,
	)
}

function replaceProperty(
	properties: PropertyState[],
	nextProperty: PropertyState,
): PropertyState[] {
	return properties.map((property) =>
		property.id === nextProperty.id ? nextProperty : property,
	)
}
