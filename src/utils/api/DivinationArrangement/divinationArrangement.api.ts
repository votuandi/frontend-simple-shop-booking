import { authAxios, commonAxios } from "@/utils/axios";

import type {
    IGetDayByYearMonth,
    IListConvertToPhp,
    ILunarCalendar,
    IYearArrage,
    IGetTimeOfDay
} from "./divinationArrangement.api.type";
import type { AxiosResponseData } from "@/utils/axios";

const divinationArrangementApi = {
  getYearArrage: (payload: IYearArrage) => {
    return commonAxios.get<AxiosResponseData>(
      "divinationArrangements/getRangeYears.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
    }
    );
  },
  getDayByYearMonth: (payload: IGetDayByYearMonth) => {
    return commonAxios.get<AxiosResponseData>(
      "divinationArrangements/getDayByYearMonth.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
    }
    );
  },
  getLunarCalendar :  (payload: ILunarCalendar) => {
    return commonAxios.get<AxiosResponseData>(
      "divinationArrangements/getLunarCalendar.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
    }
    );
  },
  getListConvertToPhp :  (payload: IListConvertToPhp) => {
    return commonAxios.get<AxiosResponseData>(
      "divinationArrangements/getListConvertToPhp.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
    }
    );
  },
  getTimeOfDay :  (payload: IGetTimeOfDay) => {
    return commonAxios.get<AxiosResponseData>(
      "divinationArrangements/getTimeOfDay.json",
      {
        params: payload.params,
        cancelToken: payload.cancelToken
    }
    );
  },
}
export default divinationArrangementApi