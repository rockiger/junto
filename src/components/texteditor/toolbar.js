import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles(theme => ({
    toolbar: {
        position: 'fixed',
        right: 0,
        top: 65        
}
})
)
const FormatToolbar = (props) => {
    const classes = useStyles()
    return (
    <Toolbar 
        className={classes.toolbar} 
        variant="dense"
    >
        {props.children}
    </Toolbar>
)
    }

export default FormatToolbar;