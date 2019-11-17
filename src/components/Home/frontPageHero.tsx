import React from 'react'
//@ts-check
import { Container, Grid, Paper } from '@material-ui/core'
import GoogleIcon from 'components/googleIcon'
import page01 from 'static/img/page01.png'

export default function FrontPageHero() {
    return (
        <>
            <Container
                maxWidth={false}
                style={{ backgroundColor: '#f7f7f7', padding: '8rem 6%' }}
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
                        <h1
                            style={{
                                fontSize: 42,
                                fontWeight: 500,
                                lineHeight: 1.16,
                            }}
                        >
                            The missing knowledge base for GSuite
                        </h1>
                        <p>
                            Google Keep is to simplistic? Google Docs sucks for
                            reading and organizing your team's knowledge? Then
                            Fulcrum is for you!
                        </p>
                        <p style={{ alignItems: 'center', display: 'flex' }}>
                            <Paper
                                className="SignInWithGoogle"
                                onClick={() => {
                                    const button =
                                        document.getElementById(
                                            'authorize_button'
                                        ) || null
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
                            <strong style={{ marginLeft: 6 }}>
                                - it's free!
                            </strong>
                        </p>
                        <p>
                            <b>Disclaimer:</b> We are still in beta.
                        </p>
                    </Grid>
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
                            src={page01}
                            style={{
                                border: '1px solid #eee',
                                borderRadius: '.5rem',
                                boxShadow:
                                    '0px 1px 8px 0px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14) , 0px 3px 3px -2px rgba(0, 0, 0, 0.12)',
                                maxWidth: '100%',
                            }}
                        />
                    </Grid>
                </Grid>
            </Container>
            <style>{`
            body {
                overflow-y: auto;
            }
            .App-main {
                padding: 0;
            }
            .SignInWithGoogle:hover {
                background-color: rgb(46, 93, 170) !important;
            }
            .SignInWithGoogle svg{
                height: 18px;
                width: 18px;
            }
            
            `}</style>
        </>
    )
}
