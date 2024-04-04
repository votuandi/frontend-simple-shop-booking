import React, { useEffect, useState } from 'react'
import { ITabView } from './AppTabView.type'

type IProps = {
  tabs: ITabView[]
  defaultPosition?: any
}

export default function AppTabView({ tabs, defaultPosition }: IProps) {
  const [position, setPosition] = useState(defaultPosition && defaultPosition.pos ? defaultPosition.pos : 0)
  let switchTab = (_position: number) => {
    setPosition(_position)
  }
  useEffect(() => {
    setPosition(defaultPosition && defaultPosition.pos)
  }, [defaultPosition])
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-row flex-wrap justify-between items-end">
        {tabs.map((tab, index) => {
          return (
            <div
              className={`w-full max-w-[50%] h-fit p-3 cursor-pointer ${index === position && 'border-[#EEB545] border-b-2'}`}
              onClick={() => switchTab(index)}
              key={index}
            >
              <p className="font-medium text-3xl leading-[43px] text-center tracking-wider text-app-brown font-noto-sans-tc">{tab.title}</p>
            </div>
          )
        })}
      </div>
      <div className="w-full h-full max-h-[65vh] overflow-y-auto">{tabs[position] && tabs[position].el}</div>
    </div>
  )
}
