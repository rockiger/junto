import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => {
    return {
        addButton: {
            display: 'flex',
            flexShrink: 0,
            marginLeft: 3,
            padding: 0,
            [theme.breakpoints.down('sm')]: {
                display: 'none',
            },
        },
        link: {
            alignItems: 'center',
            borderRadius: '0 66px 66px 0',
            display: 'flex',
            flexGrow: 1,
            textDecoration: 'none',
            color: '#3c4043',
            fontSize: '1rem',
            padding: '.25rem',
            height: '2rem',
            overflow: 'hidden',
            lineHeight: '1rem',
            width: 226,
            '&:hover': {
                backgroundColor: 'rgba(0,0,0,.04)',
            },
        },
    }
})
