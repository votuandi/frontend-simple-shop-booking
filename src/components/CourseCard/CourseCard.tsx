import React, { useState } from 'react'
import parse from 'html-react-parser'
import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import { ICourseItem } from '@/utils/api/course'
import { gotoPage } from '@/utils/helpers/common'
import { useRouter } from 'next/router'

type IProps = {
  content: ICourseItem
}

export default function CourseCard({ content }: IProps) {
  const { t } = useTranslation()
  const { locale } = useRouter()

  const [isReverse, setIfReverse] = useState<boolean>(false)

  let isSale = () => {
    return content.sale_price.toString().split(' ')[1] !== content.price.toString().split(' ')[1]
  }
  let priceClass = clsx('font-bold text-xl leading-[29px] pc:text-[22px] pc:leading-8 font-noto-sans-tc', {
    'text-[#DF3666]': isSale(),
    'text-[#16B49E]': !isSale(),
    'tracking-wider': locale === 'zh-HK',
  })

  let gotoDetail = (e: any) => {
    e.stopPropagation()
    gotoPage('/course-detail', `?id=${content.id.toString()}`)
  }

  return (
    <>
      {!isReverse && (
        <div
          className="w-[260px] h-[440px] pc:w-80 pc:h-[500px] bg-white rounded-[10px] drop-shadow-xl pc:drop-shadow-md flex flex-col relative cursor-pointer card-flip-y-animation"
          onClick={() => setIfReverse(!isReverse)}
        >
          <img className="rounded-t-[10px] w-[260px] h-[175px] pc:w-80 pc:h-[220px]" src={content.images[0].path} alt="" />
          <div className="p-5 flex flex-col h-full">
            <div className="flex flex-col h-full">
              <p
                className={`font-medium text-xl leading-[29px] pc:text-2xl pc:leading-[35px] text-medium-brown text-ellipsis whitespace-nowrap overflow-hidden font-noto-sans-tc ${
                  locale === 'zh-HK' && 'tracking-wider'
                }`}
              >
                {content.name}
              </p>
              <div className="flex flex-row items-end mt-[6px] flex-wrap">
                {isSale() && (
                  <p
                    className={`text-base leading-[26px] line-through text-[#BFBFBF] mr-[10px] font-noto-sans-tc ${
                      locale === 'zh-HK' && 'tracking-wider'
                    }`}
                  >{`${content.price}`}</p>
                )}
                <p className={priceClass}>{`${content.sale_price}`}</p>
              </div>
              <div className="flex flex-row items-center mt-2">
                <img className="w-5 h-5 mr-3" src="/icon/ic-date.svg" alt="" />
                <p
                  className={`h-fit w-full pc:text-sm pc:leading-6 text-app-brown text-ellipsis whitespace-nowrap overflow-hidden font-noto-sans-tc ${
                    locale === 'zh-HK' && 'tracking-[0.06em]'
                  }`}
                >
                  {content.periods.length > 0 && content.periods[0].name}
                </p>
              </div>
              <div className="flex flex-row items-center mt-2">
                <img className="w-5 h-5 mr-3" src="/icon/ic-time.svg" alt="" />
                <p
                  className={`h-fit w-full text-sm leading-6 text-app-brown text-ellipsis whitespace-nowrap overflow-hidden font-noto-sans-tc ${
                    locale === 'zh-HK' && 'tracking-[0.06em]'
                  }`}
                >{`${content.start_time} ~ ${content.end_time}`}</p>
              </div>
            </div>
            <div className="w-full h-fit border-t-[1px] border-[#eeeeee] mt-2 pt-[14px] flex-1">
              <button className="w-full py-3 bg-app-brown rounded-[5px]" onClick={(e) => gotoDetail(e)}>
                <span className={`text-sm leading-5 text-white font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-wider'}`}>{t('Know more')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {isReverse && (
        <div
          className="w-[260px] h-[440px] pc:w-80 pc:h-[500px] bg-white rounded-[10px] drop-shadow-md flex flex-col relative cursor-pointer card-flip-y-animation"
          onClick={() => setIfReverse(!isReverse)}
        >
          <div className="p-5 flex flex-col h-full">
            <div className="flex flex-col h-full justify-center items-start">
              <div
                className={`w-full h-fit max-h-24 pc:max-h-30 text-sm leading-6 text-app-brown font-noto-sans-tc ${
                  locale === 'zh-HK' && 'tracking-wider'
                } ::[&>p] text-ellipsis overflow-hidden my-2`}
              >
                {parse(content.short_description)}
              </div>
              <div className="flex flex-row items-center my-2">
                <img className="w-5 h-5 mr-3" src="/icon/ic-date.svg" alt="" />
                <p
                  className={`h-fit w-full text-sm leading-6 text-app-brown text-ellipsis whitespace-nowrap overflow-hidden font-noto-sans-tc ${
                    locale === 'zh-HK' && 'tracking-[0.06em]'
                  }`}
                >
                  {content.periods.length > 0 && content.periods[0].name}
                </p>
              </div>
              <div className="flex flex-row items-center my-2">
                <img className="w-5 h-5 mr-3" src="/icon/ic-time.svg" alt="" />
                <p
                  className={`h-fit w-full text-sm text-app-brown text-ellipsis whitespace-nowrap overflow-hidden font-noto-sans-tc ${
                    locale === 'zh-HK' && 'tracking-wider'
                  }`}
                >{`${content.start_time} ~ ${content.end_time}`}</p>
              </div>
              <div className="w-full h-fit flex flex-col max-h-[140px]">
                <div className="flex flex-row items-center my-2">
                  <img className="w-5 h-5 mr-3" src="/icon/ic-user.svg" alt="" />
                  <p
                    className={`h-fit w-full text-sm leading-6 text-app-brown text-ellipsis whitespace-nowrap overflow-hidden font-noto-sans-tc ${
                      locale === 'zh-HK' && 'tracking-wider'
                    }`}
                  >
                    {t('course object')}
                  </p>
                </div>
                <div
                  className={`list-disc pl-4 pc:pl-[52px] text-sm leading-6 text-app-brown text-ellipsis whitespace-nowrap overflow-hidden font-noto-sans-tc ${
                    locale === 'zh-HK' && 'tracking-wider'
                  }`}
                >
                  {parse(content.course_objects.description)}
                </div>
              </div>
            </div>
            <div className="w-full h-full border-t-[1px] border-[#eeeeee] mt-2 pt-[14px] flex-1">
              <button className="w-full py-3 bg-app-brown rounded-[5px]" onClick={(e) => gotoDetail(e)}>
                <span className={`text-sm leading-5 text-white font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-wider'}`}>
                  {t('Course Details')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
