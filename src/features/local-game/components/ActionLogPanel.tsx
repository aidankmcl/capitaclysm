import type { ActionLogEntry } from '#/game-core'

type ActionLogPanelProps = {
	actionLog: ActionLogEntry[]
}

export function ActionLogPanel({ actionLog }: ActionLogPanelProps) {
	return (
		<section className="rounded-lg border border-(--line) bg-(--surface) p-4">
			<h2 className="m-0 mb-3 text-lg font-extrabold text-(--sea-ink)">
				Action Log
			</h2>
			<div className="max-h-[28rem] space-y-2 overflow-auto pr-1">
				{actionLog.length === 0 ? (
					<p className="m-0 text-sm text-(--sea-ink-soft)">
						No actions yet.
					</p>
				) : (
					actionLog
						.slice()
						.reverse()
						.map((entry) => (
							<div
								key={entry.index}
								className="rounded-lg border border-(--line) bg-(--chip-bg) p-3"
							>
								<p className="m-0 text-xs font-bold text-(--kicker)">
									#{entry.index}
								</p>
								<pre className="m-0 mt-1 whitespace-pre-wrap text-xs text-(--sea-ink)">
									{JSON.stringify(entry.action, null, 2)}
								</pre>
							</div>
						))
				)}
			</div>
		</section>
	)
}
