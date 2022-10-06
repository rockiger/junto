//@ts-check
import { useGlobal } from 'reactn'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { format } from 'date-fns'

import { EmptyPlaceholder } from 'components/Home/FileList/EmptyPlaceHolder'
import { Card, CardHeader, Spinner } from 'components/gsuite-components'
import CheckboxMultipleBlankOutlineIcon from 'mdi-react/CheckboxMultipleBlankOutlineIcon'

import { OVERVIEW_NAME } from 'lib/constants'
import s from './wiki-list.module.scss'

export default WikiList
export { WikiList }

/**
 * @typedef WikiListProps
 * @property {import('reactn/default').IFile[]} files
 * @property {boolean} [isDashboard] - shows only the first row of the wiki list
 * @property {'date'|'name'} [orderBy]
 */

/**
 * A wiki-list component.
 * @param {WikiListProps} props
 */
function WikiList({ isDashboard }) {
    const [areWikisLoading] = useGlobal('areWikisLoading')
    const [wikis] = useGlobal('wikis')
    return (
        <div className={s.WikiList}>
            {_.isEmpty(wikis) &&
                !areWikisLoading &&
                (isDashboard ? (
                    <h2>You don't have any wikis in your Google Drive.</h2>
                ) : (
                    <EmptyPlaceholder
                        icon={CheckboxMultipleBlankOutlineIcon}
                        title="You don't have any archived wikis."
                    />
                ))}
            {_.isEmpty(wikis) && areWikisLoading && <Spinner />}
            <div
                className={clsx(
                    s.WikiList_container,
                    isDashboard && s.WikiList_container__isDashboard
                )}
            >
                {wikis.map(s => {
                    const { id, name } = s
                    const date = format(
                        //!new Date(viewedByMeTime || modifiedTime),
                        new Date(),
                        'MMMM dd, yyyy'
                    )
                    return (
                        <WikiCard
                            id={id}
                            date={date}
                            key={id}
                            pageName={name}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export function filterWikis(files) {
    const filtered = _.filter(files, file => {
        return file.properties && file.properties.pageName
    })
    return filtered
}

/**
 *
 * @param {'date'|'name'} sortBy
 * @param {import('reactn/default').IFile[]} files
 * @returns {import('reactn/default').IFile[]}
 */
export function sortWikisBy(sortBy = 'name', files) {
    return _.sortBy(files, file => file[sortBy])
}

// eslint-disable-next-line no-unused-vars

function WikiCard({ id, date, pageName }) {
    return (
        <Link key={id} to={`/page/${id}`}>
            <Card>
                <CardHeader
                    avatar={_.first(pageName)}
                    subtitle={date}
                    title={pageName}
                />
            </Card>
        </Link>
    )
}

/**
 *
 * @param {any[]} files
 * @param {string} rootFolderId
 * @returns {object|null}
 */
export function getOverviewFile(files, rootFolderId) {
    const overview = _.find(
        files,
        file =>
            file.title === OVERVIEW_NAME && file.parents.includes(rootFolderId)
    )
    if (overview) return overview
    return null
}
