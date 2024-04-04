import AppButton from '@/components/AppButton/AppButton'
import AppLabel from '@/components/AppLabel/AppLabel'
import AppPopup from '@/components/AppPopup'
import { authApi } from '@/utils/api'
import * as styles from '@/utils/constants/classStyle.constant'
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import AppOAuthen from '../AppOAuthen'
import { gotoPage } from '@/utils/helpers/common'

type IAppProps = {
  gotoRegister: Function
  onLoginSuccess: Function
  onGotoForgotPw: Function
}

export default function Login({ gotoRegister, onLoginSuccess, onGotoForgotPw }: IAppProps) {
  const [passwordType, setPasswordType] = useState<string>('password')
  const [areaCode, setAreaCode] = useState<string>('+852')
  const [phone, setPhone] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showLoading, setShowLoading] = useState<boolean>(false)
  const { t } = useTranslation()
  let changePasswordType = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password')
  }
  let logInByPhone = async () => {
    try {
      showLoadingPopup()
      let res = await authApi.logInByPhone({
        params: {
          area_code: areaCode,
          phone: phone,
          password: password,
        },
      })
      if (res.data.status === 200) {
        await localStorage.setItem('token', res.data.params.token)
        closeLoadingPopup()
        onLoginSuccess()
      } else {
        closeLoadingPopup()
        alert(t('Login failed!'))
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
        <div className={styles.DIV.TAB_FORM_FIELD}>
          <AppLabel text={t('Phone number')} />
          <div className="flex flex-row w-full">
            <div className="w-[100px] mr-2">
              <input className={styles.APP_INPUT} type="text" value={areaCode} onChange={(e) => setAreaCode(e.target.value)} />
            </div>
            <div className="w-full">
              <input className={styles.APP_INPUT} type="text" placeholder={t('Phone number')!} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
        </div>
        <div className={`${styles.DIV.TAB_FORM_FIELD} mt-5`}>
          <AppLabel text={t('Password')} />
          <div className="relative w-full">
            <input className={styles.APP_INPUT} type={passwordType} placeholder={t('Please enter')!} onChange={(e) => setPassword(e.target.value)} />
            <img className="absolute right-0 top-0 cursor-pointer" src="/icon/ic-eye.svg" alt="" onClick={() => changePasswordType()} />
          </div>
        </div>
        <div className="w-full flex flex-row justify-end">
          <p className="text-sm leading-5 tracking-wider text-medium-brown font-noto-sans-tc mt-3 cursor-pointer" onClick={() => onGotoForgotPw()}>
            {t('Forgot password?')}
          </p>
        </div>
        <div className="w-[280px] mt-10">
          <AppButton text={t('Submit')!} onClick={() => logInByPhone()} />
        </div>
        <div className="flex flex-row w-full justify-center mt-6">
          <p className="text-base leading-[23px] text-center tracking-wider text-medium-brown">{t('Not a member yet?')}</p>
          <p className="text-base leading-[23px] text-center tracking-wider text-[#EEB545] ml-2 cursor-pointer" onClick={() => gotoRegister()}>
            {t('Register now')}
          </p>
        </div>
      </div>
      <AppPopup isShow={showLoading} onClose={closeLoadingPopup}>
        <div className={styles.DIV.POPUP_CHILDREN}>
          <p>Logging In...</p>
        </div>
      </AppPopup>
    </div>
  )
}
