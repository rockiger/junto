import React from 'react'

import GoogleIcon from './googleIcon'
import logo from '../static/logo.svg'

export default function FrontPageHero() {
    return (
        <div className="hero">
            <div className="hero-logo">
                <img
                    src={logo}
                    alt="Awiki Logo"
                    style={{ textAlign: 'center' }}
                />
            </div>
            <h1 className="hero-title">Knowledge Base for Google Drive!</h1>
            <p className="hero-description" />
            <div className="hero-row">
                <button className="hero-heroButon">
                    <GoogleIcon />
                    <div
                        className="hero-buttonLabel"
                        onClick={() => {
                            document.getElementById('authorize_button').click()
                        }}
                    >
                        Login with Google
                    </div>
                </button>
            </div>
            <style>{`
            body {
                overflow-y: auto;
            }
            .App-main {
                padding: 0;
            }
            .hero {
                width: 100%;
                color: #333;
            }
            .hero-logo {
                padding-top: 80px;
                margin-bottom: 20px;
            }
            .logo img {
                width: 80px
            }
            .hero-title {
                margin: 0;
                width: 100%;
                line-height: 1.15;
                font-size: 60px;
                font-weight: 300;
            }
            .hero-logo,
            .hero-title,
            .hero-description {
                text-align: center;
            }
            .hero-row {
                margin: 80px 0 0px;
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                padding: 32px 0 32px;
                background-color: #f7f7f7;
                border-bottom: 1px solid #e8e8e8;
                border-top: 1px solid #e8e8e8;
            }
            .hero button {
                display: flex;
                flex-direction: row;
                align-items: center;
                background: white;
                color: #444;
                border-radius: 5px;
                border: 1px solid #d5d5d5;
                white-space: nowrap;
                cursor: pointer;
                transition: background-color 220ms ease-out;
                display: flex;
                height: 48px;
                padding-left: 1.5rem;
                text-transform: uppercase;
                letter-spacing: 0.01rem;
            }
            hero button:hover {
                background: linear-gradient(to bottom, #f8f8f8, #f1f1f1);
            }
            .hero-buttonLabel {
                padding: 0 1rem;
            }
            `}</style>
        </div>
    )
}
