# PRD: Modernized Web Monopoly-Style Game with Side Mini-Games

## 1. Product Summary

Build a browser-based, multiplayer, Monopoly-inspired board game with modern pacing, short side mini-games, and peer-to-peer multiplayer. The first full MVP should support a player hosting a game and other players joining through an invite code.

The project already exists as a Vite React TypeScript app created with `pnpm create vite`. The PRD should assume the current app environment rather than spending time reselecting core technologies.

The game should be built incrementally. Each milestone should be narrow enough that a coding AI can work on it without trying to implement the entire product at once.

## 2. Working Title

**Rent Party**

Name is temporary. Code should not hard-code final branding.

## 3. Core Product Goals

1. Create a playable Monopoly-like board game in the browser.
2. Support a host-created room that friends can join using an invite code.
3. Keep early hosting and infrastructure needs minimal.
4. Keep all game rules isolated from React UI and WebRTC networking.
5. Represent gameplay as serializable actions so games can be replayed, debugged, synchronized, and eventually persisted.
6. Add side mini-games as modular systems that can be triggered by board events.
7. Avoid architectural choices that would make future server support impossible, but do not optimize for scaling yet.

## 4. Non-Goals for the MVP

The MVP should not attempt to support every long-term feature.

Out of scope:

* Public matchmaking
* Ranked matchmaking
* User accounts
* Persistent profiles
* Cosmetics
* Mobile app wrappers
* Server-authoritative gameplay
* Host migration
* Spectator mode
* Real-money transactions
* AI opponents
* Full Monopoly rule parity
* Complex animation polish
* Voice/video chat
* Public room browser
* Custom production signaling infrastructure

## 5. Target Platforms

Initial target:

* Modern desktop browsers
* Chrome, Edge, Firefox, Safari latest stable versions

Secondary target:

* Tablet browsers
* Mobile browser support after core gameplay is stable

## 6. Existing Project Assumptions

The project already exists and should be treated as the starting point.

Assume the app uses:

* pnpm
* Vite
* React
* TypeScript
* TanStack tooling already chosen by the project
* Existing project linting, formatting, routing, and testing conventions where present

The coding AI should not recreate the project from scratch unless explicitly instructed.

Recommended additions if not already present:

* Vitest for game-core unit tests
* Playwright only when browser flow testing becomes useful
* Zod or a similar schema library for validating actions and network messages
* A deterministic RNG helper for dice, cards, and mini-game seeds

## 7. Design Principles

### 7.1 Keep Game Rules Pure

The game rules should not depend on:

* React
* TanStack state/router/query APIs
* WebRTC APIs
* DOM APIs
* Browser storage
* Canvas APIs
* Server APIs

The core game layer should expose functions like:

```ts
createInitialGame(config)
validateAction(state, action)
applyAction(state, action)
replayActions(initialState, actions)
```

This logic can live inside the existing app repository. It does not need to be a separate package immediately, but it should be organized so it could be extracted later.

### 7.2 Actions Are the Source of Truth

Every meaningful gameplay event should be represented as a serializable action.

Example:

```ts
{
  type: "property/buy",
  playerId: "p2",
  tileId: "boardwalk"
}
```

Players should not send whole game states over the network. They should send proposed actions. The host validates actions, applies them, and broadcasts accepted actions.

### 7.3 UI Renders State, It Does Not Own Rules

React components should never calculate rent, enforce ownership rules, determine turn order, or resolve board effects. Those decisions belong in the game core.

The UI should answer questions like:

* What state should be displayed?
* What actions can the current user attempt?
* What controls should be enabled?

The game core should answer questions like:

* Is this action valid?
* What state transition happens next?
* Who owes money?
* Who owns this property?
* Is the game over?

### 7.4 Mini-Games Are Modules

Mini-games should have a pure logic module and a separate visual/UI layer.

The board game should only care about:

* when a mini-game starts
* which players are involved
* which mini-game actions are submitted
* when the mini-game completes
* what result should be applied to the main game

