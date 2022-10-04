import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { UNTITLEDNAME } from 'lib/constants'
import PageComponent from './PageComponent'
import { useGetPage, useUpdatePage } from 'db'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

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

    useEffect(() => {
        if (page?.body) editor?.commands?.setContent(page?.body)
    }, [editor, page?.body])
    console.log({ editor })
    return (
        <PageComponent
            {...{
                editor,
                error,
                isLoading,
                onBlurInput,
                onChangeInput,
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
