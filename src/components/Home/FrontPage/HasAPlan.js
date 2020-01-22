import React from 'react'
import { Container, Grid, Step, StepLabel, Stepper } from '@material-ui/core'

export const HasAPlan = () => {
    return (
        <Container>
            <h2 style={{ margin: '80px auto', textAlign: 'center' }}>
                How to start being effortless organized?
            </h2>
            <Stepper alternativeLabel>
                <Step active={true} key="eirnate">
                    <StepLabel>Login with your Google Account.</StepLabel>
                </Step>
                <Step active={true} key="eirnate">
                    <StepLabel>
                        Start capture your knowledge in your personal wiki.
                    </StepLabel>
                </Step>
                <Step active={true} key="eirnate">
                    <StepLabel>
                        Add more wikis in your Google Drive when you need them.
                    </StepLabel>
                </Step>
            </Stepper>
        </Container>
    )
}
