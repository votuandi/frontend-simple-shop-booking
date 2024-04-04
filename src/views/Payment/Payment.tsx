import * as React from 'react'
import { useTranslation } from 'next-i18next'
import * as styles from '@/utils/constants/classStyle.constant'
import { useEffect, useState } from 'react'
import { gotoPage, halfSumPrices, sumPrices } from '@/utils/helpers/common'
import courseApi from '@/utils/api/course/course.api'
import { useRouter } from 'next/router'
import { ICourseItem } from '@/utils/api/course'
import parse from 'html-react-parser'
import userApi, { IGetInfoResponse } from '@/utils/api/user'

export interface IAppProps {}

export default function Payment(props: IAppProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { locale } = router
  const [courseIds, setCourseIds] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [courses, setCourses] = useState<ICourseItem[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [voucher, setVoucher] = useState<string>('')
  const [step, setStep] = useState<number>(0)
  const [isMobile, setIfMobile] = useState<boolean>(false)
  const [paymentLink, setPaymentLink] = useState<string>('')
  const [userInfo, setUserInfo] = useState<IGetInfoResponse | null>(null)

  //call API
  let getListCourse = async (_courseIds?: string) => {
    try {
      let res = await courseApi.getCourseByIds({
        params: {
          language: locale!.replace('-', '_'),
          course_ids: _courseIds ?? courseIds,
          token: localStorage.getItem('token')!,
          limit: '10',
          page: currentPage.toString(),
        },
      })

      setCourses(res.data.params)
    } catch (e) {
      console.log(e)
    }
  }

  //callApi
  let getUserInfo = async () => {
    try {
      let res = await userApi.getUserInfo({
        params: {
          language: locale!.replace('-', '_'),
          token: localStorage.getItem('token') ?? '',
        },
      })
      setUserInfo(res.data.params)
    } catch (e) {
      console.log(e)
    }
  }

  let handleSelect = (_id: string) => {
    let newSelected = [...selected]
    let index = selected.indexOf(_id)

    if (index !== -1) {
      newSelected.splice(index, 1)
      setSelected(newSelected)
    } else {
      newSelected.push(_id)
      setSelected(newSelected)
    }
  }

  let onPay = async () => {
    if (selected.length === 0) {
      alert(t('No course to pay'))
    } else {
      try {
        let res = await courseApi.payment({
          params: {
            language: locale!.replace('-', '_'),
            token: localStorage.getItem('token')!,
            course_ids: selected.join(','),
          },
        })
        if (res.data.status === 200) {
          setPaymentLink(res.data.params.url)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  let isSelected = (_id: string) => {
    return selected.includes(_id)
  }

  let listenResizeWindows = () => {
    setIfMobile(window.innerWidth < 1400)
  }

  useEffect(() => {
    window.addEventListener('resize', listenResizeWindows)
    listenResizeWindows()

    if (localStorage.getItem('token')) {
      let _courseIds = localStorage.getItem('cart')
      getListCourse(_courseIds ?? '')
    } else {
      gotoPage('/login')
    }
  }, [])

  useEffect(() => {
    getListCourse()
  }, [locale])

  useEffect(() => {
    if (paymentLink.length > 0) {
      window.open(paymentLink, '_blank')
    }
  }, [paymentLink])

  return (
    <>
      {isMobile ? (
        <div className="w-screen h-screen fixed z-50 top-0 left-0 bg-white flex flex-col">
          <div className="w-full h-[58px] py-4 border-b-[1px] border-[#eeeeee] border-solid drop-shadow-sm flex flex-row px-6 items-center justify-center relative">
            <p className="font-medium text-lg leading-[26px] text-center tracking-widest text-medium-brown text-ellipsis whitespace-nowrap overflow-hidden px-4">
              {t('class registration')!}
            </p>
            <img className="w-6 h-6 absolute right-5" src="/icon/ic-close.svg" alt="" onClick={() => router.back()} />
          </div>
          {step === 0 && (
            <div className="w-full h-fit flex flex-col px-4 p-10 overflow-auto">
              <p className="pt-7 pb-3 font-medium text-medium-brown text-xl leading-[29px] tracking-wider border-b-[1px] border-solid border-[#D9D9D9]">
                {t('choose a course')}
              </p>
              <div className="w-full h-fit flex flex-col mt-6">
                {courses.map((course, index) => {
                  return (
                    <div
                      className={`w-full h-fit flex flex-col justify-start items-stretch p-6 mb-4 rounded-[10px] border-solid cursor-pointer ${
                        isSelected(course.id.toString()) ? 'border-2 border-medium-brown bg-white' : 'border-[1px] border-[#BFBFBF] bg-[#F9F9F9]'
                      }`}
                      key={index}
                      onClick={() => handleSelect(course.id.toString())}
                    >
                      <div className="w-fit flex flex-col items-start">
                        <p className="w-full max-h-[70px] text-ellipsis overflow-hidden font-medium text-2xl leading-[35px] tracking-widest mb-5">
                          {course.name}
                        </p>
                        <div className="flex flex-row w-full h-fit items-stretch flex-wrap grap-3 mb-6">
                          <button className="w-fit h-fit max-w-full mr-3 py-1 px-3 bg-[#EEB545] text-white rounded-[5px] font-noto-sans-tc font-normal text-sm leading-6">
                            {t('Limited Time Offer')!}
                          </button>
                          {!userInfo?.is_orders && (
                            <button className="w-fit h-fit max-w-full mr-3 py-1 px-3 bg-[#64D28A] text-white rounded-[5px] font-noto-sans-tc font-normal text-sm leading-6">
                              {t('First Month Offer')!}
                            </button>
                          )}
                        </div>
                        {isSelected(course.id.toString()) && (
                          <div className="font-normal text-sm leading-6 tracking-[0.06em] text-[#89817A] w-full h-fit mb-8">
                            {parse(course && course.short_description)}
                          </div>
                        )}
                        <p className="font-bold text-[28px] leading-[41px] text-app-brown m-1">{course.sale_price}</p>
                        <p className="text-sm leading-5 line-through text-[#BFBFBF]">{course.price}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <button
                className="h-fit w-full max-w-[400px] rounded-[6px] py-4 bg-app-brown text-white font-normal text-base leading-[23px] text-center tracking-widest mt-8"
                onClick={() => setStep(1)}
              >
                {t('Sure')!}
              </button>
            </div>
          )}
          {step === 1 && (
            <div className="w-full h-fit flex flex-col px-4 p-10 overflow-auto">
              <p className="pt-7 pb-3 font-medium text-medium-brown text-xl leading-[29px] tracking-wider border-b-[1px] border-solid border-[#D9D9D9]">
                {t('choose a course')}
              </p>
              <div className="w-full h-fit flex flex-col mt-6">
                <div className="flex flex-col border-b-[1px] border-[#d9d9d9] border-solid w-full h-fit font-normal text-lg leading-[26px] font-noto-sans-tc text-app-brown">
                  <div className="flex flex-row justify-between items-center py-2">
                    <p>{t('course price')}</p>
                    <p>
                      {sumPrices(
                        courses
                          .filter((course) => selected.includes(course.id.toString()))
                          .map((c) => c.price.toString().split(' ')[1].replaceAll(',', ''))
                      )}
                    </p>
                  </div>
                  <div className="flex flex-row justify-between items-center py-2">
                    <p>{t('Limited Time Offer')}</p>
                    <p>
                      {halfSumPrices(
                        courses
                          .filter((course) => selected.includes(course.id.toString()))
                          .map((c) => c.discount_price.toString().split(' ')[1].replaceAll(',', ''))
                      )}
                    </p>
                  </div>
                  <div className="flex flex-row justify-between items-center py-2">
                    <p>{t('First Month Offer')}</p>
                    <p>
                      {halfSumPrices(
                        courses
                          .filter((course) => selected.includes(course.id.toString()))
                          .map((c) => c.discount_price.toString().split(' ')[1].replaceAll(',', ''))
                      )}
                    </p>
                  </div>
                  {/* <div className="flex flex-row justify-stretch items-end mt-14">
                    <input
                      className={styles.APP_INPUT}
                      type="text"
                      placeholder={t('Voucher') ?? 'Voucher'}
                      onChange={(e: any) => setVoucher(e.target.value)}
                    />
                    <button className={`px-7 py-3 ml-2 text-white rounded-[10px] ${voucher.length === 0 ? 'bg-[#BFBFBF]' : 'bg-app-brown'}`}>
                      {t('confirm')!}
                    </button>
                  </div> */}
                </div>
                <div className="py-6 flex flex-row justify-between w-full h-fit font-medium text-3xl leading-[43px] tracking-wider text-medium-brown">
                  <p>{t('total')!}</p>
                  <p>
                    {halfSumPrices(
                      courses
                        .filter((course) => selected.includes(course.id.toString()))
                        .map((c) => c.sale_price.toString().split(' ')[1].replaceAll(',', ''))
                    )}
                  </p>
                </div>
              </div>
              <button
                className="h-fit w-full max-w-[400px] rounded-[6px] py-4 bg-app-brown text-white font-normal text-base leading-[23px] text-center tracking-widest mt-8"
                onClick={() => onPay()}
              >
                {t('check out')!}
              </button>
              <button
                className="h-fit w-full max-w-[400px] rounded-[6px] py-4 bg-white text-app-brown border-[1px] border-solid border-app-brown font-normal text-base leading-[23px] text-center tracking-widest mt-5"
                onClick={() => setStep(0)}
              >
                {t('Previous')!}
              </button>
              <div className="w-full h-fit block items-center font-normal text-sm leading-5 tracking-[0.04em] text-[#89817A] mt-5">
                <span>{t('PAYMENT_WARNING')!}</span>
                <span className="underline text-[#EEB545] cursor-pointer" onClick={() => gotoPage('/privacy-policy')}>
                  {t('Privacy policy')!}
                </span>
                <span>{t('and')!}</span>
                <span className="underline text-[#EEB545] cursor-pointer" onClick={() => gotoPage('/terms-and-conditions')}>
                  {t('Terms and conditions')!}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-screen h-full pt-[110px] pb-[150px] flex flex-col items-center justify-start bg-background-01">
          <div className="relative flex flex-col justify-start items-center bg-cover w-screen h-fit">
            <div className="w-[1400px] h-fit max-h-full p-5 flex flex-col justify-start items-center">
              <div className="flex flex-row justify-start items-center w-full h-fit">
                <img className="w-6 h-6" src="/icon/ic-arrow-back-brown.svg" alt="" />
                <p
                  className="font-medium text-lg leading-[26px] tracking-[0.04em] text-medium-brown font-noto-sans-tc ml-[10px]"
                  onClick={() => router.back()}
                >
                  {t('back').toUpperCase()}
                </p>
              </div>
              <div className="w-[1400px] h-fit flex flex-row flex-wrap justify-between items-start mt-6 ">
                <div className="w-[960px] bg-white h-max flex flex-col drop-shadow-md rounded-[10px] mb-5">
                  <div className="w-full h-fit rounded-[10px] p-10 bg-white flex flex-col justify-start items-start">
                    <p className="font-medium text-3xl leading-[43px] tracking-wider text-medium-brown pb-6 mb-10 border-b-[1px] border-[#d9d9d9] border-solid w-full text-left">
                      {t('choose a course')}
                    </p>
                    {courses.map((course, index) => {
                      return (
                        <div
                          className={`w-full h-full flex flex-row justify-between items-stretch px-8 py-6 mb-4 rounded-[10px] border-solid cursor-pointer ${
                            isSelected(course.id.toString()) ? 'border-2 border-medium-brown bg-white' : 'border-[1px] border-[#BFBFBF] bg-[#F9F9F9]'
                          }`}
                          key={index}
                          onClick={() => handleSelect(course.id.toString())}
                        >
                          <div className="w-fit flex flex-row items-stretch">
                            {isSelected(course.id.toString()) && (
                              <div className="flex h-full w-fit mr-8 justify-center items-center">
                                <img className="w-8 h-8" src="/icon/ic-tick.svg" alt="" />
                              </div>
                            )}
                            <div className="w-fit max-w-sm flex flex-col items-stretch">
                              <p className="max-w-sm max-h-9 text-ellipsis whitespace-nowrap overflow-hidden font-medium text-2xl leading-[35px] tracking-widest text-medium-brown mb-4">
                                {course.name}
                              </p>
                              {isSelected(course.id.toString()) && (
                                <div className="font-normal text-sm leading-6 tracking-[0.06em] text-[#89817A] items-stretch max-h-24 max-w-sm">
                                  {parse(course && course.short_description)}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-row w-48 items-stretch flex-wrap ml-8">
                              <button className="w-fit h-fit max-w-full mr-3 py-1 px-3 bg-[#EEB545] text-white rounded-[5px] font-noto-sans-tc font-normal text-sm leading-6">
                                {t('Limited Time Offer')!}
                              </button>
                              {!userInfo?.is_orders && (
                                <button className="w-fit h-fit max-w-full mr-3 py-1 px-3 bg-[#64D28A] text-white rounded-[5px] font-noto-sans-tc font-normal text-sm leading-6">
                                  {t('First Month Offer')!}
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col justify-center max-w-full items-stretch text-center ">
                            <p className="font-bold text-2xl leading-[35px] text-app-brown">{course.sale_price}</p>
                            <p className="text-sm leading-5 line-through text-[#BFBFBF]">{course.price}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="w-[420px] bg-white h-fit flex flex-col drop-shadow-md rounded-[10px] p-10">
                  <p className="font-medium text-3xl leading-[43px] tracking-wider text-medium-brown pb-6 border-b-[1px] border-[#d9d9d9] border-solid w-full text-left">
                    {t('Order Details')}
                  </p>
                  <div className="flex flex-col py-8 border-b-[1px] border-[#d9d9d9] border-solid w-full h-fit font-normal text-lg leading-[26px] font-noto-sans-tc text-app-brown">
                    <div className="flex flex-row justify-between items-center py-2">
                      <p>{t('course price')}</p>
                      <p>
                        {sumPrices(
                          courses
                            .filter((course) => selected.includes(course.id.toString()))
                            .map((c) => c.price.toString().split(' ')[1].replaceAll(',', ''))
                        )}
                      </p>
                    </div>
                    <div className="flex flex-row justify-between items-center py-2">
                      <p>{t('Limited Time Offer')}</p>
                      <p>
                        {halfSumPrices(
                          courses
                            .filter((course) => selected.includes(course.id.toString()))
                            .map((c) => c.discount_price.toString().split(' ')[1].replaceAll(',', ''))
                        )}
                      </p>
                    </div>
                    <div className="flex flex-row justify-between items-center py-2">
                      <p>{t('First Month Offer')}</p>
                      <p>
                        {halfSumPrices(
                          courses
                            .filter((course) => selected.includes(course.id.toString()))
                            .map((c) => c.discount_price.toString().split(' ')[1].replaceAll(',', ''))
                        )}
                      </p>
                    </div>
                    {/* <div className="flex flex-row justify-stretch items-end mt-14">
                      <input
                        className={styles.APP_INPUT}
                        type="text"
                        placeholder={t('Voucher') ?? 'Voucher'}
                        onChange={(e: any) => setVoucher(e.target.value)}
                      />
                      <button className={`px-7 py-3 ml-2 text-white rounded-[10px] ${voucher.length === 0 ? 'bg-[#BFBFBF]' : 'bg-app-brown'}`}>
                        {t('confirm')!}
                      </button>
                    </div> */}
                  </div>
                  <div className="py-6 flex flex-row justify-between w-full h-fit font-medium text-3xl leading-[43px] tracking-wider text-medium-brown">
                    <p>{t('total')!}</p>
                    <p>
                      {halfSumPrices(
                        courses
                          .filter((course) => selected.includes(course.id.toString()))
                          .map((c) => c.sale_price.toString().split(' ')[1].replaceAll(',', ''))
                      )}
                    </p>
                  </div>
                  <button className="my-5 rounded-md bg-app-brown text-white py-3" onClick={() => onPay()}>
                    {t('check out')!}
                  </button>
                  <div className="w-full h-fit block items-center font-normal text-sm leading-5 tracking-[0.04em] text-[#89817A]">
                    <span>{t('PAYMENT_WARNING')!}</span>
                    <span className="underline text-[#EEB545] cursor-pointer" onClick={() => gotoPage('/privacy-policy')}>
                      {t('Privacy policy')!}
                    </span>
                    <span>{t('and')!}</span>
                    <span className="underline text-[#EEB545] cursor-pointer" onClick={() => gotoPage('/terms-and-conditions')}>
                      {t('Terms and conditions')!}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
