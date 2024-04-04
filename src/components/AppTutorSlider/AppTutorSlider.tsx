import React, { Component } from 'react'
import Slider from 'react-slick'
import TutorCard from '../TutorCard'
import { ITutorItem } from '@/utils/api/tutor'

type IProps = {
  tutors: ITutorItem[]
}

export default function AppTutorSlider({ tutors }: IProps) {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  }
  return (
    <div className="w-full pc:w-[1400px] h-fit py-12 flex justify-center items-center">
      <Slider {...settings} className="w-[80%]">
        {tutors.map((tutor, index) => {
          return <TutorCard content={tutor} key={index} />
        })}
      </Slider>
    </div>
  )
}
