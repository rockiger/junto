//@ts-check
import React, { useGlobal } from 'reactn'

import { filterIsNotArchived } from 'lib/helper/globalStateHelper'

import s from './wiki-overview.module.scss'
import WikiList from 'components/wiki-list'

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
    const [files] = useGlobal('files')

    return (
        <div className={s.WikiOverview}>
            <div className={s.header}>
                <h1 className={s.header_h1}>Wiki Directory</h1>
                <input
                    className={s.header_input}
                    type="text"
                    placeholder="Filter"
                />
            </div>
            <WikiList files={filterIsNotArchived(files)} />
        </div>
    )
}
