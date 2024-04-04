import { useTranslation } from 'next-i18next'
import { gotoPage } from '@/utils/helpers/common'
import { useEffect } from 'react'
import Register from '@/components/Register/Register'

export default function RegisterView() {
  const { t } = useTranslation()

  useEffect(() => {
    if (localStorage.getItem('token')) {
      gotoPage('/')
    }
  }, [])

  return (
    <div className="relative h-fit min-h-screen pt-14 flex flex-col items-center justify-start bg-background-01">
      <Register gotoLogin={() => gotoPage('/login')} />
    </div>
  )
}
