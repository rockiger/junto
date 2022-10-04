import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { isHotkey } from 'is-hotkey'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'

import { useGetPage, useUpdatePage } from 'db'
import { UNTITLEDNAME } from 'lib/constants'
import PageComponent from './PageComponent'

export default function Page() {
    const { id } = useParams()
    const editorRef = useRef(null)
    const titleInputRef = useRef(null)
    const [pageHead, setPageHead] = useState(UNTITLEDNAME)
    const { enqueueSnackbar } = useSnackbar()

    /* GraphQL operations */
    const [updateFile] = useUpdatePage({
        onError: error =>
            enqueueSnackbar(`Error while saving: ${error.message}`),
    })

    const { isLoading, error, page } = useGetPage({
        onCompleted: page => setPageHead(page.title),
        variables: { id },
    })

    /* Tiptap Edidor */
    const editor = useEditor({
        content: page?.body,
        editable: false,
        extensions: [StarterKit],
    })

    window.editor = editor
    /* Callbacks */
    const onBlurInput = useCallback(() => {
        if (!pageHead) {
            setPageHead(UNTITLEDNAME)
        }
        if (page?.title !== pageHead) {
            console.log('update file')
            updateFile({ variables: { id, title: pageHead } })
        }
    }, [id, page?.title, pageHead, updateFile])

    const onChangeInput = useCallback(ev => {
        setPageHead(ev.target.value)
    }, [])

    const onClickToggleButton = ev => {
        ev.preventDefault()
        ev.stopPropagation()
        if (editor?.isEditable) {
            editor.setEditable(false)
            //! Event('Editor', 'Deactivate Editor')
            if (editor.getHTML() !== page?.body) {
                console.log('update body')
                updateFile({ variables: { id, body: editor.getHTML() } })
            }
        } else {
            editor.setEditable(true)
            editor.commands.focus()
            //!Event('Editor', 'Activate Editor')
        }
    }

    const onKeyDownInput = useCallback(ev => {
        switch (ev.key) {
            case `ArrowDown`:
            case `Tab`:
                ev.preventDefault()
                editorRef?.current?.focus()
                break

            default:
                break
        }
        ev.stopPropagation()
    }, [])

    /**
     * Set shortcuts
     */
    useEffect(() => {
        // only set event listener if all neccessary dependencies are given
        if (editor && id && page?.body && updateFile) {
            function onKeyDown(ev) {
                if (editor?.isEditable && isHotkey('mod+Enter')(ev)) {
                    ev.stopPropagation()
                    ev.preventDefault()
                    editor.setEditable(false)
                    //! Event('Editor', 'Deactivate Editor with shortcut')
                    if (editor.getHTML() !== page?.body) {
                        console.log('update body')
                        updateFile({
                            variables: { id, body: editor.getHTML() },
                        })
                    }
                } else if (!editor?.isEditable && ev.key === 'e') {
                    ev.stopPropagation()
                    ev.preventDefault()
                    editor.setEditable(true)
                    editor.commands.focus()
                    // Event('Editor', 'Activate Editor with shortcut')
                }
            }

            window.addEventListener('keydown', onKeyDown)

            console.log('Set shortcuts')

            return function cleanup() {
                window.removeEventListener('keydown', onKeyDown)
            }
        }
    }, [editor, id, page?.body, updateFile])

    /**
     * Set the contentent of the editor
     */
    useEffect(() => {
        if (page && editor) editor.commands.setContent(page?.body)
    }, [editor, page])

    console.log({ editor, page })
    return (
        <PageComponent
            {...{
                editor,
                error,
                isLoading,
                onBlurInput,
                onChangeInput,
                onClickToggleButton,
                onKeyDownInput,
                page,
                pageHead,
                ref: {
                    editorRef,
                    titleInputRef,
                },
            }}
        />
    )
}