### 7.5 Milestones Should Be Narrow

Each milestone should have:

* a small goal
* specific deliverables
* acceptance criteria
* tests where applicable
* explicit non-goals

A coding AI should be prompted to complete only one milestone at a time.

## 8. Suggested Source Organization

Because the project already exists as a Vite app, start with a single-app structure instead of introducing a monorepo prematurely.

Suggested shape:

```txt
src/
├─ app/
│  ├─ App.tsx
│  ├─ router.tsx
│  └─ providers.tsx
│
├─ routes/
│  ├─ HomePage.tsx
│  ├─ LocalGamePage.tsx
│  ├─ LobbyPage.tsx
│  ├─ GamePage.tsx
│  └─ DevSandboxPage.tsx
│
├─ game-core/
│  ├─ index.ts
│  ├─ state/
│  │  ├─ GameState.ts
│  │  ├─ PlayerState.ts
│  │  ├─ BoardState.ts
│  │  ├─ PropertyState.ts
│  │  ├─ TradeState.ts
│  │  ├─ AuctionState.ts
│  │  └─ MiniGameState.ts
│  │
│  ├─ actions/
│  │  ├─ GameAction.ts
│  │  ├─ LobbyActions.ts
│  │  ├─ TurnActions.ts
│  │  ├─ PropertyActions.ts
│  │  ├─ TradeActions.ts
│  │  ├─ AuctionActions.ts
│  │  └─ MiniGameActions.ts
│  │
│  ├─ engine/
│  │  ├─ createInitialGame.ts
│  │  ├─ applyAction.ts
│  │  ├─ validateAction.ts
│  │  ├─ advanceTurn.ts
│  │  ├─ resolveDiceRoll.ts
│  │  ├─ resolveTile.ts
│  │  ├─ resolveRent.ts
│  │  └─ checkWinCondition.ts
│  │
│  ├─ board/
│  │  ├─ boardDefinition.ts
│  │  ├─ tiles.ts
│  │  ├─ properties.ts
│  │  ├─ decks.ts
│  │  └─ movement.ts
│  │
│  ├─ rules/
│  │  ├─ money.ts
│  │  ├─ ownership.ts
│  │  ├─ rent.ts
│  │  ├─ bankruptcy.ts
│  │  ├─ trades.ts
│  │  └─ auctions.ts
│  │
│  ├─ minigames/
│  │  ├─ MiniGameModule.ts
│  │  ├─ MiniGameRegistry.ts
│  │  ├─ stockTrading.ts
│  │  └─ placeholderMiniGame.ts
│  │
│  ├─ rng/
│  │  ├─ rng.ts
│  │  ├─ seed.ts
│  │  └─ shuffle.ts
│  │
│  ├─ log/
│  │  ├─ ActionLog.ts
│  │  ├─ replayActions.ts
│  │  ├─ snapshots.ts
│  │  └─ migrations.ts
│  │
│  └─ schemas/
│     ├─ actionSchemas.ts
│     ├─ stateSchemas.ts
│     └─ networkSchemas.ts
│
├─ features/
│  ├─ lobby/
│  │  ├─ LobbyView.tsx
│  │  ├─ PlayerList.tsx
│  │  ├─ RoomCodeInput.tsx
│  │  └─ useLobbyController.ts
│  │
│  ├─ board/
│  │  ├─ BoardView.tsx
│  │  ├─ BoardCanvas.tsx
│  │  ├─ TileView.tsx
│  │  ├─ PieceLayer.tsx
│  │  └─ BoardHud.tsx
│  │
│  ├─ trading/
│  │  ├─ TradeModal.tsx
│  │  ├─ TradeOfferView.tsx
│  │  └─ useTradeController.ts
│  │
│  ├─ auctions/
│  │  ├─ AuctionModal.tsx
│  │  └─ useAuctionController.ts
│  │
│  ├─ minigames/
│  │  ├─ MiniGameShell.tsx
│  │  ├─ MiniGameRouter.tsx
│  │  └─ stock-trading/
│  │     ├─ StockTradingView.tsx
│  │     └─ StockTradingControls.tsx
│  │
│  └─ devtools/
│     ├─ ActionLogPanel.tsx
│     ├─ StateInspector.tsx
│     └─ SimulateActionPanel.tsx
│
├─ networking/
│  ├─ p2p/
│  │  ├─ createPeer.ts
│  │  ├─ iceServers.ts
│  │  ├─ dataChannel.ts
│  │  ├─ peerMessages.ts
│  │  └─ reconnect.ts
│  │
│  └─ protocol/
│     ├─ ClientMessage.ts
│     ├─ HostMessage.ts
│     ├─ PeerMessage.ts
│     └─ version.ts
│
├─ store/
│  ├─ useAppStore.ts
│  ├─ useGameStore.ts
│  └─ selectors.ts
│
├─ components/
│  ├─ Button.tsx
│  ├─ Modal.tsx
│  ├─ Card.tsx
│  └─ Toast.tsx
│
├─ lib/
│  ├─ ids.ts
│  ├─ assert.ts
│  ├─ result.ts
│  └─ storage.ts
│
├─ test/
│  ├─ game-core/
│  └─ simulations/
│
└─ main.tsx
```

