import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import courseApi from '@/utils/api/course/course.api'
import { IGetRegisteredCourseByMemberItem } from '@/utils/api/course'
import AppPagination from '../AppPagination'
import { capitalizeFirstLetter, gotoPage } from '@/utils/helpers/common'

type IProps = {
  isMobile: boolean
  onClose?: Function
}

export default function RegisteredClass({ isMobile, onClose }: IProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { locale } = router
  const { data: session } = useSession()

  const [firstFetch, setFirstFetch] = useState<boolean>(true)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [classType, setClassType] = useState<number>(2)
  const [listClass, setListClass] = useState<IGetRegisteredCourseByMemberItem[]>([])
  const [totalClass, setTotalClass] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)

  //call APi
  let getListRegisteredClass = async () => {
    try {
      let res = await courseApi.getListRegisteredCourseByMember({
        params: {
          language: locale!.replace('-', '_'),
          token: localStorage.getItem('token') ?? '',
          limit: 10,
          Page: 1,
        },
      })
      setListClass(res.data.params.items)
      setTotalClass(res.data.params.total)
    } catch (e) {
      console.log(e)
    }
  }

  let getListRegisteredClassWithType = async () => {
    try {
      let res = await courseApi.getListRegisteredCourseByMemberAndType({
        params: {
          language: locale!.replace('-', '_'),
          token: localStorage.getItem('token') ?? '',
          limit: 10,
          Page: 1,
          type: classType,
        },
      })
      setListClass(res.data.params.items)
      setTotalClass(res.data.params.total)
    } catch (e) {
      console.log(e)
    }
  }

  let fetchData = async () => {
    if (classType === 2) {
      await getListRegisteredClass()
    } else {
      await getListRegisteredClassWithType()
    }
    setLoading(false)
  }

  let updateCurrentPage = (p: number | null) => {
    if (p != null && p > 0) {
      setCurrentPage(p)
    }
  }

  useEffect(() => {
    if (!firstFetch) fetchData()
    setFirstFetch(false)
  }, [locale])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchData()
  }, [currentPage])

  useEffect(() => {
    fetchData()
  }, [classType])

  return (
    <div>
      {isLoading ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : isMobile ? (
        <div className="w-screen h-screen bg-white flex flex-col fixed top-0 left-0 z-50 items-center">
          <div className="w-full h-[58px] py-4 border-b-[1px] border-[#eeeeee] border-solid drop-shadow-sm flex flex-row px-6 items-center justify-center relative">
            <img className="w-6 h-6 absolute left-4 top-4" src="/icon/ic-arrow-back-brown.svg" alt="" onClick={() => (onClose ? onClose() : {})} />
            <p className="font-medium text-lg leading-[26px] text-center tracking-widest text-medium-brown text-ellipsis whitespace-nowrap overflow-hidden px-4">
              {t('Registered Class')}
            </p>
          </div>
          <div className="w-full h-fit flex flex-col p-4"></div>
        </div>
      ) : (
        <div className="w-screen h-fit bg-background-01 py-10 flex flex-col items-center font-noto-sans-tc">
          <div className="w-[1400px] h-fit bg-white p-[60px] rounded-[10px] items-center flex flex-col">
            <div className="w-full h-fit flex flex-row items-center justify-start">
              <p className="font-medium text-3xl leading-[43px] tracking-wider text-medium-brown w-fit text-start">{t('Registered Class')}</p>
            </div>
            <div className="w-full h-fit flex flex-row gap-6 items-center justify-start mt-10">
              <button
                className={`w-fit h-fit py-2 px-5 rounded-[10px] border-[1px] border-solid ${
                  classType === 2 ? 'border-[#EEB545] text-[#EEB545]' : 'border-[#BFBFBF] text-[#BFBFBF]'
                }`}
                onClick={() => setClassType(2)}
              >
                {t('All class')}
              </button>
              <button
                className={`w-fit h-fit py-2 px-5 rounded-[10px] border-[1px] border-solid ${
                  classType === 1 ? 'border-[#EEB545] text-[#EEB545]' : 'border-[#BFBFBF] text-[#BFBFBF]'
                }`}
                onClick={() => setClassType(1)}
              >
                {t('Online')}
              </button>
              <button
                className={`w-fit h-fit py-2 px-5 rounded-[10px] border-[1px] border-solid ${
                  classType === 0 ? 'border-[#EEB545] text-[#EEB545]' : 'border-[#BFBFBF] text-[#BFBFBF]'
                }`}
                onClick={() => setClassType(0)}
              >
                {t('Office')}
              </button>
            </div>
            <div className="w-full h-fit flex justify-center items-center mt-8">
              <div className="bg-white shadow-md rounded w-full">
                <div className="bg-app-brown text-white uppercase text-sm leading-normal rounded-t-[5px] grid grid-cols-8 gap-2">
                  <div className="col-span-1 py-3 px-6 text-center">{t('Class Id')}</div>
                  <div className="col-span-1 py-3 px-6 text-center">{t('Class format')}</div>
                  <div className="col-span-2 py-3 px-6 text-center">{t('First class date')}</div>
                  <div className="col-span-2 py-3 px-6 text-center">{t('Class name')}</div>
                  <div className="col-span-1 py-3 px-6 text-center">{t('State')}</div>
                  <div className="col-span-1 py-3 px-6 text-center"></div>
                </div>
                <div className="text-medium-brown text-sm font-light">
                  {listClass.map((item, index) => {
                    return (
                      <div className="col-span-1 border-b border-gray-200 hover:bg-gray-100 grid grid-cols-8 gap-2" key={index}>
                        <div className="py-3 px-6 text-left whitespace-nowrap">
                          <div className="flex items-center">
                            <span>{item.code}</span>
                          </div>
                        </div>
                        <div className="col-span-1 py-3 px-6 text-left">
                          <div className="flex items-center">
                            <span>{item.periods[0].type}</span>
                          </div>
                        </div>
                        <div className="col-span-2 py-3 px-6 text-left">
                          <div className="flex items-center">
                            <span>{item.periods[0].start_date}</span>
                          </div>
                        </div>
                        <div className="col-span-2 py-3 px-6 text-center">
                          <span>{item.name}</span>
                        </div>
                        <div className="col-span-1 py-3 px-6 text-left">
                          <div className="flex items-center">
                            <span>{item.status_course}</span>
                          </div>
                        </div>
                        <div className="col-span-1 py-3 px-6 text-left">
                          <div className="flex items-center">
                            <span className="text-[#EEB545] cursor-pointer" onClick={() => gotoPage('/course-detail', `?id=${item.id}`)}>
                              {capitalizeFirstLetter(t('view'))}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="w-full h-fit flex justify-center items-center mt-4">
              <AppPagination total={totalClass} current={currentPage} onChange={(p) => updateCurrentPage(p)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
