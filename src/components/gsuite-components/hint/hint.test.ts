import {
    showHint,
    mergeHintData,
    makeHintRead,
    makeHintConfigRead,
    hintMap2HintMapAppConfig,
} from './hint'

const hintData = {
    wiki_page: {
        edit_page: {
            unread: true,
            message: 'Click on the pencil button or press (e) to edit a page.',
            rank: 10,
            title: 'Edit page',
        },
        star_page: {
            unread: true,
            message:
                'Click on the star button or press (f) to star a page. You will find all starred pages in your sidebar under "Starred"',
            rank: 20,
            title: 'Star page',
        },
        page_menu: {
            unread: true,
            message:
                'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum ',
            rank: 30,
            title: 'Page Menu',
        },
    },
}

const hintAppConfig = {
    wiki_page: {
        edit_page: {
            unread: false,
        },
        star_page: {
            unread: false,
        },
    },
}

const mergedHintData = {
    wiki_page: {
        edit_page: {
            unread: false,
            message: 'Click on the pencil button or press (e) to edit a page.',
            rank: 10,
            title: 'Edit page',
        },
        star_page: {
            unread: false,
            message:
                'Click on the star button or press (f) to star a page. You will find all starred pages in your sidebar under "Starred"',
            rank: 20,
            title: 'Star page',
        },
        page_menu: {
            unread: true,
            message:
                'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum ',
            rank: 30,
            title: 'Page Menu',
        },
    },
}

const updatedAppConfig = {
    wiki_page: {
        edit_page: {
            unread: false,
        },
        star_page: {
            unread: false,
        },
        page_menu: {
            unread: false,
        },
    },
}

const updatedHintData = {
    wiki_page: {
        edit_page: {
            unread: false,
            message: 'Click on the pencil button or press (e) to edit a page.',
            rank: 10,
            title: 'Edit page',
        },
        star_page: {
            unread: false,
            message:
                'Click on the star button or press (f) to star a page. You will find all starred pages in your sidebar under "Starred"',
            rank: 20,
            title: 'Star page',
        },
        page_menu: {
            unread: false,
            message:
                'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum ',
            rank: 30,
            title: 'Page Menu',
        },
    },
}

describe('mergeHintData', () => {
    test('{} {} => {}', () => {
        expect(mergeHintData({}, {})).toEqual({})
    })
    test('hintData {} => hintData', () => {
        expect(mergeHintData(hintData, {})).toEqual(hintData)
    })
    test('hintData hintAppConfig => mergedHintData', () => {
        expect(mergeHintData(hintData, hintAppConfig)).toEqual(mergedHintData)
    })
})

describe('showHint', () => {
    test('"" hintData => false', () => {
        expect(showHint('', hintData['wiki_page'], 0)).toBeFalsy()
    })
    test('"edit_page" hint_data => false', () => {
        expect(showHint('edit_page', hintData['wiki_page'], 0)).toBeFalsy()
    })
    test('"page_menu" hint_data => true', () => {
        expect(showHint('page_menu', hintData['wiki_page'], 0)).toBeTruthy()
    })
})

describe('makeHintRead', () => {
    test('mergedHintData "wiki_page" "page_menu" => updatedHintDate', () => {
        expect(makeHintRead(mergedHintData, 'page_menu', 'wiki_page')).toEqual(
            updatedHintData
        )
    })
    test('mergedHintData "xyz" "page_menu" => updatedHintDate', () => {
        expect(makeHintRead(mergedHintData, 'xyz', 'wiki_page')).toEqual(
            mergedHintData
        )
    })
})

describe('makeHintRead', () => {
    test('hintAppConfig mergedHintData "wiki_page" "page_menu" => updatedAppConfig', () => {
        expect(
            makeHintConfigRead(
                hintAppConfig,
                mergedHintData,
                'page_menu',
                'wiki_page'
            )
        ).toEqual(updatedAppConfig)
    })
    test('hintAppConfig mergedHintData "wiki_page" "page_menu" => updatedAppConfig', () => {
        expect(
            makeHintConfigRead(
                hintAppConfig,
                mergedHintData,
                'xyz',
                'wiki_page'
            )
        ).toEqual(hintAppConfig)
    })
})

describe('hintMap2HintMapAppConifg', () => {
    const hintMap = {
        dashboard: {
            dashboard: {
                unread: false,
                message:
                    'Your dashboard shows an overview of your wikis and your last opened or edited pages.',
                rank: 10,
                title: 'Fulcrum Dashboard',
            },
            new_page: {
                unread: true,
                message:
                    'Click on the "New Page" button or press (c) to create a new sub page of the current page.',
                rank: 20,
                title: 'Create new page',
            },
        },
        wiki_page: {
            edit_page: {
                unread: false,
                message:
                    'Click on the pencil button or press (e) to edit a page.',
                rank: 10,
                title: 'Edit page',
            },
            star_page: {
                unread: false,
                message:
                    'Click on the star button or press (f) to star a page. You will find all starred pages in your sidebar under "Starred"',
                rank: 20,
                title: 'Star page',
            },
        },
    }

    const hintAppConfig = {
        dashboard: {
            dashboard: {
                unread: false,
            },
        },
        wiki_page: {
            edit_page: {
                unread: false,
            },
            star_page: {
                unread: false,
            },
        },
    }
    test('hintMap => hintAppConfig', () => {
        expect(hintMap2HintMapAppConfig(hintMap)).toEqual(hintAppConfig)
    })
})
