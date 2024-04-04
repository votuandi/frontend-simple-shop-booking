import { CancelToken } from "axios";
import { type } from "os";

type Payload = {
  cancelToken?: CancelToken;
};

export type IGetListMetaphysicalPayload = {
  params: {
    language: string
    limit: string | number
    page: string | number
  };
} & Payload;

export type IGetListMetaphysicalResponse = {
    total: number
    items: IMetaphysicalItem[]
}

export type IMetaphysicalItem = {
    id: string | number
    type: string
    path: string | null
    name: string
    description: string
    origin_time: string
    method: string
    purpose: string
    famous_user: string
    founder: string
}