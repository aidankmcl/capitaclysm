# Architecture Notes

## Game Core Boundary

`src/game-core` is reserved for pure, serializable game logic. It must not import React, browser APIs, TanStack APIs, WebRTC APIs, networking modules, UI state, or storage.

React components and feature modules may render state and dispatch actions, but rule validation and state transitions belong in `src/game-core`.

Future networking code should exchange proposed or accepted actions, not direct UI-driven state mutations.

