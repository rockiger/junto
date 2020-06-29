//@ts-check
import React, { useGlobal } from 'reactn'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

import FolderGoogleDriveIcon from 'mdi-react/FolderGoogleDriveIcon'
import FolderAccountIcon from 'mdi-react/FolderAccountIcon'

import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
} from 'components/gsuite-components'

import s from './wiki-list.module.scss'

export default WikiList
export { WikiList }

/**
 * @typedef {Object.<string,any>} WikiListProps
 */

/**
 * A wiki-list component.
 * @param {WikiListProps} props
 */
function WikiList({ files }) {
    const [initialFiles] = useGlobal('initialFiles')
    const archivedWikis = filterWikis(files)
    console.log(archivedWikis)
    return (
        <div className={s.WikiList}>
            {archivedWikis.length === 0 && (
                <h2 className={s.emptyMessage}>Your wiki archive is empty.</h2>
            )}
            <div style={{ paddingTop: 16 }}>
                {archivedWikis.map(f => {
                    const {
                        id,
                        properties: { pageName },
                        modifiedTime,
                        teamDriveId,
                        parents,
                    } = f
                    const date = format(new Date(modifiedTime), 'MMMM dd, yyyy')
                    const folder = getWikiRootFolder(parents[0], initialFiles)
                    const { description } = folder
                    return (
                        <Link to={`/page/${id}`}>
                            <Card key={id}>
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

function filterWikis(files) {
    const filtered = files.filter(file => {
        return file.properties && file.properties.pageName
    })
    return filtered
}

function getWikiRootFolder(folderId, files) {
    const folder = files.find(f => f.id === folderId)
    return folder
}
