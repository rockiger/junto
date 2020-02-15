import React from 'react'

import RayStartArrowIcon from 'mdi-react/RayStartArrowIcon'

import './has-a-plan.scss'
export const HasAPlan = () => {
    return (
        <div className="step__wrapper" maxWidth={false}>
            <div align="center">
                <h2
                    className="frontpage__header"
                    style={{
                        margin: '2rem 0',
                        textAlign: 'center',
                    }}
                >
                    3 Steps to being effortlessly organized in your Google
                    Drive.
                </h2>
                <div className="columns hero__max1280">
                    <Step
                        headline="Sign in with your Google Account"
                        position="1"
                    >
                        Simply sign up with your Google Account. Click "Sign in
                        with Google", accept the permissions and we will create
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
                </div>
            </div>
        </div>
    )
}

const Step = ({ body, children, headline, position, ...props }) => {
    return (
        <div className="step col" style={{ justifyContent: 'start' }}>
            <div className="step__icon-wrapper">
                <div
                    style={{
                        alignItems: 'center',
                        color: 'white',
                        backgroundColor: '#4285f4',
                        borderRadius: '50%',
                        display: 'flex',
                        height: 96,
                        justifyContent: 'center',
                        minWidth: 96,
                        width: 96,
                    }}
                >
                    <div style={{ fontSize: '3rem', fontWeight: 400 }}>
                        {position}
                    </div>
                </div>
            </div>
            <h4 style={{ fontSize: '1.25rem' }}>{headline}</h4>
            <p align="center" component="p">
                {children}
            </p>
            <RayStartArrowIcon className="step__icon" />
        </div>
    )
}
