import React from 'react'
import { Avatar, Container, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import henryLevins from 'static/img/Henry_Levins.jpg'

export const Testimonials = () => {
    const styles = useStyles()
    return (
        <Container className={styles.wrapper} maxWidth={false}>
            <Container align="center">
                <Avatar
                    alt="Henry Levins"
                    className={styles.largeImg}
                    src={henryLevins}
                />
                <blockquote
                    style={{
                        borderLeft: 'none',
                        color: 'inherit',
                        fontWeight: 500,
                    }}
                >
                    Finally, a way to make sense of all the content in my Google
                    Drive.
                </blockquote>
                <Typography variant="caption">
                    Henry Levens
                    <br />
                    CEO, Acuserv
                </Typography>
            </Container>
        </Container>
    )
}

export const useStyles = makeStyles(theme => {
    console.log(theme.palette)
    return {
        wrapper: {
            color: 'white',
            backgroundColor: 'rgba(66, 133, 244, 1)',
            padding: '5rem',
        },
        largeImg: {
            height: 128,
            width: 128,
        },
    }
})
