import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import * as styles from '@/utils/constants/classStyle.constant'
import { useSession } from 'next-auth/react'
import userApi from '@/utils/api/user/user.api'
import { useRouter } from 'next/router'
import { IGetInfoResponse } from '@/utils/api/user'

type IProps = {
  isMobile: boolean
  onClose: Function
}

export default function ChangePasswordTab({ isMobile, onClose }: IProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { locale } = router
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
  const [firstFetch, setFirstFetch] = useState<boolean>(true)
  const [isLoading, setLoading] = useState<boolean>(true)

  //callApi
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
    setLoading(false)
  }

  //validate
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
        <div className="w-screen h-screen bg-white flex flex-col fixed top-0 left-0 z-50 items-center">
          <div className="w-full h-[58px] py-4 border-b-[1px] border-[#eeeeee] border-solid drop-shadow-sm flex flex-row px-6 items-center justify-center relative">
            <img className="w-6 h-6 absolute left-4 top-4" src="/icon/ic-arrow-back-brown.svg" alt="" onClick={() => onClose()} />
            <p className="font-medium text-lg leading-[26px] text-center tracking-widest text-medium-brown text-ellipsis whitespace-nowrap overflow-hidden px-4">
              {t('Change Password')}
            </p>
          </div>
          <div className="w-full h-fit flex flex-col p-4">
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
