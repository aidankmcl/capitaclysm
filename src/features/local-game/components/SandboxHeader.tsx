import { Play, RotateCcw } from 'lucide-react'

import {
	playerCountOptions,
	type PlayerCountOption,
} from '../localGameConfig'

type SandboxHeaderProps = {
	playerCount: PlayerCountOption
	onPlayerCountChange: (playerCount: PlayerCountOption) => void
	onStartGame: () => void
	onResetGame: () => void
}

export function SandboxHeader({
	playerCount,
	onPlayerCountChange,
	onStartGame,
	onResetGame,
}: SandboxHeaderProps) {
	return (
		<header className="mb-7 flex flex-col gap-4 border-b border-(--line) pb-5 lg:flex-row lg:items-end lg:justify-between">
			<div>
				<p className="island-kicker mb-2">Local Sandbox</p>
				<h1 className="display-title m-0 text-4xl font-bold text-(--sea-ink)">
					Rent Party Prototype
				</h1>
			</div>

			<div className="flex flex-wrap items-center gap-2">
				<div className="flex rounded-lg border border-(--line) bg-(--chip-bg) p-1">
					{playerCountOptions.map((option) => (
						<button
							key={option}
							type="button"
							className={`h-9 min-w-10 rounded-md px-3 text-sm font-bold ${
								playerCount === option
									? 'bg-(--sea-ink) text-white'
									: 'text-(--sea-ink-soft) hover:bg-(--link-bg-hover)'
							}`}
							onClick={() => onPlayerCountChange(option)}
						>
							{option}
						</button>
					))}
				</div>
				<button
					type="button"
					className="inline-flex h-10 items-center gap-2 rounded-lg bg-(--lagoon-deep) px-4 text-sm font-bold text-white shadow-sm hover:brightness-105"
					onClick={onStartGame}
				>
					<Play size={16} aria-hidden="true" />
					Start
				</button>
				<button
					type="button"
					className="inline-flex h-10 items-center gap-2 rounded-lg border border-(--line) bg-(--chip-bg) px-4 text-sm font-bold text-(--sea-ink) hover:bg-(--link-bg-hover)"
					onClick={onResetGame}
				>
					<RotateCcw size={16} aria-hidden="true" />
					Reset
				</button>
			</div>
		</header>
	)
}
