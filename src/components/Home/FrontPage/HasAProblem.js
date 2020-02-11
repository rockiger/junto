import React from 'react'
import { Container, Grid, Typography } from '@material-ui/core'

import { GoogleButton } from './GoogleButton'

import assistant from 'static/img/assistant.jpg'

export const HasAProblem = () => {
    return (
        <Container className="hero-container">
            <Grid container spacing={3}>
                <Grid
                    item
                    xs={12}
                    sm={7}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        paddingRight: '2rem',
                    }}
                >
                    <Typography color="inherit" componentent="h2" variant="h4">
                        Your knowledge management should make you look smart.
                        Like an assistant that always has your back.
                    </Typography>
                    <p>Have you felt frustrated by your note-taking app?</p>
                    <ul style={{ marginTop: 0 }}>
                        <li>
                            Did you endlessly look for a note you have written?
                        </li>
                        <li>
                            Created time-consuming documents nobody looked at
                            again?
                        </li>
                        <li>
                            Find Google Keep™ is too simplistic for your ideas?
                        </li>
                        <li>
                            Think Google Docs™ sucks for reading and organizing
                            your team's knowledge?
                        </li>
                        <li>
                            Never came back to that great idea you wrote down?
                        </li>
                    </ul>
                    <GoogleButton />
                </Grid>
                <Grid
                    className="md"
                    item
                    xs={12}
                    sm={5}
                    style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <img
                        alt="Fulcrum Page"
                        className="shadow"
                        src={assistant}
                    />
                </Grid>
            </Grid>
        </Container>
    )
}
