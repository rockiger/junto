import { DialogModal } from 'components/gsuite-components/modal/dialog-modal'
import {
    type ComponentType,
    type FormEvent,
    type Key,
    type SVGProps,
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
    useState,
} from 'react'
import {
    Button,
    ComboBox,
    Form,
    Input,
    Label,
    ListBox,
    ListBoxItem,
    Popover,
    TextField,
} from 'react-aria-components'

const fieldClassName =
    'w-full rounded-md border border-edge-strong bg-surface-paper px-3 py-2 text-fg-default placeholder:text-search-placeholder outline-none data-focus-visible:shadow-focus'

const listBoxItemClassName =
    'flex cursor-default items-center gap-2 rounded px-2 py-1.5 text-accent outline-none data-focused:bg-surface-hover'

export interface LinkItem {
    id: string
    name: string
    href: string
    icon: ComponentType<SVGProps<SVGSVGElement>>
}

export interface LinkModalResult {
    href: string
    text: string
}

export interface LinkModalHandle {
    show: (text?: string, href?: string) => Promise<LinkModalResult>
}

export interface LinkModalProps {
    items: LinkItem[]
}

function useLinkModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [text, setText] = useState('')
    const [href, setHref] = useState('')
    const promiseRef = useRef<{
        resolve?: (value: LinkModalResult) => void
        reject?: () => void
    }>({})

    const reset = useCallback(() => {
        setIsOpen(false)
        setText('')
        setHref('')
    }, [])

    const show = useCallback((initialText = '', initialHref = '') => {
        return new Promise<LinkModalResult>((resolve, reject) => {
            promiseRef.current = { resolve, reject }
            setText(initialText)
            setHref(initialHref)
            setIsOpen(true)
        })
    }, [])

    const cancel = useCallback(() => {
        reset()
        promiseRef.current.reject?.()
        promiseRef.current = {}
    }, [reset])

    const resolve = useCallback(
        (result: LinkModalResult) => {
            reset()
            promiseRef.current.resolve?.(result)
            promiseRef.current = {}
        },
        [reset],
    )

    const submit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            if (!href) return
            resolve({ href, text })
        },
        [href, text, resolve],
    )

    return {
        isOpen,
        text,
        href,
        setText,
        setHref,
        show,
        cancel,
        resolve,
        submit,
    }
}

export const LinkModal = forwardRef<LinkModalHandle, LinkModalProps>(
    function LinkModal({ items }, ref) {
        const {
            isOpen,
            text,
            href,
            setText,
            setHref,
            show,
            cancel,
            resolve,
            submit,
        } = useLinkModal()

        useImperativeHandle(ref, () => ({ show }), [show])

        const handleLinkSelect = useCallback(
            (key: Key | null) => {
                if (key == null) return
                const item = items.find((el) => el.id === key)
                if (!item) return
                resolve({ href: item.href, text: item.name })
            },
            [items, resolve],
        )

        if (!isOpen) return null

        const linkPlaceholder =
            items.length > 0 ? 'Paste a link, or search' : 'Paste a link'

        return (
            <DialogModal
                isOpen={isOpen}
                onClose={cancel}
                isDismissable={false}
                title="Edit Link"
                maxWidth="md"
                contentClassName="px-0 pb-0"
            >
                <Form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="px-6">
                        <TextField
                            name="text"
                            value={text}
                            onChange={setText}
                            className="flex flex-col gap-1"
                        >
                            <Label className="text-sm font-semibold text-text-default">
                                Text
                            </Label>
                            <Input className={fieldClassName} />
                        </TextField>
                    </div>

                    <div className="px-6">
                        <ComboBox<LinkItem>
                            allowsCustomValue
                            name="href"
                            inputValue={href}
                            onInputChange={setHref}
                            onSelectionChange={handleLinkSelect}
                            items={items}
                            className="flex flex-col gap-1"
                        >
                            <Label className="text-sm font-semibold text-text-default">
                                Link
                            </Label>
                            <Input
                                autoFocus
                                placeholder={linkPlaceholder}
                                className={fieldClassName}
                            />
                            <Popover className="z-1100 max-h-52 w-(--trigger-width) overflow-auto rounded-md border border-edge bg-surface-paper shadow-lg outline-none">
                                <ListBox className="p-1 outline-none">
                                    {(item: LinkItem) => (
                                        <ListBoxItem
                                            id={item.id}
                                            textValue={item.name}
                                            className={listBoxItemClassName}
                                        >
                                            <item.icon className="h-5 w-5 shrink-0" />
                                            <span>{item.name}</span>
                                        </ListBoxItem>
                                    )}
                                </ListBox>
                            </Popover>
                        </ComboBox>
                    </div>

                    <div className="flex justify-end gap-3 px-6 pt-2 pb-6">
                        <Button
                            type="button"
                            onPress={cancel}
                            className="rounded-full bg-transparent px-6 py-2 capitalize text-accent-dark text-sm font-semibold outline-none transition-colors duration-200 hover:bg-icon-blue-lighter data-focus-visible:shadow-focus"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isDisabled={!href}
                            className="rounded-full bg-icon-blue px-6 py-2 capitalize text-on-accent text-sm font-semibold outline-none disabled:opacity-50 data-focus-visible:shadow-focus"
                        >
                            Apply
                        </Button>
                    </div>
                </Form>
            </DialogModal>
        )
    },
)
