import React from 'react'

import BookPlusMultipleIcon from 'mdi-react/BookPlusMultipleIcon'
import MagnifyIcon from 'mdi-react/MagnifyIcon'
import ShareVariantIcon from 'mdi-react/ShareVariantIcon'

import './and-ends-in-success.scss'

export const AndEndsInSuccess = () => {
    return (
        <div className="reason-wrapper">
            <div
                className="hero hero__max1280"
                style={{ paddingLeft: 0, paddingRight: 0 }}
            >
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <h2
                        className="frontpage__header"
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
                </div>
                <div className="columns">
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
                        <strong>Organize your records</strong> like your
                        personal Wikipedia. <strong>Link, group and tag</strong>{' '}
                        your content or{' '}
                        <strong>use the Google-powered search</strong> to find
                        all your records fast.
                    </Reason>
                    <Reason headline="Share Your Work" icon={ShareVariantIcon}>
                        Did you <strong>create</strong> some{' '}
                        <strong>awesome piece</strong> of content?{' '}
                        <strong>Share it</strong> with others, that{' '}
                        <strong>they can enjoy</strong> your hard work.
                    </Reason>
                </div>
            </div>
        </div>
    )
}

const Reason = ({ body, children, headline, icon, ...props }) => {
    const Icon = icon
    return (
        <div className="reason col" item sm={4} xs={12}>
            <div className="icon-wrapper">
                <Icon className="icon" size={48} />
            </div>
            <h3
                align="center"
                color="inherit"
                component="h3"
                gutterBottom
                style={{ color: 'white', fontSize: '2rem', marginTop: '2rem' }}
                variant="h4"
            >
                {headline}
            </h3>
            <p align="center" component="p">
                {children}
            </p>
        </div>
    )
}
