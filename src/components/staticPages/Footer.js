import React from 'react'

import './footer-link.scss'

export const Footer = () => {
    return (
        <section className="footer">
            <div className="footer__logo">
                <strong>
                    <FooterLink to="/">© Fulcrum</FooterLink>
                </strong>
            </div>
            <div>
                <FooterLink to="/privacy-policy">Privacy</FooterLink>
                <FooterLink to="/terms-of-service">Terms Of Service</FooterLink>
            </div>
        </section>
    )
}

const FooterLink = ({ children, to }) => {
    return (
        <a className="footer__link col" href={to}>
            {children}
        </a>
    )
}
