import { LinearProgress } from '@material-ui/core'
import { useGlobal } from 'reactn'

/**
 * Fixed banner showing the progress of the one-time .gwiki -> .md migration.
 */
export function MigrationProgress() {
    const [migration] = useGlobal('migration')
    if (!migration || !migration.running) return null

    const { done, total } = migration
    return (
        <div
            style={{
                background: '#fff',
                borderRadius: 8,
                bottom: '1rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
                left: '50%',
                padding: '0.75rem 1.25rem',
                position: 'fixed',
                transform: 'translateX(-50%)',
                width: 320,
                zIndex: 2000,
            }}
        >
            <div style={{ marginBottom: '0.5rem' }}>
                Updating wiki pages to Markdown… {done}/{total}
            </div>
            <LinearProgress
                value={total > 0 ? (done / total) * 100 : 0}
                variant="determinate"
            />
        </div>
    )
}

export default MigrationProgress
