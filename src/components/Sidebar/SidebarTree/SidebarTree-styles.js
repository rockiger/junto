import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => {
    return {
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
