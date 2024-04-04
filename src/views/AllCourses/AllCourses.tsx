import AppDropdown from '@/components/AppDropdown'
import * as React from 'react'
import { useTranslation } from 'next-i18next'
import * as styles from '@/utils/constants/classStyle.constant'
import { useEffect, useState } from 'react'
import courseApi from '@/utils/api/course/course.api'
import { useRouter } from 'next/router'
import { ICourseItem } from '@/utils/api/course'
import CourseCard from '@/components/CourseCard/CourseCard'
import { ITutorItem } from '@/utils/api/tutor'
import tutorApi from '@/utils/api/tutor/tutor.api'
import Slider from 'react-slick'
import AppPagination from '@/components/AppPagination'

export interface IAppProps {}

export default function AllCourses(props: IAppProps) {
  const LIST_HOURS = Array.from({ length: 24 }, (v, k) => k)
  const { t } = useTranslation()
  const router = useRouter()
  const { locale } = router

  const FILTER_SLIDER_SETTINGS = {
    className: 'slider variable-width',
    dots: false,
    infinite: true,
    centerMode: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    arrows: false,
  }

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [courses, setCourses] = useState<ICourseItem[]>([])
  const [totalCourse, setTotalCourse] = useState<number>(0)
  const [firstFetch, setFirstFetch] = useState<boolean>(true)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [listFilterCourse, setListFilerCourse] = useState<
    {
      id: number
      name: string
    }[]
  >([])
  const [listFilterTutor, setListFilerTutor] = useState<ITutorItem[]>([])
  const [filterCourseNameSelected, setFilterCourseNameSelected] = useState<string | null>(null)
  const [filterCourseIdSelected, setFilterCourseIdSelected] = useState<string | number | null>(null)
  const [filterTutorSelected, setFilterTutorSelected] = useState<string | null>(null)
  const [filterTutorIdSelected, setFilterTutorIdSelected] = useState<number | null>(null)
  const [filterStartSelected, setFilterStartSelected] = useState<number | number | null>(null)
  const [filterEndSelected, setFilterEndSelected] = useState<number | string | null>(null)
  const [isMobile, setIfMobile] = useState<boolean>(false)
  const [isShowFilter, setIfShowFilter] = useState<boolean>(false)

  //call API
  let getAllCourse = async () => {
    try {
      let res = await courseApi.getListCourse({
        params: {
          language: locale!.replace('-', '_'),
          limit: 20,
          page: currentPage,
        },
      })
      setCourses(res.data.params.items)
    } catch (e) {
      console.log(e)
    }
  }

  let getListCourseName = async () => {
    try {
      let res = await courseApi.getListCourseName({
        params: {
          language: locale!.replace('-', '_'),
          limit: 20,
          page: 1,
        },
      })
      setListFilerCourse(res.data.params.items)
    } catch (e) {
      console.log(e)
    }
  }

  let getListTutor = async () => {
    try {
      let res = await tutorApi.getListTutor({
        params: {
          language: locale!.replace('-', '_'),
          limit: 20,
          page: 1,
        },
      })
      setListFilerTutor(res.data.params.items)
    } catch (e) {
      console.log(e)
    }
  }

  let searchCourse = async () => {
    try {
      let _params: any = {
        language: locale!.replace('-', '_'),
        limit: 20,
        page: currentPage,
      }
      if (filterCourseNameSelected) {
        _params['course_name'] = filterCourseNameSelected
      }
      if (filterTutorSelected) {
        _params['tutor_name'] = filterTutorSelected
      }
      if (filterStartSelected) {
        _params['start_time'] = filterStartSelected
      }
      if (filterEndSelected) {
        _params['end_time'] = filterEndSelected
      }

      let res = await courseApi.searchCourse({
        params: { ..._params },
      })
      setCourses(res.data.params.items)
    } catch (e) {
      console.log(e)
    }
  }

  let onSelectFilterMobile = async (type: number, item: any) => {
    if (type === 0) {
      setFilterCourseNameSelected(item == null ? null : item.name)
      setFilterCourseIdSelected(item == null ? null : item.id)
    } else if (type === 1) {
      setFilterTutorSelected(item == null ? null : item.name)
      setFilterTutorIdSelected(item == null ? null : item.id)
    } else if (type === 2) {
      setFilterStartSelected(item)
    } else if (type === 3) {
      setFilterEndSelected(item)
    }
  }

  let cleanFiler = () => {
    setFilterCourseNameSelected(null)
    setFilterCourseIdSelected(null)
    setFilterTutorSelected(null)
    setFilterTutorIdSelected(null)
    setFilterStartSelected(null)
    setFilterEndSelected(null)
  }

  let fetchData = async () => {
    await getAllCourse()
    await getListCourseName()
    await getListTutor()
    setLoading(false)
  }

  let toggleFilter = () => {
    setIfShowFilter(!isShowFilter)
  }

  let listenResizeWindows = () => {
    setIfMobile(window.innerWidth < 1400)
  }

  let updateCurrentPage = (p: number | null) => {
    if (p != null && p > 0) {
      setCurrentPage(p)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', listenResizeWindows)
    listenResizeWindows()
    fetchData()
  }, [])

  useEffect(() => {
    if (!firstFetch) fetchData()
    setFirstFetch(false)
  }, [locale])

  useEffect(() => {
    searchCourse()
  }, [filterCourseNameSelected, filterTutorSelected, filterStartSelected, filterEndSelected])

  useEffect(() => {
    if (isMobile) {
      if (setFilterCourseNameSelected == null) {
        getAllCourse()
      } else {
        searchCourse()
      }
    }
  }, [setFilterCourseNameSelected])

  return (
    <div className="relative w-screen h-full pt-14 pc:pt-[110px] pb-10 flex flex-col items-center justify-start">
      <div className="relative flex justify-center items-center bg-course w-screen h-[180px] pc:h-[340px]">
        <p
          className={`font-bold  text-[32px] leading-[46px] pc:text-[46px] pc:leading-[67px] text-center text-white font-noto-sans-tc ${
            locale === 'zh-HK' && 'tracking-wider'
          }`}
        >
          {t('Metaphysics course')}
        </p>
      </div>
      {isLoading ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : isMobile ? (
        <div className="w-screen h-fit flex flex-col">
          <div className="flex flex-col w-full h-fit px-4 mt-5">
            <div className="flex flex-row w-full h-fit justify-between items-center relative">
              <img className="w-6 h-6 absolute top-[12px] left-[10px]" src="/icon/ic-search.svg" alt="" />
              <input className={`${styles.APP_INPUT} p-[12px] pl-12`} type="text" placeholder={t('Keyword')!} />
              <img className="ml-3 w-7 h-7" src="/icon/ic-filter.svg" alt="" onClick={() => toggleFilter()} />
            </div>

            <div className="mt-7 w-full h-fit flex flex-row">
              <button
                className={`w-fit h-9 px-[10px] py-[6px] rounded-[5px] border-[1px] border-solid border-app-brown text-sm ${
                  filterCourseIdSelected == null ? 'bg-app-brown text-white' : 'bg-transparent text-app-brown'
                } `}
                onClick={() => onSelectFilterMobile(0, null)}
              >
                {t('All')!}
              </button>
              <div className="ml-[10px]" style={{ width: `calc(100% - 50px)` }}>
                <Slider {...FILTER_SLIDER_SETTINGS}>
                  {listFilterCourse.map((cname, index) => {
                    return (
                      <div className="px-[5px]" key={index}>
                        <button
                          className={`w-fit h-9 whitespace-nowrap px-[10px] py-[6px] rounded-[6px] border-[1px] border-solid border-app-brown text-sm ${
                            filterCourseIdSelected === cname.id ? 'bg-app-brown text-white' : 'bg-transparent text-app-brown'
                          }  font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-wider'}`}
                          onClick={() => onSelectFilterMobile(0, cname)}
                        >
                          {cname.name}
                        </button>
                      </div>
                    )
                  })}
                </Slider>
              </div>
            </div>
          </div>
          <div className="w-full h-fit justify-center items-center py-2">
            {courses.map((course, index) => {
              return (
                <div key={index} className=" h-fit w-full flex justify-center items-center mt-5">
                  <CourseCard content={course} />
                </div>
              )
            })}
          </div>
          <div className={`w-full h-fit flex justify-center items-center mt-10 font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-wider'}`}>
            <AppPagination total={totalCourse} current={currentPage} onChange={(p) => updateCurrentPage(p)} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-[1400px] h-fit mt-10 mb-16 items-center justify-start relative">
          <div className="flex flex-row flex-wrap pc:flex-nowrap justify-between items-center w-full h-fit">
            <div className="w-[365px] h-fit px-5">
              <AppDropdown
                options={listFilterCourse.map((cn) => cn.name)}
                placeholder={t('All Courses')!}
                onChange={(value) => setFilterCourseNameSelected(value)}
              />
            </div>
            <div className="w-[365px] h-fit px-5">
              <AppDropdown
                options={listFilterTutor.map((tt) => tt.name)}
                placeholder={t('All Tutors')!}
                onChange={(value) => setFilterTutorSelected(value)}
              />
            </div>
            <div className="w-[365px] h-fit px-5">
              <AppDropdown
                options={LIST_HOURS.map((i) => `${i}:00`)}
                placeholder={t('Class start at')!}
                onChange={(value) => setFilterStartSelected(value.split(':')[0])}
              />
            </div>
            <div className="w-[365px] h-fit px-5">
              <AppDropdown
                options={LIST_HOURS.map((i) => `${i}:00`)}
                placeholder={t('Class end at')!}
                onChange={(value) => setFilterEndSelected(value.split(':')[0])}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-10 w-full mt-[60px]">
            {courses.map((course, index) => {
              return (
                <div key={index} className=" h-fit w-full flex justify-center items-center">
                  <CourseCard content={course} />
                </div>
              )
            })}
          </div>
          <div className="w-full h-fit flex justify-center items-center mt-10">
            <AppPagination total={totalCourse} current={currentPage} onChange={(p) => updateCurrentPage(p)} />
          </div>
        </div>
      )}
      {isShowFilter && (
        <div className="w-screen h-screen fixed top-0 left-0 bg-white z-50 flex flex-col">
          <div className="w-full h-[58px] border-b-[1px] border-[#eeeeee] border-solid drop-shadow-sm flex flex-row px-6 items-center justify-between">
            <img className="w-6 h-6" src="/icon/ic-arrow-back-brown.svg" alt="" onClick={() => setIfShowFilter(false)} />
            <p
              className={`font-medium text-lg leading-[26px] text-center text-medium-brown font-noto-sans-tc ${
                locale === 'zh-HK' && 'tracking-wider'
              }`}
            >
              {t('Filter')!}
            </p>
            <p
              className={`font-normal text-sm leading-5 text-right text-[#89817A] font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-wider'}`}
              onClick={() => cleanFiler()}
            >
              {t('Clean')!}
            </p>
          </div>
          <div className="w-full h-full flex flex-col px-4 overflow-auto">
            <div className="w-full h-fit flex flex-col py-6">
              <p className={`font-normal text-sm leading-5 text-medium-brown font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-[0.02em]'}`}>
                {t('Course name')!}
              </p>
              <div className="w-full h-fit grid grid-cols-3 gap-3 mt-[14px]">
                {listFilterCourse.map((item, index) => {
                  return (
                    <div
                      className={`flex items-stretch justify-between rounded-[5px] border-[1px] border-solid border-app-brown py-2 px-3 ${
                        item.id === filterCourseIdSelected ? 'bg-app-brown text-white' : 'bg-transparent text-app-brown'
                      }`}
                      key={index}
                      onClick={() => onSelectFilterMobile(0, item)}
                    >
                      <p
                        className={`w-full font-normal text-sm leading-5 text-center break-words font-noto-sans-tc ${
                          locale === 'zh-HK' && 'tracking-[0.02]'
                        }`}
                      >
                        {item.name}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="w-full h-fit flex flex-col py-6">
              <p className={`font-normal text-sm leading-5 text-medium-brown font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-[0.02em'}`}>
                {t('Tutor name')!}
              </p>
              <div className="w-full h-fit grid grid-cols-3 gap-3 mt-[14px]">
                {listFilterTutor.map((item, index) => {
                  return (
                    <div
                      className={`flex items-stretch justify-between rounded-[5px] border-[1px] border-solid border-app-brown py-2 px-3 ${
                        item.id === filterTutorIdSelected ? 'bg-app-brown text-white' : 'bg-transparent text-app-brown'
                      }`}
                      key={index}
                      onClick={() => onSelectFilterMobile(1, item)}
                    >
                      <p
                        className={`w-full font-normal text-sm leading-5 text-center break-words font-noto-sans-tc ${
                          locale === 'zh-HK' && 'tracking-[0.02em]'
                        }`}
                      >
                        {item.name}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="w-full h-fit flex flex-col py-6">
              <p className={`font-normal text-sm leading-5 text-medium-brown font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-[0.02em]'}`}>
                {t('Class start at')!}
              </p>
              <div className="w-full h-fit grid grid-cols-3 gap-3 mt-[14px]">
                {LIST_HOURS.map((item, index) => {
                  return (
                    <div
                      className={`flex items-stretch justify-between rounded-[5px] border-[1px] border-solid border-app-brown py-2 px-3 ${
                        item === filterStartSelected ? 'bg-app-brown text-white' : 'bg-transparent text-app-brown'
                      }`}
                      key={index}
                      onClick={() => onSelectFilterMobile(2, item)}
                    >
                      <p
                        className={`w-full font-normal text-sm leading-5 text-center break-words font-noto-sans-tc ${
                          locale === 'zh-HK' && 'tracking-[0.02]'
                        }`}
                      >{`${item}:00`}</p>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="w-full h-fit flex flex-col py-6">
              <p className={`font-normal text-sm leading-5 text-medium-brown font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-[0.02em]'}`}>
                {t('Class end at')!}
              </p>
              <div className="w-full h-fit grid grid-cols-3 gap-3 mt-[14px]">
                {LIST_HOURS.map((item, index) => {
                  return (
                    <div
                      className={`flex items-stretch justify-between rounded-[5px] border-[1px] border-solid border-app-brown py-2 px-3 ${
                        item === filterEndSelected ? 'bg-app-brown text-white' : 'bg-transparent text-app-brown'
                      }`}
                      key={index}
                      onClick={() => onSelectFilterMobile(3, item)}
                    >
                      <p
                        className={`w-full font-normal text-sm leading-5 text-center break-words font-noto-sans-tc ${
                          locale === 'zh-HK' && 'tracking-[0.02em]'
                        }`}
                      >{`${item}:00`}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
