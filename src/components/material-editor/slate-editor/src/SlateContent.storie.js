import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import SlateContent from './SlateContent'

export const actions = {}
storiesOf('SlateContent', module).add('default', () => (
    <SlateContent {...actions} />
))
