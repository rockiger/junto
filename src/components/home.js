import React from 'react';

import FrontPageHero from './frontPageHero';
import FileList from './fileList'
import Spinner from './spinner'

function Home(props) {
    console.log(props)
    if (props.isSignedIn && !props.isSigningIn) {
        return <FileList />
    } else if ( !props.isSignedIn && props.isSigningIn) {
        return (<Spinner />)
    } else {
        return <FrontPageHero />
    }
}

export default Home