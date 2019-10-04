import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, object } from '@storybook/addon-knobs/react'

import Link from '@material-ui/core/Link'
import LinkTooltip from './LinkTooltip'

storiesOf('LinkTooltip', module)
    .addDecorator(withKnobs)
    .addDecorator(story => (
        <div style={{ padding: '1rem', border: '1px solid rgba(0,0,0, 0.2' }}>
            {story()}
        </div>
    ))
    .add('Internal', () => (
        <span style={{ position: 'relative' }}>
            <LinkTooltip
                href="/page/123456"
                onClickCopy={() => {}}
                onClickEdit={() => {}}
                onClickRemove={() => {}}
                show={true}
            />
            <Link href="/page/123456" alt="">
                Internal Link
            </Link>
        </span>
    ))
    .add('External', () => (
        <span style={{ position: 'relative' }}>
            <LinkTooltip
                href="https://spiegel.de"
                onClickCopy={() => {}}
                onClickEdit={() => {}}
                onClickRemove={() => {}}
                show={true}
            />
            <Link href="https://spiegel.de" alt="">
                External Link
            </Link>
        </span>
    ))
