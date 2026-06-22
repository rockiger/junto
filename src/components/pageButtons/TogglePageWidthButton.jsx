import ArrowCollapseHorizontalIcon from 'mdi-react/ArrowCollapseHorizontalIcon'
import ArrowExpandHorizontalIcon from 'mdi-react/ArrowExpandHorizontalIcon'
import { PAGE_WIDTH_REDUCED } from 'lib/pageWidth'

import { Button } from './Button'

import styles from './toggle-read-only-button.module.scss'

export function TogglePageWidthButton({ onClick, pageWidth }) {
    const isReduced = pageWidth === PAGE_WIDTH_REDUCED

    return (
        <Button
            active={isReduced}
            className={styles.ToggleReadOnlyButton}
            onClick={onClick}
            title={isReduced ? 'Switch to full width' : 'Switch to reduced width'}
        >
            {isReduced ? (
                <ArrowExpandHorizontalIcon />
            ) : (
                <ArrowCollapseHorizontalIcon />
            )}
        </Button>
    )
}
