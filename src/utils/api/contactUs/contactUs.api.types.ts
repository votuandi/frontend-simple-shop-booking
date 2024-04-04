import { CancelToken } from "axios";
import { type } from "os";

type Payload = {
  cancelToken?: CancelToken;
};

export type IGetListQuestionPayload = {
  params: {
    language: string
    limit: string | number
  };
} & Payload;

export type IGetListQuestionResponse = {
  ask_a_question: IQuestion[]
  course_registration: IQuestion[]
  other: IQuestion[]
}

export type IQuestion = {
  id: string | number
  contact_purpose_id: number
  name: string
  description: string
}

export type IUpdateContactUsPayload = {
  params: {
    question_id: string | number
    contact_name: string
    gender: number
    birthday: string
    contact_number: string
    language: string
  }
} & Payload

export type IUpdateContactUsResponse = {
  id: number
  question_id: number
  contact_name: string
  gender: boolean
  birthday: string
  contact_number: string
  created: string
  modified: string
  created_by: any
}