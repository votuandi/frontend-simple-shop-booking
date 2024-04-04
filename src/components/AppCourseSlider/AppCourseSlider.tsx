import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import ItemBannerCourse from '../ItemBannerCourse/ItemBannerCourse'
import { IGetHomeBannersResponse } from '@/utils/api/home'

type IProps = {
  banners: IGetHomeBannersResponse
  isMobile: boolean
}

export default function AppCourseSlider({ banners, isMobile }: IProps) {
  const [settings, setSettings] = useState<any>({
    slidesToShow: isMobile ? 3 : 2,
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
        slidesToShow: Math.floor(window.innerWidth / 320) >= 3 ? 2 : Math.floor(window.innerWidth / 320),
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
        {banners.map((item, index) => {
          return (
            <div className="px-2" key={index}>
              <ItemBannerCourse item={item} isMobile={isMobile} />
            </div>
          )
        })}
      </Slider>
    </div>
  )
}
