import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'

import { Alert } from './alert'

storiesOf('Alert', module)
    .addDecorator((story) => (
        <div
            style={{
                display: 'flex',
                padding: '1rem',
                border: '1px solid rgba(0,0,0, 0.2',
            }}
        >
            {story()}
        </div>
    ))
    .add('default', () => {
        const [isOpen, setIsOpen] = useState(true)
        return (
            <>
                <button onClick={() => setIsOpen(true)}>Open Alert</button>
                <Alert
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    title="Help"
                >
                    <AlertContent />
                </Alert>
            </>
        )
    })
    .add('Dialog', () => {
        const [isOpen, setIsOpen] = useState(true)
        return (
            <>
                <button onClick={() => setIsOpen(true)}>Open Alert</button>
                <Alert
                    isOpen={isOpen}
                    maxWidth="sm"
                    onClose={() => setIsOpen(false)}
                    onOk={() => setIsOpen(false)}
                    title="Help"
                >
                    <AlertContent />
                </Alert>
            </>
        )
    })
    .add('fullHeight', () => {
        const [isOpen, setIsOpen] = useState(true)
        return (
            <>
                <button onClick={() => setIsOpen(true)}>Open Alert</button>
                <Alert
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    fullHeight
                    title="Help"
                >
                    <AlertContent />
                </Alert>
            </>
        )
    })
    .add('xs', () => {
        const [isOpen, setIsOpen] = useState(true)
        return (
            <>
                <button onClick={() => setIsOpen(true)}>Open Alert</button>
                <Alert
                    isOpen={isOpen}
                    maxWidth="xs"
                    onClose={() => setIsOpen(false)}
                    title="Help"
                >
                    <AlertContent />
                </Alert>
            </>
        )
    })
    .add('sm', () => {
        const [isOpen, setIsOpen] = useState(true)
        return (
            <>
                <button onClick={() => setIsOpen(true)}>Open Alert</button>
                <Alert
                    isOpen={isOpen}
                    maxWidth="sm"
                    onClose={() => setIsOpen(false)}
                    title="Help"
                >
                    <AlertContent />
                </Alert>
            </>
        )
    })
    .add('md', () => {
        const [isOpen, setIsOpen] = useState(true)
        return (
            <>
                <button onClick={() => setIsOpen(true)}>Open Alert</button>
                <Alert
                    isOpen={isOpen}
                    maxWidth="md"
                    onClose={() => setIsOpen(false)}
                    title="Help"
                >
                    <AlertContent />
                </Alert>
            </>
        )
    })
    .add('lg', () => {
        const [isOpen, setIsOpen] = useState(true)
        return (
            <>
                <button onClick={() => setIsOpen(true)}>Open Alert</button>
                <Alert
                    isOpen={isOpen}
                    maxWidth="lg"
                    onClose={() => setIsOpen(false)}
                    title="Help"
                >
                    <AlertContent />
                </Alert>
            </>
        )
    })
    .add('xl', () => {
        const [isOpen, setIsOpen] = useState(true)
        return (
            <>
                <button onClick={() => setIsOpen(true)}>Open Alert</button>
                <Alert
                    isOpen={isOpen}
                    maxWidth="xl"
                    onClose={() => setIsOpen(false)}
                    title="Help"
                >
                    <AlertContent />
                </Alert>
            </>
        )
    })

function AlertContent() {
    return (
        <>
            <p>
                Alle Dateien und Ordner in Ihrem Papierkorb werden gleich
                endgültig gelöscht. Weitere Informationen
            </p>

            <p>
                <b>
                    Achtung: Diese Aktion kann nicht rückgängig gemacht werden.
                </b>
            </p>
        </>
    )
}
