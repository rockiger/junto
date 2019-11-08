import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => {
    return {
        active: {
            color: theme.palette.primary.main,
            backgroundColor: 'rgba(66, 133, 244, 0.08)',
        },
    }
})
