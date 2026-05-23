import { useMemo, useState } from "react";

import {
	applyAction,
	createInitialGame,
	getActionPermissions,
	getCurrentPlayer,
	getCurrentTile,
	getPendingPurchase,
	type GameAction,
	type GameState,
} from "#/game-core";

import { ActionLogPanel } from "./components/ActionLogPanel";
import { PlayerPanel } from "./components/PlayerPanel";
import { SandboxHeader } from "./components/SandboxHeader";
import { TurnPanel } from "./components/TurnPanel";
import { createLocalDiceRoll } from "./localDice";
import type { PlayerCountOption } from "./localGameConfig";
import { groupPlayersByPosition } from "./localGameView";
import { dallasBoardDefinition } from "./board/data";
import { Map as DallasBoardMap } from "./board";

const initialPlayerCount: PlayerCountOption = 2;

export function LocalGameSandbox() {
	const [playerCount, setPlayerCount] =
		useState<PlayerCountOption>(initialPlayerCount);
	const [gameState, setGameState] = useState<GameState>(() =>
		createInitialGame(
			{
				playerCount: initialPlayerCount,
			},
			dallasBoardDefinition,
		),
	);
	const [lastError, setLastError] = useState<string | null>(null);
	const currentPlayer = getCurrentPlayer(gameState);
	const currentTile = getCurrentTile(gameState);
	const pendingPurchase = getPendingPurchase(gameState);
	const permissions = getActionPermissions(gameState);
	const playersByPosition = useMemo(
		() => groupPlayersByPosition(gameState.players),
		[gameState.players],
	);

	function startLocalGame() {
		setGameState(
			createInitialGame(
				{
					playerCount,
					gameId: `local-${playerCount}-player-sandbox`,
				},
				dallasBoardDefinition,
			),
		);
		setLastError(null);
	}

	function dispatchGameAction(action: GameAction) {
		try {
			setGameState(applyAction(gameState, action));
			setLastError(null);
		} catch (error) {
			setLastError(error instanceof Error ? error.message : "Action failed.");
		}
	}

	function rollDice() {
		dispatchGameAction({
			type: "turn/rollDice",
			playerId: currentPlayer.id,
			dice: createLocalDiceRoll(),
		});
	}

	function buyProperty() {
		if (!pendingPurchase) {
			return;
		}

		dispatchGameAction({
			type: "property/buy",
			playerId: currentPlayer.id,
			propertyId: pendingPurchase.id,
		});
	}

	function endTurn() {
		dispatchGameAction({
			type: "turn/end",
			playerId: currentPlayer.id,
		});
	}

	return (
		<main className="page-wrap px-4 pb-10 pt-10">
			<SandboxHeader
				playerCount={playerCount}
				onPlayerCountChange={setPlayerCount}
				onStartGame={startLocalGame}
				onResetGame={startLocalGame}
			/>

			<section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
				<div className="space-y-5">
					<TurnPanel
						gameState={gameState}
						currentPlayer={currentPlayer}
						currentTile={currentTile}
						pendingPurchase={pendingPurchase}
						permissions={permissions}
						lastError={lastError}
						onRollDice={rollDice}
						onBuyProperty={buyProperty}
						onEndTurn={endTurn}
					/>
					<DallasBoardMap
						gameState={gameState}
						currentPlayer={currentPlayer}
						playersByPosition={playersByPosition}
					/>
				</div>

				<aside className="space-y-5">
					<PlayerPanel
						players={gameState.players}
						currentPlayerId={currentPlayer.id}
					/>
					<ActionLogPanel actionLog={gameState.actionLog} />
				</aside>
			</section>
		</main>
	);
}
