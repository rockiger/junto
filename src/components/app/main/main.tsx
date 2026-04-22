import { useGlobal } from 'reactn'
import type { ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'

import { ArchivePage } from 'components/archive'
import { CreateNewWiki } from 'components/CreateNewWiki'
import { Drive } from 'components/Drive/index'
import Home from 'components/Home'
import Page from 'components/Page'
import { SharedWithMe } from 'components/SharedWithMe'
import { PrivacyPolicy, TermsOfService, FAQ } from 'components/staticPages'
import styles from './main.module.scss'
import { WikiOverview } from 'components/wiki-overview'
import StarredPage from 'components/Starred/StarredPage'

export default function Main(): ReactElement {
    const [isCreatingNewFile] = useGlobal('isCreatingNewFile')
    const [isSignedIn] = useGlobal('isSignedIn')
    const [isSigningIn] = useGlobal('isSigningIn')
    const [, setGoToNewFile] = useGlobal('goToNewFile')

    return (
        <div className={styles.Main}>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            isCreatingNewFile={isCreatingNewFile}
                            isSignedIn={isSignedIn}
                            isSigningIn={isSigningIn}
                            setGoToNewFile={setGoToNewFile}
                        />
                    }
                />
                <Route
                    path="/archive"
                    element={
                        <ArchivePage
                            isSignedIn={isSignedIn}
                            isSigningIn={isSigningIn}
                        />
                    }
                />
                <Route
                    path="/page/:id"
                    element={
                        <Page
                            isCreatingNewFile={isCreatingNewFile}
                            isSignedIn={isSignedIn}
                            isSigningIn={isSigningIn}
                            setGoToNewFile={setGoToNewFile}
                        />
                    }
                />
                <Route
                    path="/shared-with-me"
                    element={
                        <SharedWithMe
                            isCreatingNewFile={isCreatingNewFile}
                            isSignedIn={isSignedIn}
                            isSigningIn={isSigningIn}
                            setGoToNewFile={setGoToNewFile}
                        />
                    }
                />
                <Route path="/drive" element={<Drive />} />
                <Route path="/drive/" element={<Drive />} />
                <Route
                    path="/new"
                    element={
                        <CreateNewWiki
                            isSignedIn={isSignedIn}
                            isSigningIn={isSigningIn}
                        />
                    }
                />
                <Route
                    path="/new/"
                    element={
                        <CreateNewWiki
                            isSignedIn={isSignedIn}
                            isSigningIn={isSigningIn}
                        />
                    }
                />
                <Route path="/faq" element={<FAQ />} />

                <Route
                    path="/privacy-policy"
                    element={<PrivacyPolicy />}
                />
                <Route
                    path="/starred"
                    element={
                        <StarredPage
                            isSignedIn={isSignedIn}
                            isSigningIn={isSigningIn}
                        />
                    }
                />
                <Route
                    path="/terms-of-service"
                    element={<TermsOfService />}
                />
                <Route path="/wikis" element={<WikiOverview />} />
            </Routes>
        </div>
    )
}
