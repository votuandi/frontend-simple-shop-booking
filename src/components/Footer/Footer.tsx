import { FOOTER, SOCIAL_NETWORK } from '@/utils/constants/footer.constant'
import { capitalizeFirstLetterAllWords } from '@/utils/helpers/common'
import * as React from 'react'
import { useTranslation } from 'next-i18next'
import AppDropdown from '../AppDropdown/AppDropdown'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const simple = (props: any) => <React.Fragment>{props.children}</React.Fragment>
const NoSsr = dynamic(() => Promise.resolve(simple), {
  ssr: false,
})

export interface IAppProps {}
export default function Footer(props: IAppProps) {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const { pathname, asPath, query } = router
  const { locale } = router

  const [isMobile, setIfMobile] = useState<boolean>(false)
  const [showSubMenu, setShowSubMenu] = useState<{
    [key: number]: boolean
  }>({})

  let onTranslate = (lang: string) => {
    let _locale = lang === 'English' ? 'en-US' : 'zh-HK'
    router.push({ pathname, query }, asPath, { locale: _locale })
    window.NextPublic.lang = locale as any
  }

  let onToggleMenu = (i: number) => {
    let newShowSubMenu = { ...showSubMenu }
    newShowSubMenu[i] = !newShowSubMenu[i]
    setShowSubMenu(newShowSubMenu)
  }

  useEffect(() => {
    const listenResizeWindows = () => {
      setIfMobile(window.innerWidth < 1400)
    }

    listenResizeWindows()
    window.addEventListener('resize', listenResizeWindows)
  }, [])

  return (
    <div className="bg-dark-brown w-screen h-full pt-0 pc:pt-[50px] items-center justify-center flex relative">
      <div className="w-full pc:w-[1400px] h-full flex flex-col  px-4 pc:px-0">
        {isMobile && (
          <div className="w-full pt-10">
            <p className="font-medium text-base leading-[23px] tracking-widest text-[#FCF8F5] mb-4">{t('Language selection')}</p>
            <NoSsr>
              <AppDropdown
                options={['English', '繁體中文']}
                value={i18n.language === 'en-US' ? 'English' : '繁體中文'}
                theme="dark"
                onChange={(lang) => onTranslate(lang)}
                isMobile={true}
              />
            </NoSsr>
          </div>
        )}
        <div className="flex flex-col pc:flex-row justify-start items-start w-full">
          {FOOTER.map((item, index) => {
            return (
              <div key={index} className="flex flex-col w-full pc:w-[25%] mt-10 pc:mt-0 text-start items-start justify-start">
                <div className="flex flex-row justify-between items-center w-full h-fit" onClick={() => onToggleMenu(index)}>
                  <p className="font-medium text-base leading-[23px] tracking-widest text-[#FCF8F5] mb-0 pc:mb-4">
                    {capitalizeFirstLetterAllWords(t(item.title) ?? item.title)}
                  </p>
                  {isMobile && <img className="w-5 h-5" src="/icon/ic-arrow-down-light.svg" alt="" />}
                </div>

                {(!isMobile || (isMobile && showSubMenu[index])) &&
                  item.content.map((c, i) => {
                    return (
                      <p className="text-sm leading-5 text-[#9A8C81] mt-4 px-2 py-2 pc:py-0 pc:px-0" key={i}>
                        {t(c.text)}
                      </p>
                    )
                  })}
              </div>
            )
          })}
          <div className="flex flex-col w-full pc:w-[25%] text-start items-start justify-start mt-10 pc:mt-0 ">
            <p className="font-medium text-base leading-[23px] tracking-widest text-[#FCF8F5] mb-8">{t('Follow and Subscribe')}</p>
            <div className="w-28 h-full flex flex-row justify-between items-center">
              {SOCIAL_NETWORK.map((item, index) => {
                return <img className=" w-6 h-6" src={`/icon/${item.icon}`} alt="" key={index} />
              })}
            </div>
            {!isMobile && (
              <div className="w-full py-10">
                <NoSsr>
                  <AppDropdown
                    options={['English', '繁體中文']}
                    value={i18n.language === 'en-US' ? 'English' : '繁體中文'}
                    theme="dark"
                    onChange={(lang) => onTranslate(lang)}
                  />
                </NoSsr>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-start items-start p-5 mt-11 border-t-[1px] border-light-brown/[.2]">
          <p className="text-xs leading-[17px] tracking-wider text-white">© Copyright 香港玄學及身心靈研習社 . All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
