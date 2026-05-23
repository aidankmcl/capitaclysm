import type { DiceRoll } from '#/game-core'

export function createLocalDiceRoll(): DiceRoll {
	return [rollDie(), rollDie()]
}

function rollDie() {
	return Math.floor(Math.random() * 6) + 1
}
