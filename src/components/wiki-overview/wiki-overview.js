//@ts-check
import React from 'react'

import s from './wiki-overview.module.scss'

export default WikiOverview
export { WikiOverview }

/**
 * @typedef {Object.<string,any>} WikiOverviewProps
 */

 /**
 * A wiki-overview component.
 * @param {WikiOverviewProps} props
 */
function WikiOverview(props) {
    return <div className={s.WikiOverview}>Hello WikiOverview</div>
}
