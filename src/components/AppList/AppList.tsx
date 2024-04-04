import React from 'react'

type IProps = {
  items: string[]
}

export default function AppList({ items }: IProps) {
  return (
    <ul className="app-list w-[640px]">
      {items.map((item, index) => {
        return (
          <li className="text-app-brown text-lg leading-[180%] tracking-[0.08em] font-noto-sans-tc" key={index}>
            {item}
          </li>
        )
      })}
    </ul>
  )
}
