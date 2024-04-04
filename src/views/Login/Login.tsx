import { useTranslation } from 'next-i18next'
import Login from '@/components/Login'
import { gotoPage } from '@/utils/helpers/common'
import { useEffect } from 'react'

export default function LoginView() {
  const { t } = useTranslation()

  useEffect(() => {
    if (localStorage.getItem('token')) {
      gotoPage('/')
    }
  }, [])

  return (
    <div className="relative h-fit min-h-screen pt-14 flex flex-col items-center justify-start bg-background-01">
      <Login gotoRegister={() => gotoPage('/register')} onLoginSuccess={() => gotoPage('/')} onGotoForgotPw={() => gotoPage('/forgot-password')} />
    </div>
  )
}
