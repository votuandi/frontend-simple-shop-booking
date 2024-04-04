import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import LayoutMain from '@/layouts/Main'

import type { NextPageWithLayout } from '@/pages/_app'
import type { GetStaticProps } from 'next'

const CourseDetailView = dynamic(() => import('@/views/CourseDetail'), {
  suspense: true,
  ssr: false,
})

const Tool: NextPageWithLayout = () => {
  return (
    <Suspense fallback="...">
      <CourseDetailView />
    </Suspense>
  )
}

Tool.getLayout = (page) => {
  return <LayoutMain>{page}</LayoutMain>
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '')),
    },
  }
}

export default Tool
