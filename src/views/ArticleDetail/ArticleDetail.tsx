import * as React from 'react'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { gotoPage } from '@/utils/helpers/common'
import { useRouter } from 'next/router'
import { IGetArticleDetailResponse, IGetListHotTopicResponse } from '@/utils/api/article'
import articleApi from '@/utils/api/article/article.api'
import parse from 'html-react-parser'

export interface IAppProps {}

export default function Article(props: IAppProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { locale } = router

  const [articleDetail, setArticleDetail] = useState<IGetArticleDetailResponse>()
  const [listHotTopic, setListHotTopic] = useState<IGetListHotTopicResponse>([])
  const [articleId, setArticleId] = useState<number | string | null>(null)
  const [firstFetch, setFirstFetch] = useState<boolean>(true)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [isMobile, setIfMobile] = useState<boolean>(false)
  const [sizeText, setSizeText] = useState<number>(1)

  //call API
  let getArticleDetail = async () => {
    try {
      let res = await articleApi.getArticleDetail({
        params: {
          language: locale!.replace('-', '_'),
          id: articleId!,
        },
      })
      setArticleDetail(res.data.params)
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

  let fetchData = async () => {
    await getArticleDetail()
    await getListHotTopic()
    await setLoading(false)
  }

  let listenResizeWindows = () => {
    setIfMobile(window.innerWidth < 1400)
  }

  let gotoDetail = (articleId: string | number) => {
    gotoPage('/article-detail', `?id=${articleId}`)
  }

  useEffect(() => {
    window.addEventListener('resize', listenResizeWindows)
    listenResizeWindows()
    let urlParams = new URLSearchParams(window.location.search)
    let _articleId = urlParams.get('id')
    setArticleId(_articleId!)
  }, [])

  useEffect(() => {
    if (!firstFetch) fetchData()
    setFirstFetch(false)
  }, [locale])

  useEffect(() => {
    if (articleId) fetchData()
  }, [articleId])

  return (
    <>
      {isLoading ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : isMobile ? (
        <div className="w-screen h-screen fixed z-50 top-0 left-0 bg-white flex flex-col">
          <div className="w-full h-[58px] py-4 border-b-[1px] border-[#eeeeee] border-solid drop-shadow-sm flex flex-row px-6 items-center justify-between">
            <img className="w-6 h-6" src="/icon/ic-arrow-back-brown.svg" alt="" onClick={() => router.back()} />
            <p
              className={`font-medium text-lg leading-[26px] text-center text-medium-brown text-ellipsis whitespace-nowrap overflow-hidden px-4 font-noto-sans-tc ${
                locale === 'zh-HK' && 'tracking-wider'
              }`}
            >
              {articleDetail?.name}
            </p>
            {/* <img className="w-6 h-6" src="/icon/ic-share-brown.svg" alt="" /> */}
          </div>
          <div className="w-full h-full flex flex-col overflow-auto">
            {articleDetail && articleDetail.images!.length > 0 && <img className="w-full h-[200px]" src={articleDetail?.images[0].path} alt="" />}
            <div className="w-full h-fit px-4 pt-5 flex flex-col">
              <p className={`font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-[0.06em]'}`}>{articleDetail?.name}</p>
              <div className="w-full h-fit flex flex-row flex-wraps justify-start items-center mt-5">
                <p className={`font-normal text-sm leading-6 text-app-brown font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-[0.06em]'}`}>
                  {articleDetail?.author}
                </p>
                <img className="w-[18px] h-[18px] ml-8" src="/icon/ic-date.svg" alt="" />
                <p className={`font-normal text-sm leading-6 text-app-brown ml-3 font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-[0.06em]'}`}>
                  {articleDetail?.published}
                </p>
                <img className="w-[18px] h-[18px] ml-8" src="/icon/ic-view.svg" alt="" />
                <p className={`font-normal text-sm leading-6 text-app-brown ml-3 font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-wider'}`}>
                  {articleDetail?.number_of_view}
                </p>
              </div>
              <div className="w-full h-fit mt-3 flex flex-row gap-4 filter-brown-icon items-end  border-b-[1px] border-solid border-[#bfbfbf]/20 pb-4">
                <img className="w-4 h-4" src="/icon/ic-txt_sm.svg" alt="" onClick={() => setSizeText(sizeText > 0 ? sizeText - 1 : 0)} />
                <img className="w-5 h-5" src="/icon/ic-txt_big.svg" alt="" onClick={() => setSizeText(sizeText < 2 ? sizeText + 1 : 2)} />
              </div>
            </div>
            <div className="w-full h-fit flex flex-col py-8 px-4">
              <div
                className={`text-app-brown text-justify ${sizeText === 0 ? 'text-xs' : sizeText === 1 ? 'text-base' : sizeText === 2 && 'text-xl'}`}
              >
                {parse(articleDetail?.description!)}
              </div>
              <div className="w-full h-fit flex flex-col mt-8">
                <p
                  className={`text-app-brown text-justify ${sizeText === 0 ? 'text-xs' : sizeText === 1 ? 'text-base' : sizeText === 2 && 'text-xl'}`}
                >
                  {t('Recommend articles')}
                </p>
                <ul className="list-disc pl-10">
                  {articleDetail?.articles_relateds.map((art, ind) => {
                    return (
                      <li
                        className={`text-[#53B8AA] text-justify mt-3 font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-wider'} ${
                          sizeText === 0 ? 'text-xs' : sizeText === 1 ? 'text-base' : sizeText === 2 && 'text-xl'
                        }`}
                        onClick={() => gotoDetail(art.id)}
                        key={ind}
                      >
                        {art.name}
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div className="w-full h-fit flex flex-row flex-wrap mt-8">
                {listHotTopic.map((item, index) => {
                  return (
                    <button
                      className={`px-2 py-1 w-fit h-fit border-app-brown border-solid border rounded-[5px] font-normal text-base leading-[23px] text-app-brown mb-3 mr-3 font-noto-sans-tc ${
                        locale === 'zh-HK' && 'tracking-[0.06em]'
                      }`}
                      key={index}
                      onClick={() => gotoDetail(item.id)}
                    >
                      {item.name}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-screen h-full pt-[110px] pb-[150px] flex flex-col flex-wrap items-center justify-start bg-background-01">
          <div className="w-[1400px] h-fit flex flex-row mt-10 justify-between flex-wrap">
            <div className="w-[960px] h-fit flex flex-col bg-white rounded-[10px] drop-shadow-md border-[1px] border-black/10 border-solid mt-5 p-[30px]justify-start items-start p-10">
              <div className="w-full h-fit flex flex-row justify-between items-center">
                <div className="flex flex-row justify-between items-center cursor-pointer" onClick={() => router.back()}>
                  <img className="w-6 h-6" src="/icon/ic-arrow-back-brown.svg" alt="" />
                  <p
                    className={`font-medium text-lg leading-[26px] text-app-brown ml-[10px] font-noto-sans-tc ${
                      locale === 'zh-HK' && 'tracking-[0.04em]'
                    }`}
                  >
                    {t('back').toUpperCase()}
                  </p>
                </div>
                <div className="w-fit h-fit justify-between items-center flex flex-row">
                  <img className="w-[30px] h-[30px] mr-8" src="/icon/ic-bookmark-brown.svg" alt="" />
                  {/* <img className="w-[30px] h-[30px]" src="/icon/ic-share-brown.svg" alt="" /> */}
                </div>
              </div>
              <p
                className={`w-full h-fit not-italic font-medium text-3xl leading-[43px] left-[299px] top-[270px] text-medium-brown mt-14 font-noto-sans-tc ${
                  locale === 'zh-HK' && 'tracking-wider'
                }`}
              >
                {articleDetail?.name}
              </p>
              <div className="w-full h-fit flex flex-row justify-between items-center mt-5 pb-3 border-b-[1px] border-[#eeeeee] border-solid">
                <div className="w-fit h-fit flex flex-row items-center">
                  <p className={`font-normal text-sm leading-6 text-[#89817A] font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-[0.06em]'}`}>
                    {articleDetail?.author}
                  </p>
                  <img className="w-[18px] h-[18px] ml-8" src="/icon/ic-date.svg" alt="" />
                  <p className={`font-normal text-sm leading-6 text-[#89817A] ml-3 font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-[0.06em]'}`}>
                    {articleDetail?.published}
                  </p>
                  <img className="w-[18px] h-[18px] ml-8" src="/icon/ic-view.svg" alt="" />
                  <p className={`font-normal text-sm leading-6 text-[#89817A] ml-3 font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-[0.06em]'}`}>
                    {articleDetail?.number_of_view}
                  </p>
                </div>
                <div className="w-fit h-fit flex flex-row items-center">
                  <img
                    className="w-[18px] h-[18px] cursor-pointer"
                    src="/icon/ic-txt_sm.svg"
                    alt=""
                    onClick={() => setSizeText(sizeText > 0 ? sizeText - 1 : 0)}
                  />
                  <img
                    className="w-[18px] h-[18px] ml-4 cursor-pointer"
                    src="/icon/ic-txt_big.svg"
                    alt=""
                    onClick={() => setSizeText(sizeText < 2 ? sizeText + 1 : 2)}
                  />
                </div>
              </div>
              {articleDetail?.images.map((pic, index) => {
                return <img className="w-[880px] h-auto mt-[30px]" src={pic.path} alt="" key={index} />
              })}
              <div
                className={`w-full h-fit mt-5 font-normal leading-[200%] text-app-brown ${
                  sizeText === 0 ? 'text-xs' : sizeText === 1 ? 'text-base' : sizeText === 2 && 'text-xl'
                }`}
              >
                {parse(articleDetail?.description ?? '')}
              </div>
            </div>

            <div className="w-[380px] h-fit flex flex-col">
              <p className={`font-medium text-2xl leading-[35px] text-medium-brown font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-wider'}`}>
                {t('Related Articles')}
              </p>
              {articleDetail?.articles_relateds &&
                articleDetail?.articles_relateds.map((item, index) => {
                  return (
                    <div
                      className={`w-[380px] h-fit py-4 flex flex-col cursor-pointer ${
                        index === 0 ? '' : 'border-t-[1px] border-solid border-app-brown/20'
                      }`}
                      key={index}
                      onClick={() => gotoDetail(item.id)}
                    >
                      <p
                        className={`w-full h-8 text-ellipsis overflow-hidden font-normal text-lg leading-[180%] text-app-brown font-noto-sans-tc ${
                          locale === 'zh-HK' && 'tracking-[0.08em]'
                        }`}
                        onClick={() => gotoDetail(item.id)}
                      >
                        {item.name}
                      </p>
                      <p className="font-normal text-sm leading-6 tracking-[0.06em] text-[#89817A]">{`${item.article_category_name} | ${item.published}`}</p>
                    </div>
                  )
                })}
              <p
                className={`font-medium text-2xl leading-[35px] text-medium-brown mt-12 font-noto-sans-tc ${locale === 'zh-HK' && 'tracking-wider'}`}
              >
                {t('Hot Topic')}
              </p>
              <div className="w-full h-fit flex flex-row flex-wrap mt-6"></div>
              {listHotTopic.map((item, index) => {
                return (
                  <button
                    className={`px-2 py-1 w-fit h-fit border-app-brown border-solid border rounded-[5px] font-normal text-base leading-[23px] text-app-brown mb-3 mr-3 font-noto-sans-tc ${
                      locale === 'zh-HK' && 'tracking-wider'
                    }`}
                    onClick={() => gotoDetail(item.id)}
                    key={index}
                  >
                    {item.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
