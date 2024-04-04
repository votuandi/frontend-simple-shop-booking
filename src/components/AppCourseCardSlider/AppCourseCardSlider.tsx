import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import { ICourseItem } from '@/utils/api/course'
import CourseCard from '../CourseCard/CourseCard'

type IProps = {
  listCourse: ICourseItem[]
  isMobile: boolean
}

export default function AppCourseSlider({ listCourse, isMobile }: IProps) {
  const [settings, setSettings] = useState<any>({
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    centerMode: true,
    focusOnSelect: true,
    arrows: !isMobile,
    infinite: true,
  })

  useEffect(() => {
    const listenResizeWindows = () => {
      setSettings({
        slidesToShow: Math.floor(window.innerWidth / 300),
        slidesToScroll: 1,
        dots: false,
        centerMode: true,
        focusOnSelect: true,
        arrows: !isMobile,
        infinite: true,
      })
    }

    listenResizeWindows()

    window.addEventListener('resize', listenResizeWindows)
  }, [])

  return (
    <div className="w-full pc:w-[1400px] h-fit">
      <Slider {...settings}>
        {listCourse.map((item, index) => {
          return (
            <div className='px-2' key={index}>
              <CourseCard content={item} />
            </div>
          )
        })}
      </Slider>
    </div>
  )
}
