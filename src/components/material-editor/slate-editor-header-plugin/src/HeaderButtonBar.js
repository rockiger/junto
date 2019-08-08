import React from 'react'

import { H1Button, H2Button } from '.'
// FIXME: Needs to handle assets files to work with SSR
if (require('exenv').canUseDOM) require('./HeaderButtonBar.css')

const HeaderButtonBar = props => (
    <div className="slate-header-plugin--button-bar">
        <H1Button {...props} />
        <H2Button {...props} />
    </div>
)

export default HeaderButtonBar
