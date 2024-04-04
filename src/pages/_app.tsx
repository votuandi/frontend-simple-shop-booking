import '@/styles/globals.css'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { TssCacheProvider } from 'tss-react'
import { createEmotionCache, createTssEmotionCache } from '@/utils/emotion'
import { UseTranslationResponse } from 'react-i18next'
import { useTranslation } from 'react-i18next'
import { appWithTranslation } from 'next-i18next'
import nextI18NextConfig from '@@/next-i18next.config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { commonConfig } from '@/utils/configs'
import { DefaultSeo } from 'next-seo'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { SessionProvider } from 'next-auth/react'
import 'slick-carousel/slick/slick.css' //here
import 'slick-carousel/slick/slick-theme.css'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (
    page: ReactElement,
    pageProps: P,
    appProps: {
      translation: UseTranslationResponse<'common'>
    }
  ) => ReactNode
}

interface MyAppProps extends AppProps {
  Component: NextPageWithLayout
  emotionCache?: EmotionCache
  tssEmotionCache?: EmotionCache
}

const clientSideEmotionCache = createEmotionCache()
const tssClientSideEmotionCache = createTssEmotionCache()

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    tssEmotionCache = tssClientSideEmotionCache,
    pageProps: { session, ...pageProps },
  } = props
  const headerLocale =
    ((pageProps?._nextI18Next?.initialLocale || '').replace('-', '_') as string) || nextI18NextConfig.i18n!.defaultLocale.replace('-', '_')
  const getLayout = Component.getLayout ?? ((page) => page)
  const translation = useTranslation()
  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {}, [])

  return (
    <>
      <DefaultSeo
        defaultTitle={commonConfig.DOCUMENT_TITLE}
        titleTemplate={`%s | ${commonConfig.DOCUMENT_TITLE}`}
        openGraph={{
          type: 'website',
          locale: headerLocale,
          // url: "",
          siteName: commonConfig.DOCUMENT_TITLE,
        }}
      />
      <QueryClientProvider client={queryClient}>
        <CacheProvider value={emotionCache}>
          <TssCacheProvider value={tssEmotionCache}>
            <SessionProvider session={session}>
              {getLayout(<Component {...pageProps} />, pageProps, {
                translation,
              })}
            </SessionProvider>
          </TssCacheProvider>
        </CacheProvider>
      </QueryClientProvider>
    </>
  )
}

export default appWithTranslation(MyApp, nextI18NextConfig as any)
