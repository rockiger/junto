import { useState } from 'react'
import { storiesOf } from '@storybook/react'

import { CreateNewWikiDialog } from './create-new-wiki'

storiesOf('CreateNewWiki', module)
    .addDecorator((story) => (
        <div style={{ padding: '1rem', border: '1px solid rgba(0,0,0, 0.2)' }}>
            {story()}
        </div>
    ))
    .add('dialog', () => <DialogStory />)

function DialogStory() {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    return (
        <CreateNewWikiDialog
            isOpen
            name={name}
            description={description}
            onNameChange={setName}
            onDescriptionChange={setDescription}
            onCancel={() => {
                setName('')
                setDescription('')
            }}
            onSubmit={(event) => {
                event.preventDefault()
                console.log({ name, description })
            }}
        />
    )
}
