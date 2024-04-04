import React, { Component, useEffect, useState } from 'react'
import Slider from 'react-slick'
import TutorCard from '../TutorCard'
import { HOME_COMPLIMENT_UI } from '@/utils/constants/common.constant'
import { IGetHomeReviewResponse, IGetHomeReviewsResponse } from '@/utils/api/home'

type IReviews = {
  reviews: IGetHomeReviewsResponse
}

export default function AppComplimentSlider({ reviews }: IReviews) {
  const [settings, setSettings] = useState<any>({
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: false,
    centerMode: true,
    focusOnSelect: true,
    arrows: true,
    infinite: true,
  })

  useEffect(() => {
    const listenResizeWindows = () => {
      setSettings({
        slidesToShow: window.innerWidth < 1400 ? Math.floor(window.innerWidth / 300) : 4,
        slidesToScroll: 1,
        dots: false,
        centerMode: true,
        focusOnSelect: true,
        arrows: window.innerWidth < 1400 ? false : true,
        infinite: true,
      })
    }

    listenResizeWindows()

    window.addEventListener('resize', listenResizeWindows)
  }, [])

  return (
    <div className="w-full pc:w-[1400px] h-fit py-12">
      <Slider {...settings} className="flex justify-center items-center">
        {reviews.map((item, index) => {
          return (
            <div className="drop-shadow-md w-fit h-fit rounded-[10px] px-2" key={index}>
              <img className="w-[260px] h-[234px] pc:w-[300px] pc:h-[270px] rounded-[10px]" src={item.path} alt="" />
            </div>
          )
        })}
      </Slider>
    </div>
  )
}
