import { CancelToken } from "axios";
import { type } from "os";

type Payload = {
  cancelToken?: CancelToken;
};

export type IGetHomeBannerCoverPayload = {
  params: {
    language: string
  };
} & Payload;

export type IGetHomeBannerCoverResponse = {
    id: string | number
    path: string
    name: string
    description: string
} 

export type IGetHomeBannersPayload = {
  params: {
    language: string,
    limit: string | number
  };
} & Payload;

export type IGetHomeBannersResponse = IGetHomeBannerResponse[]

export type IGetHomeBannerResponse = {
  id: string | number
  path: string
}

export type IGetHomeVideoPayload = {
  params: {
    language: string
  };
} & Payload;

export type IGetHomeVideoResponse = {
    id: string | number
    link: string
    name: string
    description: string
} 

export type IGetHomeReasonPayload = {
  params: {
    language: string
    limit: string | number
  };
} & Payload;

export type IGetHomeReasonResponse = {
    id: string | number
    path: string
    name: string
    description: string
}[]

export type IGetHomeOfferPayload = {
  params: {
    language: string
    limit: string| number
  };
} & Payload;

export type IGetHomeOfferResponse = {
    id: string | number
    path: string
    link: string
}[]

export type IGetHomeReviewPayload = {
  params: {
    language: string
    limit: string | number
  };
} & Payload;

export type IGetHomeReviewsResponse = IGetHomeReviewResponse[]

export type IGetHomeReviewResponse = {
  id: string | number
  path: string
}