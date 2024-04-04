import React from 'react'
import clsx from 'clsx'

export type IProps = {
  text?: string
  variant?: 'contain' | 'outline' | 'text'
  color?: 'app-brown' | 'app-mint' | 'transparent'
  textColor?: string
  width?: string
  height?: string
} & React.ComponentPropsWithoutRef<'button'>

const AppButton = ({ text, variant, color, textColor, width, height, ...rest }: IProps) => {
  variant = variant ?? 'contain'
  color = color ?? 'app-brown'
  let appClass = clsx('font-noto-sans-tc flex flex-row justify-center items-center gap-2.5 border rounded-md px-5 py-2 w-full relative', {
    ['bg-app-brown']: variant === 'contain' && color === 'app-brown',
    ['bg-app-mint']: variant === 'contain' && color === 'app-mint',
    ['border-app-brown']: variant === 'outline' && color == 'app-brown',
    ['border-app-mint']: variant === 'outline' && color == 'app-mint',
    ['border-transparent']: variant === 'text',
    ['bg-transparent']: variant === 'text',
    ['bg-mint']: color === 'app-mint',
    ['text-white']: variant === 'contain' && textColor == null,
    ['text-app-brown']: (variant === 'outline' ?? variant === 'text') && textColor == null,
  })
  return (
    <button {...rest} className={appClass}>
      <span className="text-base">{text ?? 'Button'}</span>
    </button>
  )
}

export default AppButton
