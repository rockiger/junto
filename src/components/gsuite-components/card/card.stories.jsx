import React from 'react'
import { storiesOf } from '@storybook/react'
import 'index.scss'

import GoogleFolderDriveIcon from 'mdi-react/FolderGoogleDriveIcon'

import { Card, CardBody, CardFooter, CardHeader } from './card'

storiesOf('Card', module)
    .addDecorator(story => (
        <div
            style={{
                border: '1px solid rgba(0,0,0, 0.2)',
                padding: 16,
            }}
        >
            {story()}
        </div>
    ))
    .add('default', () => {
        return (
            <Card>
                <CardHeader
                    avatar={'S'}
                    subtitle={'September 14, 2016'}
                    title={'Shrimp and Chorizo Paella'}
                ></CardHeader>
                <CardBody>
                    This impressive paella is a perfect party dish and a fun
                    meal to cook together with your guests. Add 1 cup of frozen
                    peas along with the mussels, if you like.
                </CardBody>
                <CardFooter>
                    <GoogleFolderDriveIcon /> My Drive
                </CardFooter>
            </Card>
        )
    })
