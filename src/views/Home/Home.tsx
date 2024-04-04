import AppButton from '@/components/AppButton/AppButton'
import AppBrand from '@/components/AppBrand/AppBrand'
import { useEffect, useRef, useState } from 'react'
import { IItemBannerCourse } from '@/components/ItemBannerCourse/ItemBannerCourse.type'
import AppCourseSlider from '@/components/AppCourseSlider/AppCourseSlider'
import AppTitle from '@/components/AppTitle/AppTitle'
import { HOME_UI } from '@/utils/constants/common.constant'
import { useTranslation } from 'next-i18next'
import AppTutorSlider from '@/components/AppTutorSlider/AppTutorSlider'
import CourseCard from '@/components/CourseCard'
import AppComplimentSlider from '@/components/AppComplimentSlider/AppComplimentSlider'
import AppLabel from '@/components/AppLabel/AppLabel'
import AppRadioButton from '@/components/AppRadio/AppRadioButton'
import AppDropdown from '@/components/AppDropdown/AppDropdown'
import * as styles from '@/utils/constants/classStyle.constant'
import { ICourseItem } from '@/utils/api/course'
import courseApi from '@/utils/api/course/course.api'
import { useRouter } from 'next/router'
import { gotoPage } from '@/utils/helpers/common'
import tutorApi from '@/utils/api/tutor/tutor.api'
import { ITutorItem } from '@/utils/api/tutor'
import homeApi from '@/utils/api/home/home.api'
import {
  IGetHomeBannerCoverResponse,
  IGetHomeBannersResponse,
  IGetHomeOfferResponse,
  IGetHomeReasonResponse,
  IGetHomeReviewsResponse,
  IGetHomeVideoResponse,
} from '@/utils/api/home'
import AppCourseCardSlider from '@/components/AppCourseCardSlider'
import AppReasonSlider from '@/components/AppReasonSlider/AppReasonSlider'
import { IGetListQuestionResponse, IQuestion } from '@/utils/api/contactUs'
import contactUsApi from '@/utils/api/contactUs/contactUs.api'

