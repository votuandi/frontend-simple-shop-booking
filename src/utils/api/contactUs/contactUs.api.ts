import { authAxios, commonAxios } from "@/utils/axios";

import type { IGetListQuestionPayload, IUpdateContactUsPayload } from "./contactUs.api.types";
import type { AxiosResponseData } from "@/utils/axios";

const contactUsApi = {
  getListQuestion: (payload: IGetListQuestionPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "questions/getList.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
  updateContactUs: (payload: IUpdateContactUsPayload) => {
    return commonAxios.post<AxiosResponseData>(
      "contacts/updateContactUs.json",
      payload.params
    );
  },
}

export default contactUsApi;
