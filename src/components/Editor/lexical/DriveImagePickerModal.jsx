import {
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
} from '@material-ui/core'
import { fetchDriveImageThumbnailBlob, listImageFiles } from 'lib/gdrive'
import CloseIcon from 'mdi-react/CloseIcon'
import React, { useEffect, useState } from 'react'

function DriveImageThumbnail({ file }) {
    const [src, setSrc] = useState(null)
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        let objectUrl = null
        let cancelled = false
        setSrc(null)
        setFailed(false)

        fetchDriveImageThumbnailBlob(file.id, file.thumbnailLink)
            .then(blob => {
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
            <div
                style={{
                    alignItems: 'center',
                    background: '#f0f0f0',
                    color: '#999',
                    display: 'flex',
                    fontSize: '0.65rem',
                    height: '100%',
                    justifyContent: 'center',
                    padding: '0.25rem',
                    textAlign: 'center',
                    width: '100%',
                }}
            >
                Preview unavailable
            </div>
        )
    }

    if (!src) {
        return (
            <div
                style={{
                    alignItems: 'center',
                    background: '#f0f0f0',
                    display: 'flex',
                    height: '100%',
                    justifyContent: 'center',
                    width: '100%',
                }}
            >
                <CircularProgress size={24} />
            </div>
        )
    }

    return (
        <img
            alt=""
            src={src}
            style={{
                height: '100%',
                objectFit: 'cover',
                width: '100%',
            }}
        />
    )
}

export class DriveImagePickerModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            images: [],
            loading: false,
            show: false,
        }
        this.promiseInfo = {}
    }

    show = () => {
        return new Promise((resolve, reject) => {
            this.promiseInfo = { resolve, reject }
            this.setState({
                show: true,
                loading: true,
                error: null,
                images: [],
            })

            listImageFiles()
                .then(images => this.setState({ images, loading: false }))
                .catch(() =>
                    this.setState({
                        error: 'Could not load images from Google Drive.',
                        loading: false,
                    }),
                )
        })
    }

    hide = () => {
        this.setState({ show: false, images: [], error: null, loading: false })
    }

    onCancel = () => {
        this.hide()
        this.promiseInfo.reject?.()
        this.promiseInfo = {}
    }

    onSelect = file => {
        this.hide()
        this.promiseInfo.resolve?.({ id: file.id, name: file.name })
        this.promiseInfo = {}
    }

    render() {
        const { error, images, loading, show } = this.state
        if (!show) return null

        return (
            <Dialog
                aria-labelledby="drive-image-picker-title"
                fullWidth
                maxWidth="md"
                onClose={() => {}}
                open={true}
            >
                <DialogTitle id="drive-image-picker-title">
                    Insert image from Google Drive
                    <IconButton
                        aria-label="close"
                        onClick={this.onCancel}
                        size="small"
                        style={{
                            position: 'absolute',
                            right: '1rem',
                            top: '1rem',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent
                    dividers
                    onKeyDown={ev => {
                        if (ev.key === 'Escape') {
                            ev.preventDefault()
                            this.onCancel()
                        }
                    }}
                    style={{ minHeight: '12rem' }}
                >
                    {loading && (
                        <div
                            style={{
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'center',
                                padding: '3rem',
                            }}
                        >
                            <CircularProgress />
                        </div>
                    )}
                    {!loading && error && (
                        <p style={{ color: '#666', margin: 0 }}>{error}</p>
                    )}
                    {!loading && !error && images.length === 0 && (
                        <p style={{ color: '#666', margin: 0 }}>
                            No images found on Google Drive.
                        </p>
                    )}
                    {!loading && !error && images.length > 0 && (
                        <div
                            style={{
                                display: 'grid',
                                gap: '0.75rem',
                                gridTemplateColumns:
                                    'repeat(auto-fill, minmax(7.5rem, 1fr))',
                            }}
                        >
                            {images.map(file => (
                                <button
                                    key={file.id}
                                    onClick={() => this.onSelect(file)}
                                    style={{
                                        background: 'none',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 4,
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        padding: 0,
                                        textAlign: 'left',
                                    }}
                                    title={file.name}
                                    type="button"
                                >
                                    <div
                                        style={{
                                            aspectRatio: '1',
                                            overflow: 'hidden',
                                            width: '100%',
                                        }}
                                    >
                                        <DriveImageThumbnail file={file} />
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '0.75rem',
                                            overflow: 'hidden',
                                            padding: '0.35rem 0.5rem',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {file.name}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        )
    }
}
