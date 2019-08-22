import React from 'react'
import { Paper } from '@material-ui/core'

const SearchAutocomplete = props => {
    return (
        <Paper
            elevation={1}
            style={{
                position: 'absolute',
                borderRadius: 8,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                flexGrow: 1,
                display: 'flex',
                minHeight: 200,
                marginRight: 16,
                marginLeft: 0,
                maxWidth: props.width,
                padding: '2px 4px',
                width: '100%',
                top: props.height + 1,
                left: 0,
            }}
        >
            {props.width} {props.height}
        </Paper>
    )
}

export default SearchAutocomplete
