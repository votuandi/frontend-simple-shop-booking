import React, { useState } from 'react'
import { IPeriod } from '@/utils/api/course'
import * as styles from '@/utils/constants/classStyle.constant'
import { useTranslation } from 'react-i18next'
import { capitalizeFirstLetterAllWords } from '@/utils/helpers/common'

type IProps = {
  periods: IPeriod[]
  courseName: string
  period_pos?: number
  lesson_pos?: number
  isPay: boolean
  onPay: Function
}

export default function CoursePeriod({ periods, courseName, period_pos, lesson_pos, isPay, onPay }: IProps) {
  const { t } = useTranslation()
  const [periodPosition, setPeriodPosition] = useState<number>(period_pos ?? 0)
  const [lessonPosition, setLessonPosition] = useState<number>(lesson_pos ?? 0)

  let changeTab = (pos: number) => {
    setLessonPosition(0)
    setPeriodPosition(pos)
  }

  return (
    <div className="w-full flex flex-row flex-wrap items-start">
      <div>
        <iframe
          className="mt-7"
          width="880"
          height="495"
          src={
            periods &&
            periods[periodPosition] &&
            periods[periodPosition].period_details[lessonPosition] &&
            periods[periodPosition].period_details[lessonPosition].video_url
          }
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
      <div className="w-[480px] h-[495px] ml-10 flex flex-col justify-start">
        <div className="flex flex-row flex-wrap justify-start items-center h-fit">
          {periods.map((period, periodIndex) => {
            return (
              <div
                className={`${styles.DIV.PERIOD_TAB} ${
                  periodPosition === periodIndex ? 'text-dark-brown border-b-2 border-b-medium-brown border-solid' : 'text-light-brown'
                }`}
                key={periodIndex}
                onClick={() => changeTab(periodIndex)}
              >
                <span>{period.period_level}</span>
              </div>
            )
          })}
        </div>
        <div className="h-full w-full py-8 flex flex-col">
          <p className="text-sm leading-6 tracking-[0.06em] text-app-brown p-[10px]">{`(共4節課堂，總時長6小時00分鐘)`}</p>
          {isPay === false ? (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <p className="font-medium text-3xl leading-[43px] tracking-wider font-noto-sans-tc text-medium-brown">{courseName}</p>
              <button className="items-center gap-2.5 w-[280px] h-[54px] bg-app-brown px-10 py-3.5 rounded-[10px] text-white mt-6" onClick={()=>onPay()}>
                {capitalizeFirstLetterAllWords(t('register now')!)}
              </button>
            </div>
          ) : (
            <div className="w-full h-[495px] overflow-y-auto flex flex-col justify-start items-center">
              {periods &&
                periods[periodPosition] &&
                periods[periodPosition].period_details.map((lesson, lessonIndex) => {
                  return (
                    <div
                      className="flex flex-row justify-between items-center w-full h-20px border-b-[#EEEEEE] border-b border-solid py-5 cursor-pointer"
                      key={lessonIndex}
                      onClick={() => setLessonPosition(lessonIndex)}
                    >
                      <div
                        className={`w-[284px] h-12 flex flex-row justify-start items-center ${
                          lessonIndex === lessonPosition ? 'text-app-brown' : 'text-[#bfbfbf]'
                        }`}
                      >
                        {lessonIndex === lessonPosition && <img className="w-6 h-6 mr-4" src="/icon/ic-play.svg" alt="" />}
                        <p className={`max-h-full block text-ellipsis overflow-hidden`}>{lesson.title}</p>
                      </div>
                      <p className="text-sm leading-5 text-app-brown">{lesson.time_of_length_video}</p>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
