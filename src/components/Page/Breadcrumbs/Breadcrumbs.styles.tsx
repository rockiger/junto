import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => {
    return {
        breadcrumbsBar: {
            height: 37,
            position: 'relative',
            borderTop: `1px solid ${theme.palette.grey['A100']}`,
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
