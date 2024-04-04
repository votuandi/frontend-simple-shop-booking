import { CancelToken } from "axios";

type Payload = {
  cancelToken?: CancelToken;
};

export type ILoginByPhone = {
  params: {
    area_code: string
    phone: string
    password: string
  };
} & Payload;
export type ILoginByGoogle = {
  params: {
    google: string
    avatar: string
    name: string
    email: string
  };
} & Payload;
export type IRegisterByPhone = {
  params: {
    name: string;
    code: string;
    area_code: string;
    phone: string;
    email: string;
    password: string;
  };
} & Payload;

export type FetchProfileResponseParams = {
  id: number;
  name: string;
  phone_number: string;
  email: string;
  gender: string;
  kids: {
    id: number;
    name: string;
    avatar: string | null;
    dob: string;
    gender: string;
    nick_name: string;
    relationship: string;
  }[];
};

export type ResetPasswordPayload = {
  params: {
    token_reset: string;
    password: string;
  };
} & Payload;

export type ISendOtpSms = {
  params: {
    area_code: string;
    phone: string;
    verification_type: number;
  };
} & Payload;

export type ILogOut = {
  params: {
    token: string;
  };
} & Payload;

export type ICheckPasswordResetOtp = {
  params: {
    area_code: string;
    phone: string;
    code: string | number;
  };
} & Payload;

export type IChangePassword = {
  params: {
    area_code: string;
    phone: string;
    code: string | number;
    password: string
  };
} & Payload;