This can be reorganized later if the app grows. The important boundary is conceptual: `game-core` should stay pure.

## 9. Core Gameplay Concept

The game is inspired by classic property-trading board games but should feel faster and more interactive.

Players move around a board, collect or lose money, buy properties, pay rent, trade, enter auctions, and occasionally trigger mini-games. Mini-games provide short bursts of interaction and can affect board-game outcomes.

The MVP should favor fast, understandable rules over perfect Monopoly parity.

## 10. Core Entities

### Player

A player has:

* `id`
* `name`
* `color`
* `position`
* `money`
* `ownedPropertyIds`
* `status`
* `turnOrderIndex`
* optional connection metadata outside the game core

### Game State

The game state should include:

* game ID
* current phase
* current player ID
* players
* board
* properties
* decks/cards if used
* active trade, if any
* active auction, if any
* active mini-game, if any
* action index
* RNG seed/state
* winner, if any

### Tile

A tile should include:

* `id`
* `kind`
* `name`
* `positionIndex`
* behavior-specific data

Tile kinds may include:

* start
* property
* tax
* chance/event
* jail-like
* go-to-jail-like
* free-parking-like
* mini-game
* custom special tile

### Property

A property should include:

* `id`
* `name`
* `groupId`
* `price`
* `baseRent`
* optional rent tiers
* owner player ID or null
* mortgage/status fields only if needed later

### Action

Every meaningful gameplay event should be represented as a serializable action.

Examples:

* `lobby/addPlayer`
* `lobby/removePlayer`
* `game/start`
* `turn/rollDice`
* `turn/end`
* `property/buy`
* `property/declineBuy`
* `auction/start`
* `auction/bid`
* `auction/pass`
* `trade/propose`
* `trade/accept`
* `trade/reject`
* `minigame/start`
* `minigame/submitAction`
* `minigame/complete`

## 11. Game Phases

Initial phases:

```ts
type GamePhase =
  | "lobby"
  | "waitingForRoll"
  | "moving"
  | "resolvingTile"
  | "waitingForPurchaseDecision"
  | "auction"
  | "trade"
  | "miniGame"
  | "turnEnd"
  | "gameOver";
```

The UI should render available actions based on the current phase and player permissions.

## 12. MVP Multiplayer Model

### Model: Host-Authoritative P2P

For the foreseeable future, multiplayer is host-authoritative peer-to-peer.

One browser acts as the host. Other players join using an invite code. Gameplay messages are exchanged over WebRTC DataChannels. Free STUN/TURN servers are acceptable for development and playtesting.

Basic flow:

