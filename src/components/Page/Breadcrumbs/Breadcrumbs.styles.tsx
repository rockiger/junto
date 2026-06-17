import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(() => {
    return {
        breadcrumbsBar: {
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
