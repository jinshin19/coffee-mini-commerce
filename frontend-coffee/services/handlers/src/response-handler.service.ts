// Next Imports
import { HTTP_METHOD } from "next/dist/server/web/http";

export const ResponseHandlerService = (
  params: ResponseHandlerParamsI,
): ResponseHandlerI => {
  return {
    success: params.success,
    message: params.message,
    httpCode: params.httpCode,
    data: params?.data,
    error: params.error,
  };
};

export interface ResponseHandlerParamsI {
  success: boolean;
  message?: string;
  httpCode: number;
  data?: any;
  error?: any;
}

export interface ResponseHandlerI {
  success: boolean;
  httpCode: number;
  message?: string;
  data?: any;
  error?: {
    url: string;
    method: HTTP_METHOD;
  };
}
