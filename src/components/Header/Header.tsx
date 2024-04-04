import * as React from 'react'
import { NAV_BAR, NAV_BAR_TYPE } from '@/utils/constants/navbar.constant'
import AppButton from '../AppButton'
import { useTranslation } from 'next-i18next'
import { capitalizeFirstLetter, capitalizeFirstLetterAllWords, gotoPage } from '@/utils/helpers/common'
import AppPopup from '../AppPopup/AppPopup'
import AppTabView from '../AppTabView/AppTabView'
import Login from '@/components/Login'
import Register from '@/components/Register/Register'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { authApi } from '@/utils/api'
import * as styles from '@/utils/constants/classStyle.constant'
import { useSession, signOut } from 'next-auth/react'
import { SOCIAL_NETWORK } from '@/utils/constants/footer.constant'
import userApi, { IGetInfoResponse } from '@/utils/api/user'
import { useOnClickOutside } from 'usehooks-ts'
import dynamic from 'next/dynamic'
import AppDropdown from '../AppDropdown'

const simple = (props: any) => <React.Fragment>{props.children}</React.Fragment>
const NoSsr = dynamic(() => Promise.resolve(simple), {
  ssr: false,
})

export interface IAppProps {}

export default function Header(props: IAppProps) {
  const { data: session } = useSession()
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const ref = useRef(null)
  const { pathname, asPath, query } = router
  const { locale } = router

  const [defaultLoginTab, setDefaultLoginTab] = useState<any>({ pos: 0, track: Math.random() })
  const [isShowLogin, setShowLogin] = useState<boolean>(false)
  const [isLogin, setCheckLogin] = useState<boolean>(false)
  const [showLoading, setShowLoading] = useState<boolean>(false)
  const [showLogOut, setShowLogOut] = useState<boolean>(false)
  const [cart, setCart] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [isSmallScreen, setIfSmallScreen] = useState<boolean>(false)
  const [isShowMenu, setShowMenu] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<IGetInfoResponse | null>(null)
  const [showSubNav, setShowSubNav] = useState<number | null>(null)

  let onTranslate = (lang: string) => {
    let _locale = lang === 'English' ? 'en-US' : 'zh-HK'
    router.push({ pathname, query }, asPath, { locale: _locale })
    window.NextPublic.lang = locale as any
  }

  const handleClickOutside = () => {
    setShowSubNav(null)
  }

  let showLogin = () => {
    setShowLogin(true)
  }
  let closeLogin = () => {
    setShowLogin(false)
  }
  let switchTab = (tab: number) => {
    setDefaultLoginTab({ pos: tab, track: Math.random() })
  }
  let LoginSuccess = async () => {
    closeLogin()
    router.push({ pathname, query }, asPath, { locale: locale })
    window.NextPublic.lang = locale as any
    await getUserInfo()
    setCheckLogin(true)
  }

  let gotoForgotPw = () => {
    gotoPage('/forgot-password')
    setShowLogin(false)
  }

  let gotoSubNav = (path: string) => {
    setShowSubNav(null)
    gotoPage(path)
  }

  let onlogOut = async () => {
    try {
      showLoadingPopup()
      localStorage.removeItem('token')
      localStorage.removeItem('user_name')
      localStorage.removeItem('user_email')
      localStorage.removeItem('user_phone')
      localStorage.removeItem('user_avatar')
      localStorage.removeItem('cart')
      if (session) {
        closeLoadingPopup()
        signOut()
      } else {
        router.reload()
      }
    } catch (e) {
      console.log(e)
    }
  }

  let onClickNav = (item: NAV_BAR_TYPE, index: number) => {
    if (item.subs.length > 0) {
      setShowSubNav(showSubNav === index ? null : index)
    } else {
      gotoPage(item.path)
    }
  }

  //display
  let showLoadingPopup = () => {
    setShowLoading(true)
  }
  let closeLoadingPopup = () => {
    setShowLoading(false)
  }
  let toggleLogOutBtn = () => {
    setShowLogOut(!showLogOut)
  }

  //call API
  let logInByGoogle = async () => {
    try {
      showLoadingPopup()
      let res = await authApi.logInByGoogle({
        params: {
          google: (session as any).user.id,
          avatar: session?.user?.image!,
          name: session?.user?.name!,
          email: session?.user?.email!,
        },
      })
      if (res.status === 200) {
        localStorage.setItem('token', res.data.params.token)
        closeLoadingPopup()
        LoginSuccess()
      }
    } catch (e) {
      console.log(e)
    }
  }

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

  let gotoPageFromMenu = (nav: any, index: number | null) => {
    if (index == null || typeof nav === 'string') {
      setShowMenu(false)
      gotoPage(nav.toString())
    } else {
      if (nav.subs.length > 0) setShowSubNav(nav.subs.length === 0 ? null : showSubNav === index ? null : index)
      else {
        setShowMenu(false)
        gotoPage(nav.path)
      }
    }
  }

  let gotoPayment = () => {
    if (localStorage.getItem('token')) gotoPage('/payment')
    else {
      showLogin()
    }
  }

  const listenStorageChange = () => {
    if (localStorage.getItem('cart')) {
      if (localStorage.getItem('cart') !== cart) {
        setCart(localStorage.getItem('cart'))
      }
    }
    if (localStorage.getItem('token')) {
      setUserName(localStorage.getItem('user_name'))
      setCheckLogin(true)
    }
  }

  let onShowMenu = () => {
    listenStorageChange()
    setShowMenu(true)
  }

  useEffect(() => {
    getUserInfo()
    const listenResizeWindows = () => {
      setIfSmallScreen(window.innerWidth < 1400)
    }

    setCheckLogin(typeof localStorage.getItem('token') === 'string' || typeof session === 'object')

    listenStorageChange()
    listenResizeWindows()

    window.addEventListener('storage', listenStorageChange)
    window.addEventListener('resize', listenResizeWindows)
    if (localStorage.getItem('user_name')) {
      setUserName(localStorage.getItem('user_name'))
    }
  }, [])

  useEffect(() => {
    if (session) {
      if (typeof localStorage.getItem('token') !== 'string') {
        setShowLoading(true)
        logInByGoogle()
      }
    }
  }, [session])

  useOnClickOutside(ref, handleClickOutside)

  return (
    <div className="w-screen h-[72px] pc:h-[110px] py-[22px] flex flex-col items-center fixed top-0 left-0 z-50 bg-white drop-shadow-md">
      <div className="w-screen pc:w-[1400px] h-full flex flex-row justify-between px-4 pc:px-0">
        <div className="w-fit flex flex-row justify-between items-center">
          <img className="w-[181px] h-[44px] pc:w-[230px] pc:h-14" src="/img/logo-230w56h.png" alt="" onClick={() => gotoPageFromMenu('/', null)} />
          {!isSmallScreen && (
            <div className="w-[640px] h-fit flex flex-row ml-10" ref={ref}>
              {NAV_BAR.map((item, index) => {
                return (
                  <div className="w-fit h-fit relative" key={index}>
                    <button
                      className={`font-noto-sans-tc flex flex-row justify-center items-center gap-2.5 px-5 py-2 ${
                        showSubNav === index ? 'text-[#EEB545]' : 'text-black'
                      }`}
                      onClick={() => onClickNav(item, index)}
                    >
                      <p>{capitalizeFirstLetterAllWords(t(item.text)!)}</p>
                      {item.subs.length > 0 && (
                        <img
                          className="w-[18px] h-[18px]"
                          src={showSubNav === index ? '/icon/ic-arrow-down-nav-yellow.svg' : '/icon/ic-arrow-down-nav-brown.svg'}
                          alt=""
                        />
                      )}
                    </button>
                    {showSubNav === index && (
                      <div className="w-fit h-fit absolute top-full flex flex-col rounded-md border-[1px] justify-center items-stretch">
                        {item.subs.map((sub, subIndex) => {
                          return (
                            <button
                              className={`px-2 py-1 whitespace-nowrap text-center bg-white text-black hover:bg-[#EEB545] hover:text-white ${
                                subIndex === 0 ? 'rounded-t-md' : subIndex === item.subs.length - 1 && 'rounded-b-md'
                              }`}
                              key={subIndex}
                              onClick={() => gotoSubNav(sub.path)}
                            >
                              {t(sub.text)}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div className="w-fit flex flex-row items-center justify-between">
          {/* <img className="w-[22px] h-auto mr-7" src="/icon/ic-search.svg" /> */}
          {!isSmallScreen && (
            <img
              className="w-[39px] h-auto mr-7 cursor-pointer"
              src={cart == null || cart.length == 0 ? '/icon/ic-cart.svg' : '/icon/ic-cart-mark.svg'}
              onClick={() => gotoPayment()}
            />
          )}

          {isSmallScreen ? (
            <img className="w-6 h-6 cursor-pointer" src="/icon/ic-menu.svg" onClick={() => onShowMenu()} />
          ) : isLogin ? (
            <div className="w-fit max-w-[160px] max-h-[26px] justify-start items-center flex flex-row cursor-pointer relative">
              <p className="w-fit max-w-full max-h-full text-ellipsis overflow-hidden" onClick={() => gotoPage('/member-center')}>{`${t('Hi')}, ${
                userInfo?.name
              }`}</p>
              <img className="w-3 h-3 ml-[10px]" src="/icon/ic-arrow-down-brown.svg" alt="" onClick={() => toggleLogOutBtn()} />
              {showLogOut && (
                <div
                  className="w-[160px] h-fit p-3 drop-shadow-md rounded-[10px] bg-white text-center absolute top-full m-[10px] right-0 hover:bg-app-brown/60 hover:text-white"
                  onClick={() => onlogOut()}
                >
                  {t('Log out')}
                </div>
              )}
            </div>
          ) : (
            <AppButton
              variant="contain"
              color="app-mint"
              text={capitalizeFirstLetter(`${t('Login')} / ${t('Register')}`)}
              onClick={() => showLogin()}
            />
          )}
        </div>
      </div>
      <AppPopup isShow={isShowLogin} onClose={closeLogin}>
        <AppTabView
          tabs={[
            {
              title: t('Login'),
              el: <Login gotoRegister={() => switchTab(1)} onLoginSuccess={LoginSuccess} onGotoForgotPw={gotoForgotPw} />,
            },
            {
              title: t('Register'),
              el: <Register gotoLogin={() => switchTab(0)} />,
            },
          ]}
          defaultPosition={defaultLoginTab}
        />
      </AppPopup>
      <AppPopup isShow={showLoading} onClose={closeLoadingPopup}>
        <div className={styles.DIV.POPUP_CHILDREN}>
          <p>Logging In...</p>
        </div>
      </AppPopup>
      {isShowMenu && (
        <div className="w-screen h-screen z-50 fixed top-0 left-0 flex flex-col">
          <div className="w-screen h-[72px] flex flex-row justify-between items-center px-4 bg-white">
            <div className="w-fit h-fit flex flex-row items-center justify-center">
              <img className="w-5 h-5 mr-[10px]" src="/icon/ic-user-medium-brown.svg" alt="" />
              {isLogin ? (
                <div className="w-fit max-w-[160px] max-h-[26px] justify-start items-center flex flex-row cursor-pointer relative">
                  <p
                    className="w-fit max-w-full max-h-full text-ellipsis overflow-hidden"
                    onClick={() => gotoPageFromMenu('/member-center', null)}
                  >{`${t('Hi')}, ${userInfo?.name}`}</p>
                  <img className="w-3 h-3 ml-[10px]" src="/icon/ic-arrow-down-brown.svg" alt="" onClick={() => toggleLogOutBtn()} />
                  {showLogOut && (
                    <div
                      className="w-[160px] h-fit p-3 drop-shadow-md rounded-[10px] bg-white absolute left-[50%] pc:left-0 top-full m-[10px] right-0 hover:bg-app-brown/60 hover:text-white"
                      onClick={() => onlogOut()}
                    >
                      {t('Log out')}
                    </div>
                  )}
                </div>
              ) : (
                <p className="font-normal text-lg leading-[26px] tracking-widest text-medium-brown" onClick={() => gotoPageFromMenu('/login', null)}>
                  {capitalizeFirstLetter(`${t('Login')} / ${t('Register')}`)}
                </p>
              )}
            </div>
            <img className="w-6 h-6 cursor-pointer" src="/icon/ic-close.svg" alt="" onClick={() => setShowMenu(false)} />
          </div>
          <div className="w-full h-full bg-app-brown flex flex-col p-4">
            <div className="w-full h-fit bg-app-brown border-b-[1px] border-white border-solid">
              {NAV_BAR.map((nav, index) => {
                return (
                  <div key={index} className="w-full h-fit flex flex-col z-50">
                    <div className="w-full h-fit flex flex-row justify-between items-center" onClick={() => gotoPageFromMenu(nav, index)}>
                      <p className="font-normal text-lg leading-[26px] tracking-widest text-white py-6">{t(nav.text)}</p>
                      {nav.subs.length > 0 && <img className="w-4 h-4 ml-3" src="/icon/ic-arrow-down-light.svg" alt="" />}
                    </div>
                    <div className="w-full h-fit flex flex-col gap-6 px-4">
                      {showSubNav === index &&
                        nav.subs.map((sub, subIndex) => {
                          return (
                            <p
                              className="font-normal text-lg leading-[26px] tracking-widest text-white"
                              onClick={() => gotoPageFromMenu(sub.path, index)}
                              key={subIndex}
                            >
                              {t(sub.text)}
                            </p>
                          )
                        })}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="w-full h-fit flex flex-row justify-between items-center mt-10">
              <div className="w-[120px] h-fit flex flex-row justify-center items-center relative">
                <NoSsr>
                  <AppDropdown
                    options={['English', '繁體中文']}
                    value={i18n.language === 'en-US' ? 'English' : '繁體中文'}
                    theme="dark"
                    onChange={(lang) => onTranslate(lang)}
                  />
                </NoSsr>
              </div>
              <div className="flex flex-row justify-center items-center">
                {SOCIAL_NETWORK.map((item, index) => {
                  return <img className=" w-6 h-6 ml-8" src={`/icon/${item.icon}`} alt="" key={index} />
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
