import React, { Component } from 'react'
import Slider from 'react-slick'
import { useTranslation } from 'next-i18next'
import { IGetHomeReasonResponse } from '@/utils/api/home'

type IProps = {
  reasons: IGetHomeReasonResponse
}

export default function AppReasonSlider({ reasons }: IProps) {
  const { t } = useTranslation()

  const settings = {
    dots: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    arrows: true,
  }

  return (
    <div className="w-full pc:w-[1400px] h-fit py-12 px-6">
      <Slider {...settings}>
        {reasons.map((item, index) => {
          return (
            <div key={index}>
              <div className="flex flex-col w-[90vw] pc:w-full h-fit items-center justify-center ">
                <img className="h-[120px] w-[120px] pc:h-[200px] pc:w-[200px]" src={item.path} alt="" />
                <p className="mt-6 w-full h-fit whitespace-pre-line text-center font-medium text-xl leading-[29px] pc:text-2xl pc:leading-[35px] tracking-widest text-app-brown font-noto-sans-tc">
                  {item.name}
                </p>
              </div>
            </div>
          )
        })}
      </Slider>
    </div>
  )
}
