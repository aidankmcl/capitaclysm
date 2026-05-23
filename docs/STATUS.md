# Project Status

## Current Milestone

Milestone 1: Local Single-Browser Board Sandbox

Status: Complete

## Completed

- Confirmed existing project scripts in `package.json`.
- Added `src/game-core` with a minimal pure module and trivial Vitest coverage.
- Confirmed `src/lib` already exists.
- Added `src/features` and `src/networking` orientation folders.
- Added `docs/ARCHITECTURE.md` documenting the `game-core` boundary.
- Updated Biome configuration and documented the existing inline theme bootstrap lint exception so lint passes.
- Added a local board definition with start, rest, and purchasable property tiles.
- Added pure `game-core` state creation, action validation, action application, movement, purchase, turn advancement, and selectors.
- Added serializable `GameAction` coverage for dice rolls, property purchases, and turn ending.
- Replaced the starter home page with a local React board sandbox for 2-4 fake players.
- Added a players panel and action log panel backed by game-core state.
- Split the local board sandbox UI into focused header, turn panel, board grid, players panel, and action log components.
- Moved local dice and view-formatting helpers out of the sandbox container.
- Updated local-game Tailwind CSS variable classes to use shorthand parenthesized variable syntax, such as `border-(--lagoon-deep)`.
- Added a dedicated Vitest config so game-core tests run without app server plugins.
- Added tests for initial state, movement, property buying, and turn advancement.

## In Progress

- None

## Next Task

Begin Milestone 2: deterministic action logging and replay.

## Decisions

- Existing Vite React TypeScript app is the starting point.
- Do not convert to a monorepo.
- MVP networking target is P2P invite-code hosting.
- Use free STUN/TURN for development and playtesting.
- Local sandbox dice rolls are serializable actions with dice values in the payload; deterministic RNG/replay belongs to Milestone 2.

## Blockers

- None

## Last Test Run

- `pnpm test` - passed 4 tests.
- `pnpm lint` - passed.
- `pnpm exec tsc --noEmit` - passed.
- `pnpm build` - passed.

## Notes for Next Agent Session

Read `docs/PRD.md`, `docs/STATUS.md`, and `AGENTS.md`.
Work on one milestone only. Milestone 2 should focus on deterministic replay and should not add multiplayer or WebRTC.