1. Host creates a room.
2. Host receives or generates an invite code.
3. Guest enters invite code.
4. P2P connection is established.
5. Guest sends proposed game actions.
6. Host validates proposed actions using `game-core`.
7. Host applies valid actions.
8. Host broadcasts accepted actions with an action index.
9. All clients apply accepted actions in the same order.

### Important Rule

Guests should not broadcast state mutations directly to everyone. Guests propose actions. The host accepts or rejects them.

### Disconnection Handling for MVP

Minimum behavior:

* Show disconnected player status.
* Allow game to continue only if host remains connected.
* If host disconnects, show a clear “host disconnected” message.
* Do not attempt host migration in the MVP.

### Networking Scope

The MVP should include only the networking needed for invite-code P2P play.

Do not build:

* matchmaking
* public rooms
* accounts
* server-authoritative gameplay
* ranked queues
* host migration
* custom production signaling infrastructure

The code should avoid making those things impossible later, but they should not drive the near-term design.

## 13. Network Message Examples

### Proposed Action

```ts
{
  type: "game:action:proposed",
  clientId: "client_123",
  action: {
    type: "property/buy",
    playerId: "p2",
    tileId: "tile_17"
  }
}
```

### Accepted Action

```ts
{
  type: "game:action:accepted",
  actionIndex: 42,
  action: {
    type: "property/buy",
    playerId: "p2",
    tileId: "tile_17"
  }
}
```

### Rejected Action

```ts
{
  type: "game:action:rejected",
  reason: "Not this player's turn",
  proposedActionId: "action_abc"
}
```

### Snapshot

```ts
{
  type: "game:snapshot",
  actionIndex: 42,
  state: { }
}
```

### Resync Request

```ts
{
  type: "game:resync:requested",
  fromActionIndex: 35
}
```

## 14. Mini-Game System

Mini-games should be added as modules.

### Mini-Game Interface

```ts
type MiniGameModule = {
  id: string;
  createInitialState(input: MiniGameStartInput): MiniGameState;
  validateAction(state: MiniGameState, action: MiniGameAction): ValidationResult;
  applyAction(state: MiniGameState, action: MiniGameAction): MiniGameState;
  getResult(state: MiniGameState): MiniGameResult | null;
};
```

### Mini-Game Principles

* Mini-games should be short.
* Mini-games should have deterministic outcomes where possible.
* Mini-game results should be applied to the board game through normal game actions.
* Mini-game UI should live outside the game core.
* Real-time latency-sensitive mini-games should be avoided until P2P synchronization feels reliable.

### First Mini-Game Candidate

**Stock Trading Mini-Game**

A short, deterministic market-timing mini-game:

* A mini stock chart or price sequence is generated from the game seed.
* Involved players choose when to buy, sell, hold, or cash out.
* The result is calculated deterministically.
* The winner or each player’s profit/loss is applied back to the main board game.

This is preferred over a pure reaction-speed mini-game for the first MVP because it is less sensitive to network latency.

## 15. Milestone Plan

# Milestone 0: Existing Project Orientation

## Goal

Document and lightly organize the existing Vite React TypeScript project so future coding AI prompts have clear boundaries.

## Deliverables

* Confirm existing project scripts.
* Add or confirm test setup.
* Add `src/game-core` folder.
* Add `src/features`, `src/networking`, and `src/lib` folders if not already present.
* Add a short architecture note explaining the game-core boundary.
* Add one trivial passing game-core test.

## Acceptance Criteria

* Existing `pnpm` scripts still work.
* App still starts locally.
* At least one test runs and passes.
* `src/game-core` has no React or browser dependencies.

## Non-Goals

* Do not recreate the project.
* Do not convert to a monorepo.
* Do not implement board rendering yet.
* Do not implement networking yet.
* Do not implement full game rules yet.

## Suggested Coding AI Prompt

Implement Milestone 0 only. The project already exists as a Vite React TypeScript app created with `pnpm create vite`. Do not recreate the project and do not convert it to a monorepo. Confirm or add the minimal structure needed for future work: `src/game-core`, `src/features`, `src/networking`, and `src/lib`. Add or confirm a test setup, add one trivial passing test for `game-core`, and write a short architecture note explaining that `game-core` must not depend on React, browser APIs, or networking. Do not implement gameplay or networking yet.

