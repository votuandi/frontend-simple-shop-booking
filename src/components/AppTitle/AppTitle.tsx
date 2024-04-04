import React from 'react'
import { ITitle } from './AppTitle.type'

type IProps = {
  behind: ITitle
  before: ITitle
}

export default function AppTitle({ behind, before }: IProps) {
  return (
    <div className="w-fit h-fit flex flex-col justify-center items-center">
      <div className="relative w-fit h-fit">
        <p className={behind.class}>{behind.text}</p>
        <div className="w-full h-fit absolute flex flex-col items-center -bottom-1">
          <p className={before.class}>{before.text}</p>
        </div>
      </div>
      <img className="mt-3" src="/img/pattern-breakk-line.png" alt="" />
    </div>
  )
}
