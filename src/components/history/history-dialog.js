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
                            {action.revisionNo === action.revisions.length
                                ? 'The curren version '
                                : `Version ${action.revisionNo} `}
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
                        'Delete version',
                        action.revisionId,
                        action.fileId
                    )
                    try {
                        await deleteRevision(action.fileId, action.revisionId)
                        return 'Version(s) deleted.'
                    } catch (err) {
                        console.error(err)
                        throw Error('Delete revision error')
                    }
                },
                title: 'Delete forever?',
            }
        case 'restore':
            return {
                buttonText: 'Restore version and delete younger ones',
                content: (
                    <>
                        <p>
                            Restore version {action.revisionNo}.{' '}
                            {action.revisions.length === action.revisionNo + 1
                                ? `The current version`
                                : `Versions ${action.revisions.length} - ${
                                      action.revisionNo + 1
                                  }`}{' '}
                            will be permanently deleted.
                        </p>
                        <p>
                            <b>Warning: You can't undo this action.</b>
                        </p>
                    </>
                ),
                isOpen: true,
                onOk: async () => {
                    const revisionsToDelete = action.revisions.slice(
                        0,
                        action.revisions.length - action.revisionNo
                    )
                    try {
                        await Promise.all(
                            revisionsToDelete.map(rev =>
                                deleteRevision(action.fileId, rev.id)
                            )
                        )
                        return 'Revision restored.'
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
export default function HistoryDialogContent({ fileId }) {
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
                Old versions may be deleted after 30 days or after 100 revisions
                are stored.
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
                                    revisions={array}
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
                                            : `Version ${array.length - index}`}
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
                            const message = await alert.onOk()
                            enqueueSnackbar(message, {
                                autoHideDuration: 5000,
                            })
                            alertDispatch({ type: 'close' })
                            setLoaded(false)
                            window.location.reload()
                        } catch {
                            enqueueSnackbar('Something went wrong.', {
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

function Menu({ alertDispatch, fileId, revisionId, revisionNo, revisions }) {
    return (
        <ButtonMenu
            items={[
                ...(revisionNo === revisions.length
                    ? []
                    : [
                          {
                              key: 1,
                              name: 'Restore this version',
                              handler: () =>
                                  alertDispatch({
                                      type: 'restore',
                                      fileId,
                                      revisionId,
                                      revisionNo,
                                      revisions,
                                  }),
                          },
                      ]),
                {
                    key: 2,
                    name: 'Delete this version',
                    handler: () =>
                        alertDispatch({
                            type: 'delete',
                            fileId,
                            revisionId,
                            revisionNo,
                            revisions,
                        }),
                },
            ]}
        >
            <DotsVerticalIcon />
        </ButtonMenu>
    )
}
