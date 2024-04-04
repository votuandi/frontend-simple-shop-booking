import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import userApi from '@/utils/api/user/user.api'
import { IOderHistoryItem } from '@/utils/api/user'
import AppPagination from '../AppPagination/AppPagination'

type IProps = {
  isMobile: boolean
}

export default function OderHistory({ isMobile }: IProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { locale } = router
  const { data: session } = useSession()

  const [firstFetch, setFirstFetch] = useState<boolean>(true)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [listOder, setListOder] = useState<IOderHistoryItem[]>([])
  const [totalOder, setTotalOder] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)

  //call APi
  let getListOderHistory = async () => {
    try {
      let res = await userApi.getListOderHistory({
        params: {
          language: locale!.replace('-', '_'),
          token: localStorage.getItem('token') ?? '',
          limit: 10,
          page: currentPage,
        },
      })
      setListOder(res.data.params.items)
      setTotalOder(res.data.params.total)
    } catch (e) {
      console.log(e)
    }
  }

  let fetchData = async () => {
    await getListOderHistory()
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

  return (
    <div>
      {isLoading ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="w-screen h-fit bg-background-01 py-10 flex flex-col items-center">
          <div className="w-[1400px] h-fit bg-white p-[60px] rounded-[10px] items-center flex flex-col">
            <div className="w-full h-fit flex flex-row items-center justify-start">
              <p className="font-medium text-3xl leading-[43px] tracking-wider text-medium-brown w-fit text-start">{t('Order History')}</p>
            </div>
            <div className="w-full h-fit flex justify-center items-center mt-12">
              <div className="bg-white shadow-md rounded w-full">
                <div className="bg-app-brown text-white uppercase text-sm leading-normal rounded-t-[5px] grid grid-cols-8 gap-2">
                  <div className="col-span-1 py-3 px-6 text-center">{t('Order Id')}</div>
                  <div className="col-span-1 py-3 px-6 text-center">{t('Order status')}</div>
                  <div className="col-span-2 py-3 px-6 text-center">{t('Transaction date')}</div>
                  <div className="col-span-2 py-3 px-6 text-center">{t('Order detail')}</div>
                  <div className="col-span-1 py-3 px-6 text-center">{t('Total payment')}</div>
                  <div className="col-span-1 py-3 px-6 text-center"></div>
                </div>
                <div className="text-medium-brown text-sm font-light">
                  {listOder.map((item, index) => {
                    return (
                      <div className="col-span-1 border-b border-gray-200 hover:bg-gray-100 grid grid-cols-8 gap-2" key={index}>
                        <div className="py-3 px-6 text-left whitespace-nowrap">
                          <div className="flex items-center">
                            <span>{item.id}</span>
                          </div>
                        </div>
                        <div className="col-span-1 py-3 px-6 text-left">
                          <div className="flex items-center">
                            <span>{item.status}</span>
                          </div>
                        </div>
                        <div className="col-span-2 py-3 px-6 text-left">
                          <div className="flex items-center">
                            <span>{item.transaction_date}</span>
                          </div>
                        </div>
                        <div className="col-span-2 py-3 px-6 text-center flex flex-col items-start justify-start">
                          {item.courses.map((course, courseIndex) => {
                            return <span key={courseIndex}>{course.name}</span>
                          })}
                        </div>
                        <div className="col-span-1 py-3 px-6 text-left">
                          <div className="flex items-center">
                            <span>{item.total}</span>
                          </div>
                        </div>
                        <div className="col-span-1 py-3 px-6 text-left">
                          <div className="flex items-center">
                            <span className="text-[#EEB545]">???</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="w-full h-fit flex justify-center items-center mt-4">
              <AppPagination total={totalOder} current={currentPage} onChange={(p) => updateCurrentPage(p)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
