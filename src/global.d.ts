declare module '*.css' {
    const classes: { readonly [key: string]: string }
    export default classes
}

declare module '*.scss' {
    const classes: { readonly [key: string]: string }
    export default classes
}

declare module '*.module.css' {
    const classes: { readonly [key: string]: string }
    export default classes
}

declare module 'mdi-react' {
    import type { ComponentType, SVGProps } from 'react'
    export type MdiReactIconComponentType = ComponentType<
        SVGProps<SVGSVGElement> & { size?: number | string }
    >
}

declare module 'mdi-react/*' {
    import type { MdiReactIconComponentType } from 'mdi-react'
    const Icon: MdiReactIconComponentType
    export default Icon
}

import 'lodash'

declare module 'lodash' {
    interface LoDashStatic {
        isNotEmpty: (col: unknown) => boolean
        thread: (initialValue: unknown, ...forms: unknown[]) => unknown
        trace: <T>(x: T) => T
    }
}

export {}
