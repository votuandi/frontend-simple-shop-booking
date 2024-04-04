import React from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { useRef } from 'react'

type IProps = {
  children: React.ReactNode
  isShow?: boolean
  onClose: Function
}

export default function AppPopup({ children, isShow, onClose }: IProps) {
  const ref = useRef(null)
  const handleClickOutside = () => {
    onClose()
  }
  useOnClickOutside(ref, handleClickOutside)
  return (
    <div>
      {isShow && (
        <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-[#00000060] z-40">
          <div className="w-fit min-w-[680px] max-w-[1000px] h-fit min-h-[360px] rounded-[10px] bg-white p-10 drop-shadow-md flex" ref={ref}>
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
