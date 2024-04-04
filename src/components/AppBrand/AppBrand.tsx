import { BRAND_NAME } from '@/utils/constants/common.constant'
import React from 'react'
import { useTranslation } from 'next-i18next'
import clsx from 'clsx'

const AppBrand = () => {
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  let line_1_class = clsx('font-medium font-noto-sans-tc z-10', {
    ['text-[28px] leading-[41px] pc:text-[28px] pc:leading-[36px] ']: i18n.language === 'en-US',
    ['tracking-widest text-[28px] leading-[41px] pc:text-[42px] pc:leading-[61px]']: i18n.language === 'zh-HK',
  })
  let line_2_class = clsx('font-bold text-medium-brown font-noto-sans-tc z-10', {
    ['text-[40px] leading-[40px]']: i18n.language === 'en-US',
    ['tracking-widest text-[38px] leading-[55px] pc:text-[62px] pc:leading-[90px]']: i18n.language === 'zh-HK',
  })
  let line_3_class = clsx('text-2xl text-app-brown font-noto-sans-tc', {
    ['text-[24px] leading-[35px]']: i18n.language === 'en-US',
    ['tracking-widest text-[20px] leading-[29px] pc:text-[24px] pc:leading-[35px]']: i18n.language === 'zh-HK',
  })
  let fontSize = i18n.language === 'en-US' ? 'text-[24px]' : 'tracking-widest text-[42px]'

  return (
    <div className="h-fit w-full flex flex-col">
      <div className="px-5 w-fit relative flex items-center justify-center">
        <img className="w-full h-auto absolute bottom-0 z-0" src="/img/img-mint-line.png" alt="" />
        <p className={line_1_class}>{t(BRAND_NAME.line_1)}</p>
      </div>
      <div className="px-5 w-fit relative flex items-center justify-center mt-3">
        <img className="w-full h-auto absolute bottom-0 z-0" src="/img/img-mint-line.png" alt="" />
        <p className={line_2_class}>{t(BRAND_NAME.line_2)}</p>
      </div>
      <div className="px-5 mt-7 flex flex-row items-center">
        <p className={line_3_class}>{t(BRAND_NAME.line_3)}</p>
        {/* <img className="w-6 h-6 ml-7" src="/icon/ic-go-on.svg" alt="" /> */}
      </div>
    </div>
  )
}

export default AppBrand
