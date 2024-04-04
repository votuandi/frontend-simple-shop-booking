import * as React from 'react'
import { useTranslation } from 'next-i18next'
import * as styles from '@/utils/constants/classStyle.constant'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import metaphysicalApi from '@/utils/api/metaphysical/metaphysical.api'
import parse from 'html-react-parser'
import { IMetaphysicalItem } from '@/utils/api/metaphysical'
import AppPopup from '@/components/AppPopup/AppPopup'
import AppPagination from '@/components/AppPagination'

export interface IAppProps {}

export default function MetaphysicalInformation(props: IAppProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { locale } = router

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [metaphysical, setMetaphysical] = useState<IMetaphysicalItem[]>([])
  const [filterMetaphysical, setFilerMetaphysical] = useState<IMetaphysicalItem[]>([])
  const [totalMetaphysical, setTotalMetaphysical] = useState<number>(0)
  const [firstFetch, setFirstFetch] = useState<boolean>(true)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [isShowDetail, setShowDetail] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string | number | null>(null)
  const [selectedItem, setSelectedItem] = useState<IMetaphysicalItem | null>(null)
  const [isMobile, setIfMobile] = useState<boolean>(false)

  let showDetail = () => {
    setShowDetail(true)
  }

  let hideDetail = () => {
    setShowDetail(false)
  }

  let onShowDetail = (_id: string | number) => {
    setSelectedId(_id)
    let _metaphysicalItem = metaphysical.filter((m) => m.id === _id)[0]
    setSelectedItem(_metaphysicalItem)
    setShowDetail(true)
  }

  //call API
  let getLisMetaPhysicalInformation = async () => {
    try {
      let res = await metaphysicalApi.getListMeaPhysical({
        params: {
          language: locale!.replace('-', '_'),
          limit: 20,
          page: currentPage,
        },
      })
      setMetaphysical(res.data.params.items)
      setTotalMetaphysical(res.data.params.total)
    } catch (e) {
      console.log(e)
    }
  }

  let fetchData = async () => {
    await getLisMetaPhysicalInformation()
    setLoading(false)
  }

  let onSearch = (e: any) => {
    let keyword = e.target.value
    let filterItem = metaphysical.filter((item) => item.name.includes(keyword) || item.description.includes(keyword))
    setFilerMetaphysical([...filterItem])
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
    if (!firstFetch) getLisMetaPhysicalInformation()
    setFirstFetch(false)
  }, [locale])

  useEffect(() => {
    if (selectedId) showDetail()
  }, [selectedItem])

  useEffect(() => {
    setFilerMetaphysical([...metaphysical])
  }, [metaphysical])

  return (
    <div className="relative w-screen h-full pt-14 pc:pt-[110px] pb-[150px] flex flex-col items-center justify-start">
      <div className="relative flex justify-center items-center bg-metaphysical-information w-screen h-[180px] pc:h-[340px]">
        <p className="font-bold text-3xl pc:text-[46px] pc:leading-[67px] text-center tracking-widest text-white">{t('Metaphysics course')}</p>
      </div>
      {isLoading ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="flex flex-col w-full pc:w-[1400px] h-fit px-4 mt-8 items-center justify-start relative">
          <div className="flex flex-row justify-between items-center w-full h-fit">
            <input className={styles.APP_INPUT} type="text" placeholder={t('Search')!} onChange={(e: any) => onSearch(e)} />
          </div>
          <div className="w-full flex flex-row flex-wrap items-center justify-center gap-4 pc:grid pc:grid-cols-2 pc:gap-10 pc:w-full mt-[60px]">
            {filterMetaphysical.map((item, index) => {
              return (
                <div className="flex items-center justify-center" key={index}>
                  <div
                    className="w-[164px] h-[140px] pc:w-[680px] pc:h-[220px] px-4 py-3 pc:py-[30px] flex flex-col pc:flex-row items-center justify-between bg-white rounded-md pc:rounded-[10px] drop-shadow-md border-[1px] border-solid border-[#f6f6f6] cursor-pointer"
                    onClick={() => onShowDetail(item.id)}
                  >
                    <img className="w-16 h-16 pc:w-40 pc:h-40" src={item.path ?? ''} alt="" />
                    <div className="w-full h-fit items-start justify-center flex flex-col">
                      <span className="w-full max-h-[56px] ::[&>*] text-ellipsis whitespace-nowrap overflow-hidden text-center pc:text-start font-medium text-lg pc:text-[28px] pc:leading-[41px] tracking-widest text-medium-brown">
                        {item.name}
                      </span>
                      {!isMobile && (
                        <div className="w-full h-[90px] ::[&>*] text-ellipsis overflow-hidden mt-4 font-normal text-base leading-[23px] tracking-wider text-app-brown">
                          {parse(item.description)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="w-full h-fit flex justify-center items-center mt-10">
            <AppPagination total={totalMetaphysical} current={currentPage} onChange={(p) => updateCurrentPage(p)} />
          </div>
          <AppPopup isShow={isShowDetail && !isMobile} onClose={hideDetail}>
            <div className="flex flex-col justify-between items-center w-[1000px] h-[640px]">
              <p className="font-medium text-3xl leading-[43px] text-center tracking-wider text-medium-brown">{selectedItem?.name.toUpperCase()}</p>
              <div className="flex flex-row justify-between items-stretch w-full h-[600px] gap-5">
                <div className="w-[320px] h-full flex justify-center items-center">
                  <img className="w-[320px] h-auto" src={selectedItem?.path ?? ''} alt="" />
                </div>
                <div className="w-full h-[640px] overflow-auto flex flex-col justify-start items-stretch">
                  <div className="grid grid-cols-2 gap-5 w-full mt-[60px]">
                    <div className="w-full h-fit flex flex-col justify-start">
                      <p className="font-medium text-base leading-[23px] text-medium-brown">{t('Time of Origin')}</p>
                      <p className="font-normal text-base leading-[200%] text-app-brown">{selectedItem?.origin_time}</p>
                    </div>
                    <div className="w-full h-fit flex flex-col justify-start">
                      <p className="font-medium text-base leading-[23px] text-medium-brown">{t('Founder')}</p>
                      <p className="font-normal text-base leading-[200%] text-app-brown">{selectedItem?.founder}</p>
                    </div>
                    <div className="w-full h-fit flex flex-col justify-start">
                      <p className="font-medium text-base leading-[23px] text-medium-brown">{t('Method')}</p>
                      <p className="font-normal text-base leading-[200%] text-app-brown">{selectedItem?.method}</p>
                    </div>
                    <div className="w-full h-fit flex flex-col justify-start">
                      <p className="font-medium text-base leading-[23px] text-medium-brown">{t('Purpose')}</p>
                      <p className="font-normal text-base leading-[200%] text-app-brown">{selectedItem?.purpose}</p>
                    </div>
                  </div>
                  <div className="w-full h-fit flex flex-col mt-5">
                    <p>{t('Description')!}</p>
                    <div className="w-full max-h-[120px] ::[&>*] text-ellipsis overflow-hidden font-normal text-base leading-[200%] text-app-brown text-justify">
                      {parse(selectedItem?.description ?? '')}
                    </div>
                    <p className="mt-5">{t('Famous users')!}</p>
                    <p className="w-full h-fit font-normal text-base leading-[200%] text-app-brown text-justify">{selectedItem?.famous_user}</p>
                  </div>
                  <div className="w-full h-fit justify-center items-center mt-20 flex">
                    <button className="w-[280px] h-[54px] flex justify-center items-center bg-app-brown rounded-[10px]" onClick={hideDetail}>
                      <p className="font-normal text-lg leading-[26px] text-center tracking-widest text-white">{t('Close')!}</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </AppPopup>
          {isShowDetail && isMobile && (
            <div className="w-screen h-screen fixed top-0 left-0 z-50 flex flex-col bg-white">
              <div className="w-full h-[58px] py-4 border-b-[1px] border-[#eeeeee] border-solid drop-shadow-sm flex flex-row px-6 items-center justify-center relative">
                <p className="font-medium text-lg leading-[26px] text-center tracking-widest text-medium-brown text-ellipsis whitespace-nowrap overflow-hidden px-4">
                  {selectedItem?.name}
                </p>
                <img className="w-6 h-6 absolute right-5" src="/icon/ic-close.svg" alt="" onClick={() => setShowDetail(false)} />
              </div>
              <div className="w-full h-fit flex flex-col items-center p-4 overflow-auto">
                <img className="w-32 h-auto py-5" src={selectedItem?.path ?? ''} alt="" />
                <div className="grid grid-cols-2 gap-5 w-full">
                  <div className="w-full h-fit flex flex-col justify-start">
                    <p className="font-medium text-base leading-[23px] text-medium-brown">{t('Time of Origin')}</p>
                    <p className="font-normal text-base leading-[200%] text-app-brown">{selectedItem?.origin_time}</p>
                  </div>
                  <div className="w-full h-fit flex flex-col justify-start">
                    <p className="font-medium text-base leading-[23px] text-medium-brown">{t('Founder')}</p>
                    <p className="font-normal text-base leading-[200%] text-app-brown">{selectedItem?.founder}</p>
                  </div>
                  <div className="w-full h-fit flex flex-col justify-start">
                    <p className="font-medium text-base leading-[23px] text-medium-brown">{t('Method')}</p>
                    <p className="font-normal text-base leading-[200%] text-app-brown">{selectedItem?.method}</p>
                  </div>
                  <div className="w-full h-fit flex flex-col justify-start">
                    <p className="font-medium text-base leading-[23px] text-medium-brown">{t('Purpose')}</p>
                    <p className="font-normal text-base leading-[200%] text-app-brown">{selectedItem?.purpose}</p>
                  </div>
                </div>
                <div className="w-full h-fit flex flex-col mt-5">
                  <p>{t('Description')!}</p>
                  <div className="w-full max-h-[120px] ::[&>*] text-ellipsis overflow-hidden font-normal text-base leading-[200%] text-app-brown text-justify">
                    {parse(selectedItem?.description ?? '')}
                  </div>
                  <p className="mt-5">{t('Famous users')!}</p>
                  <p className="w-full h-fit font-normal text-base leading-[200%] text-app-brown text-justify">{selectedItem?.famous_user}</p>
                </div>
                <div className="w-full h-fit justify-center items-center mt-20 flex">
                  <button className="w-[280px] h-[54px] flex justify-center items-center bg-app-brown rounded-[10px]" onClick={hideDetail}>
                    <p className="font-normal text-lg leading-[26px] text-center tracking-widest text-white">{t('Close')!}</p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
