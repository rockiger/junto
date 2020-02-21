import React from 'react'

import { GoogleButton } from './GoogleButton'

import assistant from 'static/img/assistant.jpg'

export const HasAProblem = () => {
    return (
        <div className="hero hero__max1280">
            <div className="columns">
                <div className="col" style={{ maxWidth: 640 }}>
                    <h2>
                        Your knowledge management should make you look smart.
                        Like an assistant that always has your back.
                    </h2>
                    <p>Have you felt frustrated by your note-taking app?</p>
                    <ul style={{ marginTop: 0 }}>
                        <li>
                            Did you endlessly look for a note you have written?
                        </li>
                        <li>
                            Created time-consuming documents nobody looked at
                            again?
                        </li>
                        <li>
                            Find Google Keep™ is too simplistic for your ideas?
                        </li>
                        <li>
                            Think Google Docs™ sucks for reading and organizing
                            your team's knowledge?
                        </li>
                        <li>
                            Never came back to that great idea you wrote down?
                        </li>
                    </ul>
                    <GoogleButton />
                </div>
                <div
                    className="md"
                    item
                    xs={12}
                    sm={5}
                    style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <img
                        alt="Fulcrum Page"
                        className="HasAProblem__assistant shadow"
                        src={assistant}
                    />
                    <style>
                        {`
                            @media screen and (max-width: 1279px) {
                            .HasAProblem__assistant {
                                    margin-top: 2rem;
                                }
                            }`}
                    </style>
                </div>
            </div>
        </div>
    )
}
