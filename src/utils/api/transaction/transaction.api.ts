import { authAxios, commonAxios } from "@/utils/axios";

import type {
  ICheckCoursePurchaseByMemberPayload
} from "./transaction.api.types";
import type { AxiosResponseData } from "@/utils/axios";

const transactionApi = {
  checkCoursePurchaseByMember: (payload: ICheckCoursePurchaseByMemberPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "transactions/checkCoursePurchaseByMember.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
}

export default transactionApi;
