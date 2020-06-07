//@ts-check
import React from 'react'
import TooltipBase from 'react-tooltip-lite'

import s from './tooltip.module.scss'

export default Tooltip
export { Tooltip }

/**
 * @typedef TooltipProps
 * @property {string|undefined} content
 * @property {React.ReactElement} children
 */

/**
 * A Tooltip component.
 * @param {TooltipProps} props
 */
function Tooltip({ children, content }) {
    return (
        <TooltipBase
            arrow={false}
            content={content}
            direction="down"
            hoverDelay={500}
            isOpen={!content ? false : undefined}
            mouseOutDelay={200}
            tipContentClassName={s.Tooltip}
        >
            {children}
        </TooltipBase>
    )
}
