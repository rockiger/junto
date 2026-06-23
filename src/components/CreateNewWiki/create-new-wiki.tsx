import { useLocation, useNavigate } from '@tanstack/react-router'
import { DialogModal } from 'components/gsuite-components/modal/dialog-modal'
import Spinner from 'components/gsuite-components/spinner'
import { createFile, createNewWiki } from 'db'
import { OVERVIEW_NAME, OVERVIEW_VALUE } from 'lib/constants'
import { type FormEvent, useEffect, useState } from 'react'
import {
    Button,
    Form,
    Input,
    Label,
    TextArea,
    TextField,
} from 'react-aria-components'
import { useGlobal } from 'reactn'

interface CreateNewWikiProps {
    isSignedIn: boolean
    isSigningIn: boolean
}

export interface CreateNewWikiDialogProps {
    isOpen: boolean
    name: string
    description: string
    onNameChange: (value: string) => void
    onDescriptionChange: (value: string) => void
    onCancel: () => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

interface CreateWikiState {
    folderId: string
    action: string
    userId: string
}

const fieldClassName =
    'rounded-md border border-edge-strong bg-surface-paper px-3 py-2 text-fg-default placeholder:text-search-placeholder outline-none data-focus-visible:shadow-focus'

export function getState(search: string): CreateWikiState | null {
    const stateString = new URLSearchParams(search).get('state')

    if (stateString) {
        return JSON.parse(stateString) as CreateWikiState
    }
    return null
}

export function CreateNewWikiDialog({
    isOpen,
    name,
    description,
    onNameChange,
    onDescriptionChange,
    onCancel,
    onSubmit,
}: CreateNewWikiDialogProps) {
    return (
        <DialogModal
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!open) onCancel()
            }}
            title="Create New Wiki"
            maxWidth="2xl"
            contentClassName="px-0 pb-0"
        >
            <Form onSubmit={onSubmit} className="flex flex-col">
                <div className="grid gap-6 px-6 pb-6 sm:grid-cols-[1fr_minmax(0,12rem)]">
                    <div className="flex flex-col gap-4">
                        <TextField
                            name="name"
                            isRequired
                            value={name}
                            onChange={onNameChange}
                            className="flex flex-col gap-1"
                        >
                            <Label className="text-sm font-semibold text-text-default">
                                Fulcrum Name
                            </Label>
                            <Input className={fieldClassName} />
                        </TextField>

                        <TextField
                            name="description"
                            value={description}
                            onChange={onDescriptionChange}
                            className="flex flex-col gap-1"
                        >
                            <Label className="text-sm font-semibold text-text-default">
                                Description
                            </Label>
                            <TextArea
                                rows={4}
                                placeholder="Optional: What is this wiki for?"
                                className={`resize-none ${fieldClassName}`}
                            />
                        </TextField>
                    </div>

                    <aside className="text-sm text-text-muted">
                        <p className="mb-2 font-semibold text-text-default">
                            About wikis
                        </p>
                        <p>
                            Share knowledge, manage documentation and
                            collaborate with your team. You can add pages
                            and keep them organised in a hierarchy.
                        </p>
                    </aside>
                </div>

                <div className="flex justify-end gap-3 px-6">
                    <Button
                        type="button"
                        onPress={onCancel}
                        className="rounded-full bg-transparent px-6 py-2 capitalize text-accent-dark text-sm font-semibold outline-none transition-colors duration-200 hover:bg-icon-blue-lighter data-focus-visible:shadow-focus"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        isDisabled={!name.trim()}
                        className="rounded-full bg-icon-blue px-6 capitalize text-on-accent text-sm font-semibold outline-none disabled:opacity-50 data-focus-visible:shadow-focus"
                    >
                        Apply
                    </Button>
                </div>
            </Form>
        </DialogModal>
    )
}

export function CreateNewWiki({
    isSignedIn,
    isSigningIn,
}: CreateNewWikiProps) {
    const [isCreatingNewFile, setIsCreatingNewFile] = useGlobal(
        'isCreatingNewFile',
    )
    const navigate = useNavigate()
    const { searchStr } = useLocation()

    const folderId = getState(searchStr)?.folderId ?? ''
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
        if (isSignedIn) {
            setIsDialogOpen(true)
        }
    }, [isSignedIn])

    const resetForm = () => {
        setName('')
        setDescription('')
    }

    const handleCancel = () => {
        setIsDialogOpen(false)
        resetForm()
        navigate({ to: '/home' })
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const trimmedName = name.trim()
        if (!trimmedName) return

        setIsDialogOpen(false)
        setIsCreatingNewFile(true)

        try {
            const newRootFolderId = await createNewWiki({
                name: trimmedName,
                parentId: folderId,
                supportsAllDrives: true,
                description: description.trim(),
            })
            if (!newRootFolderId) return

            const newFileId = await createFile(
                OVERVIEW_NAME,
                newRootFolderId,
                OVERVIEW_VALUE,
                trimmedName,
            )
            if (!newFileId) return

            navigate({
                to: '/page/$id',
                params: { id: newFileId },
            })
        } catch {
            setIsCreatingNewFile(false)
            navigate({ to: '/home' })
        }
    }

    if ((!isSignedIn && isSigningIn) || isCreatingNewFile) {
        return (
            <div className="mt-8">
                <Spinner />
            </div>
        )
    }

    return (
        <>
            <h1 className="p-2">Creating your Wiki ...</h1>
            <CreateNewWikiDialog
                isOpen={isDialogOpen}
                name={name}
                description={description}
                onNameChange={setName}
                onDescriptionChange={setDescription}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
            />
        </>
    )
}
