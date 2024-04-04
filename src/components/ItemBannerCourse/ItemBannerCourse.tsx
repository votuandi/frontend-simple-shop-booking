import { gotoPage } from '@/utils/helpers/common'
import React from 'react'
import { IGetHomeBannerResponse } from '@/utils/api/home'

type IProps = {
  item: IGetHomeBannerResponse
  isMobile: boolean
}

export default function ItemBannerCourse({ item, isMobile }: IProps) {
  return (
    <div className="w-[288px] h-[153px] pc:w-[480px] pc:h-64 rounded-[10px]">
      <img className="h-[153px] w-full pc:h-64 rounded-[10px]" src={item.path} alt="" />
    </div>
  )
}
