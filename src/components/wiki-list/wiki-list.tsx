// @ts-nocheck
//@ts-check

import { createLink, } from '@tanstack/react-router'
import {
    Spinner,
} from 'components/gsuite-components'
import { EmptyPlaceholder } from 'components/Home/FileList/EmptyPlaceHolder'
import { Event } from 'components/Tracking'
import { format } from 'date-fns'
import { OVERVIEW_NAME } from 'lib/constants'
import { isArchived } from 'lib/helper'
import { sortBy } from 'lodash'
import CheckboxMultipleBlankOutlineIcon from 'mdi-react/CheckboxMultipleBlankOutlineIcon'
import FolderAccountIcon from 'mdi-react/FolderAccountIcon'
import FolderGoogleDriveIcon from 'mdi-react/FolderGoogleDriveIcon'
import { useMemo } from 'react'
import { GridList, GridListItem } from 'react-aria-components'
import { useGlobal } from 'reactn'
import type { IFile } from 'reactn/default'

/** RAC {@link GridListItem} als TanStack-Router-Link ([createLink](https://tanstack.com/router/latest/docs/guide/custom-link)). */
const GridListItemLink = createLink(GridListItem)

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
function WikiList({ files, isDashboard, orderBy = 'name' }) {
    const [isInitialFileListLoading] = useGlobal('isInitialFileListLoading')
    const [rootFolderId] = useGlobal('rootFolderId')
    const wikis = useMemo(
        () => sortWikisBy(orderBy, filterWikis(files)),
        [files, orderBy],
    )
    const myFulcrum = useMemo(
        () => getOverviewFile(files, rootFolderId),
        [files, rootFolderId],
    )
    return (
        <div className="w-full">
            {(!_.isEmpty(files) || !isInitialFileListLoading) &&
                !myFulcrum &&
                wikis.length === 0 &&
                (isDashboard ? (
                    <h2>You don't have any wikis in your Google Drive.</h2>
                ) : (
                    <EmptyPlaceholder
                        icon={CheckboxMultipleBlankOutlineIcon}
                        title="You don't have any archived wikis."
                    />
                ))}
            {_.isEmpty(files) && isInitialFileListLoading && <Spinner />}
            {(isDashboard && myFulcrum) || wikis.length ? <GridList

                aria-label="Wiki pages"
                className="flex flex-col gap-0.5 px-2 lg:flex-row lg:px-0"
            >
                <GridListItem className="bg-surface-paper flex cursor-pointer rounded-b-lg rounded-t-2xl px-3 py-5 text-inherit no-underline outline-none focus-visible:shadow-(--shadow-focus) lg:hidden ">
                    <h2 className="text-lg font-medium">Wikis</h2>
                </GridListItem>
                {wikis.map(f => {
                    const {
                        id,
                        //@ts-expect-error
                        properties: { pageName },
                        modifiedTime,
                        teamDriveId,
                        starred,
                        viewedByMeTime,
                    } = f
                    const archived = isArchived(f)
                    const date = format(
                        new Date(viewedByMeTime || modifiedTime || ''),
                        'MMMM dd, yyyy'
                    )
                    return (
                        <WikiCard
                            id={id}
                            date={date}
                            description=""
                            isArchived={archived}
                            isDashboard={isDashboard}
                            isStarred={starred}
                            key={id}
                            pageName={pageName}
                            teamDriveId={teamDriveId}
                        />
                    )
                })}
                {myFulcrum && (
                    <WikiCard
                        id={myFulcrum.id}
                        date={format(
                            new Date(
                                myFulcrum.viewedByMeTime ||
                                myFulcrum.modifiedTime || ''
                            ),
                            'MMMM dd, yyyy'
                        )}
                        description=""
                        isArchived={isArchived(myFulcrum)}
                        isStarred={myFulcrum.starred}
                        key={myFulcrum.id}
                        pageName="My Wiki"
                        teamDriveId=""
                        isDashboard={isDashboard}
                    />
                )}
            </GridList> : null}
        </div>
    )
}

export function filterWikis(files: IFile[]) {
    const filtered = _.filter(files, file => {
        return file.properties?.pageName
    })
    return filtered
}

/**
 *
 * @param {'date'|'name'} attr
 * @param {import('reactn/default').IFile[]} files
 * @returns {import('reactn/default').IFile[]}
 */
export function sortWikisBy(attr = 'name', files: IFile[]) {
    if (attr === 'name') {
        return sortBy(files, file =>
            file.properties?.pageName
                ? file.properties.pageName
                : 'My Wiki'
        )
    } else {
        return sortBy(
            files,
            file => file.viewedByMeTime || file.modifiedTime
        ).reverse()
    }
}

// eslint-disable-next-line no-unused-vars
function _getWikiRootFolder(folderId: string, files: IFile[]) {
    const folder = files.find(f => f.id === folderId)
    return folder
}

function WikiCard({
    id,
    date,
    description,
    isArchived,
    isDashboard,
    isStarred,
    pageName,
    teamDriveId,
}: Partial<IFile>) {
    return (
        <GridListItemLink
            className="bg-surface-paper flex cursor-pointer rounded-lg p-3 text-inherit no-underline outline-none focus-visible:shadow-(--shadow-focus) lg:bg-surface-container lg:max-w-sm lg:rounded-xl lg:w-1/4"
            textValue={pageName}
            key={id}
            to="/page/$id"
            params={{ id }}
            onClick={() => {
                Event(
                    'WikiCard',
                    'Click',
                    `${isDashboard ? 'Dashboard,' : ''}${isStarred ? 'Starred,' : ''
                    }${isArchived ? 'Archived' : ''}`
                )
            }}
        >
            <div className="flex items-center justify-center pr-3">
                {teamDriveId ? (
                    <FolderAccountIcon size={30} />
                ) : (
                    <FolderGoogleDriveIcon size={30} />
                )}
            </div>
            <div className="flex flex-col justify-between">
                <p className="text-lg lg:text-sm lg:font-medium">{pageName}</p>
                <p className="font-medium text-sm text-text-muted lg:text-xs lg:text-fg-muted">
                    {teamDriveId ? (
                        <>
                            in Shared with me
                        </>
                    ) : (
                        <>
                            in My Drive
                        </>
                    )}
                </p>
            </div>
        </GridListItemLink>
    )
}

/**
 *
 * @param {any[]} files
 * @param {string} rootFolderId
 * @returns {object|null}
 */
export function getOverviewFile(files: IFile[], rootFolderId: string) {
    const overview = _.find(
        files,
        file =>
            file.name === OVERVIEW_NAME && file.parents.includes(rootFolderId)
    )
    if (overview) return overview
    return null
}