export default function Home() {
  const { t } = useTranslation()
  const router = useRouter()
  const { locale, query } = router
  const contactRef = useRef<null | HTMLElement>(null)

  const [courseItems, setCourseItems] = useState<IItemBannerCourse[]>([])
  const [courseCards, setCourseCards] = useState<ICourseItem[]>([])
  const [tutors, setTutors] = useState<ITutorItem[]>([])
  const [bannerCover, setBannerCover] = useState<IGetHomeBannerCoverResponse | null>(null)
  const [banners, setBanners] = useState<IGetHomeBannersResponse>([])
  const [video, setVideo] = useState<IGetHomeVideoResponse | null>(null)
  const [reasons, setReasons] = useState<IGetHomeReasonResponse>([])
  const [offers, setOffers] = useState<IGetHomeOfferResponse>([])
  const [reviews, setReviews] = useState<IGetHomeReviewsResponse>([])
  const [firstFetch, setFirstFetch] = useState<boolean>(true)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [isMobile, setIfMobile] = useState<boolean>(false)
  const [limitCategory, setLimitCategory] = useState<number>(3)
  const [listQuestion, setListQuestion] = useState<IGetListQuestionResponse | null>(null)
  const [listQuestionByPurpose, setListQuestionByPurpose] = useState<IQuestion[]>([])
  const [contactPurpose, setContactPurpose] = useState<1 | 2 | 3>(1)
  const [questionId, setQuestionId] = useState<number | null>(null)
  const [contactName, setContactName] = useState<string>('')
  const [gender, setGender] = useState<0 | 1>(0)
  const [birthday, setBirthday] = useState<string>('')
  const [contactPhone, setContactPhone] = useState<string>('')

  //get API
  let getCourseCard = async () => {
    try {
      let res = await courseApi.getListCourse({
        params: {
          language: locale!.replace('-', '_'),
          limit: 4,
          page: 1,
        },
      })
      if (res.status === 200) {
        setCourseCards(res.data.params.items)
      }
    } catch (e) {
      console.log(e)
    }
  }

  let getTutors = async () => {
    try {
      let res = await tutorApi.getListTutor({
        params: {
          language: locale!.replace('-', '_'),
          limit: 10,
          page: 1,
        },
      })
      if (res.status === 200) {
        setTutors(res.data.params.items)
      }
    } catch (e) {
      console.log(e)
    }
  }

  let getBannerCover = async () => {
    try {
      let res = await homeApi.getBannerCover({
        params: {
          language: locale!.replace('-', '_'),
        },
      })

      if (res.status === 200) {
        setBannerCover(res.data.params)
      }
    } catch (e) {
      console.log(e)
    }
  }

  let getBanners = async () => {
    try {
      let res = await homeApi.getBanners({
        params: {
          language: locale!.replace('-', '_'),
          limit: '10',
        },
      })

      if (res.status === 200) {
        setBanners(res.data.params)
      }
    } catch (e) {
      console.log(e)
    }
  }

  let getVideo = async () => {
    try {
      let res = await homeApi.getVideo({
        params: {
          language: locale!.replace('-', '_'),
        },
      })

      if (res.status === 200) {
        setVideo(res.data.params)
      }
    } catch (e) {
      console.log(e)
    }
  }

  let getReasons = async () => {
    try {
      let res = await homeApi.getReason({
        params: {
          language: locale!.replace('-', '_'),
          limit: '3',
        },
      })

      if (res.status === 200) {
        setReasons(res.data.params)
      }
    } catch (e) {
      console.log(e)
    }
  }

  let getOffer = async () => {
    try {
      let res = await homeApi.getOffer({
        params: {
          language: locale!.replace('-', '_'),
          limit: '10',
        },
      })

      if (res.status === 200) {
        setOffers(res.data.params)
      }
    } catch (e) {
      console.log(e)
    }
  }

  let getReview = async () => {
    try {
      let res = await homeApi.getReview({
        params: {
          language: locale!.replace('-', '_'),
          limit: '10',
        },
      })

      if (res.status === 200) {
        setReviews(res.data.params)
      }
    } catch (e) {
      console.log(e)
    }
  }

  let getListQuestion = async () => {
    try {
      let res = await contactUsApi.getListQuestion({
        params: {
          language: locale!.replace('-', '_'),
          limit: '200',
        },
      })

      if (res.status === 200) {
        setListQuestion(res.data.params.items)
      }
    } catch (e) {
      console.log(e)
    }
  }

  let updateContactUs = async () => {
    try {
      let res = await contactUsApi.updateContactUs({
        params: {
          question_id: questionId!,
          contact_name: contactName,
          gender: gender,
          birthday: birthday,
          contact_number: contactPhone,
          language: locale!.replace('-', '_'),
        },
      })
      if (res.data.status === 200) alert(t('Successfully!'))
      else alert(t('Failed! Try again!'))
    } catch (error) {
      console.log(error)
    }
  }

  let fetchData = async () => {
    await getTutors()
    await getCourseCard()
    await getBannerCover()
    await getBanners()
    await getVideo()
    await getReasons()
    await getOffer()
    await getReview()
    await getListQuestion()
    setLoading(false)
  }

  useEffect(() => {
    const listenResizeWindows = () => {
      setIfMobile(window.innerWidth < 1400)
    }

    listenResizeWindows()

    window.addEventListener('resize', listenResizeWindows)

    fetchData()

    let urlParams = new URLSearchParams(window.location.search)
    console.log(urlParams.get('cpn'))

    if (urlParams.get('cpn') === 'contactUs') {
      console.log('hellos')

      contactRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    if (listQuestion == null) {
      setListQuestionByPurpose([])
    } else {
      let questions: IQuestion[] = []
      Object.values(listQuestion).forEach((q) => {
        if (q.length > 0) {
          questions = [...questions, ...q.filter((qq) => qq.contact_purpose_id === contactPurpose)]
        }
      })
      setListQuestionByPurpose([...questions])
    }
  }, [listQuestion, contactPurpose])

  useEffect(() => {
    if (!firstFetch) fetchData()
    setFirstFetch(false)
  }, [locale])

  return (
    <>
      {isLoading ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="w-screen h-fit relative bg-white z-0">
          <div className="w-screen h-full absolute top-0 left-0 -z-20">
            <div className="relative w-screen h-[700px] pc:h-[420px] bg-light">
              <img className="absolute top-[110px] left-0 z-10" src="/img/pattern-fish-01.png" alt="" />
              <img className="absolute top-[130px] right-0 z-10" src="/img/pattern-fish-02.png" alt="" />
            </div>
            <div className="relative w-screen h-[600px] pc:h-[1000px] bg-dark">
              <img className="absolute top-[130px] right-0 z-10" src="/img/pattern-cloud-01.png" alt="" />
              <img className="absolute top-[1386px] left-0 z-10" src="/img/pattern-cloud-02.png" alt="" />
              <img className="absolute top-[1256px] right-0 z-10" src="/img/pattern-cloud-03.png" alt="" />
              <img className="absolute top-[1216px] right-[216px] z-10" src="/img/pattern-cloud-04.png" alt="" />
              <img className="absolute top-[1760px] right-0 z-10" src="/img/pattern-cloud-05.png" alt="" />
            </div>
          </div>
          <div className="relative h-fit pt-14 pc:pt-[110px] flex flex-col items-center justify-start">
            <div className="w-full pc:w-[1400px] h-fit flex flex-col justify-start">
              <div className="flex flex-col-reverse pc:flex-row w-full h-full">
                <div className=" w-full pc:w-[50%] h-full flex items-center pt-0 pc:pt-[15%]">
                  <AppBrand />
                </div>
                <div className="w-full pc:w-[50%] h-full">
                  <img className="w-full h-auto" src={bannerCover?.path} alt="" />
                </div>
              </div>
              <div className="w-full h-fit mt-12 pc:mt-5">
                <AppCourseSlider banners={banners} isMobile={isMobile} />
              </div>
              <div className="w-full h-fit mt-[100px] pc:mt-36 flex flex-col items-center">
                <AppTitle
                  behind={{
                    class: styles.APP_TITLE.BEHIND,
                    text: t(HOME_UI.TITLE_1_BEHIND),
                  }}
                  before={{
                    class: styles.APP_TITLE.BEFORE,
                    text: t(HOME_UI.TITLE_1_BEFORE),
                  }}
                />
                <span className="whitespace-pre-line font-normal text-base leading-[200%] text-center text-[#745039] mt-5">
                  {t(HOME_UI.DETAIL_1)}
                </span>
                <iframe
                  className="mt-7"
                  width={isMobile ? '345' : '800'}
                  height={isMobile ? '194' : '450'}
                  src={video?.link}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="w-full h-fit mt-[100px] pc:mt-36 flex flex-col items-center">
                <AppTitle
                  behind={{
                    class: styles.APP_TITLE.BEHIND,
                    text: t(HOME_UI.TITLE_2_BEHIND),
                  }}
                  before={{
                    class: styles.APP_TITLE.BEFORE,
                    text: t(HOME_UI.TITLE_2_BEFORE),
                  }}
                />
                <AppTutorSlider tutors={tutors} />
              </div>
            </div>
          </div>
          <div className="relative w-screen h-fit mt-36 flex flex-col items-center bg-wave -z-10">
            <div className="w-full h-fit absolute top-0 left-0">
              <img className="w-full h-auto z-0" src="/img/bg-radius-white.png" alt="" />
            </div>
            <div className="w-full pc:w-[1400px] flex flex-col items-center z-10 py-[120px] relative">
              <AppTitle
                behind={{
                  class: styles.APP_TITLE.BEHIND,
                  text: t(HOME_UI.TITLE_3_BEHIND),
                }}
                before={{
                  class: styles.APP_TITLE.BEFORE,
                  text: t(HOME_UI.TITLE_3_BEFORE),
                }}
              />
              <div className="flex flex-row mt-16 justify-between w-full h-fit relative">
                {isMobile ? (
                  <AppCourseCardSlider listCourse={courseCards} isMobile={isMobile} />
                ) : (
                  courseCards.map((courseCard, index) => {
                    return <CourseCard key={index} content={courseCard} />
                  })
                )}
              </div>
              {!isMobile && (
                <button
                  className="w-[280px] h-[54px] bg-white border rounded-md border-solid border-[#745039] relative mt-[60px] cursor-pointer"
                  onClick={() => gotoPage('/all-courses')}
                >
                  <span className="text-lg leading-[26px] text-center tracking-widest font-noto-sans-tc text-app-brown">{t('More courses')}</span>
                </button>
              )}
            </div>
          </div>
          <div className="relative w-screen h-fit flex flex-col items-center bg-background-01 -z-10">
            <div className="w-full pc:w-[1400px] flex flex-col items-center z-10 pt-[85px] pb-[120px] relative">
              <AppTitle
                behind={{
                  class: styles.APP_TITLE.BEHIND,
                  text: t(HOME_UI.TITLE_4_BEHIND),
                }}
                before={{
                  class: styles.APP_TITLE.BEFORE,
                  text: t(HOME_UI.TITLE_4_BEFORE),
                }}
              />
              <div className="w-full pc:grid grid-cols-3 pc:gap-4 ">
                {isMobile ? (
                  <AppReasonSlider reasons={reasons} />
                ) : (
                  reasons.map((item, index) => {
                    return (
                      <div className="flex flex-col items-center h-fit justify-start px-6" key={index}>
                        <img className="h-[200px] w-[200px]" src={item.path} alt="" />
                        <p className="whitespace-pre-line text-center font-medium text-2xl leading-[35px] tracking-widest text-app-brown font-noto-sans-tc">
                          {t(item.name)}
                        </p>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
          <div className="relative w-screen h-fit flex flex-col items-center bg-dark -z-10">
            <div className="w-screen pc:w-[1400px] flex flex-col items-center z-10 pt-[110px] pb-[140px] relative">
              <AppTitle
                behind={{
                  class: styles.APP_TITLE.BEHIND,
                  text: t(HOME_UI.TITLE_5_BEHIND),
                }}
                before={{
                  class: styles.APP_TITLE.BEFORE,
                  text: t(HOME_UI.TITLE_5_BEFORE),
                }}
              />
              {isMobile ? (
                <div className="w-full h-fit flex flex-row flex-wrap justify-center items-center">
                  {offers.slice(0, limitCategory).map((item, index) => {
                    return (
                      <img className="w-[345px] h-[180px] pc:w-[270px] pc:h-[270px] rounded-[10px] m-[10px]" src={item.path} alt="" key={index} />
                    )
                  })}
                  <button
                    className="bg-white px-24 py-5 text-app-brown border border-app-brown border-solid rounded-[10px] font-normal text-lg leading-[26px] mt-5"
                    onClick={() => setLimitCategory(limitCategory + 3)}
                  >
                    {t('More business')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-5 grid-rows-2 gap-4 w-full py-14">
                  {offers.map((item, index) => {
                    return <img className="w-[270px] h-[270px] rounded-[10px]" src={item.path} alt="" key={index} />
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="relative w-screen h-fit flex flex-col items-center bg-background-01 -z-10">
            <img className=" absolute right-0 top-[220px]" src="/img/pattern-cloud-06.png" alt="" />
            <div className="w-full pc:w-[1400px] flex flex-col items-center z-10 pt-[110px] relative">
              <AppTitle
                behind={{
                  class: styles.APP_TITLE.BEHIND,
                  text: t(HOME_UI.TITLE_6_BEHIND),
                }}
                before={{
                  class: styles.APP_TITLE.BEFORE,
                  text: t(HOME_UI.TITLE_6_BEFORE),
                }}
              />
              <AppComplimentSlider reviews={reviews ?? []} />
            </div>
          </div>

          <div className="relative w-screen h-fit flex flex-col items-center bg-background-01 -z-10">
            <div className="w-full pc:w-[1400px] flex flex-col items-center z-10 pt-[200px] pb-20 relative">
              <AppTitle
                behind={{
                  class: styles.APP_TITLE.BEHIND,
                  text: t(HOME_UI.TITLE_7_BEHIND),
                }}
                before={{
                  class: styles.APP_TITLE.BEFORE,
                  text: t(HOME_UI.TITLE_7_BEFORE),
                }}
              />
              <div
                className="flex flex-col w-screen pc:w-[800px] px-5 h-fit mt-10 mb-16 items-center"
                ref={contactRef as React.RefObject<HTMLDivElement>}
              >
                <div className={styles.DIV.HOME_FORM_FIELD}>
                  <AppLabel text={t('Contact purpose')} />
                  <div className="w-full h-fit p-5">
                    <AppRadioButton
                      onChange={(option) => setContactPurpose(option === 0 ? 1 : option === 1 ? 2 : 3)}
                      options={[t('Ask questions'), t('Course registration'), t('Others')]}
                      value={contactPurpose}
                    />
                  </div>
                </div>
                <div className={styles.DIV.HOME_FORM_FIELD}>
                  <AppLabel text={t('Ask a question')} />
                  <AppDropdown
                    options={listQuestionByPurpose.map((q) => q.name)}
                    relatedOptions={listQuestionByPurpose}
                    placeholder={t('Please select') ?? 'Please select'}
                    onChange={(value) => setQuestionId(value.id)}
                    disabled={false}
                    value={listQuestionByPurpose.length > 0 ? listQuestionByPurpose[0].name : ''}
                  />
                </div>
                <div className={styles.DIV.HOME_FORM_FIELD}>
                  <AppLabel text={t('Your name')} />
                  <input
                    className={styles.APP_INPUT}
                    type="text"
                    placeholder={t('Please enter') ?? 'Please enter'}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                <div className={styles.DIV.HOME_FORM_FIELD}>
                  <AppLabel text={t('Gender')} />
                  <div className="w-full h-fit p-5">
                    <AppRadioButton onChange={(option) => setGender(option === 1 ? 1 : 0)} options={[t('Female'), t('Male')]} value={gender} />
                  </div>
                </div>
                <div className={styles.DIV.HOME_FORM_FIELD}>
                  <AppLabel text={t('Birthday')} notReq={true} />
                  <input className={styles.APP_INPUT} type="date" onChange={(e) => setBirthday(e.target.value)} />
                </div>
                <div className={styles.DIV.HOME_FORM_FIELD}>
                  <AppLabel text={t('Phone number')} />
                  <input
                    className={styles.APP_INPUT}
                    type="text"
                    placeholder={t('Please enter') ?? 'Please enter'}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>

                <div className="w-[280px] h-fit">
                  <AppButton text={t('Submit') ?? 'Submit'} onClick={() => updateContactUs()} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
