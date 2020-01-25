import React from 'react'
import { Container, Grid, Link, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
// import { Link } from 'react-router-dom'

export const Footer = () => {
    document.title = 'Privacy Policy - Fulcrum.wiki'
    const styles = useStyles()
    return (
        <footer className={styles.footer}>
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
    const styles = useStyles()
    return (
        <Link
            className={styles.footerLink}
            to={to}
            color="textSecondary"
            href={to}
        >
            {children}
        </Link>
    )
}

const useStyles = makeStyles(theme => {
    return {
        footer: {
            marginTop: 'auto',
            padding: '5rem 1rem 1rem',
        },
        footerLink: {
            color: theme.palette.text.secondary,
            margin: '4px 16px',
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
    }
})
