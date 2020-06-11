import React, { useGlobal } from 'reactn'
import { ReactElement } from 'react'
import { Route } from 'react-router-dom'

import { ArchivePage } from 'components/archive'
import { CreateNewWiki } from 'components/CreateNewWiki'
import { Drive } from 'components/Drive/index'
import Home from 'components/Home'
import Page from 'components/Page'
import { SharedWithMe } from 'components/SharedWithMe'
import { PrivacyPolicy, TermsOfService, FAQ } from 'components/staticPages'
import styles from './main.module.scss'

export default function Main(props: any): ReactElement {
    const [isCreatingNewFile] = useGlobal('isCreatingNewFile')
    const [isSignedIn] = useGlobal('isSignedIn')
    const [isSigningIn] = useGlobal('isSigningIn')
    const [, setGoToNewFile] = useGlobal('goToNewFile')

    return (
        <div className={styles.Main}>
            <Route
                exact
                path="/"
                render={(props: any) => (
                    <Home
                        {...props}
                        isCreatingNewFile={isCreatingNewFile}
                        isSignedIn={isSignedIn}
                        isSigningIn={isSigningIn}
                        setGoToNewFile={setGoToNewFile}
                    />
                )}
            />
            <Route exact path="/archive">
                <ArchivePage
                    isSignedIn={isSignedIn}
                    isSigningIn={isSigningIn}
                />
            </Route>
            <Route
                exact
                path="/page/:id"
                render={(props: any) => (
                    <Page
                        {...props}
                        isCreatingNewFile={isCreatingNewFile}
                        isSignedIn={isSignedIn}
                        isSigningIn={isSigningIn}
                        setGoToNewFile={setGoToNewFile}
                    />
                )}
            />
            <Route
                exact
                path="/shared-with-me"
                render={(props: any) => (
                    <SharedWithMe
                        {...props}
                        isCreatingNewFile={isCreatingNewFile}
                        isSignedIn={isSignedIn}
                        isSigningIn={isSigningIn}
                        setGoToNewFile={setGoToNewFile}
                    />
                )}
            />
            <Route exact path="/drive/" render={(props) => <Drive />} />
            <Route
                exact
                path="/new/"
                render={(props: any) => (
                    <CreateNewWiki
                        isSignedIn={isSignedIn}
                        isSigningIn={isSigningIn}
                    />
                )}
            />
            <Route exact path="/faq" render={(props: any) => <FAQ />} />

            <Route
                exact
                path="/privacy-policy"
                render={(props: any) => <PrivacyPolicy />}
            />
            <Route
                exact
                path="/terms-of-service"
                render={(props: any) => <TermsOfService />}
            />
        </div>
    )
}
