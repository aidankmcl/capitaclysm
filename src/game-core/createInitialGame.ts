import {
	STARTING_MONEY,
	localBoardDefinition,
} from './board'
import type {
	BoardDefinition,
	CreateInitialGameConfig,
	GameState,
	PlayerState,
	PropertyState,
} from './types'

const fakePlayers = [
	{
		name: 'Avery',
		color: '#d84f4f',
	},
	{
		name: 'Blair',
		color: '#2f7ed8',
	},
	{
		name: 'Casey',
		color: '#2f9d67',
	},
	{
		name: 'Drew',
		color: '#b071d9',
	},
] as const

export function createInitialGame(
	config: CreateInitialGameConfig,
	boardDefinition: BoardDefinition = localBoardDefinition,
): GameState {
	if (config.playerCount < 2 || config.playerCount > 4) {
		throw new Error('Local games require 2 to 4 players.')
	}

	const players = fakePlayers
		.slice(0, config.playerCount)
		.map<PlayerState>((player, index) => ({
			id: `player-${index + 1}`,
			name: player.name,
			color: player.color,
			position: 0,
			money: STARTING_MONEY,
			ownedPropertyIds: [],
			status: 'active',
			turnOrderIndex: index,
		}))

	const properties = boardDefinition.properties.map<PropertyState>((property) => ({
		...property,
		ownerId: null,
	}))

	return {
		id: config.gameId ?? 'local-sandbox',
		phase: 'waitingForRoll',
		currentPlayerId: players[0].id,
		players,
		board: {
			tiles: boardDefinition.tiles,
		},
		properties,
		actionLog: [],
		actionIndex: 0,
		lastRoll: null,
	}
}

