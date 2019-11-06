import React from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'

import { IconButton } from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip'

const useStyles = makeStyles(theme => ({
    active: {
        background: blue[50],
        color: theme.palette.primary.main,
        height: 40,
        width: 40,
    },
    unactive: {
        height: 40,
        width: 40,
    },
}))

const Button = ({
    children,
    id,
    onClick,
    className,
    style,
    title,
    type,
    active,
    ...props
}) => {
    const classes = useStyles()
    return (
        <Tooltip title={title ? title : ''} enterDelay={500} leaveDelay={200}>
            <IconButton
                id={id}
                style={style}
                type={type}
                onClick={onClick}
                className={classnames(
                    className,
                    active ? classes.active : classes.unactive
                )}
                size="small"
                {...props}
            >
                {children}
            </IconButton>
        </Tooltip>
    )
}

Button.defaultProps = {
    type: 'button',
}

export default Button
