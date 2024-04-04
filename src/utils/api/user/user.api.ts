import { authAxios, commonAxios } from "@/utils/axios";

import type {
  IChangePasswordPayload,
  IGetDistrictPayload,
  IGetFashSaleTimePayload,
  IGetInfoPayload,
  IGetInfoResponse,
  IGetNotifyPayload,
  IGetOderHistoryPayload,
  IGetRegionPayload,
  IGetShippingAddressInfoPayload,
  IUpdateInfoPayload,
  IUpdateShippingAddressInfoPayload
} from "./user.api.types";
import type { AxiosResponseData } from "@/utils/axios";

const userApi = {
  getUserInfo: (payload: IGetInfoPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "members/getInfo.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  updateUserInfo: (payload: IUpdateInfoPayload) => {
    return commonAxios.post<AxiosResponseData>(
      "members/updateInfo.json",
      payload.params,

    );
  },
  changePassword: (payload: IChangePasswordPayload) => {
    return commonAxios.post<AxiosResponseData>(
      "members/changePasswordNew.json",
      payload.params,

    );
  },
  getListRegion: (payload: IGetRegionPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "regions/getList.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  getListDistrict: (payload: IGetDistrictPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "districts/getList.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  getListShippingAddress: (payload: IGetShippingAddressInfoPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "members/getShippingAdressInfo.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  updateListShippingAddress: (payload: IUpdateShippingAddressInfoPayload) => {
    return commonAxios.post<AxiosResponseData>(
      "members/updateShippingAddressInfo.json",
      payload.params
    );
  },
  getListOderHistory: (payload: IGetOderHistoryPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "transactions/getList.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  getNotify: (payload: IGetNotifyPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "notifies/getList.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  getFashSaleTime: (payload: IGetFashSaleTimePayload) => {
    return commonAxios.get<AxiosResponseData>(
      "members/getHourMinuteSecondOfCountdown.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
}

export default userApi;
