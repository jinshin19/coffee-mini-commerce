import { HttpException, HttpStatus } from "@nestjs/common";

const HTTPMethodsC = ["GET", "POST", "PATCH", "PUT", "DELETE"] as const;

export class ErrorResponseHandlerService extends HttpException {
  public success: boolean;

  constructor(
    success: boolean,
    httpCode: HttpStatus,
    message: string,
    error?: any,
  ) {
    super(
      {
        success,
        message,
        error,
      },
      httpCode,
    );

    this.success = success;
  }
}

export type HTTPMethodT = (typeof HTTPMethodsC)[number];
