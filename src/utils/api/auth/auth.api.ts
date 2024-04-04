import { authAxios, commonAxios } from "@/utils/axios";

import type {
  ILoginByPhone,
  IRegisterByPhone,
  ISendOtpSms,
  ICheckPasswordResetOtp,
  IChangePassword,
  ILogOut,
  ILoginByGoogle,
} from "./auth.api.types";
import type { AxiosResponseData } from "@/utils/axios";

const authApi = {
  logInByPhone: (payload: ILoginByPhone) => {
    return commonAxios.post<AxiosResponseData>(
      "members/login.json",
      payload.params
    );
  },
  logInByGoogle: (payload: ILoginByGoogle) => {
    return commonAxios.post<AxiosResponseData>(
      "members/login.json",
      payload.params
    );
  },
  registerByPhone: (payload: IRegisterByPhone) => {
    return commonAxios.post<AxiosResponseData>(
      "members/register.json",
      payload.params
    );
  },
  sendOtpSms: (payload: ISendOtpSms) => {
    return commonAxios.post<AxiosResponseData>(
      "members/sendSmsVerificationCode.json",
      payload.params,
      {
        cancelToken: payload.cancelToken,
      }
    );
  },
  logOut: (payload: ILogOut) => {
    return commonAxios.post<AxiosResponseData>(
      "members/logout.json",
      payload.params,
      {
        cancelToken: payload.cancelToken,
      }
    );
  },
  checkPasswordResetOtp: (payload: ICheckPasswordResetOtp) => {
    return commonAxios.post<AxiosResponseData>(
      "members/checkSmsForgotCode.json",
      payload.params,
      {
        cancelToken: payload.cancelToken,
      }
    );
  },
  changePassword: (payload: IChangePassword) => {
    return commonAxios.post<AxiosResponseData>(
      "members/changePassword.json",
      payload.params,
      {
        cancelToken: payload.cancelToken,
      }
    );
  },
};

export default authApi;
