import React from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'

import { IconButton } from '@material-ui/core';

import { typeCheck } from  '../../../slate-editor-utils/src'

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
  }
}))

const Button = ({ children, id, onClick, className, style, type, active, ...props }) => {
  const classes = useStyles()
  return (
    <IconButton
      id={id}
      style={style}
      type={type}
      onClick={(e) => typeCheck.isFunction(onClick) && onClick(e) }
      className={classnames(
        className,
        active ? classes.active : classes.unactive,
        )}
      size="small"
      {...props}
    >
      {children}
    </IconButton>
  )
}

Button.defaultProps = {
  type: 'button'
}

export default Button
