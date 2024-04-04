import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import userApi from '@/utils/api/user/user.api'
import { IGetFashSaleTimeResponse } from '@/utils/api/user'
import { useIsMounted } from 'usehooks-ts'

type IProps = {
  isMobile: boolean
  onRegisterCourse: Function
  onClose: Function
}

export default function FashSale({ isMobile, onRegisterCourse, onClose }: IProps) {
  const { t } = useTranslation()
  const [hours, setHours] = useState(15)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [timeLess, setTimeless] = useState<Date>(new Date())
  const [fashSaleTime, setFashSaleTime] = useState<IGetFashSaleTimeResponse | null>(null)
  const [isLogin, setIfLogin] = useState<boolean>(false)

  let getFashSaleTime = async () => {
    try {
      let res = await userApi.getFashSaleTime({
        params: {
          token: localStorage.getItem('token') ?? '',
        },
      })
      setFashSaleTime(res.data.params)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getFashSaleTime()
    } else {
      let _timeLess = new Date()
      _timeLess.setSeconds(_timeLess.getSeconds() + 21600)
      setTimeless(_timeLess)
    }
  }, [])

  useEffect(() => {
    if (isMounted()) {
      let _timeLess = new Date()
      _timeLess.setSeconds(_timeLess.getSeconds() + (fashSaleTime ? fashSaleTime?.hour * 3600 + fashSaleTime?.minute * 60 + fashSaleTime?.second : 0))
      setTimeless(_timeLess)
    }
  }, [fashSaleTime])

  useEffect(() => {
    getTimeDifference()
    const interval = setInterval(() => getTimeDifference(), 1000)
    return () => clearInterval(interval)
  }, [timeLess])

  const isMounted = useIsMounted()

  const leadingZero = (num: number) => {
    return num < 10 && num >= 0 ? '0' + num : num
  }

  let getTimeDifference = () => {
    let _timeLess = (timeLess?.getTime() - new Date().getTime()) / 1000
    const hours = Math.floor(_timeLess / 3600)
    const minutes = Math.floor((_timeLess / 60) % 60)
    const seconds = Math.floor(_timeLess % 60)
    setHours(hours)
    setMinutes(minutes)
    setSeconds(seconds)
  }

  return (
    <>
      {isMobile ? (
        <div className="bg-[#FFD84E] w-full h-fit p-4 pr-12 flex flex-row flex-wrap justify-start items-center text-lg leading-[26px] tracking-widest text-[#2D2D2D]">
          <p className="font-bold py-1">{t('Special Offer Early Bird Price')}</p>
          <p className="p-1">{t('Sale $200 off')}</p>
          <div className="w-fit flex flex-row gap-[10px] items-center justify-center py-1">
            <button className="w-[42px] h-[39px] bg-white/40 rounded-[5px]">{leadingZero(hours)}</button>
            <p>{t('hour')}</p>
            <button className="w-[42px] h-[39px] bg-white/40 rounded-[5px]">{leadingZero(minutes)}</button>
            <p>{t('minute')}</p>
            <button className="w-[42px] h-[39px] bg-white/40 rounded-[5px]">{leadingZero(seconds)}</button>
            <p>{t('second')}</p>
          </div>
          <div className="w-fit h-fit flex flex-row justify-center items-center gap-[10px] py-1" onClick={() => onRegisterCourse()}>
            <p>{t('Register now')}</p>
            <img className="w-5 h-5" src="/icon/ic-arrow-go-brown.svg" alt="" />
          </div>
          <img className="w-6 h-6 absolute top-[78px] right-[10px]" src="/icon/ic-close.svg" alt="" onClick={() => onClose()} />
        </div>
      ) : (
        <div className="w-screen h-fit py-3 flex flex-row justify-center items-center gap-[140px] bg-[#FFD84E] font-normal text-lg leading-[26px] tracking-widest text-[#2D2D2D] relative">
          <div className="w-fit h-fit flex flex-row gap-5 items-center justify-center">
            <p className="font-bold">{t('Special offer early bird price is counting down!!!')}</p>
            <div className="w-fit flex flex-row gap-[10px] items-center justify-center">
              <button className="w-[42px] h-[39px] bg-white/40 rounded-[5px]">{leadingZero(hours)}</button>
              <p>{t('hour')}</p>
              <button className="w-[42px] h-[39px] bg-white/40 rounded-[5px]">{leadingZero(minutes)}</button>
              <p>{t('minute')}</p>
              <button className="w-[42px] h-[39px] bg-white/40 rounded-[5px]">{leadingZero(seconds)}</button>
              <p>{t('second')}</p>
            </div>
          </div>
          <div className="flex flex-row gap-10 w-fit h-fit justify-center items-center">
            <p>{t('Sale $200 off')}</p>
            <button className="px-4 py-1 rounded-[5px] border-[1px] border-solid border-[#2D2D2D] bg-transparent" onClick={() => onRegisterCourse()}>
              {t('Register now')}
            </button>
          </div>
          <img className="w-6 h-6 absolute top-5 right-[10px] cursor-pointer" src="/icon/ic-close.svg" alt="" onClick={() => onClose()} />
        </div>
      )}
    </>
  )
}
