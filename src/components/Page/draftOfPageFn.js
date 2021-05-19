export default function Pagef(props) {
    const { isSignedIn, isSigningIn } = props
    const [, setGoToNewFile] = useGlobal('goToNewFile')
    const [, setBackgroundUpdate] = useGlobal('backgroundUpdate')
    const [files, setFiles] = useGlobal('files')
    const [initialFiles, setInitialFiles] = useGlobal('initialFiles')
    const [state, setState] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            canEdit: false,
            editorDelta: {},
            fileId: props.match.params.id,
            fileName: UNTITLEDFILE,
            pageHead: UNTITLEDNAME,
            fileLoaded: false,
            fileLoading: false,
        }
    )
    const editorRef = useRef(null)
    const inputRef = useRef(null)

    const loadEditorContent = useCallback(async () => {
        const { fileId } = state
        if (fileId) {
            let fileContent
            const fileDescription = files.find(el => el.id === fileId)
            if (true) {
                const pageHead = getTitleFromFile(fileDescription)

                // get local page content from localDB if present and up to date
                const page = await getPageById(fileId)
                console.log(page)
                if (page && page.editedTime >= fileDescription.modifiedTime) {
                    console.log(page.editTime)
                    fileContent = page.content
                } else {
                    console.log('Need to look for file in server')
                    fileContent = await downloadFileContent(fileId)
                    await putPage({
                        id: fileId,
                        content: fileContent,
                        editedTime: fileDescription.modifiedTime,
                        modifieddTime: fileDescription.modifiedTime,
                    })
                }
                setState({
                    canEdit: fileDescription.capabilities?.canEdit,
                    initialContent: fileContent ? fileContent : '',
                    fileLoaded: true,
                    fileLoading: false,
                    fileName: fileDescription.name,
                    pageHead,
                })
            }
        } else {
            Router.push('/')
        }
    })

    const updateViewedByMeDate = useCallback(() => {
        const { fileId } = state
        const now = new Date().toISOString()

        const change = {
            viewedByMe: true,
            viewedByMeTime: now,
        }

        // Update the current state

        const updateViewByMeDateItem = (items, id, change) =>
            items.map(item => {
                if (item.id === id) {
                    return { ...item, ...change }
                } else {
                    return item
                }
            })

        const newFiles = updateViewByMeDateItem(files, fileId, change)
        const newInitialFiles = updateViewByMeDateItem(
            initialFiles,
            fileId,
            change
        )
        setFiles(newFiles)
        setInitialFiles(newInitialFiles)

        // Update the file on Google Drive
        updateMetadata(state.fileId, { viewedByMeTime: now })
    })

    debugger
    useEffect(() => {
        setGoToNewFile(false)
        PageView()
    }, []) // eslint-disable-line

    useEffect(() => {
        // load editor content when user is signed in and can use drive api
        if (
            props.isSignedIn &&
            state.fileLoaded &&
            state.fileLoading &&
            files.length > 0
        ) {
            setState({ fileLoading: true }, () => {
                loadEditorContent()
                gapi.load('picker', {
                    callback: () => console.log('Picker loaded'),
                })
            })

            updateViewedByMeDate()
        }
    }, [
        files,
        loadEditorContent,
        props.isSignedIn,
        state.fileLoaded,
        state.fileLoading,
        updateViewedByMeDate,
    ])

    useEffect(() => {
        // when going from one page to the next, we check if the parmeter in the url changed
        if (state.fileId !== props.match.params.id && files.length > 0) {
            setGoToNewFile(false)
            setState(
                {
                    fileId: props.match.params.id,
                    fileLoaded: false,
                },
                loadEditorContent()
            )
        }
    }, [
        files,
        loadEditorContent,
        props.match.params.id,
        setGoToNewFile,
        state.fileId,
    ])

    async function downloadFileContent(fileId) {
        try {
            const fileContent = await downloadFile(fileId)
            return fileContent
        } catch (err) {
            console.log({ err })
            const body = err.body ? JSON.parse(err.body) : {}
            const { error = {} } = body
            if (error.message === 'Invalid Credentials') {
                try {
                    await refreshSession()
                    loadEditorContent()
                } catch (err) {
                    alert(`Couldn't refresh session:`)
                    console.log({ err })
                }
            } else {
                alert(`Couldn't load file`)
                console.log({ error })
            }
            return undefined
        }
    }

    const onBlurInput = async ev => {
        if (!state.pageHead) {
            state.pageHead = 'Untitled page'
        }

        if (state.fileName !== state.pageHead + EXT) {
            setState({ fileName: state.pageHead })
            await renameFile(state.fileId, state.pageHead + EXT)
            setBackgroundUpdate(true)
        }
    }

    const onChangeInput = ev => {
        setState({ pageHead: ev.target.value })
    }

    const onKeyDownInput = ev => {
        switch (ev.key) {
            case `ArrowDown`:
            case `Tab`:
                ev.preventDefault()
                editorRef.current.focus()
                break

            default:
                break
        }

        ev.stopPropagation()
    }

    function setEditorDelta(editorDelta) {
        setState({ editorDelta })
    }

    let editor = (
        <Editor
            canEdit={state.canEdit}
            fileId={state.fileId}
            fileLoaded={state.fileLoaded}
            fileName={state.fileName}
            initialValue={state.initialContent}
            inputRef={inputRef}
            ref={editorRef}
            setEditorDelta={setEditorDelta}
        />
    )
    if (props.isSignedIn && props.match.params.id && !props.isCreatingNewFile) {
        return (
            <div className="page">
                <div className="editorContainer">
                    {state.fileLoaded && (
                        <h1 className="editorHeader">
                            {state.canEdit &&
                                (state.fileName === OVERVIEW_NAME ? (
                                    <div
                                        style={{
                                            color: 'grey',
                                            paddingLeft: '.5rem',
                                        }}
                                    >
                                        {state.pageHead}
                                        <LockOutlineIcon size=".75em" />
                                    </div>
                                ) : (
                                    <FlexInput
                                        id="editorInput"
                                        onBlur={onBlurInput}
                                        value={
                                            state.pageHead !== 'Untitled page'
                                                ? state.pageHead
                                                : ''
                                        }
                                        placeholder="Untitled page"
                                        ref={inputRef}
                                        onKeyDown={onKeyDownInput}
                                        onChange={onChangeInput}
                                    />
                                ))}
                            {!state.canEdit && (
                                <div
                                    style={{
                                        color: 'grey',
                                        paddingLeft: '.5rem',
                                    }}
                                >
                                    {state.pageHead}
                                    <Chip
                                        id="Readonly-Chip"
                                        color="primary"
                                        label="Readonly"
                                        size="small"
                                        style={{
                                            margin: '0 0 3px 1rem',
                                        }}
                                    />
                                </div>
                            )}
                        </h1>
                    )}
                    {state.fileLoaded && editor}
                    {state.fileLoaded && (
                        <BreadcrumbsBar fileId={state.fileId} />
                    )}
                    {!state.fileLoaded && <Spinner />}
                </div>
                <style>{`
                    .page {
                        display: flex;
                    }
                    .editorContainer {
                        height: calc(100vh - 65px);
                        width: 100%;
                    }
                    .editorHeader {
                        border-bottom: 1px solid #d5d5d5;
                        font-size: 1.5rem;
                        font-weight: 400;
                        margin: 0;
                        padding: .45rem .5rem .5rem 0;
                    }                       
                `}</style>
            </div>
        )
    } else if (
        (!props.isSignedIn && props.isSigningIn) ||
        props.isCreatingNewFile
    )
        return <Spinner />
    else if (!props.isSignedIn && !props.isSigningIn) {
        return <Redirect to="/" />
    }
}
