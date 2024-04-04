import { authAxios, commonAxios } from "@/utils/axios";

import type {
  IGetListTutorPayload,
  IGetListTutorResponse
} from "./tutor.api.types";
import type { AxiosResponseData } from "@/utils/axios";

const tutorApi = {
  getListTutor: (payload: IGetListTutorPayload) => {
    return commonAxios.get<AxiosResponseData>(
      "tutors/getListPagination.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
      }
    );
  },
}

export default tutorApi;
