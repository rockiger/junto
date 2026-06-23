import { useDispatch } from 'reactn'
import { useLocation, useNavigate } from '@tanstack/react-router'
import {
    Collection,
    Tree,
    TreeItem,
} from 'react-aria-components'

import { getPageId, isPage } from '../Sidebar-helper'
import type { WikiTreeNode } from './SidebarTree-types'
import { useWikiTreeExpand } from './useWikiTreeExpand'
import { WikiTreeItemContent } from './WikiTreeItemContent'

type WikiSidebarTreeProps = {
    items: WikiTreeNode[]
    routeExpandedKeys: Set<string>
    'aria-label': string
}

export function WikiSidebarTree({
    items,
    routeExpandedKeys,
    'aria-label': ariaLabel,
}: WikiSidebarTreeProps) {
    const clearSearch = useDispatch('clearSearchComplete')
    const navigate = useNavigate()
    const location = useLocation()
    const currentPageId = isPage(location) ? getPageId(location) : null
    const { expandedKeys, onExpandedChange } =
        useWikiTreeExpand(routeExpandedKeys)

    function renderWikiTreeItem(node: WikiTreeNode) {
        const hasChildren = node.children.length > 0

        return (
            <TreeItem
                className="cursor-pointer outline-none"
                hasChildItems={hasChildren}
                id={node.id}
                textValue={node.label}
            >
                <WikiTreeItemContent
                    node={node}
                    isActive={currentPageId === node.id}
                />
                {hasChildren && (
                    <Collection items={node.children}>
                        {renderWikiTreeItem}
                    </Collection>
                )}
            </TreeItem>
        )
    }

    if (items.length === 0) {
        return null
    }

    return (
        <Tree
            aria-label={ariaLabel}
            className="list-none mr-2 pl-0 outline-none"
            expandedKeys={expandedKeys}
            items={items}
            onAction={key => {
                clearSearch()
                navigate({
                    to: '/page/$id',
                    params: { id: String(key) },
                })
            }}
            onExpandedChange={onExpandedChange}
            selectionMode="none"
        >
            {renderWikiTreeItem}
        </Tree>
    )
}
