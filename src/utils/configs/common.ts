import nextI18nextConfig from "@@/next-i18next.config";

export const DOCUMENT_TITLE = "web-iMSM";
export const APP_VERSION = "0.0.1";
export const APP_NAME = "app";
export const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
export const DEFAULT_LOCALE = nextI18nextConfig.i18n?.defaultLocale;
export const DEFAULT_GMT = "+08:00";
export const DEFAULT_PHONE_COUNTRY_CODE = "+852";
