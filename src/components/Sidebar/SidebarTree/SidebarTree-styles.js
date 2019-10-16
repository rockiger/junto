import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => {
    return {
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
            '&:hover': {
                backgroundColor: 'var(--hover-bg-color)',
            },
            display: 'flex',
            flexGrow: 1,
            textDecoration: 'none',
            alignItems: 'center',
            borderRadius: 'var(--border-radius)',
            color: 'var(--link-color)',
            fontSize: '1rem',
            padding: '.25rem',
            width: 210,
            height: '2rem',
            overflow: 'hidden',
            lineHeight: '1rem',
        },
        mydrive: {
            height: 'calc(100vh - 138px)',
            listStyleType: 'none',
            marginRight: '.5rem',
            paddingBottom: '2rem',
            paddingLeft: 0,
            '&:hover': {
                overflowY: 'auto',
            },
        },
    }
})
