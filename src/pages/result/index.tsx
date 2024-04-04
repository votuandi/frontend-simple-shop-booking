import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import LayoutMain from '@/layouts/Main'

import type { NextPageWithLayout } from '@/pages/_app'
import type { GetStaticProps } from 'next'

const ViewResult = dynamic(() => import('@/views/Result'), {
  suspense: true,
  ssr: false,
})

const Result: NextPageWithLayout = () => {
  return (
    <Suspense fallback="...">
      <ViewResult />
    </Suspense>
  )
}

Result.getLayout = (page) => {
  return <LayoutMain>{page}</LayoutMain>
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '')),
    },
  }
}

export default Result
