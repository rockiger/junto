import React from 'react'
import PropTypes from 'prop-types'

import FrontPageHero from './frontPageHero'
import FileList from './fileList'
import Spinner from './spinner'

function Home(props) {
    if (props.isSignedIn && !props.isSigningIn) {
        return <FileList />
    } else if (!props.isSignedIn && props.isSigningIn) {
        return (
            <div style={{ marginTop: '2rem' }}>
                <Spinner />
            </div>
        )
    } else {
        return <FrontPageHero />
    }
}
Home.propTypes = {
    isSignedIn: PropTypes.bool.isRequired,
    isSigningIn: PropTypes.bool.isRequired,
}

export default Home
