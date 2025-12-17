import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => {
    return {
        active: {
            color: theme.palette.primary.main,
            backgroundColor: '#e8f0fe',
        },
    }
})
