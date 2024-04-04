import React from 'react'

type IProps = {
  text: string
  notReq?: boolean
}

export default function AppLabel({ text, notReq }: IProps) {
  notReq = notReq ?? false
  return <p className="text-sm leading-5 tracking-wider text-medium-brown font-noto-sans-tc">{`${text}${notReq ? '' : '*'}`}</p>
}
