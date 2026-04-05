// Next Imports
import { HTTP_METHOD } from "next/dist/server/web/http";

export class ErrorResponseHandlerService extends Error {
  public status: number;
  public url: string;
  public method: HTTP_METHOD;

  constructor(
    status: number,
    method: HTTP_METHOD,
    message: string,
    url: string,
  ) {
    super(message);
    ((this.status = status), (this.url = url), (this.method = method));
  }
}
