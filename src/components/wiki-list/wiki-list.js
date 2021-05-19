//@ts-check
import React, { useGlobal } from 'reactn'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { format } from 'date-fns'
import { sortBy } from 'lodash'

import FolderGoogleDriveIcon from 'mdi-react/FolderGoogleDriveIcon'
import FolderAccountIcon from 'mdi-react/FolderAccountIcon'

import { EmptyPlaceholder } from 'components/Home/FileList/EmptyPlaceHolder'
import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Spacer,
    Spinner,
} from 'components/gsuite-components'
import ArchiveIcon from 'mdi-react/ArchiveIcon'
import CheckboxMultipleBlankOutlineIcon from 'mdi-react/CheckboxMultipleBlankOutlineIcon'
import StarIcon from 'mdi-react/StarIcon'

import { OVERVIEW_NAME } from 'lib/constants'
import { isArchived } from 'lib/helper'
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
function WikiList({ files, isDashboard, orderBy = 'name' }) {
    const [initialFiles] = useGlobal('initialFiles')
    const [isFileListLoading] = useGlobal('isFileListLoading')
    const [rootFolderId] = useGlobal('rootFolderId')
    const wikis = sortWikisBy(orderBy, filterWikis(files))
    const myFulcrum = getOverviewFile(files, rootFolderId)
    return (
        <div className={s.WikiList}>
            {!isFileListLoading &&
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
            {isFileListLoading && <Spinner />}
            <div
                className={clsx(
                    s.WikiList_container,
                    isDashboard && s.WikiList_container__isDashboard
                )}
            >
                {wikis.map(f => {
                    const {
                        id,
                        //@ts-ignore
                        properties: { pageName },
                        modifiedTime,
                        teamDriveId,
                        parents,
                        starred,
                        viewedByMeTime,
                    } = f
                    const archived = isArchived(f)
                    //@ts-ignore
                    const date = format(
                        //@ts-ignore
                        new Date(viewedByMeTime || modifiedTime),
                        'MMMM dd, yyyy'
                    )
                    const folder = getWikiRootFolder(parents[0], initialFiles)
                    return (
                        <WikiCard
                            id={id}
                            date={date}
                            description=""
                            isArchived={archived}
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
                            //@ts-ignore
                            new Date(
                                myFulcrum.viewedByMeTime ||
                                    myFulcrum.modifiedTime
                            ),
                            'MMMM dd, yyyy'
                        )}
                        description=""
                        isArchived={isArchived(myFulcrum)}
                        isStarred={myFulcrum.starred}
                        key={myFulcrum.id}
                        pageName="My Fulcrum"
                        teamDriveId=""
                    />
                )}
            </div>
        </div>
    )
}

export function filterWikis(files) {
    const filtered = files.filter(file => {
        return file.properties && file.properties.pageName
    })
    return filtered
}

/**
 *
 * @param {'date'|'name'} attr
 * @param {import('reactn/default').IFile[]} files
 * @returns {import('reactn/default').IFile[]}
 */
export function sortWikisBy(attr = 'name', files) {
    if (attr === 'name') {
        return sortBy(files, file =>
            file.properties && file.properties.pageName
                ? file.properties.pageName
                : 'My Fulcrum'
        )
    } else {
        return sortBy(
            files,
            file => file.viewedByMeTime || file.modifiedTime
        ).reverse()
    }
}

function getWikiRootFolder(folderId, files) {
    const folder = files.find(f => f.id === folderId)
    return folder
}

function WikiCard({
    id,
    date,
    description,
    isArchived,
    isStarred,
    pageName,
    teamDriveId,
}) {
    return (
        <Link key={id} to={`/page/${id}`}>
            <Card>
                <CardHeader
                    avatar={pageName[0]}
                    subtitle={date}
                    title={pageName}
                />
                <CardBody>{description}</CardBody>
                <CardFooter>
                    {teamDriveId ? (
                        <>
                            <FolderAccountIcon className={s.FooterIcon} />{' '}
                            Shared Drive
                        </>
                    ) : (
                        <>
                            <FolderGoogleDriveIcon className={s.FooterIcon} />{' '}
                            My Drive
                        </>
                    )}
                    <Spacer />
                    {isArchived && <ArchiveIcon />}
                    {isStarred && <StarIcon style={{ color: '#fbbc05' }} />}
                </CardFooter>
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
    const overview = files.find(
        file =>
            file.name === OVERVIEW_NAME && file.parents.includes(rootFolderId)
    )
    if (overview) return overview
    return null
}
