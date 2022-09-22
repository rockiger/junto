import React, { setGlobal } from 'reactn'
import ReactDOM from 'react-dom'
import { IFile, IFileOrNull } from 'reactn/default'

import { BreadcrumbsBar } from './Breadcrumbs'
import { IProps } from './Breadcrumbs.d'
import {
    getMetaById,
    getParents,
    getBreadcrumbName,
} from './Breadcrumbs-helper'
import { OVERVIEW_NAME, FOLDER_NAME } from 'lib/constants'

const ifolder1: IFileOrNull = null
const ifolder2: IFileOrNull = {
    id: 'xvlc',
    name: 'ifolder2',
    mimeType: 'application/vnd.google-apps.folder',
    parents: ['uiae'],
}
const ifolder3: IFileOrNull = {
    id: 'uiae',
    name: 'ifolder3',
    mimeType: 'application/vnd.google-apps.folder',
    parents: ['üöäp'],
}
const ifolder4: IFileOrNull = {
    id: 'üöäp',
    name: 'ifolder4',
    mimeType: 'application/vnd.google-apps.folder',
    parents: ['nrtd'],
}
const ifile2: IFileOrNull = {
    id: 'ifolder2',
    name: 'ifile2',
    mimeType: 'application/json',
    parents: [],
}
const ifile3: IFileOrNull = {
    id: 'ifolder3',
    name: 'ifile3',
    mimeType: 'application/json',
    parents: [],
}
const ifile4: IFileOrNull = {
    id: 'ifolder4',
    name: 'ifile4',
    mimeType: 'application/json',
    parents: [],
}

const rootFolder: IFileOrNull = {
    id: 'snrt',
    name: FOLDER_NAME,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [],
}

const overviewFile: IFileOrNull = {
    id: '45',
    name: OVERVIEW_NAME,
    mimeType: 'application/json',
    parents: ['snrt'],
}

const wikiRootFolder: IFileOrNull = {
    id: '19-OgtjbJ8WORJK0IHwdvT9rml3cW6TxL',
    name: 'Team2',
    mimeType: 'application/vnd.google-apps.folder',
    parents: [],
}

const wikiOverviewFile: IFileOrNull = {
    id: 'euinaerndiuare',
    name: OVERVIEW_NAME,
    mimeType: 'application/json',
    parents: ['19-OgtjbJ8WORJK0IHwdvT9rml3cW6TxL'],
}

export const files: Array<IFile> = [
    ifolder2,
    ifolder3,
    ifolder4,
    ifile2,
    ifile3,
    ifile4,
    rootFolder,
    overviewFile,
    wikiRootFolder,
    wikiOverviewFile,
]

const props: IProps = { fileId: 'ifile4', children: files }

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
        expect(getBreadcrumbName(wikiRootFolder, files)).toEqual(wikiRootFolder)
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
