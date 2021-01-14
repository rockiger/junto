//@ts-check
import React, { useGlobal } from 'reactn'
import { Redirect } from 'react-router'

import {
    H1,
    Spinner,
    Tab,
    Tabs,
    TabList,
    TabPanel,
} from 'components/gsuite-components/'
import FileList from 'components/Home/FileList'
import { WikiList } from 'components/wiki-list'

import { isArchived } from 'lib/helper'

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
                    <TabPanel style={{ maxHeight: 'calc(100vh - 168px)' }}>
                        <FileList
                            emptyMessage="Your archive is empty."
                            files={filterPages(archivedFiles)}
                            sortBy="modifiedByMeTime"
                        />
                    </TabPanel>
                    <TabPanel style={{ maxHeight: 'calc(100vh - 168px)' }}>
                        <WikiList files={archivedFiles} />
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

function filterPages(files) {
    const filtered = files.filter(file => {
        return !file.properties || !file.properties.pageName
    })
    return filtered
}
