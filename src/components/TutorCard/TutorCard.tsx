import React from 'react'
import parse from 'html-react-parser'
import { useTranslation } from 'next-i18next'
import { ITutorItem } from '@/utils/api/tutor'

type IProps = {
  content: ITutorItem
}
export default function TutorCard({ content }: IProps) {
  const { t } = useTranslation()

  return (
    <div className="flex justify-center items-center w-[80vw] pc:w-full px-3">
      <div className="w-full h-full pc:w-[1100px] pc:h-[424px] flex flex-col pc:flex-row items-center justify-between p-3">
        <div className="bg-avatar-circle-sm pc:bg-avatar-circle w-[240px] h-[240px] pc:w-[400px] pc:h-[400px] flex flex-col justify-center items-center">
          <img className="w-[204px] h-[204px] pc:w-[340px] pc:h-[340px] rounded-[50%]" src={content.path} alt="" />
        </div>
        <div className="flex flex-col justify-center items-start w-full pc:max-w-[620px] mt-[30px] pc:mt-0">
          <p className=" w-full font-noto-sans-tc font-medium text-app-brown text-3xl leading-[43px] tracking-wider mb-5 text-center">
            {content.name}
          </p>
          <div className="font-normal text-lg leading-[180%] tracking-[0.08em] text-app-brown [&>ul]:list-disc">{parse(content.description)}</div>
          <div className="flex flex-col pc:flex-row mt-8 pc:mt-12 items-center justify-center w-full">
            <button className="w-[305px] font-noto-sans-tc flex flex-row justify-center items-center gap-2.5 border rounded-md px-10 py-2 bg-app-brown text-white">
              {t('Contact tutor')}
            </button>
            <button className="w-[305px] font-noto-sans-tc flex flex-row justify-center items-center gap-2.5 border rounded-md px-10 py-2 border-app-brown text-app-brown mt-5 pc:mt-0 pc:ml-5">
              {t('Responsible for class')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
