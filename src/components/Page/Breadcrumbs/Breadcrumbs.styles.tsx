import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => {
    return {
        breadcrumbsBar: {
            height: 37,
            position: 'relative',
        },
        breadcrumbs: {
            margin: 0,
        },
        link: {
            color: 'inherit',
            fontSize: '1.2rem',
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
    }
})
