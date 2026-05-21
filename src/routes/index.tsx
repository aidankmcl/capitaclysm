import { createFileRoute } from '@tanstack/react-router'

import { LocalGameSandbox } from '#/features/local-game/LocalGameSandbox'

export const Route = createFileRoute('/')({ component: App })

function App() {
	return <LocalGameSandbox />
}
