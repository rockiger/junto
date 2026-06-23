import { DialogModal } from 'components/gsuite-components/modal/dialog-modal'
import Spinner from 'components/gsuite-components/spinner'
import { fetchDriveImageThumbnailBlob, listImageFiles } from 'lib/gdrive'
import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react'
import { Button } from 'react-aria-components'

export interface DriveImageFile {
    id: string
    name: string
    thumbnailLink?: string
}

export interface DriveImagePickResult {
    id: string
    name: string
}

export interface DriveImagePickerModalHandle {
    show: () => Promise<DriveImagePickResult>
}

interface DriveImageThumbnailProps {
    file: DriveImageFile
}

function DriveImageThumbnail({ file }: DriveImageThumbnailProps) {
    const [src, setSrc] = useState<string | null>(null)
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        let objectUrl: string | null = null
        let cancelled = false
        setSrc(null)
        setFailed(false)

        fetchDriveImageThumbnailBlob(file.id, file.thumbnailLink)
            .then((blob) => {
                if (cancelled) return
                objectUrl = URL.createObjectURL(blob)
                setSrc(objectUrl)
            })
            .catch(() => {
                if (!cancelled) setFailed(true)
            })

        return () => {
            cancelled = true
            if (objectUrl) URL.revokeObjectURL(objectUrl)
        }
    }, [file.id, file.thumbnailLink])

    if (failed) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-surface-hover p-1 text-center text-[0.65rem] text-text-muted">
                Preview unavailable
            </div>
        )
    }

    if (!src) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-surface-hover">
                <div
                    className="h-6 w-6 animate-spin rounded-full border-2 border-edge-strong border-t-accent"
                    aria-hidden
                />
            </div>
        )
    }

    return (
        <img
            alt=""
            src={src}
            className="h-full w-full object-cover"
        />
    )
}

function useDriveImagePicker() {
    const [isOpen, setIsOpen] = useState(false)
    const [images, setImages] = useState<DriveImageFile[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const promiseRef = useRef<{
        resolve?: (value: DriveImagePickResult) => void
        reject?: () => void
    }>({})

    const reset = useCallback(() => {
        setIsOpen(false)
        setImages([])
        setError(null)
        setLoading(false)
    }, [])

    const show = useCallback(() => {
        return new Promise<DriveImagePickResult>((resolve, reject) => {
            promiseRef.current = { resolve, reject }
            setIsOpen(true)
            setLoading(true)
            setError(null)
            setImages([])

            listImageFiles()
                .then((files) => setImages(files))
                .catch(() =>
                    setError('Could not load images from Google Drive.'),
                )
                .finally(() => setLoading(false))
        })
    }, [])

    const cancel = useCallback(() => {
        reset()
        promiseRef.current.reject?.()
        promiseRef.current = {}
    }, [reset])

    const select = useCallback(
        (file: DriveImageFile) => {
            reset()
            promiseRef.current.resolve?.({ id: file.id, name: file.name })
            promiseRef.current = {}
        },
        [reset],
    )

    return {
        isOpen,
        images,
        loading,
        error,
        show,
        cancel,
        select,
    }
}

export const DriveImagePickerModal = forwardRef<DriveImagePickerModalHandle>(
    function DriveImagePickerModal(_props, ref) {
        const { isOpen, images, loading, error, show, cancel, select } =
            useDriveImagePicker()

        useImperativeHandle(ref, () => ({ show }), [show])

        if (!isOpen) return null

        return (
            <DialogModal
                isOpen={isOpen}
                onClose={cancel}
                isDismissable={false}
                title="Insert image from Google Drive"
                maxWidth="4xl"
                contentClassName="min-h-48 pt-2"
            >
                {loading && (
                    <div className="flex justify-center py-12">
                        <Spinner />
                    </div>
                )}
                {!loading && error && (
                    <p className="m-0 text-text-muted">{error}</p>
                )}
                {!loading && !error && images.length === 0 && (
                    <p className="m-0 text-text-muted">
                        No images found on Google Drive.
                    </p>
                )}
                {!loading && !error && images.length > 0 && (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-3">
                        {images.map((file) => (
                            <Button
                                key={file.id}
                                onPress={() => select(file)}
                                aria-label={file.name}
                                className="cursor-pointer overflow-hidden rounded border border-edge-strong bg-transparent p-0 text-left outline-none transition-colors hover:border-accent data-focus-visible:shadow-focus"
                            >
                                <div className="aspect-square w-full overflow-hidden">
                                    <DriveImageThumbnail file={file} />
                                </div>
                                <div className="truncate px-2 py-1.5 text-xs">
                                    {file.name}
                                </div>
                            </Button>
                        ))}
                    </div>
                )}
            </DialogModal>
        )
    },
)
