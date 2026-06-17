import { useNavigate } from '@tanstack/react-router'
import {
    Breadcrumb,
    Breadcrumbs,
} from 'react-aria-components/Breadcrumbs'
import _ from 'lodash'
import NavigateNextIcon from 'mdi-react/NavigateNextIcon'
import FileTreeIcon from 'mdi-react/FileTreeIcon'

import { ButtonMenu } from 'components/ButtonMenu'
import { getTitleFromFile } from 'lib/helper'

import { IProps } from './Breadcrumbs.d'
import { useBreadcrumbs } from './breadcrumbs-hooks'

/**
 * Breadcrumb component that shows the descendents of the given file
 * @param props
 */
export const BreadcrumbsBar = (props: IProps) => {
    const { children, fileId } = props
    const { childPages, parentPages } = useBreadcrumbs(fileId)
    const navigate = useNavigate()

    if (parentPages.length === 0) return null
    return (
        <span id="breadcrumbsBar" className="relative text-xl font-normal">
            <Breadcrumbs
                aria-label="breadcrumb"
                id="breadcrumbs"
                className="m-0 flex h-10 flex-wrap items-center list-none p-0"
            >
                {parentPages.map((el) => {
                    const title = getTitleFromFile(el.file)
                    if (!title) return null
                    return (
                        <Breadcrumb
                            key={el.file.id}
                            className="flex select-none items-center"
                        >
                            {({ isCurrent }) => (
                                <>
                                    <ButtonMenu
                                        buttonType="LinkButton"
                                        items={_.concat(
                                            [
                                                {
                                                    key: el.file.id,
                                                    name: getTitleFromFile(
                                                        el.file
                                                    ),
                                                    handler: () =>
                                                        void navigate({
                                                            to: '/page/$id',
                                                            params: {
                                                                id: el.file.id,
                                                            },
                                                        }),
                                                },
                                            ],
                                            el.children.map(child => ({
                                                key: child.id,
                                                name: getTitleFromFile(child),
                                                handler: () =>
                                                    void navigate({
                                                        to: '/page/$id',
                                                        params: {
                                                            id: child.id,
                                                        },
                                                    }),
                                            }))
                                        )}
                                        tooltip={title}
                                    >
                                        {title}
                                    </ButtonMenu>
                                    {!isCurrent && (
                                        <NavigateNextIcon className="mx-2 flex shrink-0" />
                                    )}
                                </>
                            )}
                        </Breadcrumb>
                    )
                })}
                <Breadcrumb className="flex select-none items-center">
                    <div className="flex items-center">
                        <span className="inline-flex min-h-8 items-center py-1 [&>div]:flex [&>div]:items-center [&_input]:translate-y-0">
                            {children}
                        </span>
                        {!_.isEmpty(childPages) ? (
                            <ButtonMenu
                                items={childPages.map(child => ({
                                    key: child.id,
                                    name: getTitleFromFile(child),
                                    handler: () =>
                                        void navigate({
                                            to: '/page/$id',
                                            params: { id: child.id },
                                        }),
                                }))}
                            >
                                <FileTreeIcon />
                            </ButtonMenu>
                        ) : null}
                    </div>
                </Breadcrumb>
            </Breadcrumbs>
        </span>
    )
}
