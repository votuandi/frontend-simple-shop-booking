import * as React from 'react'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { gotoPage } from '@/utils/helpers/common'
import { NAV_BAR, NAV_BAR_MOBILE } from '@/utils/constants/memberCenter.constant'
import MemberInformation from '@/components/MemberInformation/MemberInformation'
import ShipAddress from '@/components/ShipAddress/ShipAddress'
import RegisteredClass from '@/components/RegisteredClass/RegisteredClass'
import OderHistory from '@/components/OderHistory/OderHistory'
import Notification from '@/components/Notification/Notification'
import { useRouter } from 'next/router'
import { useSession, signOut } from 'next-auth/react'
import userApi, { IGetInfoResponse } from '@/utils/api/user'
import courseApi from '@/utils/api/course'
import MemberProfile from '@/components/MemberProfile/MemberProfile'
import ChangePasswordTab from '@/components/ChangePasswordTab/ChangePasswordTab'

export interface IAppProps {}

export default function MemberCenter(props: IAppProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { data: session } = useSession()
  const { locale } = router

  const [userInfo, setUserInfo] = useState<IGetInfoResponse | null>(null)
  const [tabPos, setTabPos] = useState<number | null>(null)
  const [firstFetch, setFirstFetch] = useState<boolean>(true)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [isLoginSocial, setIfLoginSocial] = useState<boolean>(false)
  const [totalClass, setTotalClass] = useState<number>(0)
  const [isMobile, setIfMobile] = useState<boolean>(false)
  const [totalOnlineClass, setTotalOnlineClass] = useState<number>(0)

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

  let getListRegisteredClass = async () => {
    try {
      let res = await courseApi.getListRegisteredCourseByMember({
        params: {
          language: locale!.replace('-', '_'),
          token: localStorage.getItem('token') ?? '',
          limit: 100000,
          Page: 1,
        },
      })
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
          limit: 100000,
          Page: 1,
          type: 1,
        },
      })
      setTotalOnlineClass(res.data.params.total)
    } catch (e) {
      console.log(e)
    }
  }

  let fetchData = async () => {
    await getUserInfo()
    await getListRegisteredClass()
    await getListRegisteredClassWithType()
    setLoading(false)
  }

  let onCloseTaMobile = () => {
    setTabPos(null)
  }

  let onlogOut = async () => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user_name')
      localStorage.removeItem('user_email')
      localStorage.removeItem('user_phone')
      localStorage.removeItem('user_avatar')
      localStorage.removeItem('cart')
      if (session) {
        signOut()
      } else {
        router.reload()
      }
    } catch (e) {
      console.log(e)
    }
  }
  let listenResizeWindows = () => {
    setIfMobile(window.innerWidth < 1400)
  }

  useEffect(() => {
    window.addEventListener('resize', listenResizeWindows)
    listenResizeWindows()
    if (!localStorage.getItem('token')) {
      gotoPage('/')
    } else {
      if (session) setIfLoginSocial(true)
      else setIfLoginSocial(false)

      fetchData()
    }
  }, [])

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
      ) : isMobile ? (
        <div className="w-screen h-fit min-h-screen flex flex-col py-[72px]">
          <div className="relative flex flex-col justify-center items-start bg-member-center-mobile w-screen h-[140px] px-4">
            <p className="font-medium text-2xl leading-[35px] text-white">{`${'Hi'}, ${userInfo?.name}`}</p>
            <div className="w-fit h-fit flex flex-row flex-wrap font-normal text-sm leading-5 text-white mt-3 gap-3">
              <p className="pr-4 border-r-[1px] border-white border-solid">{`${t('Membership number')} ${userInfo?.phone}`}</p>
              <p className="">{`${t('Registered Classes')} ${totalClass}`}</p>
            </div>
          </div>
          <div className="px-4 flex flex-col w-full gap-10 mt-8">
            {NAV_BAR_MOBILE.map((nav, index) => {
              return (
                <div className="w-full h-fit flex flex-row justify-between items-center" key={index} onClick={() => setTabPos(index)}>
                  <p className="font-normal text-lg leading-[26px] tracking-widest text-app-brown">{t(nav)}</p>
                  <img className="w-6 h-6" src="/icon/ic-arrow-go-brown.svg" alt="" />
                </div>
              )
            })}
            <div className="w-fit h-fit flex flex-row gap-3" onClick={() => signOut()}>
              <img src="/icon/ic-out.svg" alt="" />
              <p className="font-normal text-lg leading-[26px] tracking-widest text-app-brown">{t('Log out')}</p>
            </div>
          </div>
          {tabPos === 0 ? (
            <MemberProfile isMobile={isMobile} onClose={() => onCloseTaMobile()} />
          ) : tabPos === 1 ? (
            <ChangePasswordTab isMobile={isMobile} onClose={() => onCloseTaMobile()} />
          ) : (
            tabPos === 2 && <RegisteredClass isMobile={isMobile} onClose={() => onCloseTaMobile()} />
          )}
        </div>
      ) : (
        <div className="relative w-screen h-full pt-[110px] flex flex-col items-center justify-start">
          <div className="w-screen h-[240px] bg-member-center flex justify-center items-center">
            <div className="w-[1400px] h-fit grid grid-cols-5 ">
              <div className="col-span-3 flex flex-row items-end justify-between border-r-[1px] border-app-brown/40 border-solid pr-14">
                <div className="flex flex-col font-medium text-3xl leading-[43px] tracking-wider text-medium-brown">
                  <p>{t('Hi')}</p>
                  <p>{userInfo ? userInfo.name : ''}</p>
                </div>
                <div className="flex flex-row items-center justify-center w-fit h-fit">
                  <img className="w-6 h-6 cursor-pointer" src="/icon/ic-bell.svg" alt="" onClick={() => setTabPos(4)} />
                  <div className="flex flex-row items-center justify-center w-fit h-fit ml-10 cursor-pointer">
                    <p className="font-normal text-lg leading-[180%] tracking-[0.08em] text-medium-brown" onClick={() => onlogOut()}>
                      {t('Log out')}
                    </p>
                    <img className="w-6 h-6 ml-2" src="/icon/ic-out.svg" alt="" />
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex flex-row items-end justify-between pl-14">
                <div className="w-fit h-fit flex flex-col justify-center items-start">
                  <p className="font-normal text-lg leading-[180%] tracking-[0.08em] text-medium-brown">{t('Registered Classes')}</p>
                  <p className="font-medium text-3xl leading-[43px] tracking-wider text-medium-brown">{totalClass}</p>
                </div>
                <div className="w-fit h-fit flex flex-col justify-center items-start">
                  <p className="font-normal text-lg leading-[180%] tracking-[0.08em] text-medium-brown">{t('Classes can be replayed online')}</p>
                  <div className="w-fit h-fit flex flex-row gap-10 items-end">
                    <p className="font-medium text-3xl leading-[43px] tracking-wider text-medium-brown">{totalOnlineClass}</p>
                    <div className="w-fit h-fit flex flex-row justify-center items-center cursor-pointer" onClick={() => setTabPos(2)}>
                      <p className="font-normal text-lg leading-[180%] tracking-[0.08em] text-app-brown">{`${t('view')}/${t('review')}`}</p>
                      <img className="w-5 h-5 ml-2" src="/icon/ic-arrow-go-brown.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white w-screen h-[60px] flex justify-center items-center">
            <div className="w-[1400px] h-[60px] grid grid-cols-5">
              {NAV_BAR.map((nav, index) => {
                return (
                  <div
                    className={`flex justify-center items-center w-[280px] cursor-pointer ${
                      index === tabPos ? 'border-b-2 border-[#EEB545] border-solid' : ''
                    }`}
                    onClick={() => setTabPos(index)}
                    key={index}
                  >
                    {t(nav)}
                  </div>
                )
              })}
            </div>
          </div>
          {tabPos === 0 || tabPos == null ? (
            <MemberInformation isMobile={isMobile} />
          ) : tabPos === 1 ? (
            <ShipAddress isMobile={isMobile} />
          ) : tabPos === 2 ? (
            <RegisteredClass isMobile={isMobile} />
          ) : tabPos === 3 ? (
            <OderHistory isMobile={isMobile} />
          ) : (
            <Notification isMobile={isMobile} />
          )}
        </div>
      )}
    </>
  )
}
