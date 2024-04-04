import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import LayoutMain from '@/layouts/Main'

import type { NextPageWithLayout } from '@/pages/_app'
import type { GetStaticProps } from 'next'

const ViewPlateResult = dynamic(() => import('@/views/PlateResult'), {
  suspense: true,
  ssr: false,
})

const PlateResult: NextPageWithLayout = () => {
  return (
    <Suspense fallback="...">
      <ViewPlateResult />
    </Suspense>
  )
}

PlateResult.getLayout = (page) => {
  return <LayoutMain>{page}</LayoutMain>
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '')),
    },
  }
}

export default PlateResult
