import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import parse from 'html-react-parser'
import { IGetListArticleBannerResponse } from '@/utils/api/article'
import router from 'next/router'

type IProps = {
  banners: IGetListArticleBannerResponse
}

export default function AppArticleBanner({ banners }: IProps) {
  const { locale } = router

  const [isMobile, setIfMobile] = useState<boolean>(false)

  const settings = {
    dots: window.innerWidth < 1400,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: window.innerWidth >= 1400,
  }

  let listenResizeWindows = () => {
    setIfMobile(window.innerWidth < 1400)
  }

  useEffect(() => {
    window.addEventListener('resize', listenResizeWindows)
    listenResizeWindows()
  }, [])

  return (
    <div className="w-screen pc:w-[1400px] h-fit">
      <Slider {...settings}>
        {banners.map((item, index) => {
          return (
            <div className="h-[240px] w-full pc:w-[1400px] pc:h-[600px] relative rounded-none pc:rounded-[20px]" key={index}>
              <img className="h-[240px] w-full pc:w-[1400px] pc:h-[600px] relative rounded-none pc:rounded-[20px]" src={item.path} alt="" />
              <div className="w-full h-[84px] pc:w-[1400px] pc:h-[200px] absolute bottom-0 rounded-none pc:rounded-b-[20px] bg-black/60 flex flex-col items-start justify-center p-4 text-white">
                <p
                  className={`font-medium text-lg leading-[26px] pc:text-3xl pc:leading-[43px] text-ellipsis overflow-hidden font-noto-sans-tc ${
                    locale === 'zh-HK' && 'tracking-wider'
                  }`}
                >
                  {item.name}
                </p>
                {!isMobile && (
                  <div
                    className={`font-normal text-lg leading-[180%] tracking-[0.08em] pt-2 text-ellipsis overflow-hidden  font-noto-sans-tc ${
                      locale === 'zh-HK' && 'tracking-wider'
                    }`}
                  >
                    {parse(item.description)}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </Slider>
    </div>
  )
}
