import * as React from 'react'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { capitalizeFirstLetter, capitalizeFirstLetterAllWords, gotoPage } from '@/utils/helpers/common'
import courseApi from '@/utils/api/course/course.api'
import { useRouter } from 'next/router'
import { ICourseDetail } from '@/utils/api/course'
import parse from 'html-react-parser'
import AppSlotProgress from '@/components/AppSlotProgress/AppSlotProgress'
import CoursePeriod from '@/components/CoursePeriod/CoursePeriod'
import { COURSE_DETAIL_TAB } from '@/utils/constants/course.constant'
import transactionApi from '@/utils/api/transaction/transaction.api'
import Slider from 'react-slick'
import FashSale from '@/components/FashSale/FashSale'

export interface IAppProps {}

export default function CourseDetail(props: IAppProps) {
  const TAB_SLIDER_SETTINGS = {
    className: 'slider variable-width',
    dots: false,
    infinite: true,
    centerMode: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    arrows: false,
  }

  const { t } = useTranslation()
  const router = useRouter()
  const { locale } = router
  const [courseDetail, setCourseDetail] = useState<ICourseDetail>()
  const [courseId, setCourseId] = useState<string | null>(null)
  const [tutor, setTutor] = useState<string>('')
  const [tabPos, setTabPos] = useState<number>(0)
  const [isPay, setIsPay] = useState<boolean | null>(null)
  const [isMobile, setIfMobile] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isMoreMaterials, setIfMoreMaterials] = useState<boolean>(false)
  const [showFashSale, setShowFastSale] = useState<boolean>(true)

  //call API
  let getCourseDetail = async (courseId: string) => {
    try {
      let res = await courseApi.getCourseDetail({
        params: {
          id: courseId,
          language: locale!.replace('-', '_'),
        },
      })
      setCourseDetail(res.data.params)
    } catch (e) {
      console.log(e)
    }
  }

  let checkPay = async (courseId: string, token: string) => {
    if (token == null) setIsPay(false)
    else
      try {
        let res = await transactionApi.checkCoursePurchaseByMember({
          params: {
            course_id: courseId,
            token: token,
          },
        })
        setIsPay(res.data.params)
      } catch (e) {
        console.log(e)
      }
  }

  let downloadBook = (url: string) => {
    window.open(url, '_blank')
  }

  let registerCourse = () => {
    if (!localStorage.getItem('token')) {
      gotoPage('/login')
    }
    if (localStorage.getItem('cart')) {
      let cart: string[] = localStorage.getItem('cart')!.split(',')
      if (!cart?.includes(courseId!)) {
        cart?.push(courseId!)
        localStorage.setItem('cart', cart.join(','))
      }
    } else localStorage.setItem('cart', courseId!)
    window.dispatchEvent(new Event('storage'))

    gotoPage('/payment', `?courseId=${courseId!}`)
  }

  let listenResizeWindows = () => {
    setIfMobile(window.innerWidth < 1400)
  }

  const handleScroll = () => {
    setScrollPosition(window.pageYOffset)
  }

  useEffect(() => {
    window.addEventListener('resize', listenResizeWindows)
    listenResizeWindows()

    window.addEventListener('scroll', handleScroll)

    let urlParams = new URLSearchParams(window.location.search)
    let _courseId = urlParams.get('id')
    setCourseId(_courseId!)
  }, [])

  useEffect(() => {
    if (typeof courseId === 'string') {
      if (isPay != null) getCourseDetail(courseId!)
      else checkPay(courseId!, localStorage.getItem('token')!)
      setLoading(false)
    }
  }, [locale, courseId])

  useEffect(() => {
    if (typeof isPay === 'boolean') {
      getCourseDetail(courseId!)
      setShowFastSale(!isPay)
    }
  }, [isPay])

  return (
    <>
      {isLoading ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : isMobile ? (
        <div className="w-screen h-screen fixed z-40 top-0 left-0 bg-white flex flex-col">
          <div className="w-full h-fit flex flex-col">
            <div className="w-full h-[58px] py-4 border-b-[1px] border-[#eeeeee] border-solid drop-shadow-sm flex flex-row px-6 items-center justify-between">
              <img className="w-6 h-6" src="/icon/ic-arrow-back-brown.svg" alt="" onClick={() => router.back()} />
              <p
                className={`font-medium text-lg leading-[26px] text-center text-medium-brown text-ellipsis whitespace-nowrap overflow-hidden px-4 font-noto-sans-tc ${
                  locale === 'zh-HK' && 'tracking-wider'
                }`}
              >
                {courseDetail?.name}
              </p>
              <img className="w-6 h-6" src="/icon/ic-share-brown.svg" alt="" />
            </div>
            {showFashSale && (
              <div>
                <FashSale isMobile={true} onClose={() => setShowFastSale(false)} onRegisterCourse={() => registerCourse()} />
              </div>
            )}
          </div>
          <div className="w-full h-fit flex flex-col overflow-auto">
            <div className="w-full h-fit px-4 py-8 bg-detail-title">
              <p className={`font-bold text-[28px] leading-[41px] text-white font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-wider'}s`}>
                {courseDetail?.name}
              </p>
              <div
                className={`font-normal text-sm leading-5 text-white max-h-[80px] w-full mt-8 text-ellipsis overflow-hidden font-noto-sans-tc ${
                  locale === 'zh-HK' && 'tracking-wider'
                }`}
              >
                {parse(courseDetail?.description ?? '')}
              </div>
              <button
                className={`h-fit w-full max-w-[400px] rounded-[6px] py-4 bg-white text-app-brown font-normal text-base leading-[23px] text-center mt-8 font-noto-sans-tc ${
                  locale === 'zh-HK' && 'tracking-wider'
                }`}
                onClick={() => registerCourse()}
              >
                {t('Register now')!}
              </button>
            </div>
            <div className="w-full h-fit py-10 px-4 bg-background-01">
              <p className={`font-medium text-xl leading-[29px] text-medium-brown font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-wider'}`}>
                {capitalizeFirstLetter(t('class materials'))}
              </p>
              <div className="w-full h-fit flex flex-col mt-8">
                <div className="w-[310px] h-12 flex flex-row px-[10px] my-4 items-center justify-start">
                  <img className="w-10 h-10 filter-brown-icon" src="/icon/ic-cd-date.svg" alt="" />
                  <div className="flex flex-col justify-between items-start ml-4">
                    <p
                      className={`font-normal text-sm leading-5 text-center text-app-brown font-noto-sans-tc ${
                        locale === 'zh-HK' && 'tracking-wider'
                      }`}
                    >
                      {capitalizeFirstLetterAllWords(t('class date')!)}
                    </p>
                    <p
                      className={`font-medium text-base leading-[23px] text-medium-brown font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-wider'}`}
                    >
                      {courseDetail?.periods && courseDetail?.periods[0].name}
                    </p>
                  </div>
                </div>
                <div className="w-[310px] h-12 flex flex-row px-[10px] my-4 items-center justify-start">
                  <img className="w-10 h-10 filter-brown-icon" src="/icon/ic-cd-price.svg" alt="" />
                  <div className="flex flex-col justify-between items-start ml-4">
                    <p className="font-normal text-sm leading-5 text-center tracking-[0.06em] text-app-brown">
                      {capitalizeFirstLetterAllWords(t('class fee')!)}
                    </p>
                    <div className="::[&>p] font-medium text-base leading-[23px] tracking-wider text-medium-brown">
                      {courseDetail?.course_outlines && parse(courseDetail?.course_outlines.description)}
                    </div>
                  </div>
                </div>
                {isMoreMaterials && (
                  <div className="w-full h-fit flex flex-col">
                    <div className="w-[310px] h-12 flex flex-row px-[10px] my-4 items-center justify-start">
                      <img className="w-10 h-10 filter-brown-icon" src="/icon/ic-cd-time.svg" alt="" />
                      <div className="flex flex-col justify-between items-start ml-4">
                        <p
                          className={`font-normal text-sm leading-5 text-center text-app-brown font-noto-sans-tc ${
                            locale === 'zh-HK' && 'tracking-[0.06em]'
                          }`}
                        >
                          {capitalizeFirstLetterAllWords(t('class time')!)}
                        </p>
                        <p className="{`font-medium text-base leading-[23px] text-medium-brown font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-wider'}`}">{`${courseDetail?.end_time} - ${courseDetail?.start_time}`}</p>
                      </div>
                    </div>
                    <div className="w-[310px] h-12 flex flex-row px-[10px] my-4 items-center justify-start">
                      <img className="w-10 h-10 filter-brown-icon" src="/icon/ic-cd-tutor.svg" alt="" />
                      <div className="flex flex-col justify-between items-start ml-4">
                        <p
                          className={`font-normal text-sm leading-5 text-center text-app-brown font-noto-sans-tc ${
                            locale === 'zh-HK' && 'tracking-wider'
                          }`}
                        >
                          {capitalizeFirstLetterAllWords(t('professor tutor')!)}
                        </p>
                        <p className="font-medium text-base leading-[23px] tracking-wider text-medium-brown">
                          {courseDetail?.tutors &&
                            courseDetail?.tutors
                              .map((tutor) => {
                                return tutor.name
                              })
                              .join(locale === 'en-US' ? ' - ' : '、')}
                        </p>
                      </div>
                    </div>
                    <div className="w-[310px] h-12 flex flex-row px-[10px] my-4 items-center justify-start">
                      <img className="w-10 h-10 filter-brown-icon" src="/icon/ic-cd-student.svg" alt="" />
                      <div className="flex flex-col justify-between items-start ml-4">
                        <p
                          className={`font-normal text-sm leading-5 text-center text-app-brown font-noto-sans-tc ${
                            locale === 'zh-HK' && 'tracking-wider'
                          }`}
                        >
                          {capitalizeFirstLetterAllWords(t('Remaining positions')!)}
                        </p>
                        <div className="flex flex-row items-center ">
                          <AppSlotProgress
                            current={courseDetail?.number_student_register_of_course ?? 0}
                            total={courseDetail?.maximum_number_of_student ?? 0}
                          />
                          <p
                            className={`font-medium text-base leading-[23px] text-medium-brown ml-2 font-noto-sans-tc ${
                              locale === 'zh-HK' && 'tracking-wider'
                            }`}
                          >{`${courseDetail?.number_student_register_of_course ?? 0}/${courseDetail?.maximum_number_of_student ?? 0}`}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="w-full h-fit flex flex-row items-center justify-center mt-6" onClick={() => setIfMoreMaterials(!isMoreMaterials)}>
                  <p
                    className={`w-fit max-w-full font-normal text-sm leading-5 text-center text-medium-brown font-noto-sans-tc ${
                      locale === 'zh-HK' && 'tracking-wider'
                    }`}
                  >
                    {isMoreMaterials ? t('Less') : t('More')}
                  </p>
                  <img className={`w-3 h-3 ml-2 ${isMoreMaterials && 'rotate-180'}`} src="/icon/ic-arrow-down.svg" alt="" />
                </div>
              </div>
            </div>
            <div className="w-screen h-fit bg-white">
              <Slider {...TAB_SLIDER_SETTINGS}>
                {COURSE_DETAIL_TAB.map((tab, index) => {
                  return (
                    <div
                      className={`px-6 py-3 flex justify-center items-center border-solid ${
                        tabPos === index ? 'border-app-brown text-app-brown border-b-[2px]' : 'border-[#BFBFBF] text-[#BFBFBF] border-b-[2px]'
                      }`}
                      key={index}
                      onClick={() => setTabPos(index)}
                    >
                      <p
                        className={`font-medium text-base leading-[180%] text-center font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-[0.04em]'}`}
                      >
                        {tab}
                      </p>
                    </div>
                  )
                })}
              </Slider>
            </div>
            <div className="w-screen h-fit px-4 pt-8 pb-12">
              {tabPos === 0 ? (
                <div className="text-app-brown font-noto-sans-tc pb-[90px] ">
                  <p
                    className={`font-medium text-[20px] leading-7 pc:text-2xl pc:leading-[35px] mb-6 font-noto-sans-tc ${
                      locale === 'zh-HK' && 'tracking-wider'
                    }`}
                  >
                    {capitalizeFirstLetterAllWords(t(COURSE_DETAIL_TAB[tabPos])!)}
                  </p>
                  <div className="text-base leading-[23px] tracking-widest text-app-brown">{parse(courseDetail?.description ?? '')}</div>
                </div>
              ) : tabPos === 1 ? (
                <div className="text-app-brown font-noto-sans-tc pb-[90px]">
                  <p className="font-medium text-2xl leading-[35px]">{capitalizeFirstLetterAllWords(t(COURSE_DETAIL_TAB[tabPos])!)}</p>
                  {courseDetail?.tutors &&
                    courseDetail?.tutors.map((tutor) => {
                      return (
                        <div key={tutor.id} className="flex flex-col justify-start items-center w-full h-fit mt-12">
                          <img className="w-[200px] h-[200px] rounded-[10px]" src={tutor.path} alt="" />
                          <div className="h-fit w-full flex flex-col mt-6">
                            <p className="font-medium text-2xl leading-[35px] tracking-widest">{tutor.name}</p>
                            <div className="font-normal text-base leading-[30px] mt-5">{parse(tutor.description)}</div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              ) : tabPos === 2 ? (
                <div className="text-app-brown font-noto-sans-tc pb-[90px]">
                  <p className="font-medium text-2xl leading-[35px] mb-6">{capitalizeFirstLetterAllWords(t(COURSE_DETAIL_TAB[tabPos])!)}</p>
                  <div>{parse(courseDetail?.course_outlines.description ?? '')}</div>
                </div>
              ) : tabPos === 3 ? (
                <div className="text-app-brown font-noto-sans-tc pb-[90px]">
                  <p className="font-medium text-2xl leading-[35px] mb-6">{capitalizeFirstLetterAllWords(t(COURSE_DETAIL_TAB[tabPos])!)}</p>
                  <div>{parse(courseDetail?.course_textbook_downloads.description ?? '')}</div>
                  <div className="w-full grid grid-cols-4 gap-6 mt-6">
                    {courseDetail?.course_textbook_downloads.files.map((book, bookIndex) => {
                      return isPay ? (
                        <div
                          className="w-80 h-14 border px-6 py-3.5 border-solid border-app-brown flex flex-row justify-between items-center"
                          key={bookIndex}
                        >
                          <p className="font-normal text-base leading-[30px] tracking-[0.14em] text-app-brown text-ellipsis overflow-hidden max-h-fit">
                            {book.file_name}
                          </p>
                          <img className="cursor-pointer" src="/icon/ic-download-book.svg" alt="" onClick={() => downloadBook(book.path)} />
                        </div>
                      ) : (
                        <div
                          className="w-80 h-14 border px-6 py-3.5 border-solid border-[#bfbfbf] flex flex-row justify-between items-center"
                          key={bookIndex}
                        >
                          <p className="font-normal text-base leading-[30px] tracking-[0.14em] text-[#bfbfbf] text-ellipsis overflow-hidden max-h-fit">
                            {book.file_name}
                          </p>
                          <img src="/icon/ic-download-disable.svg" alt="" />
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-app-brown font-noto-sans-tc pb-[90px]">
                  <p className="font-medium text-2xl leading-[35px] mb-6">{capitalizeFirstLetterAllWords(t(COURSE_DETAIL_TAB[tabPos])!)}</p>
                  <div className="w-full flex flex-col items-center justify-center gap-6 mt-6">
                    {courseDetail?.course_witnesses.images.map((witness, wi) => {
                      return <img className="w-[320px] h-[320px] rounded-[10px]" key={wi} src={witness.path} alt="" />
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-screen h-full pt-[110px] pb-[150px] flex flex-col items-center justify-start">
          {showFashSale && (
            <div className={scrollPosition > 0 ? 'fixed top-[110px] left-0 z-40' : 'relative'}>
              <FashSale onClose={() => setShowFastSale(false)} onRegisterCourse={() => registerCourse()} isMobile={false} />
            </div>
          )}
          <div className="relative flex flex-col justify-start items-center bg-detail-title bg-cover w-screen h-fit max-h-[560px]">
            <div className="w-[1400px] h-fit max-h-full p-5 flex flex-col justify-start items-center">
              <div className="w-full h-fit flex flex-row justify-between items-center">
                <div className="flex flex-row justify-between items-center" onClick={() => router.back()}>
                  <img className="w-6 h-6" src="/icon/ic-arrow-back.svg" alt="" />
                  <p className="font-medium text-lg leading-[26px] tracking-[0.04em] text-white font-noto-sans-tc ml-[10px]">
                    {t('back').toUpperCase()}
                  </p>
                </div>
                {/* <img className="w-[30px] h-[30px]" src="/icon/ic-share.svg" alt="" /> */}
              </div>
              <div className="w-full h-fit flex flex-row justify-between items-center flex-wrap mt-[60px]">
                <div className="w-[640px] h-fit justify-start items-start flex flex-col">
                  <p className="font-bold text-[46px] leading-[67px] tracking-widest text-white font-noto-sans-tc">{courseDetail?.name}</p>
                  <p className="font-medium text-2xl leading-[35px] tracking-widest text-white font-noto-sans-tc mt-2">實用、易學、成為專家</p>
                  <div className="::[&>p] font-normal text-base leading-[23px] tracking-[0.14em] text-white font-noto-sans-tc mt-6">
                    {courseDetail?.short_description && parse(courseDetail?.short_description!)}
                  </div>
                </div>
                <div className="w-[640px] h-fit justify-start items-start flex flex-row flex-wrap">
                  <div className="w-[310px] h-12 flex flex-row px-[10px] my-4 items-center justify-start">
                    <img className="w-10 h-10" src="/icon/ic-cd-date.svg" alt="" />
                    <div className="flex flex-col justify-between items-start ml-4 text-white leading-6 text-left tracking-[0.06em]">
                      <p className="text-sm">{capitalizeFirstLetterAllWords(t('class date')!)}</p>
                      <p className=" text-base">{courseDetail?.periods && courseDetail?.periods[0].name}</p>
                    </div>
                  </div>
                  <div className="w-[310px] h-12 flex flex-row px-[10px] my-4 items-center justify-start">
                    <img className="w-10 h-10" src="/icon/ic-cd-price.svg" alt="" />
                    <div className="flex flex-col justify-between items-start ml-4 text-white leading-6 text-left tracking-[0.06em]">
                      <p className="text-sm">{capitalizeFirstLetterAllWords(t('class fee')!)}</p>
                      <div className="::[&>p] text-base">{courseDetail?.course_outlines && parse(courseDetail?.course_outlines.description)}</div>
                    </div>
                  </div>
                  <div className="w-[310px] h-12 flex flex-row px-[10px] my-4 items-center justify-start">
                    <img className="w-10 h-10" src="/icon/ic-cd-time.svg" alt="" />
                    <div className="flex flex-col justify-between items-start ml-4 text-white leading-6 text-left tracking-[0.06em]">
                      <p className="text-sm">{capitalizeFirstLetterAllWords(t('class time')!)}</p>
                      <p className="text-base">{`${courseDetail?.end_time} - ${courseDetail?.start_time}`}</p>
                    </div>
                  </div>
                  <div className="w-[310px] h-12 flex flex-row px-[10px] my-4 items-center justify-start">
                    <img className="w-10 h-10" src="/icon/ic-cd-tutor.svg" alt="" />
                    <div className="flex flex-col justify-between items-start ml-4 text-white leading-6 text-left tracking-[0.06em]">
                      <p className="text-sm">{capitalizeFirstLetterAllWords(t('professor tutor')!)}</p>
                      <p className=" text-base">
                        {courseDetail?.tutors &&
                          courseDetail?.tutors
                            .map((tutor) => {
                              return tutor.name
                            })
                            .join(locale === 'en-US' ? ' - ' : '、')}
                      </p>
                    </div>
                  </div>
                  <div className="w-[310px] h-12 flex flex-row px-[10px] my-4 items-center justify-start">
                    <img className="w-10 h-10" src="/icon/ic-cd-student.svg" alt="" />
                    <div className="flex flex-col justify-between items-start ml-4 text-white leading-6 text-left tracking-[0.06em]">
                      <p className="text-sm">{capitalizeFirstLetterAllWords(t('Remaining positions')!)}</p>
                      <div className="flex flex-row items-center ">
                        <AppSlotProgress
                          current={courseDetail?.number_student_register_of_course ?? 0}
                          total={courseDetail?.maximum_number_of_student ?? 0}
                        />
                        <p className="text-base ml-2">{`${courseDetail?.number_student_register_of_course ?? 0}/${
                          courseDetail?.maximum_number_of_student ?? 0
                        }`}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-start mt-10 w-full">
                <button
                  className="w-[280px] h-fit py-[14px] bg-white text-app-brown text-lg rounded-[10px] cursor-pointer"
                  onClick={() => registerCourse()}
                >
                  {t('Register now')!}
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[1400px] h-fit mt-10 mb-10 items-center justify-start relative py-20">
            <CoursePeriod periods={courseDetail?.periods ?? []} courseName={courseDetail?.name ?? ''} isPay={isPay!} onPay={() => registerCourse()} />
          </div>
          <div className="w-[1400px] grid grid-cols-5 ">
            {COURSE_DETAIL_TAB.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`flex items-center justify-center py-4 font-medium text-lg leading-[180%] text-center tracking-[0.08em] font-noto-sans-tc border-solid border-b-2 cursor-pointer ${
                    index === tabPos ? 'text-medium-brown border-b-medium-brown' : 'text-[#bfbfbf] border-b-[#bfbfbf]'
                  }`}
                  onClick={() => setTabPos(index)}
                >
                  <p>{capitalizeFirstLetterAllWords(t(item)!)}</p>
                </div>
              )
            })}
          </div>
          <div className="w-[1400px] flex flex-col justify-start items-start pt-10 px-4">
            {tabPos === 0 ? (
              <div className="text-app-brown font-noto-sans-tc pb-[90px] ">
                <p className="font-medium text-2xl leading-[35px] mb-6">{capitalizeFirstLetterAllWords(t(COURSE_DETAIL_TAB[tabPos])!)}</p>
                <div>{parse(courseDetail?.description ?? '')}</div>
              </div>
            ) : tabPos === 1 ? (
              <div className="text-app-brown font-noto-sans-tc pb-[90px]">
                <p className="font-medium text-2xl leading-[35px]">{capitalizeFirstLetterAllWords(t(COURSE_DETAIL_TAB[tabPos])!)}</p>
                {courseDetail?.tutors &&
                  courseDetail?.tutors.map((tutor) => {
                    return (
                      <div key={tutor.id} className="flex flex-row justify-start items-start w-full h-fit mt-12">
                        <img className="w-[200px] h-[200px] rounded-[10px]" src={tutor.path} alt="" />
                        <div className="h-fit w-full flex flex-col ml-6">
                          <p className="font-medium text-2xl leading-[35px] tracking-widest">{tutor.name}</p>
                          <div className="font-normal text-base leading-[30px] mt-5">{parse(tutor.description)}</div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : tabPos === 2 ? (
              <div className="text-app-brown font-noto-sans-tc pb-[90px]">
                <p className="font-medium text-2xl leading-[35px] mb-6">{capitalizeFirstLetterAllWords(t(COURSE_DETAIL_TAB[tabPos])!)}</p>
                <div>{parse(courseDetail?.course_outlines.description ?? '')}</div>
              </div>
            ) : tabPos === 3 ? (
              <div className="text-app-brown font-noto-sans-tc pb-[90px]">
                <p className="font-medium text-2xl leading-[35px] mb-6">{capitalizeFirstLetterAllWords(t(COURSE_DETAIL_TAB[tabPos])!)}</p>
                <div>{parse(courseDetail?.course_textbook_downloads.description ?? '')}</div>
                <div className="w-full grid grid-cols-4 gap-6 mt-6">
                  {courseDetail?.course_textbook_downloads.files.map((book, bookIndex) => {
                    return isPay ? (
                      <div
                        className="w-80 h-14 border px-6 py-3.5 border-solid border-app-brown flex flex-row justify-between items-center"
                        key={bookIndex}
                      >
                        <p className="font-normal text-base leading-[30px] tracking-[0.14em] text-app-brown text-ellipsis overflow-hidden max-h-fit">
                          {book.file_name}
                        </p>
                        <img className="cursor-pointer" src="/icon/ic-download-book.svg" alt="" onClick={() => downloadBook(book.path)} />
                      </div>
                    ) : (
                      <div
                        className="w-80 h-14 border px-6 py-3.5 border-solid border-[#bfbfbf] flex flex-row justify-between items-center"
                        key={bookIndex}
                      >
                        <p className="font-normal text-base leading-[30px] tracking-[0.14em] text-[#bfbfbf] text-ellipsis overflow-hidden max-h-fit">
                          {book.file_name}
                        </p>
                        <img src="/icon/ic-download-disable.svg" alt="" />
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="text-app-brown font-noto-sans-tc pb-[90px]">
                <p className="font-medium text-2xl leading-[35px] mb-6">{capitalizeFirstLetterAllWords(t(COURSE_DETAIL_TAB[tabPos])!)}</p>
                <div className="w-full grid grid-cols-4 gap-6 mt-6">
                  {courseDetail?.course_witnesses.images.map((witness, wi) => {
                    return <img className="w-[320px] h-[320px] rounded-[10px]" key={wi} src={witness.path} alt="" />
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="w-[1400px] h-fit py-10 bg-app-brown rounded-[10px] flex flex-col justify-center items-center">
            <img className="w-[100px] h-[100px]" src="/img/ic-question.png" alt="" />
            <div className="flex flex-row items-center justify-center font-medium text-2xl leading-[35px] tracking-widest text-white mt-6">
              <p>{capitalizeFirstLetter(t('Have other questions?')!)}</p>
              <p className="ml-[20px] cursor-pointer">{capitalizeFirstLetter(t('contact now')!)}</p>
              <img className="w-7 h-7 ml-[10px]" src="/icon/ic-arrow-go.svg" alt="" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