# Milestone 1: Local Single-Browser Board Sandbox

## Goal

Create a local, single-browser board game sandbox with basic movement and property purchase.

## Deliverables

* Initial board definition
* Initial game state creation
* Player creation
* Dice roll action
* Movement resolution
* Basic property purchase
* End turn
* Simple React board view
* Action log panel

## Acceptance Criteria

* User can start a local test game with 2–4 fake players.
* User can roll dice for the current player.
* Player moves around the board.
* If a player lands on an unowned property, they can buy it.
* Current turn can end and advance to the next player.
* Every move is represented as a `GameAction`.
* Basic tests cover initial state, movement, buying, and turn advancement.

## Non-Goals

* No multiplayer.
* No WebRTC.
* No trades.
* No auctions.
* No mini-games.
* No polished graphics.

## Suggested Coding AI Prompt

Implement Milestone 1 only. Build a local single-browser board sandbox. All game logic must live in `src/game-core` and be exposed through pure functions. The React app should render state and dispatch actions but should not contain rule logic. Add tests for state creation, dice movement, property buying, and turn advancement. Do not implement networking, trades, auctions, or mini-games.

# Milestone 2: Deterministic Action Log and Replay

## Goal

Make the game replayable from an action log.

## Deliverables

* Action log data structure
* Action index tracking
* Deterministic RNG seed handling
* Replay function
* Snapshot helper
* Devtools panel for viewing action log
* Tests for deterministic replay

## Acceptance Criteria

* Starting from the same initial state and same action list produces the same final state.
* Dice rolls are deterministic from the configured seed/action flow.
* The app can reset and replay the current action log.
* Tests verify replay consistency.

## Non-Goals

* No networking yet.
* No persistence beyond local in-memory replay.
* No save/load UI required beyond devtools.

## Suggested Coding AI Prompt

Implement Milestone 2 only. Add deterministic action logging and replay to the local board sandbox. Ensure dice and random effects are deterministic. Add replay helpers and tests that verify the same action log always produces the same final state. Do not implement multiplayer or WebRTC yet.

# Milestone 3: Basic Local Persistence

## Goal

Allow a local game to survive page refresh.

## Deliverables

* Local save/load using localStorage or IndexedDB
* Store game seed, initial config, action log, and latest snapshot if useful
* Restore UI state on reload
* Clear saved game option

## Acceptance Criteria

* User can start a local game, take actions, refresh the page, and continue.
* Saved game is reconstructed from initial state plus action log or a validated snapshot.
* User can clear the saved local game.

## Non-Goals

* No cloud saves.
* No accounts.
* No multiplayer persistence.

## Suggested Coding AI Prompt

Implement Milestone 3 only. Add local persistence for the single-browser game using localStorage or IndexedDB. Save enough data to restore the game after a refresh. Prefer storing initial config, seed, and action log. Add a clear-save option. Do not implement cloud saves, accounts, or multiplayer.

# Milestone 4: P2P Invite-Code Room Prototype

## Goal

Create a basic peer-to-peer multiplayer prototype with host-authoritative gameplay.

## Deliverables

* P2P connection setup using WebRTC or an abstraction such as PeerJS
* Free STUN/TURN ICE server configuration
* Host room creation flow
* Invite code display
* Guest join flow
* DataChannel messaging
* Host-authoritative action validation
* Accepted/rejected action messages
* Basic connection status UI

## Acceptance Criteria

* One host and one guest can connect in two browser windows.
* Host can share an invite code.
* Guest can join using the invite code.
* Guest can propose an action.
* Host validates and broadcasts accepted action.
* Both clients apply accepted actions in the same order.
* Rejected actions show a visible error or debug message.
* The game still works locally when networking is disabled.

## Non-Goals

