//@ts-check
import React from 'react'
import { Container, Grid, Link, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { AndEndsInSuccess } from './FrontPage/AndEndsInSuccess'
import { GoogleButton } from './FrontPage/GoogleButton'
import { HasAPlan } from './FrontPage/HasAPlan'
import { HasAProblem } from './FrontPage/HasAProblem'
import { Testimonials } from './FrontPage/Testimonials'

import gsuiteIntegrations from 'static/img/gsuite-integrations.png'
import instantSearch from 'static/img/instant-search.png'
import page01 from 'static/img/page01.png'
import page02 from 'static/img/page02.png'
import GoogleDriveLogo from 'static/googleDriveLogo.svg'

export default function FrontPageHero() {
    document.title = 'Fulcrum.wiki - The knowledge base made for Google Drive'
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
                        <h1>
                            Effortless.
                            <br />
                            Organized.
                            <br />
                            <img
                                alt=""
                                src={GoogleDriveLogo}
                                style={{
                                    bottom: -12,
                                    height: 46,
                                    position: 'relative',
                                }}
                            />
                            .
                        </h1>
                        <p>
                            <b>Capture</b> knowledge. <b>Find</b> information
                            faster. <b>Share</b> your ideas with others.
                        </p>
                        <p>
                            Projects, Meeting notes, marketing plans -
                            everything <b>saved in your Google Drive</b>.
                        </p>
                        <p className={styles.sm}>
                            <img
                                className={styles.shadow}
                                alt="Fulcrum Page"
                                src={page01}
                            />
                        </p>
                        <div style={{ alignItems: 'center', display: 'flex' }}>
                            <GoogleButton />
                            <strong style={{ marginLeft: 6 }}>
                                - it's free!
                            </strong>
                        </div>
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
            <div className={styles.callToAction}>
                <GoogleButton />
            </div>
            <HasAProblem />
            <AndEndsInSuccess />
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
                            <strong>Don't waste your time</strong>
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
            <Testimonials />
            <HasAPlan />
            <Container maxWidth="sm">
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <GoogleButton />
                </div>
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
        callToAction: {
            bottom: 20,
            position: 'fixed',
            right: 20,
            [theme.breakpoints.down('sm')]: {
                display: 'none',
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
