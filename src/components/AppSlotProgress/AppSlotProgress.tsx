import React from 'react'
import clsx from 'clsx'

type IAppSlotProgress = {
  current: number
  total: number
}

const AppSlotProgress = ({ current, total }: IAppSlotProgress) => {
  const currentStyle = clsx('bg-app-brown pc:bg-white h-full rounded-[10px]', {
    'w-[0px]': current === 0,
    'w-[10%]': current / total > 0 && current / total < 0.1,
    'w-[20%]': current / total > 0.1 && current / total < 0.2,
    'w-[30%]': current / total > 0.2 && current / total < 0.3,
    'w-[40%]': current / total > 0.3 && current / total < 0.4,
    'w-[50%]': current / total > 0.4 && current / total < 0.5,
    'w-[60%]': current / total > 0.5 && current / total < 0.6,
    'w-[70%]': current / total > 0.6 && current / total < 0.7,
    'w-[80%]': current / total > 0.7 && current / total < 0.8,
    'w-[90%]': current / total > 0.8 && current / total < 0.9,
    'w-full': current === total,
  })
  return (
    <div className="flex flex-row justify-center items-center w-fit h-fit py-2">
      <div className="h-[6px] w-[180px] bg-app-brown/20 rounded-[10px] flex flex-row relative">
        <div className={currentStyle}></div>
      </div>
    </div>
  )
}

export default AppSlotProgress
