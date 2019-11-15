import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'

import { MemoryRouter } from 'react-router-dom'

import Page, { getUserRole } from './page'

describe('Page', () => {
    const props = {
        isSignedIn: false,
        isSigningIn: false,
        match: {
            params: { id: '' },
        },
        setGoToNewFile: () => {},
    }

    it('renders without crashing', () => {
        const div = document.createElement('div')
        ReactDOM.render(
            <MemoryRouter>
                <Page {...props} />
            </MemoryRouter>,
            div
        )
        ReactDOM.unmountComponentAtNode(div)
    })

    test('getuserRole', () => {
        expect(getUserRole('', [], '')).toBe('reader')
        expect(getUserRole('abeiab', files, 'scholzc79@gmail.com')).toBe(
            'reader'
        )
        expect(
            getUserRole(
                '17rJP0l9jAR5fO_PAXpcy73-FAGX0RKIf',
                files,
                'scholzc79@gmail.com'
            )
        ).toBe('organizer')
        expect(
            getUserRole(
                '18DP7sgrMv8Cp288lDUTtSF8oGgHxmkJV',
                files,
                'scholzc79@gmail.com'
            )
        ).toBe('owner')
        expect(
            getUserRole(
                '1POY90jipM9R7ZDfOJqIXH-H3NV5yI6xp',
                files,
                'scholzc79@gmail.com'
            )
        ).toBe('fileOrganizer')
        expect(
            getUserRole(
                '1Yys1N2eYk9so6lGZQufjckJPR9Tl8ujP',
                files,
                'scholzc79@gmail.com'
            )
        ).toBe('writer')
        expect(
            getUserRole(
                '1rVljzJiHtnoOzl8-DMWdZnNPrcE4pg6T',
                files,
                'scholzc79@gmail.com'
            )
        ).toBe('commenter')
        expect(
            getUserRole(
                '1vU3znplcXPvJehJlD1Xn1BZX3I9L-xk2',
                files,
                'scholzc79@gmail.com'
            )
        ).toBe('reader')
    })
})

const files = [
    {
        id: '17rJP0l9jAR5fO_PAXpcy73-FAGX0RKIf',

        permissions: [
            {
                kind: 'drive#permission',
                id: '13946023684264424886',
                type: 'user',
                emailAddress: 'scholzc79@gmail.com',
                role: 'organizer',
                displayName: 'Christin Scholz',
                photoLink:
                    'https://lh3.googleusercontent.com/a-/AAuE7mA6MNLNp_vwSbG4oNmleDNLDANKvNsj1rxOaKDM=s64',
                deleted: false,
            },
        ],
    },
    {
        id: '18DP7sgrMv8Cp288lDUTtSF8oGgHxmkJV',

        permissions: [
            {
                kind: 'drive#permission',
                id: '13946023684264424886',
                type: 'user',
                emailAddress: 'scholzc79@gmail.com',
                role: 'owner',
                displayName: 'Christin Scholz',
                photoLink:
                    'https://lh3.googleusercontent.com/a-/AAuE7mA6MNLNp_vwSbG4oNmleDNLDANKvNsj1rxOaKDM=s64',
                deleted: false,
            },
        ],
    },
    {
        id: '1POY90jipM9R7ZDfOJqIXH-H3NV5yI6xp',

        permissions: [
            {
                kind: 'drive#permission',
                id: '13946023684264424886',
                type: 'user',
                emailAddress: 'scholzc79@gmail.com',
                role: 'fileOrganizer',
                displayName: 'Christin Scholz',
                photoLink:
                    'https://lh3.googleusercontent.com/a-/AAuE7mA6MNLNp_vwSbG4oNmleDNLDANKvNsj1rxOaKDM=s64',
                deleted: false,
            },
        ],
    },
    {
        id: '1Yys1N2eYk9so6lGZQufjckJPR9Tl8ujP',

        permissions: [
            {
                kind: 'drive#permission',
                id: '13946023684264424886',
                type: 'user',
                emailAddress: 'scholzc79@gmail.com',
                role: 'writer',
                displayName: 'Christin Scholz',
                photoLink:
                    'https://lh3.googleusercontent.com/a-/AAuE7mA6MNLNp_vwSbG4oNmleDNLDANKvNsj1rxOaKDM=s64',
                deleted: false,
            },
            {
                kind: 'drive#permission',
                id: '08910577730449941132',
                type: 'user',
                emailAddress: 'rockiger@googlemail.com',
                role: 'owner',
                displayName: 'Marco Laspe',
                photoLink:
                    'https://lh3.googleusercontent.com/a-/AAuE7mDwWi1obkyFzIHPvrTCRdR0mpPYW7Mu1Efl0wryBg=s64',
                deleted: false,
            },
        ],
    },
    {
        id: '1rVljzJiHtnoOzl8-DMWdZnNPrcE4pg6T',

        permissions: [
            {
                kind: 'drive#permission',
                id: '13946023684264424886',
                type: 'user',
                emailAddress: 'scholzc79@gmail.com',
                role: 'commenter',
                displayName: 'Christin Scholz',
                photoLink:
                    'https://lh3.googleusercontent.com/a-/AAuE7mA6MNLNp_vwSbG4oNmleDNLDANKvNsj1rxOaKDM=s64',
                deleted: false,
            },
        ],
    },
    {
        id: '1vU3znplcXPvJehJlD1Xn1BZX3I9L-xk2',

        permissions: [
            {
                kind: 'drive#permission',
                id: '13946023684264424886',
                type: 'user',
                emailAddress: 'scholzc79@gmail.com',
                role: 'reader',
                displayName: 'Christin Scholz',
                photoLink:
                    'https://lh3.googleusercontent.com/a-/AAuE7mA6MNLNp_vwSbG4oNmleDNLDANKvNsj1rxOaKDM=s64',
                deleted: false,
            },
        ],
    },
    {
        id: '1XIChuA7ck744SFNZEd5hhdjjefQn6pdz',

        permissions: [
            {
                kind: 'drive#permission',
                id: '13946023684264424886',
                type: 'user',
                emailAddress: 'scholzc79@gmail.com',
                role: 'owner',
                displayName: 'Christin Scholz',
                photoLink:
                    'https://lh3.googleusercontent.com/a-/AAuE7mA6MNLNp_vwSbG4oNmleDNLDANKvNsj1rxOaKDM=s64',
                deleted: false,
            },
        ],
    },
]
