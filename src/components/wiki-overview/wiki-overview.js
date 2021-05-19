//@ts-check
import React, { useGlobal, useState } from 'reactn'

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
    const [files] = useGlobal('initialFiles')
    const [filterString, setFilterString] = useState('')

    return (
        <div className={s.WikiOverview}>
            <div className={s.header}>
                <h1 className={s.header_h1}>Wiki Directory</h1>
                <input
                    className={s.header_input}
                    onChange={ev => setFilterString(ev.target.value)}
                    placeholder="Filter"
                    type="text"
                    value={filterString}
                />
            </div>
            <WikiList files={filterSearch(filterString, files)} />
        </div>
    )

    /**
     *
     * @param {string} filterString
     * @param {import('reactn/default').IFile[]} files
     * @returns {import('reactn/default').IFile[]}
     */
    function filterSearch(filterString, files) {
        if (filterString.length < 3) return files

        return files.filter(f => {
            const result = `${
                f.properties && f.properties.pageName
                    ? f.properties.pageName
                    : ''
            } ${f.description ? f.description : ''}`
            console.log(result)
            return (
                result
                    .trim()
                    .toLowerCase()
                    .search(filterString.toLowerCase()) !== -1
            )
        })
    }
}
