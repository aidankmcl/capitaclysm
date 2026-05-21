export type PlayerId = string
export type TileId = string
export type PropertyId = string

export type GamePhase =
	| 'waitingForRoll'
	| 'waitingForPurchaseDecision'
	| 'turnEnd'

export type TileKind = 'start' | 'property' | 'rest'

export type BoardTile = {
	id: TileId
	kind: TileKind
	name: string
	positionIndex: number
	propertyId?: PropertyId
}

export type PropertyDefinition = {
	id: PropertyId
	tileId: TileId
	name: string
	groupId: string
	price: number
	baseRent: number
}

export type BoardDefinition = {
	tiles: BoardTile[]
	properties: PropertyDefinition[]
}

export type PlayerState = {
	id: PlayerId
	name: string
	color: string
	position: number
	money: number
	ownedPropertyIds: PropertyId[]
	status: 'active'
	turnOrderIndex: number
}

export type PropertyState = PropertyDefinition & {
	ownerId: PlayerId | null
}

export type BoardState = {
	tiles: BoardTile[]
}

export type DiceRoll = readonly [number, number]

export type LastRoll = {
	playerId: PlayerId
	dice: DiceRoll
	total: number
	fromPosition: number
	toPosition: number
	passedStart: boolean
}

export type GameAction =
	| {
			type: 'turn/rollDice'
			playerId: PlayerId
			dice: DiceRoll
	  }
	| {
			type: 'property/buy'
			playerId: PlayerId
			propertyId: PropertyId
	  }
	| {
			type: 'turn/end'
			playerId: PlayerId
	  }

export type ActionLogEntry = {
	index: number
	action: GameAction
}

export type GameState = {
	id: string
	phase: GamePhase
	currentPlayerId: PlayerId
	players: PlayerState[]
	board: BoardState
	properties: PropertyState[]
	actionLog: ActionLogEntry[]
	actionIndex: number
	lastRoll: LastRoll | null
}

export type CreateInitialGameConfig = {
	playerCount: number
	gameId?: string
}

export type ValidationResult =
	| {
			valid: true
	  }
	| {
			valid: false
			reason: string
	  }