* No matchmaking.
* No public room list.
* No custom backend.
* No server-authoritative gameplay.
* No host migration.
* No robust reconnect yet.
* No more than 2 players required at this milestone.

## Suggested Coding AI Prompt

Implement Milestone 4 only. Add a basic P2P invite-code room prototype using WebRTC or a small WebRTC abstraction. Use free STUN/TURN configuration suitable for development and playtesting. The guest should send proposed actions to the host. The host validates with `src/game-core`, applies the action, and broadcasts accepted actions. Both clients should apply accepted actions in order. Keep all rules in `src/game-core`. Do not implement matchmaking, a public room list, a custom backend, host migration, or server-authoritative gameplay.

# Milestone 5: Multiplayer Lobby and 2–4 Player Support

## Goal

Support a small P2P multiplayer lobby and start a game with multiple connected players.

## Deliverables

* Lobby page
* Player list
* Player name/color selection
* Ready state
* Host starts game
* 2–4 connected players
* Basic room code UX

## Acceptance Criteria

* Host can create a room.
* Guests can join before the game starts.
* Players can set display names.
* Host can start the game when minimum player count is reached.
* Turn order includes all connected players.
* Basic disconnect state is shown.

## Non-Goals

* No public room browser.
* No matchmaking queue.
* No user accounts.
* No host migration.
* No server-authoritative gameplay.

## Suggested Coding AI Prompt

Implement Milestone 5 only. Build a small P2P multiplayer lobby on top of the existing invite-code room prototype. Support 2–4 players, names, colors, ready state, and host-started game creation. Preserve host-authoritative action flow. Do not implement matchmaking, accounts, a public room browser, host migration, or server-authoritative gameplay.

# Milestone 6: Core Board Rules Expansion

## Goal

Make the board game meaningfully playable.

## Deliverables

* Rent payment
* Property groups
* Basic bankruptcy handling
* Tax/special tiles
* Simple chance/event cards if desired
* Win condition
* Improved phase handling

## Acceptance Criteria

* Landing on an owned property charges rent.
* Player money updates correctly.
* Players can go bankrupt or be eliminated according to simple rules.
* A winner is declared when only one active player remains or another configured win condition is met.
* Tests cover rent, bankruptcy, special tiles, and win condition.

## Non-Goals

* No houses/hotels unless explicitly added.
* No mortgages unless explicitly added.
* No complex Monopoly parity.
* No mini-games yet.

## Suggested Coding AI Prompt

Implement Milestone 6 only. Expand the board game rules with rent, property groups, special tiles, simple bankruptcy, and a win condition. Keep all rule logic in `src/game-core`. Add tests for each rule. Do not implement houses, hotels, mortgages, mini-games, or new networking features.

# Milestone 7: Trades and Auctions

## Goal

Add player negotiation systems.

## Deliverables

* Trade proposal action
* Trade accept/reject actions
* Trade validation
* Auction start action
* Auction bid/pass actions
* Auction resolution
* UI for trades and auctions

## Acceptance Criteria

* Players can propose a trade involving money and properties.
* Trade can be accepted or rejected.
* Invalid trades are rejected by validation.
* Unbought property can enter auction.
* Players can bid or pass.
* Auction winner receives property and pays bid.
* Tests cover trade validation and auction resolution.

## Non-Goals

* No chat system required.
* No simultaneous complex negotiations.
* No AI trade suggestions.

## Suggested Coding AI Prompt

Implement Milestone 7 only. Add trades and auctions. Trades should support money and property exchange. Auctions should support bidding, passing, and resolution. All validation and state transitions must live in `src/game-core`. Add React UI for basic interaction. Do not implement chat, AI suggestions, or mini-games.

# Milestone 8: Mini-Game Framework

## Goal

Add the infrastructure needed to trigger and resolve side mini-games.

## Deliverables

* `MiniGameModule` interface
* Mini-game registry
* Board tile or card that starts a mini-game
* Mini-game state inside main game state
* Mini-game action routing
* Mini-game result application
* Generic MiniGameShell UI

