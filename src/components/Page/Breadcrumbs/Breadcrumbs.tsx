import React from 'reactn'
import { Breadcrumbs, Link, Typography } from '@material-ui/core'
import NavigateNextIcon from 'mdi-react/NavigateNextIcon'

import { useStyles } from './Breadcrumbs.styles'

export const BreadcrumbsBar = props => {
    const classes = useStyles()

    return (
        <div id="breadcrumbsBar" className={classes.breadcrumbsBar}>
            <Breadcrumbs
                aria-label="breadcrumb"
                className={classes.breadcrumbs}
                id="breadcrumbs"
                separator={<NavigateNextIcon />}
            >
                <Link color="inherit" href="/">
                    Material-UI
                </Link>
                <Link color="inherit" href="/getting-started/installation/">
                    Core
                </Link>
                <Typography color="textPrimary">Breadcrumb</Typography>
            </Breadcrumbs>
        </div>
    )
}
