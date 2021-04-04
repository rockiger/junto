import React, { useEffect, useGlobal, useState } from 'reactn'
import { Link } from 'react-router-dom'
import { IFile, IFileOrNull } from 'reactn/default'
import { Breadcrumbs, Typography } from '@material-ui/core'
import NavigateNextIcon from 'mdi-react/NavigateNextIcon'

import { getTitleFromFile } from 'lib/helper'

import { getMetaById, getParents } from './Breadcrumbs-helper'
import { IProps } from './Breadcrumbs.d'
import { useStyles } from './Breadcrumbs.styles'

/**
 * Breadcrumb component that shows the descendents of the given file
 * @param props
 */
export const BreadcrumbsBar = (props: IProps) => {
    const { children, fileId } = props
    const [files] = useGlobal('initialFiles')
    const [file, setFile] = useState<IFileOrNull>(null)
    const [parents, setParents] = useState<Array<IFile>>([])
    const classes = useStyles()

    useEffect(() => {
        if (fileId && files.length > 0) {
            setFile(getMetaById(fileId, files))
        }
    }, [fileId, files, setFile])

    useEffect(() => {
        if (file && files.length > 0) {
            setParents(getParents(file, files))
        }
    }, [file, files, setFile, setParents])

    if (parents.length === 0) return null
    return (
        <span id="breadcrumbsBar" className={classes.breadcrumbsBar}>
            <Breadcrumbs
                aria-label="breadcrumb"
                className={classes.breadcrumbs}
                id="breadcrumbs"
                separator={<NavigateNextIcon />}
            >
                {parents.map((el, index) => {
                    let title = getTitleFromFile(el)
                    if (title) {
                        return (
                            <Link
                                key={index}
                                className={classes.link}
                                to={`/page/${el.id}/`}
                            >
                                {title}
                            </Link>
                        )
                    } else {
                        return null
                    }
                })}
                {children}
            </Breadcrumbs>
        </span>
    )
}
