import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => {
    return {
        breadcrumbsBar: {
            height: 37,
            position: 'relative',
            borderTop: `1px solid ${theme.palette.grey['A100']}`,
        },
        breadcrumbs: {
            margin: '7px .7rem',
        },
    }
})
