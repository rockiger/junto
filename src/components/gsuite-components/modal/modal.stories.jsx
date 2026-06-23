import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'

import Modal from './modal'

storiesOf('Modal', module)
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
                <button onClick={() => setIsOpen(true)}>Open Modal</button>
                <Modal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    fullHeight
                    title="Help"
                >
                    <ModalContent />
                </Modal>
            </>
        )
    })
    .add('xs', () => {
        const [isOpen, setIsOpen] = useState(true)
        return (
            <>
                <button onClick={() => setIsOpen(true)}>Open Modal</button>
                <Modal
                    isOpen={isOpen}
                    maxWidth="xs"
                    onClose={() => setIsOpen(false)}
                    title="Help"
                >
                    <ModalContent />
                </Modal>
            </>
        )
    })
    .add('sm', () => {
        const [isOpen, setIsOpen] = useState(true)
        return (
            <>
                <button onClick={() => setIsOpen(true)}>Open Modal</button>
                <Modal
                    isOpen={isOpen}
                    maxWidth="sm"
                    onClose={() => setIsOpen(false)}
                    title="Help"
                >
                    <ModalContent />
                </Modal>
            </>
        )
    })
    .add('md', () => {
        const [isOpen, setIsOpen] = useState(true)
        return (
            <>
                <button onClick={() => setIsOpen(true)}>Open Modal</button>
                <Modal
                    isOpen={isOpen}
                    maxWidth="md"
                    onClose={() => setIsOpen(false)}
                    title="Help"
                >
                    <ModalContent />
                </Modal>
            </>
        )
    })
    .add('lg', () => {
        const [isOpen, setIsOpen] = useState(true)
        return (
            <>
                <button onClick={() => setIsOpen(true)}>Open Modal</button>
                <Modal
                    isOpen={isOpen}
                    maxWidth="lg"
                    onClose={() => setIsOpen(false)}
                    title="Help"
                >
                    <ModalContent />
                </Modal>
            </>
        )
    })
    .add('xl', () => {
        const [isOpen, setIsOpen] = useState(true)
        return (
            <>
                <button onClick={() => setIsOpen(true)}>Open Modal</button>
                <Modal
                    isOpen={isOpen}
                    maxWidth="xl"
                    onClose={() => setIsOpen(false)}
                    title="Help"
                >
                    <ModalContent />
                </Modal>
            </>
        )
    })

function ModalContent() {
    return (
        <>
            <p>
                Am Montag um 12 Uhr wird sich in Potsdam entscheiden, ob Andreas
                Kalbitz Mitglied der AfD-Fraktion im Brandenburger Landtag
                bleiben kann - oder besser gesagt: Es wird entschieden, ob er
                wieder Mitglied wird. Dann tritt die AfD-Landtagsfraktion zur
                Krisensitzung zusammen. Kalbitz wird als Gast erwartet. Seit am
                Freitag die Entscheidung des Bundesvorstands fiel, die
                AfD-Mitgliedschaft des Rechtsaußen für nichtig zu erklären,
                gehört er formal auch nicht mehr dem Gremium an.
            </p>

            <p>
                Am Montag um 12 Uhr wird sich in Potsdam entscheiden, ob Andreas
                Kalbitz Mitglied der AfD-Fraktion im Brandenburger Landtag
                bleiben kann - oder besser gesagt: Es wird entschieden, ob er
                wieder Mitglied wird. Dann tritt die AfD-Landtagsfraktion zur
                Krisensitzung zusammen. Kalbitz wird als Gast erwartet. Seit am
                Freitag die Entscheidung des Bundesvorstands fiel, die
                AfD-Mitgliedschaft des Rechtsaußen für nichtig zu erklären,
                gehört er formal auch nicht mehr dem Gremium an.
            </p>

            <p>
                Seinen Landesvorsitz haben seine Stellvertreter bereits
                übernommen. In die Landtagsfraktion könnte er als parteiloses
                Mitglied wieder aufgenommen werden, heißt es dort. Ob er als
                Parteiloser sogar wieder den Fraktionsvorsitz übernehmen wird,
                ist nach SPIEGEL-Informationen noch nicht ausgemacht. Im
                gegnerischen Lager kursieren jedenfalls schon Namen für die
                mögliche Neubesetzung.
            </p>
        </>
    )
}
