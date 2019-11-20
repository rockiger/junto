//@ts-check
import React from 'react'
import { Container, Grid, Link, Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import GoogleKeepIcon from 'mdi-react/GoogleKeepIcon'
import GoogleDocsIcon from 'mdi-react/FileDocumentIcon'

import GoogleIcon from 'components/googleIcon'

import gsuiteIntegrations from 'static/img/gsuite-integrations.png'
import instantSearch from 'static/img/instant-search.png'
import logo from 'static/logo.svg'
import page01 from 'static/img/page01.png'
import page02 from 'static/img/page02.png'

export default function FrontPageHero() {
    const styles = useStyles()
    return (
        <>
            <Container
                className={styles.heroContainer}
                maxWidth={false}
                style={{ backgroundColor: '#f7f7f7' }}
            >
                <Grid container spacing={3}>
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            paddingRight: '2rem',
                        }}
                    >
                        <h1>The missing knowledge base for G&nbsp;Suite™</h1>
                        <p>
                            Google Keep™ is too simplistic? Google Docs™ sucks
                            for reading and organizing your team's knowledge?
                        </p>
                        <p>Then Fulcrum is for you!</p>
                        <p className={styles.sm}>
                            <img
                                className={styles.shadow}
                                alt="Fulcrum Page"
                                src={page01}
                            />
                        </p>
                        <p style={{ alignItems: 'center', display: 'flex' }}>
                            <GoogleButton />
                            <strong style={{ marginLeft: 6 }}>
                                - it's free!
                            </strong>
                        </p>
                        <p>
                            <b>Disclaimer:</b> We are still in beta.
                        </p>
                    </Grid>
                    <Grid
                        className={styles.md}
                        item
                        xs={12}
                        sm={6}
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <img
                            className={styles.shadow}
                            alt="Fulcrum Page"
                            src={page01}
                        />
                    </Grid>
                </Grid>
            </Container>
            <Container>
                <h2 style={{ margin: '80px auto', textAlign: 'center' }}>
                    Why Fulcrum?
                </h2>
                <Grid container spacing={3}>
                    <Grid
                        className={styles.whyIconContainer}
                        item
                        sm={4}
                        xs={12}
                    >
                        <GoogleKeepIcon
                            color={'rgba(0, 0, 0, 0.54)'}
                            size={64}
                        />
                        <p>
                            When we started with G Suite we were looking for a
                            solution to{' '}
                            <strong>create our knowledge base</strong>. We first
                            tested <strong>Keep</strong>. Though it's great for
                            taking notes, it's much
                            <strong>
                                {' '}
                                too simplistic to create compelling
                                documentation{' '}
                            </strong>{' '}
                            for your work.{' '}
                        </p>
                    </Grid>
                    <Grid
                        className={styles.whyIconContainer}
                        item
                        sm={4}
                        xs={12}
                    >
                        <GoogleDocsIcon
                            color={'rgba(0, 0, 0, 0.54)'}
                            size={64}
                        />
                        <p>
                            We then switched to <strong>Docs</strong> - which is{' '}
                            <strong>a great word processor</strong>! Maybe the
                            best we ever used. For{' '}
                            <strong>reading and finding</strong> information on
                            the other hand it is a real pain. It's very
                            cumbersome to create an information structure with
                            Docs and the l
                            <strong>oading of documents takes ages</strong> if
                            you just want to look up something.{' '}
                            <strong>
                                It is made for writing, not reading.
                            </strong>
                        </p>
                    </Grid>
                    <Grid
                        className={styles.whyIconContainer}
                        item
                        sm={4}
                        xs={12}
                    >
                        <img src={logo} alt="Fulcrum Logo" height={64} />
                        <p>
                            After this experience we started to build Fulcrum.{' '}
                            <strong>It fits right in there.</strong> It is the
                            missing link between Keep and Docs. Create{' '}
                            <strong>powerful documentation</strong> right in
                            your personal Google Drive or collaborate{' '}
                            <strong>with your team</strong> on a shared Drive.
                        </p>
                    </Grid>
                </Grid>
            </Container>
            <Container className={styles.container} maxWidth={false}>
                <Grid container spacing={3}>
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <img
                            alt=""
                            src={page02}
                            style={{
                                border: '1px solid #eee',
                                borderRadius: '.5rem',
                                boxShadow:
                                    '0px 1px 8px 0px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14) , 0px 3px 3px -2px rgba(0, 0, 0, 0.12)',
                                maxWidth: '100%',
                            }}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            paddingLeft: '2rem',
                        }}
                    >
                        <h2>
                            Build great looking pages - all saved in your Google
                            Drive
                        </h2>
                        <p>
                            Create pages with{' '}
                            <strong>all content formats</strong> you need.
                            Tables, Images, Lists - you name it. Write a new
                            marketing plan, document your workflow for employee
                            onboarding or write a memo for your co-workers.
                        </p>
                        <p>
                            The best is:{' '}
                            <strong>Everything stays on your Drives</strong>.
                            Unlike other tools, we don't introduce a new SaaS
                            infrastructure to your business. All the content you
                            create is saved on your Drives.{' '}
                            <strong>Nothing is saved on our servers.</strong>
                        </p>
                    </Grid>
                </Grid>
            </Container>
            <Container className={styles.container} maxWidth={false}>
                <Grid container spacing={3}>
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            paddingRight: '2rem',
                        }}
                    >
                        <h2>Easily find & navigate your work</h2>
                        <p>
                            Always stay on top of your work. Organize your{' '}
                            <strong>work in different Drives</strong> and create
                            sub-pages of your work. Access your most recent and
                            important work instantly.
                        </p>
                        <p>
                            <strong>Don't waste your time</strong> with
                            searching. Find what you are looking for with a
                            powerful search - just like you expect from any
                            other Google product.
                        </p>
                        <img
                            alt="Search"
                            src={instantSearch}
                            style={{
                                maxWidth: 645,
                                width: '100%',
                            }}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            paddingLeft: '1rem',
                        }}
                    >
                        <h2>Work seamlessly with your G Suite</h2>
                        <p>
                            Fulcrum allows you to <strong>connect</strong> your{' '}
                            <strong>
                                pages with other G Suite applications
                            </strong>
                            . Insert your photos into your pages. Open
                            documents, presentation and spreadsheets directly
                            from your pages. Share them with your co-workers.
                        </p>
                        <p>
                            Everything is tightly integrated. We even stick to
                            Google's design guidelines that you and your
                            team-mates are <strong>productive instantly</strong>
                            .
                        </p>

                        <img
                            alt="Share pages"
                            src={gsuiteIntegrations}
                            style={{
                                border: '1px solid #eee',
                                borderRadius: '.5rem',
                                boxShadow:
                                    '0px 1px 8px 0px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14) , 0px 3px 3px -2px rgba(0, 0, 0, 0.12)',
                                maxWidth: 643,
                                width: '100%',
                            }}
                        />
                    </Grid>
                </Grid>
            </Container>
            <Container maxWidth="sm">
                <div
                    className="hero-logo"
                    style={{ paddingTop: 0, textAlign: 'center' }}
                >
                    <img src={logo} alt="Fulcrum Logo" style={{ width: 64 }} />
                </div>
                <h2 style={{ margin: '2rem 0', textAlign: 'center' }}>
                    Get started with Fulcrum?
                </h2>

                <p
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <GoogleButton />
                </p>
            </Container>
            <footer className={styles.footer}>
                <Container>
                    <Grid container>
                        <Grid item sm={2} xs={12}>
                            <Typography color="textSecondary">
                                <strong>© Fulcrum</strong>
                            </Typography>
                        </Grid>
                        <Grid item sm={10} xs={12}>
                            <Link
                                className={styles.footerLink}
                                color="textSecondary"
                                href="https://rockiger.com/en/privacy/"
                                target="blank"
                            >
                                Privacy
                            </Link>
                        </Grid>
                    </Grid>
                </Container>
            </footer>
            <style>{`
            body {
                overflow-y: auto;
                font-size: 1rem;
            }
            .App-main {
                padding: 0;
                margin-top: 57px;
            }
            .hero-container {
                padding: 8rem 6%
            }
            .SignInWithGoogle:hover {
                background-color: rgb(46, 93, 170) !important;
            }
            .SignInWithGoogle svg{
                height: 18px;
                width: 18px;
            }
            
            .hero-logo {
                padding-top: 80px;
                margin-bottom: 20px;
            }
            
            h1, h2 {
                font-size: 42px;
                font-weight: 500;
                line-height: 1.2
            }
            `}</style>
        </>
    )
}

