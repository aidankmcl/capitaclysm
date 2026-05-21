# Agent Instructions

This is a Vite + React + TypeScript game project.

## Product Direction

See `docs/PRD.md` for the full product plan if you need additional context about higher level goals, but first start with `docs/STATUS.md`.

The project is a browser-based Monopoly-inspired board game with side mini-games. The near-term MVP is local play first, then P2P host-authoritative multiplayer using invite codes.

## Architecture Rules

- Keep pure game logic in `src/game-core`.
- `src/game-core` must not import React, browser APIs, WebRTC APIs, TanStack APIs, or UI state.
- React components may render state and dispatch actions, but must not own game rules.
- Gameplay should be represented as serializable actions.
- Do not implement future milestones unless explicitly requested.

## Current Status

Before starting work, read `docs/STATUS.md`.

After completing work, update `docs/STATUS.md` with:
- what changed
- tests run
- current milestone status
- next recommended task
- any blockers or follow-up decisions

## Commands

Use the project’s existing package scripts. Prefer:
- `pnpm install`
- `pnpm dev`
- `pnpm test`
- `pnpm lint`
- `pnpm typecheck`

Only add or change scripts if needed.

## Definition of Done

A task is done when:
- TypeScript passes
- relevant tests pass
- new game rules have tests
- the implementation stays within the requested milestone
- `docs/STATUS.md` is updated