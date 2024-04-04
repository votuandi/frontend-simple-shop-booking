import * as styles from '@/utils/constants/classStyle.constant'
import React from 'react'
import { useTranslation } from 'next-i18next'
import { signIn } from 'next-auth/react'
import { CLIENT_ID, CLIENT_SECRET, FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, NEXTAUTH_SECRET } from '@/utils/configs/googleService'

type IProps = {
  onLoginSuccess: Function
}
type IResponse = {
  isSuccess: boolean
  res: any
}

export default function AppOAuthen({ onLoginSuccess }: IProps) {
  console.log(CLIENT_ID)
  const { t } = useTranslation()
  return (
    <div className="w-full h-full flex flex-col relative">
      <button className={`${styles.BUTTON.FACEBOOK}`} onClick={() => signIn('facebook')}>
        <img className="w-8 h-8" src="/icon/ic-login-fb.svg" alt="" />
        <span className={`${styles.BUTTON.TEXT_INSIDE} text-white`}>{t('Continue with Facebook')}</span>
      </button>
      <button className={`${styles.BUTTON.GOOGLE} mt-5`} onClick={() => signIn('google')}>
        <img className="w-8 h-8" src="/icon/ic-login-google.svg" alt="" />
        <span className={`${styles.BUTTON.TEXT_INSIDE} text-medium-brown`}>{t('Continue with Google')}</span>
      </button>
    </div>
  )
}
