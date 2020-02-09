import React from 'react'
import { Container, Grid, Link, Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

export const AndMeetsAGuide = ({}) => {
    const styles = useStyles()

    return (
        <Container
            className={styles.heroContainer}
            maxWidth={false}
            style={{ backgroundColor: '#f7f7f7' }}
        >
            <Container>
                <h2>
                    Your knowledge management should make you smarter. Like an
                    assistent that never sleeps.
                </h2>
            </Container>
        </Container>
    )
}

export const useStyles = makeStyles(theme => {
    return {
        heroContainer: {
            padding: '3rem 6%',
            [theme.breakpoints.up('sm')]: {
                padding: '8rem 6%',
            },
        },
    }
})