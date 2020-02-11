import React from 'react'
import { Container, Grid, Link, Typography } from '@material-ui/core'

import './footer-link.scss'

export const Footer = () => {
    return (
        <footer className="footer">
            <Container>
                <Grid container>
                    <Grid item sm={2} xs={12}>
                        <Typography color="textSecondary">
                            <strong>
                                <FooterLink to="/">© Fulcrum</FooterLink>
                            </strong>
                        </Typography>
                    </Grid>
                    <Grid item sm={10} xs={12}>
                        <FooterLink to="/privacy-policy">Privacy</FooterLink>
                        <FooterLink to="/terms-of-service">
                            Terms Of Service
                        </FooterLink>
                    </Grid>
                </Grid>
            </Container>
        </footer>
    )
}

const FooterLink = ({ children, to }) => {
    return (
        <Link className="footer__link" to={to} color="textSecondary" href={to}>
            {children}
        </Link>
    )
}
