import { CancelToken } from "axios";
import { type } from "os";

type Payload = {
  cancelToken?: CancelToken;
};

export type IGetListArticleBannerPayload = {
  params: {
    language: string
    limit: string | number
  };
} & Payload;

export type IGetListArticleBannerResponse = IArticleBannerResponseItem[]

export type IArticleBannerResponseItem = {
  id: string | number
  path: string
  name: string
  description: string
}

export type IGetListArticleCategoryPayload = {
  params: {
    language: string
    limit: string | number
  };
} & Payload;

export type IGetListArticleCategoryResponse = IArticleCategoryResponseItem[]

export type IArticleCategoryResponseItem = {
  id: string | number
  name: string
  description: string
}

export type IGetListArticlePayload = {
  params: {
    language: string
    page: string | number
    limit: string | number
  };
} & Payload;

export type IGetListArticleByCategoryPayload = {
  params: {
    language: string
    page: string | number
    limit: string | number
    article_category_id: string | number
  };
} & Payload;

export type IGetListArticleResponse = IArticleItem[] 

export type IArticleItem = {
  id: string | number
  name: string
  description: string
  short_description: string
  images: {path: string}[]
  slug: string
  author: string
  is_hot_articles: boolean
  is_popular_articles: boolean
  published: string
  article_categories: {
    id: string | number
    article_id: string | number
    name: string
    description: string
  }
}

export type IGetListPopularArticlePayload = {
  params: {
    language: string
    page: string | number
    limit: string | number
  };
} & Payload;

export type IGetListPopularArticleResponse = IPopularArticleItem[]

export type IPopularArticleItem = {
  id: string | number
  name: string
  published: string
  article_categories: string
}

export type IGetListHotTopicPayload = {
  params: {
    language: string
    page: string | number
    limit: string | number
  };
} & Payload;

export type IGetListHotTopicResponse = {
  id: string | number
  name: string
}[]

export type IGetArticleDetailPayload = {
  params: {
    language: string
    id: string | number
  };
} & Payload;

export type IGetArticleDetailResponse = {
  id: string | number
  name: string
  description: string
  short_description: string
  images: {path: string}[]
  slug: string
  author: string
  number_of_view: number
  is_hot_articles: boolean
  is_popular_articles: boolean
  published: string
  course_categories: {
    id: string | number
    article_id: string | number
    name: string
    description: string
  }
  articles_relateds: {
    id: string | number
    article_id: string | number
    name: string
    description: string
    short_description: string,
    published: string,
    article_category_name: string
  }[]
}