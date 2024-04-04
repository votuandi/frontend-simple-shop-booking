import { CancelToken } from "axios";
import { type } from "os";

type Payload = {
  cancelToken?: CancelToken;
};

export type IGetListTutorPayload = {
  params: {
    language: string
    limit: string | number
    page: string | number
  };
} & Payload;

export type IGetListTutorResponse = {
    total: number
    items: ITutorItem[]
} 

export type ITutorItem = {
  id: string | number
  path: string
  name: string
  description: string
}