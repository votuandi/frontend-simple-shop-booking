import { authAxios, commonAxios } from "@/utils/axios";

import type {
  ICourseDetailPayload,
  ICoursePayload,
  IGetListCourseByIdsPayload,
  IGetListCategory,
  IGetListCourseNamePayload,
  ISearchCoursePayload,
  IPaymentPayload,
  IGetRegisteredCourseByMemberPayload,
  IGetRegisteredCourseByMemberAndTypePayload
} from "./course.api.types";
import type { AxiosResponseData } from "@/utils/axios";

const courseApi = {
  getListCourse: (payload: ICoursePayload) => {
    return commonAxios.get<AxiosResponseData>(
      "courses/getList.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  getCourseDetail: (payload: ICourseDetailPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "courses/getDetail.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  getList: (payload: IGetListCategory) => {
    return commonAxios.get<AxiosResponseData>(
      "courseCategories/getList.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  getCourseByIds: (payload: IGetListCourseByIdsPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "courses/getListByCourseIds.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    )
  },
  getListCourseName: (payload: IGetListCourseNamePayload) => {
    return commonAxios.get<AxiosResponseData>(
      "courses/getListCourseName.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    )
  },
  searchCourse: (payload: ISearchCoursePayload) => {
    return commonAxios.get<AxiosResponseData>(
      "courses/search.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  payment: (payload: IPaymentPayload) => {
    return commonAxios.post<AxiosResponseData>(
      "transactions/insertOrderDetailPayment.json",
      payload.params
    );
  },
  getListRegisteredCourseByMember: (payload: IGetRegisteredCourseByMemberPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "courses/getListCourseRegisterByMemberId.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  getListRegisteredCourseByMemberAndType: (payload: IGetRegisteredCourseByMemberAndTypePayload) => {
    return commonAxios.get<AxiosResponseData>(
      "courses/getListCourseRegisterByMemberIdAndType.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
}

export default courseApi;
