import { authAxios, commonAxios } from "@/utils/axios";

import type {
  IGetHomeBannerCoverPayload,
  IGetHomeBannerCoverResponse,
  IGetHomeBannersPayload,
  IGetHomeBannersResponse,
  IGetHomeOfferPayload,
  IGetHomeOfferResponse,
  IGetHomeReasonPayload,
  IGetHomeReasonResponse,
  IGetHomeReviewPayload,
  IGetHomeReviewResponse,
  IGetHomeVideoPayload,
  IGetHomeVideoResponse
} from "./home.api.types";
import type { AxiosResponseData } from "@/utils/axios";

const homeApi = {
  getBannerCover: (payload: IGetHomeBannerCoverPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "homeOneImages/getOneItem.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  getBanners: (payload: IGetHomeBannersPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "homeBanners/getList.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  getVideo: (payload: IGetHomeVideoPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "homeVideos/getOneItem.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  getReason: (payload: IGetHomeReasonPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "homeReasons/getList.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  getOffer: (payload: IGetHomeOfferPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "homeBusinessCategories/getList.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  getReview: (payload: IGetHomeReviewPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "homeGuestReviews/getList.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
}

export default homeApi;
