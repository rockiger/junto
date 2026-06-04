// @ts-check
import { createLink } from '@tanstack/react-router'
import { Spinner } from 'components/gsuite-components'
import { Event } from 'components/Tracking'
import { format } from 'date-fns'
import { OVERVIEW_NAME } from 'lib/constants'
import { isArchived } from 'lib/helper'
import { sortBy } from 'lodash'
import _ from 'lib/helper/globals'
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

interface WikiListProps {
    files: IFile[]
    isDashboard?: boolean
    orderBy?: 'date' | 'name'
}

/**
 * A wiki-list component.
 */
function WikiList({ files, isDashboard, orderBy = 'name' }: WikiListProps) {
    const [isInitialFileListLoading] = useGlobal('isInitialFileListLoading')
    const [rootFolderId] = useGlobal('rootFolderId')
    const wikis = useMemo(
        () => sortWikisBy(orderBy, filterWikis(files)),
        [files, orderBy],
    )
    const myFulcrum = useMemo(
        () => (rootFolderId ? getOverviewFile(files, rootFolderId) : null),
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
                    <h2>You don't have any archived wikis.</h2>
                ))}
            {_.isEmpty(files) && isInitialFileListLoading && <Spinner />}
            {(isDashboard && myFulcrum) || wikis.length ? (
                <GridList
                    aria-label="Wiki pages"
                    className="flex flex-col gap-0.5 px-2 lg:flex-row lg:px-0"
                >
                    <GridListItem className="bg-surface-paper flex cursor-pointer rounded-b-lg rounded-t-2xl px-3 py-5 text-inherit no-underline outline-none focus-visible:shadow-(--shadow-focus) lg:hidden ">
                        <h2 className="text-lg font-medium">Wikis</h2>
                    </GridListItem>
                    {wikis.map(f => {
                        const {
                            id,
                            properties: { pageName = '' } = {},
                            modifiedTime,
                            teamDriveId,
                            starred,
                            viewedByMeTime,
                        } = f
                        const archived = isArchived(f)
                        const date = format(
                            new Date(viewedByMeTime || modifiedTime || ''),
                            'MMMM dd, yyyy',
                        )
                        return (
                            <WikiCard
                                id={id}
                                date={date}
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
                                        myFulcrum.modifiedTime ||
                                        '',
                                ),
                                'MMMM dd, yyyy',
                            )}
                            isArchived={isArchived(myFulcrum)}
                            isStarred={myFulcrum.starred}
                            key={myFulcrum.id}
                            pageName="My Wiki"
                            teamDriveId=""
                            isDashboard={isDashboard}
                        />
                    )}
                </GridList>
            ) : null}
        </div>
    )
}

export function filterWikis(files: IFile[]): IFile[] {
    return files.filter(file => file.properties?.pageName)
}

export function sortWikisBy(attr: 'date' | 'name' = 'name', files: IFile[]) {
    if (attr === 'name') {
        return sortBy(files, file =>
            file.properties?.pageName ? file.properties.pageName : 'My Wiki',
        )
    }
    return sortBy(
        files,
        file => file.viewedByMeTime || file.modifiedTime,
    ).reverse()
}

interface WikiCardProps {
    id: string
    date: string
    isArchived?: boolean
    isDashboard?: boolean
    isStarred?: boolean
    pageName?: string
    teamDriveId?: string
}

function WikiCard({
    id,
    isArchived,
    isDashboard,
    isStarred,
    pageName,
    teamDriveId,
}: WikiCardProps) {
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
                    `${isDashboard ? 'Dashboard,' : ''}${
                        isStarred ? 'Starred,' : ''
                    }${isArchived ? 'Archived' : ''}`,
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
                    {teamDriveId ? <>in Shared with me</> : <>in My Drive</>}
                </p>
            </div>
        </GridListItemLink>
    )
}

export function getOverviewFile(files: IFile[], rootFolderId: string) {
    const overview = _.find(
        files,
        file =>
            file.name === OVERVIEW_NAME &&
            file.parents.includes(rootFolderId),
    )
    return overview ?? null
}
