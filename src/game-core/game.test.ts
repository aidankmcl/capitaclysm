import { describe, expect, it } from 'vitest'

import {
	STARTING_MONEY,
	applyAction,
	createInitialGame,
	getCurrentPlayer,
	getPendingPurchase,
	getPropertyById,
} from './index'

describe('local board game core', () => {
	it('creates an initial local game with fake players and board state', () => {
		const state = createInitialGame({
			playerCount: 3,
			gameId: 'test-game',
		})

		expect(state.id).toBe('test-game')
		expect(state.phase).toBe('waitingForRoll')
		expect(state.players).toHaveLength(3)
		expect(state.players[0]).toMatchObject({
			id: 'player-1',
			position: 0,
			money: STARTING_MONEY,
			ownedPropertyIds: [],
		})
		expect(state.currentPlayerId).toBe('player-1')
		expect(state.board.tiles.length).toBeGreaterThan(0)
		expect(state.properties.length).toBeGreaterThan(0)
		expect(state.actionLog).toEqual([])
	})

	it('moves the current player when dice are rolled', () => {
		const state = createInitialGame({
			playerCount: 2,
		})
		const nextState = applyAction(state, {
			type: 'turn/rollDice',
			playerId: 'player-1',
			dice: [1, 1],
		})

		expect(getCurrentPlayer(nextState).position).toBe(2)
		expect(nextState.lastRoll).toMatchObject({
			playerId: 'player-1',
			total: 2,
			fromPosition: 0,
			toPosition: 2,
		})
		expect(nextState.phase).toBe('waitingForPurchaseDecision')
		expect(nextState.actionLog).toHaveLength(1)
	})

	it('lets the current player buy an unowned property they landed on', () => {
		const state = createInitialGame({
			playerCount: 2,
		})
		const afterRoll = applyAction(state, {
			type: 'turn/rollDice',
			playerId: 'player-1',
			dice: [1, 1],
		})
		const pendingPurchase = getPendingPurchase(afterRoll)

		expect(pendingPurchase?.id).toBe('coffee-row')

		const afterBuy = applyAction(afterRoll, {
			type: 'property/buy',
			playerId: 'player-1',
			propertyId: 'coffee-row',
		})
		const buyer = getCurrentPlayer(afterBuy)
		const property = getPropertyById(afterBuy, 'coffee-row')

		expect(buyer.money).toBe(STARTING_MONEY - property.price)
		expect(buyer.ownedPropertyIds).toEqual(['coffee-row'])
		expect(property.ownerId).toBe('player-1')
		expect(afterBuy.phase).toBe('turnEnd')
		expect(afterBuy.actionLog).toHaveLength(2)
	})

	it('ends the turn and advances to the next player', () => {
		const state = createInitialGame({
			playerCount: 2,
		})
		const afterRoll = applyAction(state, {
			type: 'turn/rollDice',
			playerId: 'player-1',
			dice: [1, 1],
		})
		const afterEndTurn = applyAction(afterRoll, {
			type: 'turn/end',
			playerId: 'player-1',
		})

		expect(afterEndTurn.currentPlayerId).toBe('player-2')
		expect(afterEndTurn.phase).toBe('waitingForRoll')
		expect(afterEndTurn.lastRoll).toBeNull()
		expect(afterEndTurn.actionLog).toHaveLength(2)
	})
})

