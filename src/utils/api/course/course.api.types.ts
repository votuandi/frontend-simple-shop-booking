import { CancelToken } from "axios";
import { type } from "os";

type Payload = {
  cancelToken?: CancelToken;
};

export type ICoursePayload = {
  params: {
    language: string
    limit: string | number
    page: string | number
  };
} & Payload;

export type IListCourseResponse = {
    total: number
    items: ICourseItem[]
} 

export type ICourseItem = {
  id: string | number
  name: string
  description: string
  short_description: string
  images: {path: string}[]
  price: string | number
  sale_price: string | number
  discount_price: string | number
  start_time: string
  end_time: string
  course_categories: ICourseCategory
  course_objects: ICourseObject
  periods: IPeriod[]
}

export type ITutor = {
  id: string | number
  course_id?: string | number
  name: string
  description: string
  path: string
}

export type ICourseCategory = {
  id: string | number
  course_id?: string | number
  name: string
  description: string
}

export type ICourseObject = {
  id: string | number
  course_id: string | number
  name: string
  description: string
}

export type ICourseOutline = {
  id: string | number
  course_id: string | number
  name: string
  description: string
}

export type IPeriod = {
  id: string | number
  course_id: string | number
  type: number
  period_level: number
  name: string
  description: string
  period_details: IPeriodDetail[]
}

export type IPeriodDetail = {
  id: string | number
  video_url: string
  time_of_length_video: string
  title: string
}

export type ICourseDetailPayload = {
  params: {
  id: string | number
  language: string,
}
} & Payload

export type ICourseDetail  = {
  id: string | number
  maximum_number_of_student: number
  number_student_register_of_course: number
  name: string
  description: string
  short_description: string
  images: {path: string}[]
  price: string | number
  sale_price: string | number
  discount_price: string | number
  start_time: string
  end_time: string
  course_categories: ICourseCategory
  course_objects: ICourseObject
  course_outlines: ICourseOutline
  tutors: ITutor[]
  periods: IPeriod[]
  course_textbook_downloads: ICourseTextbookDownload
  course_witnesses: ICourseWitnesses
}

export type ICourseTextbookDownload = {
  id: string | number
  course_id: string | number
  name: string
  description: string
  files: {path: string, file_name: string}[]
}

export type ICourseWitnesses = {
  id: string | number
  course_id: string | number
  images: {path: string}[]
}
export type IGetListCategory = {
  params: {
    language: string
  };
} & Payload;

export type IGetListItem = {
  id: number
  name:string
  description:string
}

export type IGetListCourseByIdsPayload = {
  params: {
    language: string
    course_ids: string
    token: string
    limit: string | number
    page: string | number
}} & Payload;

export type IGetListCourseNamePayload = {
  params: {
    language: string
    limit: string | number
    page: string | number
  };
} & Payload;

export type IGetListCourseNameResponse = {
  id: number,
  items: {
    id: number
    name:string
  }[]
}

export type ISearchCoursePayload = {
  params: {
    language: string
    limit: string | number
    page: string | number
    course_name?: string
    tutor_name?: string
    start_time?: string | number
    start_end?: string | number
  };
} & Payload;

export type ISearchCourseResponse = {
  total: number
  items: ICourseItem[]
} 

export type IPaymentPayload = {
  params: {
    language: string
    token: string
    course_ids: string | string[]
  };
} & Payload;

export type IPaymentRResponse = {
  url: string
  id: string
  payment_intent: any
}

export type IGetRegisteredCourseByMemberPayload = {
  params: {
    language: string
    token: string
    limit: string | number
    Page: string | number
  };
} & Payload;

export type IGetRegisteredCourseByMemberAndTypePayload = {
  params: {
    language: string
    token: string
    limit: string | number
    Page: string | number
    type: string | number
  };
} & Payload;

export type IGetRegisteredCourseByMemberResponse = {
  total: number
  items: IGetRegisteredCourseByMemberItem[]
}

export type IGetRegisteredCourseByMemberItem = {
  id: number | string
  name: string
  code: string
  transaction_number: string
  price: string
  discount_price: string
  sale_price: string
  start_time: string
  end_time: string
  status_course: string
  periods: {
    id: number | string
    type: string
    period_level: number
    start_date: string
  }[]
}