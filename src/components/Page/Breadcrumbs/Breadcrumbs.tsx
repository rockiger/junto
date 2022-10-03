import { useHistory } from 'react-router'
import { Breadcrumbs } from '@material-ui/core'
import NavigateNextIcon from 'mdi-react/NavigateNextIcon'
import FileTreeIcon from 'mdi-react/FileTreeIcon'

import { ButtonMenu } from 'components/ButtonMenu'
import { getTitleFromFile } from 'lib/helper'

import { IProps } from './Breadcrumbs.d'
import { useStyles } from './Breadcrumbs.styles'
import { useBreadcrumbs } from './breadcrumbs-hooks'

/**
 * Breadcrumb component that shows the descendents of the given file
 * @param props
 */
export const BreadcrumbsBar = (props: IProps) => {
    const { children, fileId } = props
    const { childPages, parentPages } = useBreadcrumbs(fileId)
    const history = useHistory()
    const classes = useStyles()

    console.log({ parentPages, childPages })

    if (!parentPages.length && !childPages.length) {
        return (
            <Children childPages={childPages} history={history}>
                {children}
            </Children>
        )
    }
    return (
        <span id="breadcrumbsBar" className={classes.breadcrumbsBar}>
            <Breadcrumbs
                aria-label="breadcrumb"
                className={classes.breadcrumbs}
                id="breadcrumbs"
                separator={<NavigateNextIcon />}
                style={{ height: 40 }}
            >
                {parentPages.map((el, index) => {
                    let title = getTitleFromFile(el.file)
                    if (title) {
                        return (
                            <ButtonMenu
                                key={index}
                                buttonType="LinkButton"
                                items={_.concat(
                                    [
                                        {
                                            key: el.file.id,
                                            name: getTitleFromFile(el.file),
                                            handler: () =>
                                                history.push(
                                                    `/page/${el.file.id}`
                                                ),
                                        },
                                    ],
                                    el.children.map(child => ({
                                        key: child.id,
                                        name: getTitleFromFile(child),
                                        handler: () =>
                                            history.push(`/page/${child.id}`),
                                    }))
                                )}
                                tooltip={title}
                            >
                                {title}
                            </ButtonMenu>
                        )
                    } else {
                        return null
                    }
                })}
                <Children childPages={childPages} history={history}>
                    {children}
                </Children>
            </Breadcrumbs>
        </span>
    )
}
function Children({ children, childPages, history }) {
    return (
        <div style={{ display: 'flex' }}>
            {children}
            {!_.isEmpty(childPages) ? (
                <ButtonMenu
                    items={childPages.map(child => ({
                        key: child.id,
                        name: getTitleFromFile(child),
                        handler: () => history.push(`/page/${child.id}`),
                    }))}
                >
                    <FileTreeIcon />
                </ButtonMenu>
            ) : null}
        </div>
    )
}
