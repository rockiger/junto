import React from 'react'
import { format } from 'date-fns'
import { Story, Meta } from '@storybook/react/types-6-0'
import DotsVerticalIcon from 'mdi-react/DotsVerticalIcon'

import { List, ListItem, ListItemProps, ListProps } from './list'
import { ButtonMenu } from 'components/ButtonMenu'

export default {
    title: 'List',
    component: List,
} as Meta

export const Empty = args => <List {...args} />

export const OneItem = args => (
    <List {...args}>
        <ListItem>{data[0].lastModifyingUser.displayName}</ListItem>
    </List>
)

export const ManyItemsSimple = args => (
    <List {...args}>
        {data.map(rev => (
            <ListItem>{rev.lastModifyingUser.displayName}</ListItem>
        ))}
    </List>
)

export const ManyItemsComplex = args => (
    <List {...args} divided>
        {data.map((rev, index, array) => (
            <ListItem
                active={index === 0}
                key={index}
                menu={menu}
                title={format(new Date(rev.modifiedTime), 'MMMM d, Y, p')}
            >
                <div>
                    <small>
                        <i>
                            {index === 0
                                ? 'Current Version'
                                : `Revision ${array.length - index}`}
                        </i>
                    </small>
                </div>

                <div>
                    <small>{rev?.lastModifyingUser?.displayName}</small>
                </div>
            </ListItem>
        ))}
    </List>
)

const menu = () => (
    <ButtonMenu
        items={[
            {
                key: 1,
                name: 'Restore this revision',
                handler: () => console.log('Restore revision'),
            },
            {
                key: 2,
                name: 'Delete this revision',
                handler: () => console.log('Delete revision'),
            },
        ]}
    >
        <DotsVerticalIcon />
    </ButtonMenu>
)

