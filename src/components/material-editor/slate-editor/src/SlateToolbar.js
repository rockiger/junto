import React from 'react'
import classnames from 'classnames'
import { react } from '../../slate-editor-utils/src'

import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles(theme => ({
  toolbar: {
    position: 'fixed',
    right: 0,
    top: 65
  }
}))

export default ({ children, style, className, ...rest }) => {
  const classes = useStyles()
  return (
    <Toolbar 
      className={classnames('editor--toolbar', className, classes.toolbar)} style={style}
      variant="dense"
    >
      {react.cloneElement(children, rest)}
    </Toolbar>
  )
}
