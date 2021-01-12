import React, { useEffect, useState } from 'reactn'
import { format } from 'date-fns'
import * as _ from 'lodash'

import { listRevisions } from 'lib/gdrive'

export { HistoryDialogContent }
export default function HistoryDialogContent({ fileId, setIsOpen, isOpen }) {
    const [downloaded, setDownloaded] = useState(false)
    const [revisions, setRevisions] = useState([])

    useEffect(() => {
        async function getRevisions() {
            setDownloaded(true)
            const revData = await listRevisions(fileId)
            console.log({ revData })
            setRevisions(revData.result.revisions)
        }
        if (!downloaded) {
            getRevisions()
        }
    }, [fileId, downloaded])
    return (
        <div>
            <p>
                Old versions may be deleted after 30 days or after 100
                revisionens are stored.
            </p>
            <ul>
                {_.reverse(revisions).map((rev, index, array) => (
                    <li key={index}>
                        <div>
                            <b>
                                {format(
                                    new Date(rev.modifiedTime),
                                    'MMMM d, Y, p'
                                )}
                            </b>
                        </div>
                        <div>
                            <small>
                                {index === 0
                                    ? 'Current Version'
                                    : `Revision ${array.length - index}`}
                            </small>
                        </div>

                        <div>
                            <small>{rev.lastModifyingUser.displayName}</small>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
