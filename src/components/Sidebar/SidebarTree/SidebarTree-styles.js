import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => {
    return {
        addButton: {
            display: 'flex',
            flexShrink: 0,
            marginLeft: 3,
            padding: 0,
        },
        ul: {
            listStyleType: 'none',
            paddingLeft: 0,
        },
        group: {
            marginLeft: 0,
        },
        icon: {
            color: theme.palette.primary.main,
            minWidth: theme.spacing(4),
        },
        link: {
            alignItems: 'center',
            borderRadius: '0 var(--border-radius) var(--border-radius) 0',
            display: 'flex',
            flexGrow: 1,
            textDecoration: 'none',
            color: 'var(--link-color)',
            fontSize: '1rem',
            padding: '.25rem',
            height: '2rem',
            overflow: 'hidden',
            lineHeight: '1rem',
            width: 226,
            '&:hover': {
                backgroundColor: 'var(--hover-bg-color)',
            },
        },
        mydrive: {
            height: 'calc(100vh - 138px)',
            listStyleType: 'none',
            marginLeft: '-1rem',
            marginRight: '.5rem',
            paddingBottom: '2rem',
            paddingLeft: 0,
            '&:hover': {
                overflowY: 'auto',
            },
        },
    }
})
