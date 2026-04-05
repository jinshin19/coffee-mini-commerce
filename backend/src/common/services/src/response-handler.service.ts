// NestJs Imports
import { HttpStatus } from "@nestjs/common";

export const ResponseHandlerService = ({
  success,
  httpCode,
  message,
  data,
  error,
}: ResponseHandlerServiceParamsI): ResponseHandlerServiceParamsI => {
  return {
    success,
    httpCode,
    message,
    data,
    error,
  };
};

export interface ResponseHandlerServiceParamsI {
  success: boolean;
  httpCode: HttpStatus;
  message?: string;
  data?: any;
  error?: any;
}
