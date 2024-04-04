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
}

export default function MemberInformation({ isMobile }: IProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { locale, pathname, asPath, query } = router
  const { data: session } = useSession()

  const [userInfo, setUserInfo] = useState<IGetInfoResponse | null>(null)
  const [currentPassword, setCurrentPassword] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [rePassword, setRePassword] = useState<string>('')
  const [currentPasswordType, setCurrentPasswordType] = useState<string>('password')
  const [passwordType, setPasswordType] = useState<string>('password')
  const [rePasswordType, setRePasswordType] = useState<string>('password')
  const [isValidPassword, setIfValidPassword] = useState<boolean>(true)
  const [isValidRePassword, setIfValidRePassword] = useState<boolean>(true)
  const [isLoginSocial, setIfLoginSocial] = useState<boolean>(false)
  const [showAddPhone, setShowAddPhone] = useState<boolean>(false)
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

  let changePassword = async () => {
    try {
      if (isValidPassword && isValidRePassword && password.length > 0) {
        let res = await userApi.changePassword({
          params: {
            token: localStorage.getItem('token') ?? '',
            password_old: currentPassword,
            password_new: password,
          },
        })
        if (res.data.status === 200) {
          alert('Change password successfully!')
          router.reload()
        } else {
          alert(`Failed. ${res.data.message}`)
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

  let handleCurrentPassword = (_password: string) => {
    setCurrentPassword(_password)
  }
  let handlePassword = (_password: string) => {
    if (_password.length < 8 || _password.length > 10) {
      setIfValidPassword(false)
    } else {
      setIfValidPassword(true)
    }
    setPassword(_password)
  }
  let handleRePassword = (_rePassword: string) => {
    if (_rePassword !== password) {
      setIfValidRePassword(false)
    } else {
      setIfValidRePassword(true)
    }
    setRePassword(_rePassword)
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

  //Password display
  let changeCurrentPasswordType = () => {
    setCurrentPasswordType(currentPasswordType === 'password' ? 'text' : 'password')
  }
  let changePasswordType = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password')
  }
  let changeRePasswordType = () => {
    setRePasswordType(rePasswordType === 'password' ? 'text' : 'password')
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
        <div className="w-screen h-fit bg-background-01 py-10 flex flex-col items-center">
          <div className="w-[1400px] h-fit bg-white p-[60px] rounded-[10px] items-center flex flex-col">
            <p className="font-medium text-3xl leading-[43px] tracking-wider text-medium-brown w-full text-start">{t('Member Information')}</p>
            <div className="w-full h-fit flex flex-col mt-12">
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

          <div className="w-[1400px] h-fit bg-white p-[60px] rounded-[10px] items-center flex flex-col mt-[60px]">
            <p className="font-medium text-3xl leading-[43px] tracking-wider text-medium-brown w-full text-start">{t('Change Password')}</p>
            <div className="w-full h-fit flex flex-col mt-12">
              <p className="font-normal text-sm leading-5 tracking-wider text-medium-brown">{t('Current password')}</p>
              <div className="relative w-full">
                <input
                  className={styles.APP_INPUT}
                  type={currentPasswordType}
                  placeholder={t('Please enter the current password')!}
                  onChange={(e) => handleCurrentPassword(e.target.value)}
                  disabled={isLoginSocial}
                />
                <img className="absolute right-0 top-0 cursor-pointer" src="/icon/ic-eye.svg" alt="" onClick={() => changeCurrentPasswordType()} />
              </div>
              <p className="font-normal text-sm leading-5 tracking-wider text-medium-brown mt-6">{t('New password')}</p>
              <div className="relative w-full">
                <input
                  className={isValidPassword ? styles.APP_INPUT : styles.APP_INVALID_INPUT}
                  type={passwordType}
                  placeholder={t('INPUT_PASSWORD')!}
                  onChange={(e) => handlePassword(e.target.value)}
                  disabled={isLoginSocial}
                />
                <img className="absolute right-0 top-0 cursor-pointer" src="/icon/ic-eye.svg" alt="" onClick={() => changePasswordType()} />
              </div>
              <p className="font-normal text-sm leading-5 tracking-wider text-medium-brown mt-6">{t('Confirm new password')}</p>
              <div className="relative w-full">
                <input
                  className={isValidRePassword ? styles.APP_INPUT : styles.APP_INVALID_INPUT}
                  type={rePasswordType}
                  placeholder={t('INPUT_CONFIRM_PASSWORD')!}
                  onChange={(e) => handleRePassword(e.target.value)}
                  disabled={isLoginSocial}
                />
                <img className="absolute right-0 top-0 cursor-pointer" src="/icon/ic-eye.svg" alt="" onClick={() => changePasswordType()} />
              </div>
            </div>
            <button className="w-fit h-fit px-[123px] py-[14px] rounded-[6px] bg-app-brown text-white mt-10" onClick={() => changePassword()}>
              {t('Change')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