## Acceptance Criteria

* Landing on a configured tile can start a mini-game.
* Game phase changes to `miniGame`.
* Mini-game actions are validated and applied through the core engine.
* Completing a mini-game returns a result.
* The result modifies the main board state.
* Tests cover mini-game start, action application, completion, and result application.

## Non-Goals

* No polished mini-game yet.
* No real-time twitch gameplay yet.
* No animation-heavy renderer required yet.

## Suggested Coding AI Prompt

Implement Milestone 8 only. Add a generic mini-game framework. Create a `MiniGameModule` interface, registry, game phase integration, action routing, and result application. Add a placeholder mini-game that can be started and completed. Do not build a polished mini-game or add advanced animation/rendering libraries yet.

# Milestone 9: First Playable Mini-Game

## Goal

Add a stock-trading mini-game.

## Deliverables

* Stock-trading mini-game module
* React UI for the mini-game
* Deterministic market/price sequence generation
* Actions for player decisions
* Result calculation
* Reward or penalty application to board game

## Acceptance Criteria

* Mini-game can be triggered during normal play.
* Involved players can interact with the mini-game UI.
* Mini-game reaches a clear completion state.
* Profit/loss or winner result is applied to the board game.
* All clients remain synchronized in multiplayer.
* Tests cover mini-game logic.

## Non-Goals

* No need for multiple mini-games yet.
* No animation polish required.
* No latency-perfect twitch gameplay.

## Suggested Coding AI Prompt

Implement Milestone 9 only. Build the first playable mini-game: a deterministic stock-trading mini-game. Keep the mini-game logic in `src/game-core`; keep rendering and controls in the React app. Generate market behavior from the game seed so clients remain synchronized. Ensure the result is applied back to the main board game. Do not add additional mini-games or advanced animations.

# Milestone 10: MVP Playtest Hardening

## Goal

Make the local and P2P MVP reliable enough for small playtests.

## Deliverables

* Better connection error messages
* Basic reconnect or resync attempt if easy
* Snapshot/resync button or debug command
* Improved empty/loading/error states
* Clear current-turn UI
* Clear available-action UI
* More simulation tests
* More multiplayer flow tests if practical
* Basic accessibility pass

## Acceptance Criteria

* App handles common P2P connection failures clearly.
* User can understand whose turn it is and what actions are available.
* P2P playtesters can complete a simple game without devtools.
* Important game flows have automated tests.
* No known state desyncs in normal 2–4 player flows.

## Non-Goals

* No matchmaking.
* No public rooms.
* No accounts.
* No custom backend.
* No major new gameplay systems.
* No monetization.
* No mobile-native app.

## Suggested Coding AI Prompt

Implement Milestone 10 only. Harden the local and P2P MVP for small playtests. Focus on clearer connection errors, current-turn clarity, available-action clarity, basic resync/debug tools, and broader test coverage. Do not add matchmaking, public rooms, accounts, a backend, or major new gameplay systems.

## 16. Validation and Testing Requirements

### Unit Tests

Required for:

* initial game creation
* turn order
* dice movement
* property purchase
* rent payment
* bankruptcy
* trades
* auctions
* mini-game result application
* action replay

### Integration Tests

Useful for:

* local full turn loop
* two-player P2P action proposal and acceptance
* mini-game triggered from board and resolved back to board

### Simulation Tests

Add a script that can run many random games and check invariants.

Example invariants:

* current player always exists unless game is over
* no property has multiple owners
* no active auction references a missing property
* action replay does not diverge
* money changes only through valid rules
* eliminated players do not take turns

## 17. AI Coding Guidelines

When prompting a coding AI to work on this project, instruct it to:

1. Work on only one milestone at a time.
2. Preserve the pure `src/game-core` boundary.
3. Add tests for every game rule it changes.
4. Avoid implementing future milestones early.
5. Prefer simple, explicit types over clever abstractions.
6. Keep actions and network messages serializable.
7. Avoid storing derived state unless there is a clear reason.
8. Keep UI state separate from game state.
9. Use the existing project conventions instead of introducing a new stack.
10. Run or explain relevant tests before considering work complete.

