//@ts-check
import React from 'react'

import { AndEndsInSuccess } from './AndEndsInSuccess'
import { GoogleButton } from './GoogleButton'
import { HasAPlan } from './HasAPlan'
import { HasAProblem } from './HasAProblem'
import { Testimonials } from './Testimonials'

import gsuiteIntegrations from 'static/img/gsuite-integrations.png'
import instantSearch from 'static/img/instant-search.png'
import page01 from 'static/img/page01.png'
import page02 from 'static/img/page02.png'

import './front-page.scss'

export default function FrontPage() {
    document.title = 'Fulcrum.wiki - The knowledge base made for Google Drive'
    return (
        <>
            <div className="hero" style={{ backgroundColor: '#f7f7f7' }}>
                <div className="columns">
                    <div className="col">
                        <h1 className="frontpage__header">
                            Effortless.
                            <br />
                            Organized.
                            <br />
                            <img
                                alt=""
                                src={''}
                                style={{
                                    bottom: -12,
                                    height: 46,
                                    position: 'relative',
                                }}
                            />
                            .
                        </h1>
                        <p>
                            <b>Capture</b> knowledge. <b>Find</b> information
                            faster. <b>Share</b> your ideas with others.
                        </p>
                        <p>
                            Projects, Meeting notes, marketing plans -
                            everything <b>saved in your Google Drive</b>.
                        </p>
                        <p
                            className="show__lg
                        "
                        >
                            <img
                                className="shadow"
                                alt="Fulcrum Page"
                                src={page01}
                            />
                        </p>
                        <div
                            style={{
                                alignItems: 'center',
                                display: 'flex',
                            }}
                        >
                            <GoogleButton />
                            <strong style={{ marginLeft: 6 }}>
                                - it's free!
                            </strong>
                        </div>
                        <p>
                            <b>Disclaimer:</b> We are still in beta.
                        </p>
                    </div>
                    <div className="col hidden__lg">
                        <img
                            className="shadow"
                            alt="Fulcrum Page"
                            src={page01}
                        />
                    </div>
                </div>
            </div>
            <div className="call-to-action">
                <GoogleButton />
            </div>
            <HasAProblem />
            <AndEndsInSuccess />
            <div className="frontpage-container">
                <div className="columns">
                    <div className="col">
                        <img
                            alt=""
                            src={page02}
                            style={{
                                border: '1px solid #eee',
                                borderRadius: '.5rem',
                                boxShadow:
                                    '0px 1px 8px 0px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14) , 0px 3px 3px -2px rgba(0, 0, 0, 0.12)',
                                maxWidth: '100%',
                            }}
                        />
                    </div>
                    <div className="col">
                        <h2 className="frontpage__header">
                            Build great looking pages - all saved in your Google
                            Drive
                        </h2>
                        <p>
                            Create pages with{' '}
                            <strong>all content formats</strong> you need.
                            Tables, Images, Lists - you name it. Write a new
                            marketing plan, document your workflow for employee
                            onboarding or write a memo for your co-workers.
                        </p>
                        <p>
                            The best is:{' '}
                            <strong>Everything stays on your Drives</strong>.
                            Unlike other tools, we don't introduce a new SaaS
                            infrastructure to your business. All the content you
                            create is saved on your Drives.{' '}
                            <strong>Nothing is saved on our servers.</strong>
                        </p>
                    </div>
                </div>
            </div>
            <div className="frontpage-container">
                <div className="columns">
                    <div className="col">
                        <h2 className="frontpage__header">
                            Easily find & navigate your work
                        </h2>
                        <p>
                            Always stay on top of your work. Organize your{' '}
                            <strong>work in different Drives</strong> and create
                            sub-pages of your work. Access your most recent and
                            important work instantly.
                        </p>
                        <p>
                            <strong>Don't waste your time</strong>
                            searching. Find what you are looking for with a
                            powerful search - just like you expect from any
                            other Google product.
                        </p>
                        <img
                            alt="Search"
                            src={instantSearch}
                            style={{
                                maxWidth: 645,
                                width: '100%',
                            }}
                        />
                    </div>
                    <div
                        className="col"
                        style={{
                            justifyContent: 'start',
                        }}
                    >
                        <h2 className="frontpage__header">
                            Work seamlessly with your G Suite
                        </h2>
                        <p>
                            Fulcrum allows you to <strong>connect</strong> your{' '}
                            <strong>
                                pages with other G Suite applications
                            </strong>
                            . Insert your photos into your pages. Open
                            documents, presentation and spreadsheets directly
                            from your pages. Share them with your co-workers.
                        </p>
                        <p>
                            Everything is tightly integrated. We even stick to
                            Google's design guidelines that you and your
                            team-mates are <strong>productive instantly</strong>
                            .
                        </p>

                        <img
                            alt="Share pages"
                            src={gsuiteIntegrations}
                            style={{
                                border: '1px solid #eee',
                                borderRadius: '.5rem',
                                boxShadow:
                                    '0px 1px 8px 0px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14) , 0px 3px 3px -2px rgba(0, 0, 0, 0.12)',
                                maxWidth: 643,
                                width: '100%',
                            }}
                        />
                    </div>
                </div>
            </div>
            <Testimonials />
            <HasAPlan />
            <div>
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        marginBottom: '5rem',
                    }}
                >
                    <GoogleButton />
                </div>
            </div>
            <style>{` 
                /* Needed, because we can't change the class of the body element
                   declaratively from react */
                body {
                    overflow-y: auto !important;
                    font-size: 1rem;
                }
                .App-main {
                    padding: 0;
                }
            `}</style>
        </>
    )
}
