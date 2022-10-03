import { updateFile } from 'db'
import { UNTITLEDNAME } from 'lib/constants'
import { fetchPage } from 'lib/wordpress'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import PageComponent from './PageComponent'

export default function Page() {
    const { id } = useParams()
    const editorRef = useRef(null)
    const titleInputRef = useRef(null)
    const [page, setPage] = useState(null)
    const [pageHead, setPageHead] = useState(UNTITLEDNAME)

    console.log({ id, page })

    const onBlurInput = useCallback(
        () => {
            if (!pageHead) {
                setPageHead(UNTITLEDNAME)
            }
            if (page?.title !== pageHead) {
                console.log('update file')
                updateFile(id, { title: pageHead })
            }
        },
        //!
        [id, page?.title, pageHead]
    )

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

    // Get Page data
    useEffect(() => {
        const getData = async () => {
            const __page = await fetchPage(id)
            setPage(__page)
            if (__page?.title) setPageHead(__page?.title)
        }
        getData()
    }, [id])

    // Set the title
    return (
        <PageComponent
            {...{
                page,
                onBlurInput,
                onChangeInput,
                onKeyDownInput,
                pageHead,
                ref: {
                    editorRef,
                    titleInputRef,
                },
            }}
        />
    )
}
