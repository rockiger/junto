import React, { useGlobal } from 'reactn'

import { useStyles } from '../SidebarTree/SidebarTree-styles'
import { sortWikisBy } from 'components/wiki-list'
import { SidebarTreeItem } from '../SidebarTree/SidebarTreeItem'

export function SidebarSharedDrives() {
    const [initialFiles] = useGlobal('initialFiles')
    const [wikis] = useGlobal('wikis')
    const classes = useStyles()
    window['initialFiles'] = initialFiles

    return (
        <ul className={classes.mydrive}>
            <li>
                <ul className={classes.mydrive}>
                    {thread(
                        '->>',
                        wikis,
                        //! filterIsNotArchived,
                        [sortWikisBy, 'name'],
                        [
                            map,
                            wiki => (
                                <SidebarTreeItem
                                    expand={true}
                                    key={wiki.id}
                                    initialFiles={initialFiles}
                                    label={wiki.name}
                                    level={0}
                                    pageId={wiki.overviewPage}
                                />
                            ),
                        ]
                    )}
                </ul>
            </li>
        </ul>
    )
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
