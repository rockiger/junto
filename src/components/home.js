import React from 'react';

import FrontPageHero from './frontPageHero';
import FileList from './fileList'

function Home(props) {
    console.log(props)
    if (props.isSignedIn) {
        return <FileList />
    } else {
        return <FrontPageHero />
    }
}

export default Home