import { CancelToken } from "axios";
import { type } from "os";

type Payload = {
  cancelToken?: CancelToken;
};

export type IYearArrage = {
    params: {
        year_from: string
    };
  } & Payload;

export type IGetDayByYearMonth = {
    params: {
        cboYear: string
        cboMonth: string
    };
  } & Payload;
export type ILunarCalendar = {
    params: {
        cboYear: string
        cboMonth: string
        cboDay: string
    };
  } & Payload;

export type ILunarCalendarResponse = {
    year: string 
    month: string
    day: string 
  }
export type IListConvertToPhp = {
    params: {
    cboYear: string | null
    cboMonth :string | null
    cboDay: string | null
    cboHour:string | null
    cboMinute:string | null
    cboSecond:string | null
    cboSec:string | null
};
} & Payload;



export type IGetListCoverToPhpResponse = {
    lblBazi: string
    lblDate: string
    lblDateLunar: string
    lblFu:string
    lblJiqi:string
    mainDivination: IBigSquar
};

export type ISmallSquar = {
    '1': string,
    '2': string,
    '3': string,
    '4': string,
    '5': string,
    '6': string,
    '7': string,
    '8': string,
    '9': string,
}

export type IBigSquar = {
    '1': ISmallSquar,
    '2': ISmallSquar,
    '3': ISmallSquar,
    '4': ISmallSquar,
    '5': ISmallSquar,
    '6': ISmallSquar,
    '7': ISmallSquar,
    '8': ISmallSquar,
    '9': ISmallSquar,
}
export type IGetTimeOfDay = {
  params: {
    language: string 
};
} & Payload;

export type IGetTimeOfDayItem = {
  '23_1': string
  '1_3': string
  '3_5': string
  '5_7': string
  '7_9': string
  '9_11': string
  '11_13': string
  '13_15': string
  '15_17': string
  '17_19': string
  '19_21': string
  '21_23': string
}