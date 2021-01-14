import React, { useEffect, useReducer, useState } from 'reactn'
import { format } from 'date-fns'
import * as _ from 'lodash'
import DotsVerticalIcon from 'mdi-react/DotsVerticalIcon'
import { useSnackbar } from 'notistack'

import { ButtonMenu } from 'components/ButtonMenu'
import { Spinner } from 'components/gsuite-components'
import {
    Alert,
    emptyAlert as initialAlert,
} from 'components/gsuite-components/alert'
import { List, ListItem } from 'components/gsuite-components/list'
import { deleteRevision, listRevisions } from 'lib/gdrive'

function dialogReducer(state, action) {
    switch (action.type) {
        case 'close':
            return initialAlert
        case 'delete':
            return {
                buttonText: 'Delete forever',
                content: (
                    <>
                        <p>
                            {action.revisionNo === 0
                                ? 'The curren revision '
                                : `Revision ${action.revisionNo} `}
                            is about to be permanently deleted.
                        </p>
                        <p>
                            <b>Warning: You can't undo this action.</b>
                        </p>
                    </>
                ),
                isOpen: true,
                onOk: async () => {
                    console.log(
                        'Delete revision',
                        action.revisionId,
                        action.fileId
                    )
                    try {
                        await deleteRevision(action.fileId, action.revisionId)
                    } catch (err) {
                        console.error(err)
                        throw Error('Delete revision error')
                    }
                },
                title: 'Delete forever?',
            }
        default:
            return state
    }
}

export { HistoryDialogContent }
export default function HistoryDialogContent({
    fileId,
    loadEditorContent,
    setIsOpen,
    isOpen,
}) {
    const [alert, alertDispatch] = useReducer(dialogReducer, initialAlert)
    const [loaded, setLoaded] = useState(false)
    const [revisions, setRevisions] = useState([])
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        async function getRevisions() {
            const revData = await listRevisions(fileId)
            console.log({ revData })
            setRevisions(_.reverse(revData.result.revisions))
            setLoaded(true)
        }
        if (!loaded) {
            getRevisions()
        }
    }, [fileId, loaded])
    return (
        <>
            <p>
                Old versions may be deleted after 30 days or after 100
                revisionens are stored.
            </p>
            {!loaded ? (
                <Spinner />
            ) : (
                <List divided>
                    {revisions.map((rev, index, array) => (
                        <ListItem
                            active={index === 0}
                            key={index}
                            menu={() => (
                                <Menu
                                    alertDispatch={alertDispatch}
                                    fileId={fileId}
                                    revisionId={rev.id}
                                    revisionNo={array.length - index}
                                />
                            )}
                            title={format(
                                new Date(rev.modifiedTime),
                                'MMMM d, Y, p'
                            )}
                        >
                            <div>
                                <small>
                                    <i>
                                        {index === 0
                                            ? 'Current Version'
                                            : `Revision ${
                                                  array.length - index
                                              }`}
                                    </i>
                                </small>
                            </div>

                            <div>
                                <small>
                                    {rev?.lastModifyingUser?.displayName}
                                </small>
                            </div>
                        </ListItem>
                    ))}
                </List>
            )}
            {alert.isOpen && (
                <Alert
                    content={alert.content}
                    isOpen={alert.isOpen}
                    okLabel={alert.buttonText}
                    onClose={() => alertDispatch({ type: 'close' })}
                    onOk={async () => {
                        try {
                            await alert.onOk()
                            enqueueSnackbar('Revision deleted.', {
                                autoHideDuration: 5000,
                            })
                            alertDispatch({ type: 'close' })
                            setLoaded(false)
                            window.location.reload()
                        } catch {
                            enqueueSnackbar("Couldn't delete revision.", {
                                autoHideDuration: 5000,
                            })
                            alertDispatch({ type: 'close' })
                        }
                    }}
                    maxWidth="sm"
                    title={alert.title}
                >
                    {alert.content}
                </Alert>
            )}
        </>
    )
}

function Menu({ alertDispatch, fileId, revisionId, revisionNo }) {
    return (
        <ButtonMenu
            items={[
                {
                    key: 1,
                    name: 'Restore this revision',
                    handler: () => console.log('Restore revision', revisionId),
                },
                {
                    key: 2,
                    name: 'Delete this revision',
                    handler: () =>
                        alertDispatch({
                            type: 'delete',
                            fileId,
                            revisionId,
                            revisionNo,
                        }),
                },
            ]}
        >
            <DotsVerticalIcon />
        </ButtonMenu>
    )
}
