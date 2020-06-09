//@ts-check
import React from 'react'

import s from './archive.module.scss'

export default Archive
export { Archive }

/**
 * @typedef {object} ArchiveProps
 */

/**
 * A archive component.
 * @param {ArchiveProps} props
 */
function Archive(props) {
    return <div className={s.Archive}>Hello Archive</div>
}
