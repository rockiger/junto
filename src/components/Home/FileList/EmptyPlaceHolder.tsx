
import { H2 } from 'components/gsuite-components/h2'
import type { MdiReactIconComponentType } from 'mdi-react'
import { createElement } from 'react'

interface Props {
    icon?: MdiReactIconComponentType
    subline?: string
    title?: string
}

export const EmptyPlaceholder = ({ icon, subline, title }: Props) => {
    return (
        <div className="flex flex-col justify-center items-center mt-24"
        >
            {icon &&
                createElement(icon, {
                    className: 'text-icon-blue-light size-40',
                })}
            <H2>{title}</H2>
            <div className="text-center">{subline && subline}</div>
        </div>
    )
}
