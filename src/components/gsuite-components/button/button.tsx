import clsx from 'clsx'
import type { ReactNode } from 'react'
import {
    Button as AriaButton,
    type ButtonProps as AriaButtonProps,
    composeRenderProps,
} from 'react-aria-components'

export type ButtonVariant = 'primary' | 'secondary' | 'quiet'

export interface ButtonProps
    extends Omit<AriaButtonProps, 'className' | 'children'> {
    variant?: ButtonVariant
    /** @deprecated Use `variant="primary"` */
    primary?: boolean
    /** Alias for `isDisabled` */
    disabled?: boolean
    children?: ReactNode
    className?: string | AriaButtonProps['className']
    /** Legacy props from MUI-style callers — ignored */
    color?: string
    edge?: string
}

const sharedClass =
    'relative inline-flex min-w-0 cursor-default items-center justify-center gap-2 border border-transparent font-sans text-sm font-medium [-webkit-tap-highlight-color:transparent] outline-none transition-[color,background,transform] duration-200 focus-visible:shadow-focus data-pressed:scale-[0.98] data-disabled:cursor-not-allowed'

const variantClass: Record<ButtonVariant, string> = {
    primary:
        'min-h-10 rounded-full bg-icon-blue px-4 text-on-accent hover:bg-accent-dark data-hovered:bg-accent-dark data-pressed:bg-accent-dark data-disabled:opacity-50',
    secondary:
        'min-h-10 rounded-full bg-transparent px-4 text-accent-dark hover:bg-icon-blue-lighter data-hovered:bg-icon-blue-lighter data-pressed:bg-icon-blue-lighter data-disabled:text-fg-disabled',
    quiet:
        'rounded-control bg-transparent px-4 py-2 text-grey-700 hover:bg-surface-hover data-hovered:bg-surface-hover data-pressed:bg-surface-hover data-disabled:text-fg-disabled',
}

function ButtonSpinner({ variant }: { variant: ButtonVariant }) {
    const strokeClass =
        variant === 'primary' ? 'stroke-on-accent' : 'stroke-current'

    return (
        <span className="absolute inset-0 flex items-center justify-center">
            <svg
                className={clsx('size-4 animate-spin', strokeClass)}
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
            >
                <title>Loading</title>
                <circle
                    cx="12"
                    cy="12"
                    r="10"
                    strokeWidth="4"
                    className="opacity-25"
                />
                <circle
                    cx="12"
                    cy="12"
                    r="10"
                    strokeWidth="4"
                    strokeLinecap="round"
                    pathLength="100"
                    strokeDasharray="60 140"
                />
            </svg>
        </span>
    )
}

function resolveVariant(
    variant: ButtonVariant | undefined,
    primary: boolean | undefined,
): ButtonVariant {
    if (variant) {
        return variant
    }
    return primary ? 'primary' : 'quiet'
}

function Button({
    primary,
    variant: variantProp,
    disabled,
    isDisabled: isDisabledProp,
    className,
    children,
    color: _color,
    edge: _edge,
    ...rest
}: ButtonProps) {
    const variant = resolveVariant(variantProp, primary)
    const isDisabled = isDisabledProp ?? disabled

    return (
        <AriaButton
            {...rest}
            isDisabled={isDisabled}
            className={composeRenderProps(className, (cn, renderProps) =>
                clsx(
                    sharedClass,
                    variantClass[variant],
                    renderProps.isPending && 'text-transparent',
                    cn,
                ),
            )}
        >
            {composeRenderProps(children, (childContent, { isPending }) => (
                <>
                    {childContent}
                    {isPending && <ButtonSpinner variant={variant} />}
                </>
            ))}
        </AriaButton>
    )
}

export { Button }
export default Button
