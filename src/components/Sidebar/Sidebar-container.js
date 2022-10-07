import { createPage } from 'db'
import React, { useGlobal } from 'reactn'
import PropTypes from 'prop-types'
import { matchPath, useHistory } from 'react-router'

import SidebarRenderer from './Sidebar-component'

export default Sidebar
export function Sidebar() {
    const [wikis] = useGlobal('wikis')
    const [, setIsCreatingNewFile] = useGlobal('isCreatingNewFile')
    const history = useHistory()
    const onClickNewButton = async ev => {
        ev.preventDefault(ev)

        const title = window.prompt('New filename')
        if (title) {
            // We can't use hook useParams, because Sidebar compent it outside
            // of any route.
            const pathname = history.location.pathname
            const match = matchPath(pathname, {
                path: '/page/:id',
                exact: true,
                strict: false,
            })
            const id = match?.params?.id
            try {
                // create new child page
                const page = await createPage({
                    title: title,
                    parentId: id || _.get(_.first(wikis), 'overviewPage'),
                })
                history.push(`/page/${page.id}?edit`)
            } catch (err) {
                setIsCreatingNewFile(false)
                window.err = err
                console.error(err)
            }
        }
    }

    return <SidebarRenderer onClickNewButton={onClickNewButton} />
}

Sidebar.propTypes = {
    goToNewFile: PropTypes.bool,
    setGoToNewFile: PropTypes.func,
}
