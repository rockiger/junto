import React, { useGlobal } from 'reactn'
import { OVERVIEW_NAME } from 'lib/constants'

import { SidebarTreeItem } from '../SidebarTree/SidebarTreeItem'
import { useStyles } from '../SidebarTree/SidebarTree-styles'
import { getTitleFromFile, isArchived } from 'lib/helper'
import { filterWikis, sortWikisBy } from 'components/wiki-list'
import { filterIsNotArchived } from 'lib/helper/globalStateHelper'

export function SidebarSharedDrives() {
    const [initialFiles] = useGlobal('initialFiles')
    const classes = useStyles()
    window['initialFiles'] = initialFiles
    console.log(initialFiles)

    return (
        <ul className={classes.mydrive}>
            <li>
                <ul className={classes.mydrive}>
                    {thread(
                        '->>',
                        initialFiles,
                        filterWikis,
                        filterIsNotArchived,
                        [sortWikisBy, 'name'],
                        [
                            map,
                            (file, index) => (
                                <SidebarTreeItem
                                    expand={false}
                                    key={index}
                                    files={initialFiles}
                                    label={getTitleFromFile(file)}
                                    level={0}
                                    pageId={file.id}
                                    parentId={file.parents[0]}
                                />
                            ),
                        ]
                    )}
                </ul>
            </li>
        </ul>
    )
}
// sortWikisBy(orderBy, filterWikis(files))
function filterSharedDrives(files) {
    return files.filter(
        file =>
            file.name === OVERVIEW_NAME &&
            file.properties &&
            file.properties.pageName &&
            file.parents[0] &&
            isParentFolderNotDeleted(file, files) &&
            !isArchived(file)
        // file.teamDriveId
        // TODO && parent[0] is
    )
}

function isParentFolderNotDeleted(childFile, files) {
    const parentId = childFile.parents[0]
    const parents = files.filter(file => file.id === parentId)
    return parents[0] && parents[0].trashed === false
}

/**
 * Evaluates the given forms in order, the result of each form will be add last or first in the next form
 * @example thread(
 *             '->',
 *             arr,
 *             fn1,
 *             [fn2, arg2]
 *          )
 * @param {'->' | '-->'} threadType --> for thread last and -> for thread first
 * @param {*} initialValue
 * @param  {...any} forms
 * @returns any
 */
const thread = (threadType, initialValue, ...forms) => {
    return forms.reduce((acc, curVal) => {
        //console.log({ acc, curVal })
        if (Array.isArray(curVal)) {
            const [head, ...rest] = curVal
            //console.log([acc, ...rest])
            return threadType === '->'
                ? head.apply(this, [acc, ...rest])
                : head.apply(this, [...rest, acc])
        } else {
            //console.log({ curVal })
            return curVal(acc)
        }
    }, initialValue)
}

const map = (fn, arr) => arr.map(fn)
