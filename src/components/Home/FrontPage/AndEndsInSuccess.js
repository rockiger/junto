import React from 'react'
import { Container, Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import BookPlusMultipleIcon from 'mdi-react/BookPlusMultipleIcon'
import MagnifyIcon from 'mdi-react/MagnifyIcon'
import ShareVariantIcon from 'mdi-react/ShareVariantIcon'

export const AndEndsInSuccess = () => {
    const styles = useStyles()
    return (
        <Container className={styles.reasonWrapper} maxWidth={false}>
            <Container>
                <h2
                    style={{
                        color: 'white',
                        margin: 0,
                        marginBottom: '2rem',
                        textAlign: 'center',
                    }}
                >
                    Manage your knowledge.
                    <br />
                    Have your records always ready.
                </h2>
                <Grid container spacing={10}>
                    <Reason
                        headline="Capture Knowledge"
                        icon={BookPlusMultipleIcon}
                    >
                        <strong>Easily create</strong> pages with{' '}
                        <strong>your knowledge</strong>. Projects, Meeting
                        notes, marketing plans - everything saved{' '}
                        <strong>in your Google Drive</strong>.
                    </Reason>
                    <Reason
                        headline="Find information faster"
                        icon={MagnifyIcon}
                    >
                        <strong>Organinze your records</strong> like your
                        personal Wikipedia. <strong>Link, group and tag</strong>{' '}
                        your content or{' '}
                        <strong>use the Google powered search</strong> to find
                        all your records fast.
                    </Reason>
                    <Reason headline="Share Your Work" icon={ShareVariantIcon}>
                        You <strong>created</strong> some{' '}
                        <strong>awesome piece</strong> of content?{' '}
                        <strong>Share it</strong> with others, that{' '}
                        <strong>they can enjoy</strong> your hard work.
                    </Reason>
                </Grid>
            </Container>
        </Container>
    )
}

const Reason = ({ body, children, headline, icon, ...props }) => {
    const Icon = icon
    const styles = useStyles()
    return (
        <Grid className={styles.reason} item sm={4} xs={12}>
            <div className={styles.iconWrapper}>
                <Icon className={styles.icon} size={48} />
            </div>
            <Typography
                align="center"
                color="inherit"
                component="h3"
                gutterBottom
                style={{ marginTop: '2rem' }}
                variant="h4"
            >
                {headline}
            </Typography>
            <Typography align="center" component="p">
                {children}
            </Typography>
        </Grid>
    )
}
export const useStyles = makeStyles(theme => {
    console.log(theme.palette)
    return {
        reasonWrapper: {
            color: 'white',
            backgroundColor: 'rgba(66, 133, 244, 1)',
            padding: '5rem',
        },
        reason: {
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
