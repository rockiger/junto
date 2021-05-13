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
    Spinner,
} from 'components/gsuite-components'

import s from './wiki-list.module.scss'
import CheckboxMultipleBlankOutlineIcon from 'mdi-react/CheckboxMultipleBlankOutlineIcon'

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
    const wikis = sortWikisBy(orderBy, filterWikis(files))
    return (
        <div className={s.WikiList}>
            {!isFileListLoading && wikis.length === 0 && (
                <EmptyPlaceholder
                    icon={CheckboxMultipleBlankOutlineIcon}
                    title="Your wiki archive is empty."
                />
            )}
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
                        viewedByMeTime,
                    } = f
                    //@ts-ignore
                    const date = format(
                        //@ts-ignore
                        new Date(viewedByMeTime || modifiedTime),
                        'MMMM dd, yyyy'
                    )
                    const folder = getWikiRootFolder(parents[0], initialFiles)
                    const { description } = folder
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
                                            <FolderAccountIcon
                                                className={s.FooterIcon}
                                            />{' '}
                                            Shared Drive
                                        </>
                                    ) : (
                                        <>
                                            <FolderGoogleDriveIcon
                                                className={s.FooterIcon}
                                            />{' '}
                                            My Drive
                                        </>
                                    )}{' '}
                                </CardFooter>
                            </Card>
                        </Link>
                    )
                })}
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
