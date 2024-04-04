import { authAxios, commonAxios } from "@/utils/axios";

import type {
  IGetListMetaphysicalPayload,
  IGetListMetaphysicalResponse
} from "./metaphysical.api.types";
import type { AxiosResponseData } from "@/utils/axios";

const metaphysicalApi = {
  getListMeaPhysical: (payload: IGetListMetaphysicalPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "metaphysicals/getListPagination.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
}

export default metaphysicalApi;
