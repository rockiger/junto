import clsx from 'clsx'
import { Button } from 'components/gsuite-components'

type GoogleButtonProps = {
  className?: string
  onClick?: () => void
  signIn?: boolean
}

export function GoogleButton({
  className,
  onClick = () => { },
  signIn = true,
}: GoogleButtonProps) {
  console.log(signIn, signIn ? "#F2F2F2" : "#131314")
  return (
    <Button className={clsx("px-6 py-3", className)} variant='primary' onPress={onClick}>{signIn ? 'Sign In' : 'Sign Up'}</Button>
  )
}
