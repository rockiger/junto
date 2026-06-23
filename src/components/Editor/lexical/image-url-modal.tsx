import { DialogModal } from 'components/gsuite-components/modal/dialog-modal'
import {
    type FormEvent,
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
    useState,
} from 'react'
import {
    Button,
    Form,
    Input,
    Label,
    TextField,
} from 'react-aria-components'

const fieldClassName =
    'rounded-md border border-edge-strong bg-surface-paper px-3 py-2 text-fg-default placeholder:text-search-placeholder outline-none data-focus-visible:shadow-focus'

export interface ImageUrlModalHandle {
    show: () => Promise<string>
}

function useImageUrlModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [url, setUrl] = useState('')
    const promiseRef = useRef<{
        resolve?: (value: string) => void
        reject?: () => void
    }>({})

    const reset = useCallback(() => {
        setIsOpen(false)
        setUrl('')
    }, [])

    const show = useCallback(() => {
        return new Promise<string>((resolve, reject) => {
            promiseRef.current = { resolve, reject }
            setIsOpen(true)
            setUrl('')
        })
    }, [])

    const cancel = useCallback(() => {
        reset()
        promiseRef.current.reject?.()
        promiseRef.current = {}
    }, [reset])

    const submit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const trimmed = url.trim()
            if (!trimmed) return
            reset()
            promiseRef.current.resolve?.(trimmed)
            promiseRef.current = {}
        },
        [url, reset],
    )

    return {
        isOpen,
        url,
        setUrl,
        show,
        cancel,
        submit,
    }
}

export const ImageUrlModal = forwardRef<ImageUrlModalHandle>(
    function ImageUrlModal(_props, ref) {
        const { isOpen, url, setUrl, show, cancel, submit } =
            useImageUrlModal()

        useImperativeHandle(ref, () => ({ show }), [show])

        if (!isOpen) return null

        return (
            <DialogModal
                isOpen={isOpen}
                onClose={cancel}
                isDismissable={false}
                title="Insert image by URL"
                maxWidth="md"
                contentClassName="px-0 pb-0"
            >
                <Form onSubmit={submit} className="flex flex-col gap-6">
                    <div>
                        <TextField
                            name="url"
                            type="url"
                            isRequired
                            autoFocus
                            value={url}
                            onChange={setUrl}
                            className="flex flex-col gap-1"
                        >
                            <Label className="text-sm font-semibold text-text-default">
                                Image URL
                            </Label>
                            <Input className={fieldClassName} />
                        </TextField>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            onPress={cancel}
                            className="rounded-full bg-transparent px-6 py-2 capitalize text-accent-dark text-sm font-semibold outline-none transition-colors duration-200 hover:bg-icon-blue-lighter data-focus-visible:shadow-focus"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isDisabled={!url.trim()}
                            className="rounded-full bg-icon-blue px-6 py-2 capitalize text-on-accent text-sm font-semibold outline-none disabled:opacity-50 data-focus-visible:shadow-focus"
                        >
                            Insert
                        </Button>
                    </div>
                </Form>
            </DialogModal>
        )
    },
)
