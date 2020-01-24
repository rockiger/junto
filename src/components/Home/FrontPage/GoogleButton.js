import React from 'react'
import { Paper } from '@material-ui/core'

import GoogleIcon from 'components/googleIcon'

export const GoogleButton = () => (
    <Paper
        className="SignInWithGoogle"
        onClick={() => {
            const button = document.getElementById('authorize_button') || null
            if (button) button.click()
        }}
        style={{
            alignItems: 'center',
            backgroundColor: 'var(--primary-color)',
            border: '1px solid var(--primary-color)',
            borderRadius: 2,
            cursor: 'pointer',
            display: 'flex',
            height: 40,
            maxWidth: 214,
            width: 'fit-content',
        }}
    >
        <div
            style={{
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: '1',
                display: 'flex',
                height: '100%',
                paddingLeft: 12,
                paddingRight: 12,
            }}
        >
            <GoogleIcon active="true" />
        </div>
        <div
            style={{
                color: 'white',
                fontWeight: 500,
                paddingLeft: 12,
                paddingRight: 16,
            }}
        >
            Sign in with Google
        </div>
    </Paper>
)
