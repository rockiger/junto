import React, { useEffect, useGlobal, useState } from 'reactn'
import { Link } from 'react-router-dom'
import { Breadcrumbs, Typography } from '@material-ui/core'
import NavigateNextIcon from 'mdi-react/NavigateNextIcon'

import { getTitleFromFile } from 'lib/helper'

import { getMetaById, getParents } from './Breadcrumbs-helper'
import { IMeta, IMetaOrNull, IProps } from './Breadcrumbs.d'
import { useStyles } from './Breadcrumbs.styles'

/**
 * Breadcrumb component that shows the descendents of the given file
 * @param props
 */
export const BreadcrumbsBar = (props: IProps) => {
    const { fileId } = props
    const [files] = useGlobal('initialFiles')
    const [file, setFile] = useState<IMetaOrNull>(null)
    const [parents, setParents] = useState<Array<IMeta>>([])
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
        <div id="breadcrumbsBar" className={classes.breadcrumbsBar}>
            <Breadcrumbs
                aria-label="breadcrumb"
                className={classes.breadcrumbs}
                id="breadcrumbs"
                separator={<NavigateNextIcon />}
            >
                {parents.map(el => {
                    let title = getTitleFromFile(el)
                    if (title) {
                        return (
                            <Link
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
                {file && file.name && (
                    <Typography color="textPrimary">
                        {getTitleFromFile(file)}
                    </Typography>
                )}
            </Breadcrumbs>
        </div>
    )
}
