import React from 'react'
import TooltipBase from 'react-tooltip-lite'
import CloseIcon from 'mdi-react/CloseIcon'
import IconButton from '../icon-button'
import { HStack } from '..'
import logo from 'static/logo_48.svg'
import s from './hint.module.scss'

interface Props {
    children: React.ReactNode
}

export const Hint = ({ children }: Props) => {
    return (
        <div className={s.hint__wrapper_outer}>
            {children}
            <div className={s.hint__wrapper_inner}>
                <TooltipBase
                    content={
                        <div>
                            <IconButton
                                className={s.hint__Tooltip__iconbar__IconButton}
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

                                    <div className={s.hint__Tooltip__content}>
                                        <div
                                            className={
                                                s.hint__Tooltip__content__headline
                                            }
                                        >
                                            ernia eurna e eurna utiarn
                                        </div>
                                        t trne tianetr etura deruatre erunade
                                        rnuaerraune nreren
                                    </div>
                                </HStack>
                            </div>
                        </div>
                    }
                    direction="down"
                    eventToggle="onClick"
                    onToggle={ev => console.log(ev)}
                    tipContentClassName={s.hint__Tooltip}
                >
                    <div className={s.hint} />
                </TooltipBase>
            </div>
        </div>
    )
}

// Todo little x to click away the tooltip