const GoogleButton = () => (
    <Paper
        className="SignInWithGoogle"
        onClick={() => {
            const button = document.getElementById('authorize_button') || null
            if (button) button.click()
        }}
        style={{
            alignItems: 'center',
            backgroundColor: 'var(--primary-color)',
            border: '1px solid var(--primary-color)',
            borderRadius: 2,
            cursor: 'pointer',
            display: 'flex',
            height: 40,
            width: 'fit-content',
        }}
    >
        <div
            style={{
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: '1',
                display: 'flex',
                height: '100%',
                paddingLeft: 12,
                paddingRight: 12,
            }}
        >
            <GoogleIcon active="true" />
        </div>
        <div
            style={{
                color: 'white',
                fontWeight: 500,
                paddingLeft: 12,
                paddingRight: 16,
            }}
        >
            Sign in with Google
        </div>
    </Paper>
)

export const useStyles = makeStyles(theme => {
    return {
        shadow: {
            border: '1px solid #eee',
            borderRadius: '.5rem',
            boxShadow:
                '0px 1px 8px 0px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14) , 0px 3px 3px -2px rgba(0, 0, 0, 0.12)',
            maxWidth: '100%',
        },
        heroContainer: {
            padding: '3rem 6%',
            [theme.breakpoints.up('sm')]: {
                padding: '8rem 6%',
            },
        },
        container: {
            margin: '3rem 0',
            padding: '0 6%',
            [theme.breakpoints.up('sm')]: {
                margin: '8rem 0',
                padding: '0 6%',
            },
        },
        footer: {
            marginTop: 'auto',
            padding: '5rem 1rem 1rem',
        },
        footerLink: {
            margin: '4px 16px',
        },
        md: {
            display: 'none',
            [theme.breakpoints.up('sm')]: {
                display: 'flex',
            },
        },
        sm: {
            [theme.breakpoints.up('sm')]: {
                display: 'none',
            },
        },
        whyIconContainer: {
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
        },
    }
})
