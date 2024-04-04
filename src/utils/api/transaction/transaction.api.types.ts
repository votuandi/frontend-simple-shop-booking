import { CancelToken } from "axios";
import { type } from "os";

type Payload = {
  cancelToken?: CancelToken;
};

export type ICheckCoursePurchaseByMemberPayload = {
  params: {
    course_id: string | number
    token: string
  };
} & Payload;

