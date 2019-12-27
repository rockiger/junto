import React, { setGlobal } from 'reactn'
import ReactDOM from 'react-dom'

import { BreadcrumbsBar } from './Breadcrumbs'
import { IMeta, IMetaOrNull, IProps } from './Breadcrumbs.d'
import {
    getMetaById,
    getParents,
    getBreadcrumbName,
} from './Breadcrumbs-helper'
import { OVERVIEW_NAME, FOLDER_NAME } from 'lib/constants'

const ifolder1: IMetaOrNull = null
const ifolder2: IMetaOrNull = {
    id: 'xvlc',
    name: 'ifolder2',
    mimeType: 'application/vnd.google-apps.folder',
    parents: ['uiae'],
}
const ifolder3: IMetaOrNull = {
    id: 'uiae',
    name: 'ifolder3',
    mimeType: 'application/vnd.google-apps.folder',
    parents: ['üöäp'],
}
const ifolder4: IMetaOrNull = {
    id: 'üöäp',
    name: 'ifolder4',
    mimeType: 'application/vnd.google-apps.folder',
    parents: ['nrtd'],
}
const ifile2: IMetaOrNull = {
    id: 'ifolder2',
    name: 'ifile2',
    mimeType: 'application/json',
    parents: [],
}
const ifile3: IMetaOrNull = {
    id: 'ifolder3',
    name: 'ifile3',
    mimeType: 'application/json',
    parents: [],
}
const ifile4: IMetaOrNull = {
    id: 'ifolder4',
    name: 'ifile4',
    mimeType: 'application/json',
    parents: [],
}

const rootFolder: IMetaOrNull = {
    id: 'snrt',
    name: FOLDER_NAME,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [],
}

const overviewFile: IMetaOrNull = {
    id: '45',
    name: OVERVIEW_NAME,
    mimeType: 'application/json',
    parents: ['snrt'],
}

export const files: Array<IMeta> = [
    ifolder2,
    ifolder3,
    ifolder4,
    ifile2,
    ifile3,
    ifile4,
    rootFolder,
    overviewFile,
]

const props: IProps = { fileId: 'ifile4', files }

describe('Breadcrumbs', () => {
    it('renders without crashing', () => {
        setGlobal({ initialFiles: files }, () => {
            const div = document.createElement('div')
            ReactDOM.render(<BreadcrumbsBar {...props} />, div)
            ReactDOM.unmountComponentAtNode(div)
        })
    })

    test('getMetaById', () => {
        expect(getMetaById('', files)).toBe(ifolder1)
        expect(getMetaById('xvlc', files)).toBe(ifolder2)
        expect(getMetaById('uiae', files)).toBe(ifolder3)
    })

    test('getBreadcrumbName', () => {
        expect(getBreadcrumbName(ifolder2, files)).toEqual(ifile2)
        expect(getBreadcrumbName(ifolder4, files)).toEqual(ifile4)
        expect(getBreadcrumbName(rootFolder, files)).toEqual(overviewFile)
    })

    test('getParents', () => {
        expect(getParents(ifolder1, files)).toEqual([])
        expect(getParents(ifolder2, files)).toEqual([ifile4, ifile3])
        expect(getParents(ifolder3, files)).toEqual([ifile4])
        expect(getParents(ifolder4, files)).toEqual([])
        expect(getParents(rootFolder, files)).toEqual([])
        // The overview of a wiki shouldn't have a parent
        expect(getParents(overviewFile, files)).toEqual([])
    })
})
