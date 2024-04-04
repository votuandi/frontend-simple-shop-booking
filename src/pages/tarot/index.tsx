import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import LayoutMain from '@/layouts/Main'

import type { NextPageWithLayout } from '@/pages/_app'
import type { GetStaticProps } from 'next'

const ViewTarot = dynamic(() => import('@/views/Tarot'), {
  suspense: true,
  ssr: false,
})

const Tarot: NextPageWithLayout = () => {
  return (
    <Suspense fallback="...">
      <ViewTarot />
    </Suspense>
  )
}

Tarot.getLayout = (page) => {
  return <LayoutMain>{page}</LayoutMain>
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '')),
    },
  }
}

export default Tarot
