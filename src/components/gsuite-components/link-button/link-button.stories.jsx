import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import LinkButton from './link-button'

import MenuDownIcon from "mdi-react/MenuDownIcon";

storiesOf('LinkButton', module)
    .addDecorator(story => (
        <div
            style={{
                display: 'flex',
                padding: '1rem',
                border: '1px solid rgba(0,0,0, 0.2',
                alignItems: 'center',
            }}
        >
            {story()}
        </div>
    ))
    .add('default', () => {
        return (
            <>
                <LinkButton>
                    Link Button
                </LinkButton>
            </>
        )
    })
    .add('tooltip', () => {
        return (
            <>
                <LinkButton tooltip="Tooltip">
                    Hover over me
                </LinkButton>
            </>
        )
    })
    .add('with trailing icon', () => {
        return (
            <>
                <LinkButton Icon={MenuDownIcon}>
                    Link Button
                </LinkButton>
            </>
        )
    })
    .add('selected', () => {
        return (
            <>
                <LinkButton selected>
                    Link Button
                </LinkButton>
            </>
        )
    })
