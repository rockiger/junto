import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    root: {
        height: 32,
        margin: '4px 8px',
        borderRight: `1px solid ${theme.palette.grey['A100']}`,
        verticalAlign: 'middle',
    },
}))

const Divider = ({
    children,
    id,
    onClick,
    outerState: { readOnly },
    className,
    style,
    type,
    active,
    ...props
}) => {
    const classes = useStyles()
    if (readOnly) return null
    return <div className={classes.root} />
}

export default Divider
