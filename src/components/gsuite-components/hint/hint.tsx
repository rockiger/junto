import React, { useGlobal } from 'reactn'
import TooltipBase from 'react-tooltip-lite'
import _ from 'lib/helper/globals'
import CloseIcon from 'mdi-react/CloseIcon'
import IconButton from '../icon-button'
import { HStack } from '..'
import logo from 'static/logo_48.svg'
import s from './hint.module.scss'

export interface HintData {
    unread: boolean
    message: string
    rank: number
    title: string
}

/**
 * An "2-dimensional" hash map of hinst. Where the first dimension represents the scope, e.g. a page/route where you want to show the hints, and the second dimension represents the actial hint to display.
 * E.g., here the wiki_page is the scope and the edit_page is the ID of
 * a hint:
 * wiki_page: {
 *        edit_page: {
 *            unread: true,
 *            message: 'Click on the pencil button',
 *            rank: 10,
 *            title: 'Edit page',
 *        },
 *        star_page: {
 *            unread: true,
 *            message: 'Click on the star button',
 *            rank: 20,
 *            title: 'Star page',
 *        },
 *      }
 */
export interface HintMap {
    [key: string]: { [key: string]: HintData }
}

export interface HintMapAppConfig {
    [key: string]: { [key: string]: { unread: boolean } }
}

interface Props {
    children: React.ReactNode
    /**
     * The identifier of the hint.
     */
    id: string
    /**
     * The area of the app where the hint should be shown.
     * ex. page
     */
    scope: string
}

export const Hint = ({ children, id, scope }: Props) => {
    const [hints, setHints] = useGlobal('hints')
    const [hintCounter, setHintCounter] = useGlobal('hintCounter')
    const [isOpen, setIsOpen] = React.useState(false)
    const show = showHint(id, hints[scope], hintCounter)
    let hint
    try {
        hint = hints[scope][id]
        if (!hint) throw new Error('Hint is undefined')
    } catch (e) {
        hint = emptyHint()
    }
    const { message, title } = hint

    const onClickIconButton = () => {
        setIsOpen(false)
        // a bit complicated. It needs to change the nested hint in scope
        setHints(makeHintRead(hints, id, scope))
        setHintCounter(hintCounter + 1)
        console.log('//! TODO write changes to config in gdrive')
        //! TODO write changes to config in gdrive
    }
    return (
        <div className={s.hint__wrapper_outer}>
            {children}
            {show && (
                <div className={s.hint__wrapper_inner}>
                    <TooltipBase
                        arrow={false}
                        content={
                            <div>
                                <IconButton
                                    className={
                                        s.hint__Tooltip__iconbar__IconButton
                                    }
                                    onClick={onClickIconButton}
                                >
                                    <CloseIcon size="1rem" />
                                </IconButton>
                                <div className={s.hint__Tooltip__main}>
                                    <HStack>
                                        <img
                                            className={s.hint__Tooltip__logo}
                                            src={logo}
                                            alt="App logo"
                                        />

                                        <div
                                            className={s.hint__Tooltip__content}
                                        >
                                            <div
                                                className={
                                                    s.hint__Tooltip__content__headline
                                                }
                                            >
                                                {title}
                                            </div>
                                            {message}
                                        </div>
                                    </HStack>
                                </div>
                            </div>
                        }
                        direction="down"
                        eventToggle="onClick"
                        isOpen={isOpen}
                        onToggle={ev => setIsOpen(ev)}
                        tipContentClassName={s.hint__Tooltip}
                    >
                        <div className={s.hint} />
                    </TooltipBase>
                </div>
            )}
        </div>
    )
}

const emptyHint = (): HintData => ({
    message: '',
    rank: -1,
    title: '',
    unread: false,
})

/**
 * Consume an hints object and an id to decide if the current
 * hint should be shown.
 * @param currentId
 * @param scopedHints the hints of the current scope
 * @returns boolean
 */
export const showHint = (
    currentId: string,
    scopedHints: { [key: string]: HintData },
    showedHints: number
) => {
    if (showedHints >= 3) {
        return false
    }
    return _.thread(
        scopedHints,
        _.keys,
        [_.map, el => ({ ...scopedHints[el], id: el })],
        [_.filter, ['unread', true]],
        [_.sortBy, ['rank', 'title', 'message']],
        [_.findIndex, ['id', currentId]],
        [pos => pos === 0]
    )
}

/**
 * Consume a HintMap and a HintMapAppConfig and updates the HintMap
 * based on the given HintMapAppConfig.
 * @param hints
 * @param hintsAppData
 * @returns the newly created HintMap
 */
export const mergeHintData = (
    hints: HintMap,
    hintsAppData: HintMapAppConfig
) => {
    if (_.isEmpty(hints) || _.isEmpty(hintsAppData)) {
        return hints
    }
    return _.merge(hints, hintsAppData)
}

/**
 * Consumes a HintMap the scope and the id. If the right path is found,
 * it produces a new HintMap with a new read item otherwise the given
 * HintMap is returned.
 * @param hints
 * @param id
 * @param scope
 * @returns
 */
export const makeHintRead = (
    hints: HintMap,
    id: string,
    scope: string
): HintMap => {
    if (_.has(hints, `${scope}.${id}.unread`)) {
        return _.set(hints, `${scope}.${id}.unread`, false)
    }
    return hints
}

/**
 * Consumes a HintMapAppConfig, a HintMap, the scope and the id. If the
 * right path is found, it produces a new HintMapAppConfig with a new
 *  read item otherwise the given HintMapAppConfig is returned.
 * @param hintAppConfig
 * @param hints
 * @param id
 * @param scope
 * @returns
 */
export const makeHintConfigRead = (
    hintAppConfig: HintMapAppConfig,
    hints: HintMap,
    id: string,
    scope: string
): HintMapAppConfig => {
    if (_.has(hints, `${scope}.${id}.unread`)) {
        return _.set(hintAppConfig, `${scope}.${id}.unread`, false)
    }
    return hintAppConfig
}
