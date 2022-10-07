/* global reactPress */
import {
    ApolloClient,
    InMemoryCache,
    gql,
    createHttpLink,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
    uri: 'http://rockiger.local/graphql',
})

const authLink = setContext((_, { headers }) => {
    const credentials = btoa('admin:pass')

    // return the headers to the context so httpLink can read them

    return {
        headers: {
            ...headers,

            Authorization: `Basic ${credentials}`,
        },
    }
})

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
})

export async function fetcher(slug, options = {}) {
    const url = `${reactPress.root}wp/v2${slug}`
    if (process.env.NODE_ENV === 'development') {
        const credentials = btoa('admin:pass')
        const auth = { Authorization: `Basic ${credentials}` }
        const response = await fetch(url, { ...options, headers: auth })
        const data = await response.json()
        return data
    }
    //! https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/
    //! https://developer.wordpress.org/rest-api/using-the-rest-api/client-libraries/
}

export const CREATE_FULCRUM_PAGE = gql`
    mutation createFulcrumPage(
        $spaceId: ID!
        $title: String
        $body: String
        $parentId: ID
    ) {
        createFulcrumPage(
            input: {
                fulcrumSpaces: { nodes: { id: $spaceId } }
                title: $title
                content: $body
                parentId: $parentId
            }
        ) {
            clientMutationId
            fulcrumPage {
                acfFulcrumPage {
                    isoverview
                    isstarred
                }
                author {
                    node {
                        avatar {
                            url
                        }
                        firstName
                        name
                        nicename
                        nickname
                    }
                }
                content
                date
                excerpt
                id
                modified
                parentId
                status
                title
            }
        }
    }
`

/**
 * Consumes the properties of the new page and creates the
 * new page in WordPress. One of title or content is required.
 * @returns
 */
export async function postPage({
    spaceId = '',
    title = '',
    content = '',
    parentId = '',
}) {
    const response = await client.mutate({
        mutation: CREATE_FULCRUM_PAGE,
        variables: { spaceId, title, content, parentId },
    })

    return response.data.createFulcrumPage.fulcrumPage
}

export const GET_FULCRUM_SPACES = gql`
    query getFulcrumSpaces {
        fulcrumSpaces {
            nodes {
                acfFulcrumSpace {
                    overviewPage
                }
                count
                description
                id
                name
            }
        }
    }
`
export async function fetchSpaces() {
    function rewriteNodes(nodes) {
        return nodes.map(node => {
            const {
                acfFulcrumSpace: { overviewPage },
                count,
                description,
                id,
                name,
            } = node
            return {
                overviewPage,
                count,
                description,
                id,
                name,
            }
        })
    }
    const response = await client.query({
        query: GET_FULCRUM_SPACES,
    })
    return rewriteNodes(response.data.fulcrumSpaces.nodes)
}

export const GET_FULCRUM_PAGE = gql`
    query FetchPage($id: ID!) {
        fulcrumPage(id: $id) {
            acfFulcrumPage {
                isoverview
                isstarred
            }
            author {
                node {
                    avatar {
                        url
                    }
                    firstName
                    name
                    nicename
                    nickname
                }
            }
            content
            date
            excerpt
            id
            modified
            parentId
            status
            title
        }
    }
`

export const normalizeFetchPageData = data => {
    const {
        acfFulcrumPage,
        author,
        content,
        excerpt,
        date,
        id,
        modified,
        parentId,
        status,
        title,
    } = data.fulcrumPage
    const { firstName, name, nicename, nickname } = author.node
    const isOverview = !!acfFulcrumPage?.isoverview
    const isStarred = !!acfFulcrumPage?.isstarred

    return {
        author: {
            avatar: data.fulcrumPage.author.node.avatar.url,
            name: firstName || nickname || nicename || name,
        },
        body: content || '',
        created: date,
        excerpt,
        id,
        isOverview,
        isStarred,
        modified: modified,
        parentId,
        status,
        title,
    }
}
export async function fetchPage(id) {
    const response = await client.query({
        query: GET_FULCRUM_PAGE,
        variables: { id },
    })
    return normalizeFetchPageData(response.data)
}

export const GET_FULCRUM_PAGES = gql`
    query getFulcrumPages {
        drafts: fulcrumPages(where: { status: DRAFT }) {
            nodes {
                acfFulcrumPage {
                    isoverview
                    isstarred
                }
                author {
                    node {
                        avatar {
                            url
                        }
                        firstName
                        name
                        nicename
                        nickname
                    }
                }
                date
                excerpt
                id
                modified
                parentId
                status
                title
            }
        }
        pendings: fulcrumPages(where: { status: PENDING }) {
            nodes {
                acfFulcrumPage {
                    isoverview
                    isstarred
                }
                author {
                    node {
                        avatar {
                            url
                        }
                        firstName
                        name
                        nicename
                        nickname
                    }
                }
                date
                excerpt
                id
                modified
                parentId
                status
                title
            }
        }
        publishes: fulcrumPages(where: { status: PUBLISH }) {
            nodes {
                acfFulcrumPage {
                    isoverview
                    isstarred
                }
                author {
                    node {
                        avatar {
                            url
                        }
                        firstName
                        name
                        nicename
                        nickname
                    }
                }
                date
                excerpt
                id
                modified
                parentId
                status
                title
            }
        }
    }
`

export async function fetchPages() {
    function rewriteNodes(nodes) {
        return nodes.map(node => {
            const {
                acfFulcrumPage = {},
                author,
                excerpt,
                date,
                id,
                modified,
                parentId,
                status,
                title,
            } = node
            const { firstName, name, nicename, nickname } = author.node
            const isOverview = !!acfFulcrumPage.isoverview
            const isStarred = !!acfFulcrumPage.isstarred

            return {
                author: {
                    avatar: node.author.node.avatar.url,
                    name: firstName || nickname || nicename || name,
                },
                created: date,
                excerpt,
                id,
                isOverview,
                isStarred,
                modified: modified,
                parentId,
                status,
                title,
            }
        })
    }
    const response = await client.query({
        query: GET_FULCRUM_PAGES,
    })
    const { drafts, pendings, publishes } = response.data
    return _.concat(
        rewriteNodes(drafts.nodes),
        rewriteNodes(pendings.nodes),
        rewriteNodes(publishes.nodes)
    )
}

export const UPDATE_FULCRUM_PAGE = gql`
    mutation UpdateFulcrumPage(
        $body: String
        $id: ID!
        $parentId: ID
        $spaceId: ID
        $title: String
    ) {
        updateFulcrumPage(
            input: {
                content: $body
                fulcrumSpaces: { nodes: { id: $spaceId } }
                id: $id
                parentId: $parentId
                title: $title
            }
        ) {
            fulcrumPage {
                modified
            }
        }
    }
`
/**
 * Consumes the id and the new properties of the new page and update the
 * page in WordPress.
 * @returns
 */
export async function updatePage(
    id,
    { spaceId = '', title = '', content = '', parentId = '' }
) {
    const response = await client.mutate({
        mutation: UPDATE_FULCRUM_PAGE,
        variables: { id, spaceId, title, content, parentId },
    })

    return response.data.updateFulcrumPage.fulcrumPage
}
