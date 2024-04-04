import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import userApi from '@/utils/api/user/user.api'
import { INotifyItem } from '@/utils/api/user'
import AppPagination from '../AppPagination/AppPagination'

type IProps = {
  isMobile: boolean
}

export default function Notification({ isMobile }: IProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { locale } = router
  const { data: session } = useSession()

  const [firstFetch, setFirstFetch] = useState<boolean>(true)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [listNotify, setListNotify] = useState<INotifyItem[]>([])
  const [totalNotify, setTotalNotify] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)

  //call APi
  let getListOderHistory = async () => {
    try {
      let res = await userApi.getNotify({
        params: {
          language: locale!.replace('-', '_'),
          token: localStorage.getItem('token') ?? '',
          limit: 10,
          page: currentPage,
        },
      })
      setListNotify(res.data.params.items)
      setTotalNotify(res.data.params.total)
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
              <p className="font-medium text-3xl leading-[43px] tracking-wider text-medium-brown w-fit text-start">{t('Notification')}</p>
            </div>
            <div className="w-full h-fit flex flex-col justify-center items-center mt-12">
              {listNotify.map((item, index) => {
                return (
                  <div
                    className="w-full h-fit py-5 border-b-[1px] border-[#bfbfbf] border-solid flex flex-col items-start justify-center"
                    key={index}
                  >
                    <div className="w-full h-fit flex flex-row items-center justify-start">
                      <p className="font-medium text-2xl leading-[35px] tracking-widest text-medium-brown">{item.name}</p>
                      <p className="ml-5 font-normal text-base leading-[200%] text-[#BFBFBF]">{item.created}</p>
                    </div>
                    <p className="font-normal text-base leading-[200%] text-[#89817A] mt-2">{item.description}</p>
                  </div>
                )
              })}
            </div>
            <div className="w-full h-fit flex justify-center items-center mt-4">
              <AppPagination total={totalNotify} current={currentPage} onChange={(p) => updateCurrentPage(p)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
