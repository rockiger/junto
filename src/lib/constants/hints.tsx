import { HintMap } from 'components/gsuite-components/hint'

export const hints: HintMap = {
    dashboard: {
        dashboard: {
            unread: true,
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
    },
}
