import AppButton from '@/components/AppButton'
import AppLabel from '@/components/AppLabel'
import AppOAuthen from '@/components/AppOAuthen/AppOAuthen'
import AppPopup from '@/components/AppPopup'
import { authApi } from '@/utils/api'
import * as styles from '@/utils/constants/classStyle.constant'
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { gotoPage } from '@/utils/helpers/common'

type IAppProps = {
  gotoLogin: Function
}

export default function Register({ gotoLogin }: IAppProps) {
  const { t } = useTranslation()
  const [name, setName] = useState<string>('')
  const [areaCode, setAreaCode] = useState<string>('+852')
  const [phone, setPhone] = useState<string>('')
  const [verificationCode, setVerificationCode] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [rePassword, setRePassword] = useState<string>('')
  const [otp, setOtp] = useState<string | null>(null)
  const [passwordType, setPasswordType] = useState<string>('password')
  const [rePasswordType, setRePasswordType] = useState<string>('password')
  const [isValidPhone, setIfValidPhone] = useState<boolean>(true)
  const [isValidPassword, setIfValidPassword] = useState<boolean>(true)
  const [isValidRePassword, setIfValidRePassword] = useState<boolean>(true)
  const [showLoading, setShowLoading] = useState<boolean>(false)

  //validate
  let handlePhone = (_phone: string) => {
    if (isNaN(+_phone)) {
      setIfValidPhone(false)
    } else {
      setIfValidPhone(true)
      setPhone(_phone)
    }
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
  let changePasswordType = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password')
  }
  let changeRePasswordType = () => {
    setRePasswordType(rePasswordType === 'password' ? 'text' : 'password')
  }

  //call API
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
        }
      } catch (e) {
        console.log(e)
      }
  }
  let registerByPhone = async () => {
    showLoadingPopup()
    try {
      let res = await authApi.registerByPhone({
        params: {
          code: otp!,
          area_code: areaCode,
          phone: phone,
          email: email,
          password: password,
          name: name,
        },
      })
      closeLoadingPopup()
      if (res.status === 200) {
        gotoLogin()
      }
    } catch (e) {
      console.log(e)
    }
  }

  //display
  let showLoadingPopup = () => {
    setShowLoading(true)
  }
  let closeLoadingPopup = () => {
    setShowLoading(false)
  }

  useEffect(() => {}, [])
  return (
    <div className={styles.DIV.TAB_VIEW_CONTENT}>
      <AppOAuthen onLoginSuccess={() => gotoPage('/')} />

      <p className="line-between text-[#89817A] py-5">{t('or').toUpperCase()}</p>

      <div className="w-full h-fit flex flex-col items-center">
        <div className={`${styles.DIV.TAB_FORM_FIELD}`}>
          <AppLabel text={t('Your name')} />
          <input className={styles.APP_INPUT} type="text" placeholder={t('Please enter')!} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className={`${styles.DIV.TAB_FORM_FIELD} mt-5`}>
          <AppLabel text={t('Phone number')} />
          <div className="flex flex-row w-full">
            <div className="w-[100px] mr-2">
              <input className={styles.APP_INPUT} type="text" value={areaCode} onChange={(e) => setAreaCode(e.target.value)} />
            </div>
            <div className="w-full">
              <input
                className={isValidPhone ? styles.APP_INPUT : styles.APP_INVALID_INPUT}
                type="string"
                placeholder={t('Phone number') ?? 'Phone number'}
                onChange={(e) => handlePhone(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={`${styles.DIV.TAB_FORM_FIELD} mt-5`}>
          <AppLabel text={t('Verification code')} />
          <div className="relative w-full">
            <input className={styles.APP_INPUT} type="text" placeholder={t('Please enter')!} onChange={(e) => setVerificationCode(e.target.value)} />
            <img className="absolute right-0 top-0 cursor-pointer" src="/icon/ic-send.svg" alt="" onClick={() => sendOTP()} />
          </div>
        </div>

        <div className={`${styles.DIV.TAB_FORM_FIELD} m-5`}>
          <AppLabel text={t('email')} />
          <input className={styles.APP_INPUT} type="text" placeholder="address@mail.com" onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className={`${styles.DIV.TAB_FORM_FIELD} mt-5`}>
          <AppLabel text={t('Password')} />
          <div className="relative w-full">
            <input
              className={isValidPassword ? styles.APP_INPUT : styles.APP_INVALID_INPUT}
              type={passwordType}
              placeholder={t('INPUT_PASSWORD')!}
              onChange={(e) => handlePassword(e.target.value)}
            />
            <img className="absolute right-0 top-0 cursor-pointer" src="/icon/ic-eye.svg" alt="" onClick={() => changePasswordType()} />
          </div>
        </div>

        <div className={`${styles.DIV.TAB_FORM_FIELD} mt-5`}>
          <AppLabel text={t('Confirm password')} />
          <div className="relative w-full">
            <input
              className={isValidRePassword ? styles.APP_INPUT : styles.APP_INVALID_INPUT}
              type={rePasswordType}
              placeholder={t('INPUT_CONFIRM_PASSWORD')!}
              onChange={(e) => handleRePassword(e.target.value)}
            />
            <img className="absolute right-0 top-0 cursor-pointer" src="/icon/ic-eye.svg" alt="" onClick={() => changeRePasswordType()} />
          </div>
        </div>

        <div className="w-[280px] mt-10">
          <AppButton text={t('Submit')!} onClick={() => registerByPhone()} />
        </div>

        <div className="flex flex-row w-full justify-center mt-6">
          <p className="text-base leading-[23px] text-center tracking-wider text-medium-brown">{t('Have an account')}</p>
          <p className="text-base leading-[23px] text-center tracking-wider text-[#EEB545] ml-2 cursor-pointer" onClick={() => gotoLogin()}>
            {t('Login now')}
          </p>
        </div>
      </div>
      <AppPopup isShow={showLoading} onClose={closeLoadingPopup}>
        <div className={styles.DIV.POPUP_CHILDREN}>
          <p>Register...</p>
        </div>
      </AppPopup>
    </div>
  )
}
