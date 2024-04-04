import React from 'react'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

type MainProps = {
  children: React.ReactNode
}

const Main = (props: MainProps) => {
  const { children } = props

  return (
    <div className="flex flex-col w-screen justify-start items-center relative">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Main
