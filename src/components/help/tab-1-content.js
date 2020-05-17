import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'

import ExpandMoreIcon from 'mdi-react/ExpandMoreIcon'

import s from './help.module.scss'

const ExpansionePanel = withStyles({
    root: {
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        borderTop: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(ExpansionPanel)

const ExpansionPaenelSummary = withStyles({
    root: {
        color: '#1967d2',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(ExpansionPanelSummary)

const ExpansionPaneelDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(ExpansionPanelDetails)

export default function CustomizedExpansionPanels() {
    return (
        <div>
            <h1 className={s.header}>Fulcrum FAQ</h1>
            <ExpansionPanel classes={{ root: s.ExpansionPanel }} square>
                <ExpansionPanelSummary
                    aria-controls="panel1d-content"
                    classes={{ root: s.ExpansionPanelSummary }}
                    expandIcon={<ExpandMoreIcon className={s.ExpandMoreIcon} />}
                    id="panel1d-header"
                >
                    <Typography>Collapsible Group Item #1</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={s.ExpansionPanelDetails}>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse malesuada lacus ex, sit amet blandit leo
                        lobortis eget. Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit. Suspendisse malesuada lacus ex, sit
                        amet blandit leo lobortis eget.
                    </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel square>
                <ExpansionPanelSummary
                    aria-controls="panel2d-content"
                    classes={{ root: s.ExpansionPanelSummary }}
                    expandIcon={<ExpandMoreIcon />}
                    id="panel2d-header"
                >
                    <Typography>Collapsible Group Item #2</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse malesuada lacus ex, sit amet blandit leo
                        lobortis eget. Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit. Suspendisse malesuada lacus ex, sit
                        amet blandit leo lobortis eget.
                    </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel square>
                <ExpansionPanelSummary
                    aria-controls="panel3d-content"
                    classes={{ root: s.ExpansionPanelSummary }}
                    expandIcon={<ExpandMoreIcon />}
                    id="panel3d-header"
                >
                    <Typography>Collapsible Group Item #3</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse malesuada lacus ex, sit amet blandit leo
                        lobortis eget. Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit. Suspendisse malesuada lacus ex, sit
                        amet blandit leo lobortis eget.
                    </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    )
}
