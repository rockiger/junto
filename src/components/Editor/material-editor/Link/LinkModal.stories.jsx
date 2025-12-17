import React, { useEffect } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { LinkModal } from './LinkModal'

const items = [
    {
        id: '1',
        icon: () => (
            <img
                style={{
                    verticalAlign: 'sub',
                }}
                src="https://drive-thirdparty.googleusercontent.com/16/type/application/json"
                alt="Wiki File"
            />
        ),
        href: 'https://spielgel.de',
        name: 'Test 1',
    },
    {
        id: '2',
        icon: () => (
            <img
                style={{
                    verticalAlign: 'sub',
                }}
                src="https://drive-thirdparty.googleusercontent.com/16/type/application/json"
                alt="Wiki File"
            />
        ),
        href: 'https://faz.net',
        name: 'Test 2',
    },
]

storiesOf('LinkModal', module)
    .addDecorator(story => (
        <div style={{ padding: '1rem', border: '1px solid rgba(0,0,0, 0.2' }}>
            {story()}
        </div>
    ))
    .add('default', () => <ModalComponent />)

function ModalComponent() {
    const modalRef = React.useRef(null)

    const showModal = async (linkText = '') => {
        const modal = modalRef.current
        try {
            // Wait user to confirm !
            const result = await modal.show(linkText)
            // this line below is executed only after user click on OK
            return result
        } catch (err) {
            console.log(err)
            return null
        }
    }

    useEffect(() => {
        showModal()
    }, [])

    return (
        <>
            <LinkModal ref={modalRef} items={items} />
        </>
    )
}
