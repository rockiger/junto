import {
    buildMyHomeTreeRoot,
    buildSidebarTreeIndexes,
    getExpandedAncestorPageIds,
    getFolderId,
    isPageUnderWikiRoot,
} from './SidebarTree-helper'
import { testState } from './SidebarTree-helper-testState'

const ROOT_FOLDER_ID = '10aUxMqE50MWMBEuZ8C3baucvd3Qh6wzT'
const OVERVIEW_PAGE_ID = '19txRTZ8mEFgJcued6pAZGJPvzm-PaYVi'
const SUB_1_PAGE_ID = '1HDzQoHzNtpfqfRj6kBcfeP5Vuc3SHwPt'
const SUB_2A_PAGE_ID = '10PaYVJl7NhyTGBw-VdzYHu7EdSB6Nn2b'
const SUB_3A_PAGE_ID = '1aLtqdTeZzO00UGBvoB-mONG3tDWfnD8U'

describe('getFolderId', () => {
    test('file without children should return null', () => {
        expect(getFolderId(testState[6].id, testState)).toBe(null)
    })
    test('file with children should return an id', () => {
        expect(getFolderId(testState[4].id, testState)).toBe(
            '1sdF4_JC13Kyo6XIFeOXyYjYi8s5S2pKm',
        )
    })
})

describe('isPageUnderWikiRoot', () => {
    test('returns true for page directly under wiki root', () => {
        expect(
            isPageUnderWikiRoot(SUB_1_PAGE_ID, ROOT_FOLDER_ID, testState),
        ).toBe(true)
    })

    test('returns true for nested page', () => {
        expect(
            isPageUnderWikiRoot(SUB_3A_PAGE_ID, ROOT_FOLDER_ID, testState),
        ).toBe(true)
    })

    test('returns false for unknown page', () => {
        expect(
            isPageUnderWikiRoot('unknown', ROOT_FOLDER_ID, testState),
        ).toBe(false)
    })
})

describe('getExpandedAncestorPageIds', () => {
    test('returns empty set for unknown page', () => {
        expect(
            getExpandedAncestorPageIds('unknown', testState, ROOT_FOLDER_ID),
        ).toEqual(new Set())
    })

    test('returns empty set for overview page', () => {
        expect(
            getExpandedAncestorPageIds(
                OVERVIEW_PAGE_ID,
                testState,
                ROOT_FOLDER_ID,
            ),
        ).toEqual(new Set())
    })

    test('expands overview for direct child page', () => {
        expect(
            getExpandedAncestorPageIds(
                SUB_1_PAGE_ID,
                testState,
                ROOT_FOLDER_ID,
            ),
        ).toEqual(new Set([OVERVIEW_PAGE_ID]))
    })

    test('expands all ancestors for nested page', () => {
        expect(
            getExpandedAncestorPageIds(
                SUB_3A_PAGE_ID,
                testState,
                ROOT_FOLDER_ID,
            ),
        ).toEqual(
            new Set([OVERVIEW_PAGE_ID, SUB_1_PAGE_ID, SUB_2A_PAGE_ID]),
        )
    })
})

function findNodeById(
    node: { id: string; children: { id: string; children: unknown[] }[] },
    id: string,
): { id: string; children: { id: string; children: unknown[] }[] } | null {
    if (node.id === id) {
        return node
    }
    for (const child of node.children) {
        const found = findNodeById(child, id)
        if (found) {
            return found
        }
    }
    return null
}

describe('buildWikiTreeNode', () => {
    const indexes = buildSidebarTreeIndexes(testState)

    test('leaf nodes have empty children', () => {
        const root = buildMyHomeTreeRoot(testState, ROOT_FOLDER_ID, indexes)
        expect(root).not.toBeNull()
        const leaf = findNodeById(root!, SUB_3A_PAGE_ID)
        expect(leaf).not.toBeNull()
        expect(leaf!.children).toEqual([])
    })

    test('nested page path has three ancestor levels under overview', () => {
        const root = buildMyHomeTreeRoot(testState, ROOT_FOLDER_ID, indexes)
        expect(root).not.toBeNull()

        const sub1 = findNodeById(root!, SUB_1_PAGE_ID)
        const sub2a = findNodeById(root!, SUB_2A_PAGE_ID)
        const sub3a = findNodeById(root!, SUB_3A_PAGE_ID)

        expect(sub1).not.toBeNull()
        expect(sub2a).not.toBeNull()
        expect(sub3a).not.toBeNull()
        expect(findNodeById(sub1!, SUB_2A_PAGE_ID)).not.toBeNull()
        expect(findNodeById(sub2a!, SUB_3A_PAGE_ID)).not.toBeNull()
    })
})

describe('buildMyHomeTreeRoot', () => {
    test('returns overview root with MYHOME label', () => {
        const indexes = buildSidebarTreeIndexes(testState)
        const root = buildMyHomeTreeRoot(testState, ROOT_FOLDER_ID, indexes)

        expect(root).toEqual(
            expect.objectContaining({
                id: OVERVIEW_PAGE_ID,
                label: 'My Wiki',
                parentFolderId: ROOT_FOLDER_ID,
            }),
        )
        expect(root!.children.length).toBeGreaterThan(0)
    })

    test('returns null without root folder id', () => {
        expect(buildMyHomeTreeRoot(testState, null)).toBeNull()
    })
})
