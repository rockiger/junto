//@ts-check
import React, { useGlobal } from 'reactn'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

import FolderGoogleDriveIcon from 'mdi-react/FolderGoogleDriveIcon'
import FolderAccountIcon from 'mdi-react/FolderAccountIcon'

import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    H1,
    Spinner,
    Tab,
    Tabs,
    TabList,
    TabPanel,
} from 'components/gsuite-components/'
import FileList from 'components/Home/FileList'

import { isArchived } from 'lib/helper'

import s from './archive-page.module.scss'

export default ArchivePage
export { ArchivePage }

/**
 * @typedef ArchivePageProps
 * @property {boolean} isSignedIn
 * @property {boolean} isSigningIn
 */

/**
 * A archive-page component.
 * @param {ArchivePageProps} props
 */
function ArchivePage({ isSignedIn, isSigningIn }) {
    const [files] = useGlobal('files')
    const archivedFiles = filterIsArchived(files)

    if (isSignedIn && !isSigningIn) {
        return (
            <>
                <H1>Archive</H1>
                <Tabs>
                    <TabList>
                        <Tab>Pages</Tab>
                        <Tab>Wikis</Tab>
                    </TabList>
                    <TabPanel>
                        <FileList
                            emptyMessage="Your archive is empty."
                            files={filterPages(archivedFiles)}
                            sortBy="modifiedByMeTime"
                        />
                    </TabPanel>
                    <TabPanel>
                        <div style={{ paddingTop: 16 }}>
                            {filterWikis(archivedFiles).map(f => {
                                const {
                                    id,
                                    properties: { pageName },
                                    modifiedTime,
                                    teamDriveId,
                                    parents,
                                } = f
                                const date = format(
                                    new Date(modifiedTime),
                                    'MMMM dd, yyyy'
                                )
                                const folder = getWikiRootFolder(
                                    parents[0],
                                    files
                                )
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
                                                            className={
                                                                s.FooterIcon
                                                            }
                                                        />{' '}
                                                        Shared Drive
                                                    </>
                                                ) : (
                                                    <>
                                                        <FolderGoogleDriveIcon
                                                            className={
                                                                s.FooterIcon
                                                            }
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
                    </TabPanel>
                </Tabs>
            </>
        )
    } else if (!isSignedIn && isSigningIn) {
        return (
            <div style={{ marginTop: '2rem' }}>
                <Spinner />
            </div>
        )
    } else {
        return <Redirect to={'/'} />
    }
}

function filterIsArchived(files) {
    const filtered = files.filter(file => {
        return isArchived(file)
    })
    return filtered
}

function filterWikis(files) {
    const filtered = files.filter(file => {
        return file.properties && file.properties.pageName
    })
    return filtered
}

function filterPages(files) {
    const filtered = files.filter(file => {
        return !file.properties || !file.properties.pageName
    })
    return filtered
}

function getWikiRootFolder(folderId, files) {
    const folder = files.find(f => f.id === folderId)
    return folder
}
