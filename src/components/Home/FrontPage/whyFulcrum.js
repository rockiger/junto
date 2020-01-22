import React from 'react'
import { Container, Grid } from '@material-ui/core'
import GoogleKeepIcon from 'mdi-react/GoogleKeepIcon'
import GoogleDocsIcon from 'mdi-react/FileDocumentIcon'

export const whyFulcrum = () => {
    return (
        <Container>
            <h2 style={{ margin: '80px auto', textAlign: 'center' }}>
                Why Fulcrum?
            </h2>
            <Grid container spacing={3}>
                <Grid className={styles.whyIconContainer} item sm={4} xs={12}>
                    <GoogleKeepIcon color={'rgba(0, 0, 0, 0.54)'} size={64} />
                    <p>
                        When we started with G Suite we were looking for a
                        solution to <strong>create our knowledge base</strong>.
                        We first tested <strong>Keep</strong>. Though it's great
                        for taking notes, it's much
                        <strong>
                            {' '}
                            too simplistic to create compelling documentation{' '}
                        </strong>{' '}
                        for your work.{' '}
                    </p>
                </Grid>
                <Grid className={styles.whyIconContainer} item sm={4} xs={12}>
                    <GoogleDocsIcon color={'rgba(0, 0, 0, 0.54)'} size={64} />
                    <p>
                        We then switched to <strong>Docs</strong> - which is{' '}
                        <strong>a great word processor</strong>! Maybe the best
                        we ever used. For <strong>reading and finding</strong>{' '}
                        information on the other hand it is a real pain. It's
                        very cumbersome to create an information structure with
                        Docs and the l
                        <strong>oading of documents takes ages</strong> if you
                        just want to look up something.{' '}
                        <strong>It is made for writing, not reading.</strong>
                    </p>
                </Grid>
                <Grid className={styles.whyIconContainer} item sm={4} xs={12}>
                    <img src={logo} alt="Fulcrum Logo" height={64} />
                    <p>
                        After this experience we started to build Fulcrum.{' '}
                        <strong>It fits right in there.</strong> It is the
                        missing link between Keep and Docs. Create{' '}
                        <strong>powerful documentation</strong> right in your
                        personal Google Drive or collaborate{' '}
                        <strong>with your team</strong> on a shared Drive.
                    </p>
                </Grid>
            </Grid>
        </Container>
    )
}
