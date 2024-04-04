import { CancelToken } from "axios";
import { type } from "os";

type Payload = {
  cancelToken?: CancelToken;
};

export type IGetInfoPayload = {
  params: {
    language: string
    token: string
  };
} & Payload;

export type IGetInfoResponse = {
  avatar: string | null
  name: string
  email: string
  area_code: string | null
  phone: string | null
  is_orders: boolean
}

export type IUpdateInfoPayload = {
  params: {
    language: string
    token: string
    name: string
    area_code?: string
    phone?: string
    code?: string
  };
} & Payload;

export type IUpdateInfoResponse = {
  params: {
    member: {
      id: string | number
      phone: string
      google: string | null
      facebook: string | null
      name: string
      email: string
      is_orders: boolean
      area_code: string
    }
  }
}

export type IChangePasswordPayload = {
  params: {
    token: string
    password_old: string
    password_new: string
  };
} & Payload;

export type IGetRegionPayload = {
  params: {
    language: string
  };
} & Payload;

export type IGetDistrictPayload = {
  params: {
    language: string
    region_id: string
  };
} & Payload;

export type IShippingAddressItem = {
  region_id: number
  region_name: string
  district_id: number
  district_name: string
  is_default: boolean
  delivery_address: string
  unit: string
}

export type IGetShippingAddressInfoPayload = {
  params: {
    language: string
    token: string
  };
} & Payload;

export type IGetShippingAddressInfoResponse = IShippingAddressItem[]

export type IUpdateShippingAddressInfoPayload = {
  params: {
    language: string
    token: string
    delivery_address: string
  };
} & Payload;

export type IGetOderHistoryPayload = {
  params: {
    language: string
    token: string
    limit: string | number
    page: string | number
  };
} & Payload;

export type IGetOderHistoryResponse = {
  total: number
  items: IOderHistoryItem[]
}

export type IOderHistoryItem = {
  id: number
  transaction_number: string
  transaction_date: string | null
  status: string
  total: string
  courses: IOderCourseItem[]
}

export type IOderCourseItem = {
  id: number
  code: string
  name: string
  start_time: string
  end_time: string
  price: string
  discount_price: string
}

export type IGetNotifyPayload = {
  params: {
    language: string
    token: string
    limit: string | number
    page: string | number
  };
} & Payload;

export type IGetNotifyResponse = {
  items: INotifyItem[]
  total: number
}

export type INotifyItem = {
  id: number
  status: string
  created: string
  name: string
  description: string
}

export type IGetFashSaleTimePayload = {
  params: {
    token: string
  }
} & Payload;

export type IGetFashSaleTimeResponse = {
  hour: number
  minute: number
  second: number
  hour_minute_second: string
}