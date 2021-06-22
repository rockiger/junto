import React, { useGlobal } from 'reactn'
import TooltipBase from 'react-tooltip-lite'
import CloseIcon from 'mdi-react/CloseIcon'
import IconButton from '../icon-button'
import { HStack } from '..'
import logo from 'static/logo_48.svg'
import s from './hint.module.scss'
import { Hint as IHint } from 'reactn/default'

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
    const [isOpen, setIsOpen] = React.useState(false)

    let hint
    try {
        hint = hints[scope][id]
    } catch (e) {
        hint = emptyHint()
    }
    const { message, rank, title, unread } = hint

    const onClickIconButton = () => {
        setIsOpen(false)
        // a bit complicated. It needs to change the nested hint in scope
        setHints({
            ...hints,
            [scope]: {
                ...hints[scope],
                [id]: { message, rank, title, unread: false },
            },
        })

        //! TODO write changes to config in gdrive
    }
    return (
        <div className={s.hint__wrapper_outer}>
            {children}
            {unread && (
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

const emptyHint = (): IHint => ({
    message: '',
    rank: -1,
    title: '',
    unread: false,
})
