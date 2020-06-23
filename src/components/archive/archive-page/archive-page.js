//@ts-check
import React, { useGlobal } from 'reactn'
import { Redirect } from 'react-router'

import {
    Spinner,
    Tab,
    Tabs,
    TabList,
    TabPanel,
} from 'components/gsuite-components/'
import FileList from 'components/Home/FileList'

import { isArchived } from 'lib/helper'
import H1 from 'components/gsuite-components/h1'

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
                            files={filterIsArchived(files)}
                            sortBy="modifiedByMeTime"
                        />
                    </TabPanel>
                    <TabPanel>Wikis</TabPanel>
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
