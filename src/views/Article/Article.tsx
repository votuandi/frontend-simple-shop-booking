import * as React from 'react'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { formatDate, gotoPage } from '@/utils/helpers/common'
import { useRouter } from 'next/router'
import {
  IGetListArticleBannerResponse,
  IGetListArticleCategoryResponse,
  IGetListArticleResponse,
  IGetListHotTopicResponse,
  IGetListPopularArticleResponse,
} from '@/utils/api/article'
import articleApi from '@/utils/api/article/article.api'
import AppArticleBanner from '@/components/AppArticleBanner/AppArticleBanner'
import parse from 'html-react-parser'
import AppPagination from '@/components/AppPagination'
import Slider from 'react-slick'

export interface IAppProps {}

export default function Article(props: IAppProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { locale } = router

  const FILTER_SLIDER_SETTINGS = {
    className: 'slider variable-width',
    dots: false,
    infinite: false,
    centerMode: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    arrows: false,
  }

  const [articleBanner, setArticleBanner] = useState<IGetListArticleBannerResponse>([])
  const [articleCategories, setArticleCategories] = useState<IGetListArticleCategoryResponse>([])
  const [listArticle, setListArticle] = useState<IGetListArticleResponse>([])
  const [listPopularArticle, setListPopularArticle] = useState<IGetListPopularArticleResponse>([])
  const [listHotTopic, setListHotTopic] = useState<IGetListHotTopicResponse>([])
  const [firstFetch, setFirstFetch] = useState<boolean>(true)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [selectedCategory, setSelectedCategory] = useState<number | string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalArticle, setTotalArticle] = useState<number>(0)
  const [isMobile, setIfMobile] = useState<boolean>(false)

  //call API
  let getArticleBanners = async () => {
    try {
      let res = await articleApi.getListArticleBanner({
        params: {
          language: locale!.replace('-', '_'),
          limit: 10,
        },
      })
      setArticleBanner(res.data.params)
    } catch (e) {
      console.log(e)
    }
  }

  let getArticleCategories = async () => {
    try {
      let res = await articleApi.getListArticleCategory({
        params: {
          language: locale!.replace('-', '_'),
          limit: 10,
        },
      })
      setArticleCategories(res.data.params)
    } catch (e) {
      console.log(e)
    }
  }

  let getPopularArticle = async () => {
    try {
      let res = await articleApi.getListPopularArticle({
        params: {
          language: locale!.replace('-', '_'),
          limit: 10,
          page: 1,
        },
      })
      setListPopularArticle(res.data.params.items)
    } catch (e) {
      console.log(e)
    }
  }

  let getListHotTopic = async () => {
    try {
      let res = await articleApi.getListHotTopic({
        params: {
          language: locale!.replace('-', '_'),
          limit: 10,
          page: 1,
        },
      })
      setListHotTopic(res.data.params.items)
    } catch (e) {
      console.log(e)
    }
  }

  let getListArticle = async () => {
    try {
      let res =
        selectedCategory == null
          ? await articleApi.getListArticle({
              params: {
                language: locale!.replace('-', '_'),
                limit: 10,
                page: currentPage,
              },
            })
          : await articleApi.getListArticleByCategory({
              params: {
                language: locale!.replace('-', '_'),
                limit: 10,
                page: currentPage,
                article_category_id: selectedCategory!,
              },
            })
      setListArticle(res.data.params.items)
      setTotalArticle(res.data.params.total)
    } catch (e) {
      console.log(e)
    }
  }

  let fetchData = async () => {
    await getArticleBanners()
    await getArticleCategories()
    await getListArticle()
    await getPopularArticle()
    await getListHotTopic()
    await setLoading(false)
  }

  let updateCurrentPage = (p: number | null) => {
    if (p != null && p > 0) {
      setCurrentPage(p)
    }
  }

  let selectCategory = (index: number | string | null) => {
    setSelectedCategory(index)
  }

  let gotoDetail = (articleId: string | number) => {
    gotoPage('/article-detail', `?id=${articleId}`)
  }

  let listenResizeWindows = () => {
    setIfMobile(window.innerWidth < 1400)
  }

  useEffect(() => {
    window.addEventListener('resize', listenResizeWindows)
    listenResizeWindows()
    fetchData()
  }, [])

  useEffect(() => {
    if (!firstFetch) fetchData()
    setFirstFetch(false)
  }, [locale, currentPage])

  useEffect(() => {
    if (!firstFetch) getListArticle()
  }, [selectedCategory])

  return (
    <>
      {isLoading ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="relative w-screen h-full pt-[72px] pc:pt-[110px] pc:pb-[150px] flex flex-col items-center justify-start bg-background-01">
          <div className="w-full pc:w-[1400px] h-fit flex flex-col py-0 pc:py-10">
            <AppArticleBanner banners={articleBanner} />
            {isMobile ? (
              <div className="mt-7 w-full h-fit flex flex-row px-4">
                <button
                  className={`w-fit h-9 px-[10px] py-[6px] rounded-[5px] border-[1px] border-solid border-app-brown text-sm ${
                    selectedCategory == null ? 'bg-app-brown text-white' : 'bg-transparent text-app-brown'
                  } font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-wider'}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  {t('All')!}
                </button>
                <div className="ml-1" style={{ width: `calc(100% - 50px)` }}>
                  <Slider {...FILTER_SLIDER_SETTINGS}>
                    {articleCategories.map((ac, acIndex) => {
                      return (
                        <div className="px-[5px]" key={acIndex}>
                          <button
                            className={`w-fit h-9 whitespace-nowrap px-[10px] py-[6px] rounded-[6px] border-[1px] border-solid border-app-brown text-sm ${
                              selectedCategory === ac.id ? 'bg-app-brown text-white' : 'bg-transparent text-app-brown'
                            } font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-wider'}`}
                            onClick={() => selectCategory(ac.id)}
                          >
                            {ac.name}
                          </button>
                        </div>
                      )
                    })}
                  </Slider>
                </div>
              </div>
            ) : (
              <div className="mt-10 w-full h-fit flex flex-row justify-start items-center flex-wrap px-4 pc:px-0">
                <button
                  className={`w-fit h-fit px-5 py-3 rounded-[6px] border-[1px] border-solid border-app-brown ${
                    selectedCategory == null ? 'bg-app-brown text-white' : 'bg-transparent text-app-brown'
                  } font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-wider'} `}
                  onClick={() => selectCategory(null)}
                >
                  {t('All')}
                </button>
                {articleCategories.map((cate, acIndex) => {
                  return (
                    <button
                      className={`w-fit h-fit px-5 py-3 rounded-[6px] border-[1px] border-solid border-app-brown ml-5 ${
                        selectedCategory === cate.id ? 'bg-app-brown text-white' : 'bg-transparent text-app-brown'
                      } font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-wider'}`}
                      key={acIndex}
                      onClick={() => selectCategory(cate.id)}
                    >
                      {cate.name}
                    </button>
                  )
                })}
              </div>
            )}
            <div className="w-full pc:w-[1400px] h-fit flex flex-row mt-[10px] justify-between flex-wrap">
              <div className="w-full pc:w-[960px] h-fit flex flex-col p-4">
                {listArticle.map((articleItem, aIndex) => {
                  return (
                    <div
                      key={aIndex}
                      onClick={() => gotoDetail(articleItem.id)}
                      className="w-full h-[120px] pc:w-[960px] pc:h-[260px] bg-white rounded-[10px] drop-shadow-md border-[1px] border-black/10 border-solid mt-5 p-3 pc:p-[30px] flex flex-row justify-start items-start cursor-pointer"
                    >
                      <img className="w-24 h-24 pc:w-[260px] pc:h-[200px]" src={articleItem.images[0].path} alt="" />
                      <div className="flex flex-col w-full pc:w-[620px] h-full pc:h-[200px] ml-5 justify-between">
                        <div className="w-full pc:h-[43px] flex flex-col pc:flex-row justify-start items-start">
                          <div className="w-fit pc:h-[43px] pc:border-r-[1px] pc:border-[#EEB545] pc:border-solid pc:pr-[14px]">
                            {isMobile ? (
                              <p
                                className={`font-normal text-xs leading-[17px] text-app-brown font-noto-sans-tc ${
                                  locale === 'zh-HK' && 'tracking-[0.06em]'
                                }`}
                              >
                                {articleItem.published.replaceAll('-', '.')}
                              </p>
                            ) : (
                              <div className="flex flex-col items-center justify-center">
                                <p
                                  className={`font-medium text-xs leading-none text-medium-brown font-noto-sans-tc ${
                                    locale === 'zh-HK' && 'tracking-widest'
                                  }`}
                                >
                                  {articleItem.published.split('-').splice(0, 2).join('.')}
                                </p>
                                <p
                                  className={`font-medium text-[30px] leading-none text-medium-brown font-noto-sans-tc ${
                                    locale === 'zh-HK' && 'tracking-widest'
                                  }`}
                                >
                                  {articleItem.published.split('-')[2]}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="w-full pc:h-[43px]">
                            <p
                              className={`text-ellipsis overflow-hidden font-medium text-base leading-6 pc:text-3xl pc:leading-[43px] text-medium-brown pc:pl-[14px] ${
                                locale === 'zh-HK' && 'tracking-widest'
                              }`}
                            >
                              {articleItem.name}
                            </p>
                          </div>
                        </div>
                        {!isMobile && (
                          <div
                            className={`w-[620px] h-[96px] font-normal text-base leading-[200%] text-app-brown ${
                              locale === 'zh-HK' && 'tracking-widest'
                            }`}
                          >
                            {parse(articleItem.description)}
                          </div>
                        )}
                        <div
                          className={`w-full pc:w-[960px] pc:h-6 justify-start flex flex-row font-normal text-xs leading-4 text-medium-brown pc:text-sm pc:leading-6 pc:text-[#89817A] font-noto-sans-tc ${
                            locale === 'zh-HK' && 'tracking-widest'
                          }`}
                        >
                          <p className="pr-[10px] border-r-[1px] border-solid border-[#89817A]">{articleItem.article_categories.name}</p>
                          <p className="pl-[10px]">{articleItem.author}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div className={`w-full h-fit flex justify-center items-center mt-4 ${locale === 'zh-HK' && 'tracking-widest'}`}>
                  <AppPagination total={totalArticle} current={currentPage} onChange={(p) => updateCurrentPage(p)} bg="bg-background-01" />
                </div>
              </div>
              {!isMobile && (
                <div className="w-[380px] h-fit flex flex-col">
                  <p className={`font-medium text-2xl leading-[35px] text-medium-brown font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-widest'}`}>
                    {t('Popular Articles')}
                  </p>
                  {listPopularArticle.map((item, paIndex) => {
                    return (
                      <div
                        className={`w-[380px] h-fit py-4 flex flex-col cursor-pointer ${
                          paIndex === 0 ? '' : 'border-t-[1px] border-solid border-app-brown/20'
                        }`}
                        key={paIndex}
                        onClick={() => gotoDetail(item.id)}
                      >
                        <p
                          className={`w-full h-8 text-ellipsis overflow-hidden font-normal text-lg leading-[180%] text-app-brown font-noto-sans-tc ${
                            locale === 'zh-HK' && 'tracking-widest'
                          }`}
                        >
                          {item.name}
                        </p>
                        <p
                          className={`font-normal text-sm leading-6 text-[#89817A] font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-widest'}`}
                        >{`${item.article_categories} | ${formatDate(item.published)}`}</p>
                      </div>
                    )
                  })}
                  <p className="font-medium text-2xl leading-[35px] tracking-widest text-medium-brown mt-12">{t('Hot Topic')}</p>
                  <div className="w-full h-fit flex flex-row flex-wrap mt-6"></div>
                  {listHotTopic.map((item, htIndex) => {
                    return (
                      <button
                        key={htIndex}
                        onClick={() => gotoDetail(item.id)}
                        className={`px-2 py-1 w-fit h-fit border-app-brown border-solid border rounded-[5px] font-normal text-base leading-[23px] text-app-brown mb-3 mr-3 font-noto-sans-tc ${
                          locale === 'zh-HK' && 'tracking-wider'
                        }`}
                      >
                        {item.name}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
