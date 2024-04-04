import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { useOnClickOutside } from 'usehooks-ts'

type SelectInputProps = {
  options: string[]
  value?: string
  relatedOptions?: any[] | null
  placeholder?: string
  onChange?: (value: any) => void
  theme?: 'dark' | 'light'
  disabled?: boolean
  isMobile?: boolean
}

const AppDropdown: React.FC<SelectInputProps> = ({ options, value, placeholder, onChange, theme, disabled, isMobile, relatedOptions }) => {
  theme = theme ?? 'light'
  disabled = disabled ?? false
  isMobile = isMobile ?? false
  relatedOptions = relatedOptions ?? options

  const ref = useRef(null)
  const { locale } = useRouter()
  const [position, setPosition] = useState<number | null>(value && options.includes(value) ? options.indexOf(value) : null)
  const [isShowOptions, setShowOption] = useState(false)
  useEffect(() => {
    if (value) {
      setPosition(options.indexOf(value!) ?? null)
    }
  }, [value])
  let onChangeOption = (pos: number) => {
    setShowOption(false)
    setPosition(pos)
    onChange && onChange(relatedOptions ? relatedOptions[pos] : options[pos])
  }
  const handleClickOutside = () => {
    setShowOption(false)
  }
  const handleOptionClick = (pos: number) => {
    setShowOption(false)
    setPosition(pos)
    onChange && onChange(relatedOptions ? relatedOptions[pos] : options[pos])
  }
  useOnClickOutside(ref, handleClickOutside)
  let classContainer = clsx('flex flex-row border-b-[1px] p-3 justify-between items-center ', {
    'hover:bg-[#74503915] border-app-brown': theme === 'light' && !disabled,
    'hover:bg-[#ffffff15] border-white': theme === 'dark' && !disabled,
    'cursor-pointer': !disabled,
  })

  let classValue = clsx('text-lg leading-[26px] font-noto-sans-tc', {
    'text-app-brown': theme === 'light' && !disabled,
    'text-white': theme === 'dark' && !disabled,
    'text-[#A9A9A9]': disabled,
  })
  let classOptionsContainer = clsx(
    'w-full h-fit flex flex-col relative pc:absolute top-full drop-shadow-lg w-full max-h-[200px] z-50 overflow-auto',
    {
      'bg-background-01': theme === 'light',
      'bg-[#ffffff15]': theme === 'dark',
    }
  )
  let classOptionContainer = clsx('w-full h-fit cursor-pointer px-3 py-2', {
    'hover:bg-[#74503915] text-app-brown': theme === 'light',
    'hover:bg-light-brown text-light-brown hover:text-app-brown': theme === 'dark',
  })
  return (
    <div className="w-full h-fit relative" ref={ref}>
      <div className={classContainer} onClick={() => !disabled && setShowOption(!isShowOptions)}>
        <div className="w-full h-fit">
          <span className={classValue}>{position == null ? placeholder ?? options[0] : options[position]}</span>
        </div>
        <img className="h-2 w-auto" src={theme === 'light' ? '/icon/ic-arrow-down.svg' : '/icon/ic-arrow-down-light.svg'} alt="" />
      </div>
      {isShowOptions && (
        <div className={classOptionsContainer}>
          {options.map((item, index) => {
            const isOptionDisabled = disabled
            const handleOptionClickWrapper = () => !isOptionDisabled && handleOptionClick(index)
            return (
              <div
                className={classOptionContainer}
                onClick={handleOptionClickWrapper}
                key={index}
                style={{ pointerEvents: isOptionDisabled ? 'none' : 'auto' }}
              >
                <span className={`text-lg leading-[26px] w-full h-fit font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-wider'}`}>{item}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AppDropdown