## 18. Definition of Done for Any Milestone

A milestone is complete when:

* The requested scope is implemented.
* TypeScript passes.
* Relevant tests pass.
* New game rules have unit tests.
* UI changes are minimally usable.
* No unrelated future milestone features are added.
* Docs are updated when architecture changes.
* The implementation preserves the separation between game core, UI, networking, and protocol layers.

## 19. Open Product Questions

These do not need to be answered before Milestone 1.

1. Should the game use a square Monopoly-like board or a more flexible map?
2. Should properties have upgrades, or should the game avoid houses/hotels for faster play?
3. Should mini-games trigger from specific tiles, cards, rent disputes, auctions, or all of the above?
4. Should the win condition be last player standing, fixed turn limit, wealth target, or configurable?
5. Should games target 20–30 minutes instead of classic Monopoly length?
6. Should all mini-games be deterministic and asynchronous-friendly, or should some be real-time twitch games later?
7. How much reconnect support is worth building before the first playtest?
8. Should the eventual server, if one is ever added, only help with signaling or eventually run authoritative matches?

## 20. Recommended First Coding Prompt

Use this to orient the existing project:

```txt
You are implementing Milestone 0 of a browser-based Monopoly-inspired multiplayer board game.

The project already exists as a Vite React TypeScript app created with `pnpm create vite`. Do not recreate the project. Do not convert it into a monorepo. Use the existing project conventions and dependencies where possible.

Goal:

Prepare the codebase for incremental game development.

Requirements:

- Confirm the existing app still runs.
- Add or confirm a test setup.
- Create `src/game-core` for pure game logic.
- Create `src/features`, `src/networking`, and `src/lib` if useful.
- Add one trivial passing test for `src/game-core`.
- Add a short architecture note explaining that `src/game-core` must not depend on React, browser APIs, TanStack APIs, or networking.

Constraints:

- Do not implement gameplay yet.
- Do not implement networking yet.
- Do not add server code.
- Do not change the app stack unless necessary.

When finished, summarize the files changed and the commands to run.
```

## 21. Recommended Second Coding Prompt

Use this after Milestone 0 is complete:

```txt
You are implementing Milestone 1 of a browser-based Monopoly-inspired multiplayer board game.

Build a local single-browser board sandbox.

Requirements:

- All game rules must live in `src/game-core`.
- The React app may render state and dispatch actions but must not contain rule logic.
- Create a simple board definition.
- Create initial game state for 2–4 local players.
- Add actions for rolling dice, moving, buying an unowned property, and ending the turn.
- Render a simple board and player status UI.
- Render an action log panel.
- Add tests for initial state, movement, buying, and turn advancement.

Do not implement:

- WebRTC
- multiplayer rooms
- trades
- auctions
- mini-games
- persistence
- polished art or animation

When finished, summarize the files changed and the tests added.
```

## 22. Notes on WebRTC, STUN, and TURN

For development and playtesting, using free STUN/TURN servers is acceptable.

The MVP should keep ICE server configuration isolated in one place so it can be swapped later without touching game rules.

Example:

```ts
export const iceServers: RTCIceServer[] = [
  {
    urls: ["stun:stun.l.google.com:19302"]
  }
];
```

The game should not be architected around production-scale networking yet. The immediate goal is invite-code P2P play that is good enough for small playtests.

## 23. Long-Term Direction

The near-term product is:

1. **Local-only sandbox**: single-browser development and testing.
2. **P2P host-authoritative play**: host creates a room, friends join with an invite code.
3. **P2P MVP hardening**: enough reliability, clarity, and tests for small playtests.

Possible future work, not part of the MVP:

* custom signaling service
* public room browser
* matchmaking
* accounts
* server-authoritative matches
* host migration
* cloud saves

The code should not block those future options, but they should not be prioritized until the P2P MVP is fun and stable.
