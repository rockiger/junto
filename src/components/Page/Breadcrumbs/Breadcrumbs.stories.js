import React, { setGlobal } from 'reactn'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs/react'

import { OVERVIEW_NAME, FOLDER_NAME } from 'lib/constants'

import { BreadcrumbsBar } from './Breadcrumbs'

const ifolder2 = {
    id: 'xvlc',
    name: 'ifolder2',
    mimeType: 'application/vnd.google-apps.folder',
    parents: ['uiae'],
}
const ifolder3 = {
    id: 'uiae',
    name: 'ifolder3',
    mimeType: 'application/vnd.google-apps.folder',
    parents: ['üöäp'],
}
const ifolder4 = {
    id: 'üöäp',
    name: 'ifolder4',
    mimeType: 'application/vnd.google-apps.folder',
    parents: ['nrtd'],
}
const ifile2 = {
    id: 'ifolder2',
    name: 'ifile2',
    mimeType: 'application/json',
    parents: [],
}
const ifile3 = {
    id: 'ifolder3',
    name: 'ifile3',
    mimeType: 'application/json',
    parents: [],
}
const ifile4 = {
    id: 'ifolder4',
    name: 'ifile4',
    mimeType: 'application/json',
    parents: [],
}

const rootFolder = {
    id: 'snrt',
    name: FOLDER_NAME,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [],
}

const overviewFile = {
    id: '45',
    name: OVERVIEW_NAME,
    mimeType: 'application/json',
    parents: ['snrt'],
}

export const files = [
    ifolder2,
    ifolder3,
    ifolder4,
    ifile2,
    ifile3,
    ifile4,
    rootFolder,
    overviewFile,
]

storiesOf('BreadcrumbsBar', module)
    .addDecorator(withKnobs)
    .addDecorator(story => (
        <div
            style={{
                padding: '1rem',
                border: '1px solid rgba(0,0,0, 0.2',
            }}
        >
            {story()}
        </div>
    ))
    .add('default', () => <BreadcrumbsBar fileId={'ifolder2'} files={files} />)
