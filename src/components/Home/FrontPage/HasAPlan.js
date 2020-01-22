import React from 'react'
import { Avatar, Container, Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import RayStartArrowIcon from 'mdi-react/RayStartArrowIcon'

export const HasAPlan = () => {
    const styles = useStyles()
    return (
        <Container className={styles.stepWrapper} maxWidth={false}>
            <Container align="center">
                <h2
                    style={{
                        margin: 0,
                        marginBottom: '2rem',
                        maxWidth: '50%',
                        textAlign: 'center',
                    }}
                >
                    3 Steps to being effortlessly organized in your Google
                    Drive.
                </h2>
                <Grid container spacing={10}>
                    <Step
                        headline="Sign in with your Google Account"
                        position="1"
                    >
                        Simply sign up with your Google Account. Click "Sign in
                        with Google", accept the permission and we will create
                        your personal wiki. No further registration steps are
                        necessary.
                    </Step>
                    <Step headline="Capture your knowledge" position="2">
                        Create notes, link to files in your Google Drive, author
                        memos. Do what you want. It is your personal wiki.
                    </Step>
                    <Step
                        headline="Add more wikis in your Google Drive
"
                        position="3"
                    >
                        Do your notes outgrow your personal wiki? Do yoou need
                        to collaborate with others? Create more wikis where you
                        need them from Google Drive - Shared Drives included.
                    </Step>
                </Grid>
            </Container>
        </Container>
    )
}

const Step = ({ body, children, headline, position, ...props }) => {
    const styles = useStyles()
    return (
        <Grid className={styles.step} item sm={4} xs={12}>
            <div className={styles.iconWrapper}>
                <Avatar
                    style={{
                        backgroundColor: 'var(--primary-color)',
                        height: 96,
                        width: 96,
                    }}
                >
                    <Typography component="span" variant="h3">
                        {position}
                    </Typography>
                </Avatar>
            </div>
            <Typography
                align="center"
                color="inherit"
                component="h4"
                gutterBottom
                style={{ marginTop: '2rem' }}
                variant="h6"
            >
                {headline}
            </Typography>
            <Typography align="center" component="p">
                {children}
            </Typography>
            <RayStartArrowIcon style={{ fill: 'var(--primary-color)' }} />
        </Grid>
    )
}
export const useStyles = makeStyles(theme => {
    console.log(theme.palette)
    return {
        stepWrapper: {
            padding: '5rem',
        },
        step: {
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
        },
        icon: {
            fill: 'white',
        },
        iconWrapper: {
            alignItems: 'center',
            borderWidth: 4,
            borderRadius: '50%',
            borderColor: 'white',
            borderStyle: 'solid',
            display: 'flex',
            height: 96,
            justifyContent: 'center',
            marginTop: '3rem',
            textAlign: 'center',
            width: 96,
        },
    }
})
