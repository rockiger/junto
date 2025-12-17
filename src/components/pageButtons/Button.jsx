import React from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'

import { IconButton } from 'components/gsuite-components'

const useStyles = makeStyles((theme) => ({
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

export const Button = ({
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
        <IconButton
            id={id}
            style={style}
            type={type}
            onClick={(e) => onClick(e)}
            className={classnames(
                className,
                active ? classes.active : classes.unactive
            )}
            size="small"
            tooltip={title}
            {...props}
        >
            {children}
        </IconButton>
    )
}

Button.defaultProps = {
    type: 'button',
}
