import { HintMap } from 'components/gsuite-components/hint'

export const hints: HintMap = {
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
