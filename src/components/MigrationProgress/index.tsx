import { ProgressBar } from 'react-aria-components'
import { useGlobal } from 'reactn'

/**
 * Fixed banner showing the progress of the one-time .gwiki -> .md migration.
 */
export function MigrationProgress() {
	const [migration] = useGlobal('migration')
	if (!migration?.running) return null

	const { done, total } = migration
	const maxValue = Math.max(total, 1)

	return (
		<div className="fixed bottom-4 left-1/2 z-2000 w-80 max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-panel bg-surface-paper px-5 py-3 shadow-lg/25">
			<div className="mb-2 text-sm text-fg-default">
				Updating wiki pages to Markdown… {done}/{total}
			</div>
			<ProgressBar
				aria-label="Wiki migration progress"
				value={done}
				minValue={0}
				maxValue={maxValue}
				className="w-full"
			>
				{({ percentage }) => (
					<div className="relative h-1 overflow-hidden rounded-full bg-surface-alt">
						<div
							className="absolute inset-y-0 left-0 rounded-full bg-accent transition-[width] duration-200 ease-out forced-colors:bg-[Highlight]"
							style={{ width: `${percentage}%` }}
						/>
					</div>
				)}
			</ProgressBar>
		</div>
	)
}

export default MigrationProgress