const data = [
    {
        kind: 'drive#revision',
        id: '0B2-3AOVMV2yfMnVPTVRRdENtelRiKzk4dWp5YXY4dVpwYkVBPQ',
        mimeType: 'application/json',
        modifiedTime: '2020-12-07T08:59:54.378Z',
        keepForever: false,
        published: false,
        lastModifyingUser: {
            kind: 'drive#user',
            displayName: 'Marco Laspe',
            photoLink:
                'https://lh3.googleusercontent.com/a-/AOh14GgX4XP2XzMqLoIg7oYYHY6ebfkLUjkoDhiiqrC6KA=s64',
            me: true,
            permissionId: '08910577730449941132',
            emailAddress: 'rockiger@googlemail.com',
        },
        originalFilename: 'Lernen.gwiki',
        md5Checksum: '4bd6f5450d09a63b896fae89eea83500',
        size: '17711',
    },
    {
        kind: 'drive#revision',
        id: '0B2-3AOVMV2yfME5McFVZeWdNR3V3bEJsclR2MWlTTEw3c1NRPQ',
        mimeType: 'application/json',
        modifiedTime: '2020-12-13T22:38:22.526Z',
        keepForever: false,
        published: false,
        lastModifyingUser: {
            kind: 'drive#user',
            displayName: 'Marco Laspe',
            photoLink:
                'https://lh3.googleusercontent.com/a-/AOh14GgX4XP2XzMqLoIg7oYYHY6ebfkLUjkoDhiiqrC6KA=s64',
            me: true,
            permissionId: '08910577730449941132',
            emailAddress: 'rockiger@googlemail.com',
        },
        originalFilename: 'Lernen.gwiki',
        md5Checksum: '9ca733acc6b0852f694a68e0243bec40',
        size: '18032',
    },
    {
        kind: 'drive#revision',
        id: '0B2-3AOVMV2yfd0trR2FJcHYyNy9aNkhDcFEwTUtBaEs4dmhNPQ',
        mimeType: 'application/json',
        modifiedTime: '2020-12-13T22:40:36.626Z',
        keepForever: false,
        published: false,
        lastModifyingUser: {
            kind: 'drive#user',
            displayName: 'Marco Laspe',
            photoLink:
                'https://lh3.googleusercontent.com/a-/AOh14GgX4XP2XzMqLoIg7oYYHY6ebfkLUjkoDhiiqrC6KA=s64',
            me: true,
            permissionId: '08910577730449941132',
            emailAddress: 'rockiger@googlemail.com',
        },
        originalFilename: 'Lernen.gwiki',
        md5Checksum: '9ca733acc6b0852f694a68e0243bec40',
        size: '18032',
    },
    {
        kind: 'drive#revision',
        id: '0B2-3AOVMV2yfRmwvSVhrZkdja0dWazJnUm9kb0FjK0R1NTJNPQ',
        mimeType: 'application/json',
        modifiedTime: '2020-12-14T16:01:14.258Z',
        keepForever: false,
        published: false,
        lastModifyingUser: {
            kind: 'drive#user',
            displayName: 'Marco Laspe',
            photoLink:
                'https://lh3.googleusercontent.com/a-/AOh14GgX4XP2XzMqLoIg7oYYHY6ebfkLUjkoDhiiqrC6KA=s64',
            me: true,
            permissionId: '08910577730449941132',
            emailAddress: 'rockiger@googlemail.com',
        },
        originalFilename: 'Lernen.gwiki',
        md5Checksum: '8352245b2c28b4208320f57007a4b178',
        size: '18288',
    },
    {
        kind: 'drive#revision',
        id: '0B2-3AOVMV2yfTmEyeFhpcVR1blM4SjhvYXlDUXEraEREM3I0PQ',
        mimeType: 'application/json',
        modifiedTime: '2020-12-14T21:54:49.805Z',
        keepForever: false,
        published: false,
        lastModifyingUser: {
            kind: 'drive#user',
            displayName: 'Marco Laspe',
            photoLink:
                'https://lh3.googleusercontent.com/a-/AOh14GgX4XP2XzMqLoIg7oYYHY6ebfkLUjkoDhiiqrC6KA=s64',
            me: true,
            permissionId: '08910577730449941132',
            emailAddress: 'rockiger@googlemail.com',
        },
        originalFilename: 'Lernen.gwiki',
        md5Checksum: '663689e8c69aa98d566eee9800d3c7a2',
        size: '18426',
    },
    {
        kind: 'drive#revision',
        id: '0B2-3AOVMV2yfdzJ0eGJRbUNTbUZLNjFSZExRVkR1N25VSUtJPQ',
        mimeType: 'application/json',
        modifiedTime: '2020-12-14T21:59:19.303Z',
        keepForever: false,
        published: false,
        lastModifyingUser: {
            kind: 'drive#user',
            displayName: 'Marco Laspe',
            photoLink:
                'https://lh3.googleusercontent.com/a-/AOh14GgX4XP2XzMqLoIg7oYYHY6ebfkLUjkoDhiiqrC6KA=s64',
            me: true,
            permissionId: '08910577730449941132',
            emailAddress: 'rockiger@googlemail.com',
        },
        originalFilename: 'Lernen.gwiki',
        md5Checksum: '663689e8c69aa98d566eee9800d3c7a2',
        size: '18426',
    },
    {
        kind: 'drive#revision',
        id: '0B2-3AOVMV2yfRklNTjFSb1FoMFdxdWdhT2lCOGRDNHdqTGNNPQ',
        mimeType: 'application/json',
        modifiedTime: '2021-01-02T08:29:16.120Z',
        keepForever: false,
        published: false,
        lastModifyingUser: {
            kind: 'drive#user',
            displayName: 'Marco Laspe',
            photoLink:
                'https://lh3.googleusercontent.com/a-/AOh14GgX4XP2XzMqLoIg7oYYHY6ebfkLUjkoDhiiqrC6KA=s64',
            me: true,
            permissionId: '08910577730449941132',
            emailAddress: 'rockiger@googlemail.com',
        },
        originalFilename: 'Lernen.gwiki',
        md5Checksum: '6d5c3ce8e112f9cf7577e561f4799790',
        size: '18954',
    },
    {
        kind: 'drive#revision',
        id: '0B2-3AOVMV2yfcmZoRXhvV0k1Ukg4YytIYURsUUwyTEFrc2VzPQ',
        mimeType: 'application/json',
        modifiedTime: '2021-01-02T11:01:43.857Z',
        keepForever: false,
        published: false,
        lastModifyingUser: {
            kind: 'drive#user',
            displayName: 'Marco Laspe',
            photoLink:
                'https://lh3.googleusercontent.com/a-/AOh14GgX4XP2XzMqLoIg7oYYHY6ebfkLUjkoDhiiqrC6KA=s64',
            me: true,
            permissionId: '08910577730449941132',
            emailAddress: 'rockiger@googlemail.com',
        },
        originalFilename: 'Lernen.gwiki',
        md5Checksum: '3c6845667ffe481908859dc15067845c',
        size: '19179',
    },
    {
        kind: 'drive#revision',
        id: '0B2-3AOVMV2yfVng0NDMwT29HMHljSG42dUZvcGFEYm8xUjNFPQ',
        mimeType: 'application/json',
        modifiedTime: '2021-01-02T23:23:30.485Z',
        keepForever: false,
        published: false,
        lastModifyingUser: {
            kind: 'drive#user',
            displayName: 'Marco Laspe',
            photoLink:
                'https://lh3.googleusercontent.com/a-/AOh14GgX4XP2XzMqLoIg7oYYHY6ebfkLUjkoDhiiqrC6KA=s64',
            me: true,
            permissionId: '08910577730449941132',
            emailAddress: 'rockiger@googlemail.com',
        },
        originalFilename: 'Lernen.gwiki',
        md5Checksum: '3c6845667ffe481908859dc15067845c',
        size: '19179',
    },
    {
        kind: 'drive#revision',
        id: '0B2-3AOVMV2yfcUlIK2VoVy9zQ1VxUzB3WkRMWUpHL1Y4NmlnPQ',
        mimeType: 'application/json',
        modifiedTime: '2021-01-02T23:23:32.287Z',
        keepForever: false,
        published: false,
        lastModifyingUser: {
            kind: 'drive#user',
            displayName: 'Marco Laspe',
            photoLink:
                'https://lh3.googleusercontent.com/a-/AOh14GgX4XP2XzMqLoIg7oYYHY6ebfkLUjkoDhiiqrC6KA=s64',
            me: true,
            permissionId: '08910577730449941132',
            emailAddress: 'rockiger@googlemail.com',
        },
        originalFilename: 'Lernen.gwiki',
        md5Checksum: '61cf8ad189782da384812c0142940b5c',
        size: '19178',
    },
    {
        kind: 'drive#revision',
        id: '0B2-3AOVMV2yfOUhzT3Bob0txdHZhWWhBeXRZTWxnR2liWTVzPQ',
        mimeType: 'application/json',
        modifiedTime: '2021-01-02T23:23:36.300Z',
        keepForever: false,
        published: false,
        lastModifyingUser: {
            kind: 'drive#user',
            displayName: 'Marco Laspe',
            photoLink:
                'https://lh3.googleusercontent.com/a-/AOh14GgX4XP2XzMqLoIg7oYYHY6ebfkLUjkoDhiiqrC6KA=s64',
            me: true,
            permissionId: '08910577730449941132',
            emailAddress: 'rockiger@googlemail.com',
        },
        originalFilename: 'Lernen.gwiki',
        md5Checksum: '3c6845667ffe481908859dc15067845c',
        size: '19179',
    },
    {
        kind: 'drive#revision',
        id: '0B2-3AOVMV2yfVmNDeEdLcUgxSU03K2NpdS9Ra0xWbEsvTndjPQ',
        mimeType: 'application/json',
        modifiedTime: '2021-01-09T23:35:00.845Z',
        keepForever: false,
        published: false,
        lastModifyingUser: {
            kind: 'drive#user',
            displayName: 'Marco Laspe',
            photoLink:
                'https://lh3.googleusercontent.com/a-/AOh14GgX4XP2XzMqLoIg7oYYHY6ebfkLUjkoDhiiqrC6KA=s64',
            me: true,
            permissionId: '08910577730449941132',
            emailAddress: 'rockiger@googlemail.com',
        },
        originalFilename: 'Lernen.gwiki',
        md5Checksum: 'd2175066a02ddb0c92559ef803354cb6',
        size: '19179',
    },
    {
        kind: 'drive#revision',
        id: '0B2-3AOVMV2yfMWNMandvZmJ1M2x4R012OUhqamlXelFnT2lFPQ',
        mimeType: 'application/json',
        modifiedTime: '2021-01-12T12:10:11.613Z',
        keepForever: false,
        published: false,
        lastModifyingUser: {
            kind: 'drive#user',
            displayName: 'Marco Laspe',
            photoLink:
                'https://lh3.googleusercontent.com/a-/AOh14GgX4XP2XzMqLoIg7oYYHY6ebfkLUjkoDhiiqrC6KA=s64',
            me: true,
            permissionId: '08910577730449941132',
            emailAddress: 'rockiger@googlemail.com',
        },
        originalFilename: 'Lernen.gwiki',
        md5Checksum: 'b5f3dbb883edaed2bb1cbd8791e39a96',
        size: '19359',
    },
]
