import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import CircleSmallIcon from 'mdi-react/CircleSmallIcon'
import MenuDownIcon from 'mdi-react/MenuDownIcon'
import MenuRightIcon from 'mdi-react/MenuRightIcon'
import PlusIcon from 'mdi-react/PlusIcon'
import {
    Button,
    TreeItemContent,
    type TreeItemContentRenderProps,
} from 'react-aria-components'

import type { WikiTreeNode } from './SidebarTree-types'
import { useWikiTreeAddChild } from './useWikiTreeAddChild'

type WikiTreeItemContentProps = {
    node: WikiTreeNode
    isActive: boolean
}

export function WikiTreeItemContent({
    node,
    isActive,
}: WikiTreeItemContentProps) {
    const contentRef = useRef<HTMLDivElement>(null)
    const [showAddButton, setShowAddButton] = useState(false)
    const onAddChild = useWikiTreeAddChild()

    useEffect(() => {
        if (isActive && contentRef.current) {
            contentRef.current.scrollIntoView({ block: 'nearest' })
        }
    }, [isActive])

    return (
        <TreeItemContent>
            {({
                hasChildItems,
                isExpanded,
            }: TreeItemContentRenderProps) => (
                <div
                    ref={contentRef}
                    className={clsx(
                        'group flex h-8 w-[226px] grow cursor-pointer items-center overflow-hidden rounded-full p-1 text-base leading-4 text-fg-default',
                        'pl-[calc((var(--tree-item-level)-1)*16px)]',
                        isActive && 'bg-[#e8f0fe] text-accent',
                        !isActive && 'hover:bg-black/4',
                    )}
                    onMouseEnter={() => setShowAddButton(true)}
                    onMouseLeave={() => setShowAddButton(false)}
                >
                    {hasChildItems ? (
                        <Button
                            slot="chevron"
                            aria-label="open"
                            className={clsx(
                                'm-[3px] shrink-0 border-0 bg-transparent p-0',
                                isActive && 'text-accent',
                            )}
                        >
                            {isExpanded ? (
                                <MenuDownIcon />
                            ) : (
                                <MenuRightIcon />
                            )}
                        </Button>
                    ) : (
                        <CircleSmallIcon className="m-[3px] shrink-0" />
                    )}
                    <div
                        className="max-w-[calc(100%-40px)] grow truncate leading-normal"
                        title={node.label}
                    >
                        {node.label}
                    </div>
                    {showAddButton && (
                        <Button
                            aria-label="add"
                            className="ml-[3px] hidden shrink-0 cursor-pointer rounded-full border-0 bg-transparent p-0 hover:bg-black/8 sm:flex"
                            onPress={() =>
                                onAddChild(node.id, node.parentFolderId)
                            }
                        >
                            <PlusIcon />
                        </Button>
                    )}
                </div>
            )}
        </TreeItemContent>
    )
}
