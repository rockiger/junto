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
            <h1>Wiki Directory</h1>
            <WikiList files={filterIsNotArchived(files)} />
        </div>
    )
}
