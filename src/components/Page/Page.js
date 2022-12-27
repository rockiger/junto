import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
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
        onCompleted: data => refetch(),
        onError: error =>
            enqueueSnackbar(`Error while saving: ${error.message}`),
    })

    const { isLoading, error, page, refetch } = useGetPage({
        onCompleted: page => setPageTitle(page.title),
        variables: { id },
    })

    /* Tiptap Edidor */
    const editor = useEditor({
        content: page?.body,
        editable: false,
        extensions: [
            StarterKit,
            Image,
            Link,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
        ],
    })
    window.editor = editor

    /* Callbacks */

    const addImage = () => {
        const url = window.prompt('URL')

        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const onBlurInput = useCallback(() => {
        if (!pageHead) {
            setPageTitle(UNTITLEDNAME)
        }
        if (page?.title !== pageHead) {
            console.log('update file')
            updateFile({ variables: { id, title: pageHead } })
        }
    }, [id, page?.title, pageHead, updateFile])

    const onChangeInput = useCallback(ev => {
        setPageTitle(ev.target.value)
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

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()

            return
        }

        // update link
        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run()
    }, [editor])

    /** @param {string} pageTitle */
    function setPageTitle(pageTitle) {
        console.log('setPageTitle Test')
        document.title = `${pageTitle} – Fulcrum.wiki`
        setPageHead(pageTitle)
    }

    /**
     * Set shortcuts
     */
    useEffect(() => {
        // only set event listener if all neccessary dependencies are given
        if (editor && id && updateFile) {
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
                } else if (editor?.isEditable && isHotkey('mod+b')(ev)) {
                    ev.stopPropagation()
                    ev.preventDefault()
                    setLink()
                } else if (editor?.isEditable && isHotkey('mod+i')(ev)) {
                    ev.stopPropagation()
                    ev.preventDefault()
                    addImage()
                } else if (!editor?.isEditable && ev.key === 'e') {
                    ev.stopPropagation()
                    ev.preventDefault()
                    editor.setEditable(true)
                    editor.commands.focus()
                    // Event('Editor', 'Activate Editor with shortcut')
                }
            }

            window.addEventListener('keydown', onKeyDown)

            return function cleanup() {
                window.removeEventListener('keydown', onKeyDown)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor, id, page?.body, setLink, updateFile])

    /**
     * Set the contentent of the editor
     */
    useEffect(() => {
        if (page && editor) {
            editor.commands.setContent(page?.body)
            editor.setEditable(false)
        }
    }, [editor, page])

    return (
        <PageComponent
            {...{
                editor,
                error,
                isLoading,
                onBlurInput,
                onChangeInput,
                onClickToggleButton,
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
