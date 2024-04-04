import { authAxios, commonAxios } from "@/utils/axios";

import type {
  IGetArticleDetailPayload,
  IGetListArticleBannerPayload,
  IGetListArticleByCategoryPayload,
  IGetListArticleCategoryPayload,
  IGetListArticlePayload,
  IGetListHotTopicPayload,
  IGetListPopularArticlePayload
} from "./article.api.types";
import type { AxiosResponseData } from "@/utils/axios";

const articleApi = {
  getListArticleBanner: (payload: IGetListArticleBannerPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "articleBanners/getList.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  getListArticleCategory: (payload: IGetListArticleCategoryPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "articleCategories/getList.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  getListArticle: (payload: IGetListArticlePayload) => {
    return commonAxios.get<AxiosResponseData>(
      "articles/getList.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  getListArticleByCategory: (payload: IGetListArticleByCategoryPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "articles/getListByCategoryId.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  getListPopularArticle: (payload: IGetListPopularArticlePayload) => {
    return commonAxios.get<AxiosResponseData>(
      "articles/getListArticleIspopular.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  getListHotTopic: (payload: IGetListHotTopicPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "articles/getListArticleIsHot.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  getArticleDetail: (payload: IGetArticleDetailPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "articles/getDetail.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
}

export default articleApi;
