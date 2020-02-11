import React from 'react'
import { Avatar, Container, Typography } from '@material-ui/core'

import henryLevins from 'static/img/Henry_Levins.jpg'

import './testimonials.scss'

export const Testimonials = () => {
    return (
        <Container className="testimonials-wrapper" maxWidth={false}>
            <Container align="center">
                <Avatar
                    alt="Henry Levins"
                    className="testimonials__large-img"
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
