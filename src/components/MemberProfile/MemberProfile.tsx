import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import * as styles from '@/utils/constants/classStyle.constant'
import { useSession } from 'next-auth/react'
import AppLabel from '../AppLabel'
import { authApi } from '@/utils/api'
import userApi from '@/utils/api/user/user.api'
import { useRouter } from 'next/router'
import { IGetInfoResponse, IUpdateInfoPayload } from '@/utils/api/user'

type IProps = {
  isMobile: boolean
  onClose: Function
}

export default function MemberProfile({ isMobile, onClose }: IProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { locale, pathname, asPath, query } = router
  const { data: session } = useSession()

  const [userInfo, setUserInfo] = useState<IGetInfoResponse | null>(null)
  const [isLoginSocial, setIfLoginSocial] = useState<boolean>(false)
  const [isValidPhone, setIfValidPhone] = useState<boolean>(true)
  const [areaCode, setAreaCode] = useState<string>('+852')
  const [verificationCode, setVerificationCode] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [otp, setOtp] = useState<string>('')
  const [newName, setNewName] = useState<string>('')
  const [firstFetch, setFirstFetch] = useState<boolean>(true)
  const [isLoading, setLoading] = useState<boolean>(true)

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
      setNewName(res.data.params.name ?? '')
      setPhone(res.data.params.phone ?? '')
      setAreaCode(res.data.params.area_code ?? '')
    } catch (e) {
      console.log(e)
    }
  }

  let updateUserInfo = async () => {
    try {
      if (newName === userInfo?.name && phone === userInfo.phone) {
        return
      }
      if (
        phone !== userInfo?.phone &&
        (areaCode.length === 0 || phone.length === 0 || otp.length === 0) &&
        (areaCode.length > 0 || phone.length > 0 || verificationCode.length > 0)
      ) {
        alert(t('Invalid phone number or OTP')!)
        return
      } else {
        if (otp.length > 0 && otp !== verificationCode) {
          alert('Invalid verification code!')
          return
        }
        let _params: any = {
          language: locale!.replace('-', '_'),
          token: localStorage.getItem('token') ?? '',
          name: newName,
        }
        if (phone !== userInfo?.phone && otp.length > 0) {
          _params['area_code'] = areaCode
          _params['phone'] = phone
          _params['code'] = otp
        }
        let res = await userApi.updateUserInfo({
          params: { ..._params },
        })
        if (res.status === 200 && res.data.message === 'data_is_updated') {
          alert('Update data successfully!')
          router.reload()
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  let fetchData = async () => {
    await getUserInfo()

    setLoading(false)
  }

  //validate
  let handlePhone = (_phone: string) => {
    if (isNaN(+_phone)) {
      setIfValidPhone(false)
    } else {
      setIfValidPhone(true)
      setPhone(_phone)
    }
  }

  let sendOTP = async () => {
    if (phone.length < 6) {
      setIfValidPhone(false)
    } else
      try {
        let res = await authApi.sendOtpSms({
          params: {
            area_code: areaCode,
            phone: phone,
            verification_type: 2,
          },
        })
        if (res.status === 200) {
          setOtp(res.data.params.verify_code)
          if (res.data.status === 999) {
            setIfValidPhone(false)
            alert('Failed! Please check you phone number')
          }
        }
      } catch (e) {
        console.log(e)
      }
  }

  useEffect(() => {
    if (!firstFetch) fetchData()
    setFirstFetch(false)
  }, [locale])

  useEffect(() => {
    if (session) setIfLoginSocial(true)
    else setIfLoginSocial(false)

    fetchData()
  }, [])

  return (
    <div>
      {isLoading ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="w-screen h-screen bg-white flex flex-col fixed top-0 left-0 z-50 items-center">
          <div className="w-full h-[58px] py-4 border-b-[1px] border-[#eeeeee] border-solid drop-shadow-sm flex flex-row px-6 items-center justify-center relative">
            <img className="w-6 h-6 absolute left-4 top-4" src="/icon/ic-arrow-back-brown.svg" alt="" onClick={() => onClose()} />
            <p className="font-medium text-lg leading-[26px] text-center tracking-widest text-medium-brown text-ellipsis whitespace-nowrap overflow-hidden px-4">
              {t('Member Profile')}
            </p>
          </div>
          <div className="w-full h-fit flex flex-col p-4">
            <p className="font-normal text-sm leading-5 tracking-wider text-medium-brown">{t('Name')}</p>
            <input className={styles.APP_INPUT} type="text" placeholder={newName} onChange={(e) => setNewName(e.target.value)} />
            <p className="font-normal text-sm leading-5 tracking-wider text-medium-brown mt-6">{t('email')}</p>
            <input className={styles.APP_INPUT} type="text" placeholder={userInfo?.email ?? ''} disabled />
            <div className="flex flex-col">
              <div className={`${styles.DIV.TAB_FORM_FIELD} mt-5`}>
                <AppLabel text={t('Phone number')} />
                <div className="flex flex-row w-full">
                  <div className="w-[100px] mr-2">
                    <input className={styles.APP_INPUT} type="text" placeholder={areaCode} onChange={(e) => setAreaCode(e.target.value)} />
                  </div>
                  <div className="w-full">
                    <input
                      className={isValidPhone ? styles.APP_INPUT : styles.APP_INVALID_INPUT}
                      type="string"
                      placeholder={phone}
                      onChange={(e) => handlePhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className={`${styles.DIV.TAB_FORM_FIELD} mt-5`}>
                <AppLabel text={t('Verification code')} />
                <div className="relative w-full">
                  <input
                    className={styles.APP_INPUT}
                    type="text"
                    placeholder={t('Please enter')!}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  <img className="absolute right-0 top-0 cursor-pointer" src="/icon/ic-send.svg" alt="" onClick={() => sendOTP()} />
                </div>
              </div>
            </div>
          </div>
          <button className="w-fit h-fit px-[123px] py-[14px] rounded-[6px] bg-app-brown text-white mt-10" onClick={() => updateUserInfo()}>
            {t('Change')}
          </button>
        </div>
      )}
    </div>
  )
}
