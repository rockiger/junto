import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { IconButton } from '@material-ui/core';
import blue from '@material-ui/core/colors/blue'

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

const ToolbarButton = React.forwardRef(
  ({ className, active, reversed, ...props }, ref) => {
    const classes = useStyles();

    return (

      <IconButton
        {...props}
        ref={ref}
        className={active ? classes.active : classes.unactive}
        size="small"
      />
    )
  }
)

export default ToolbarButton