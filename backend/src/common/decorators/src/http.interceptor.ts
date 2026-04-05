// NestJs imports
import {
  HttpStatus,
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
} from "@nestjs/common";
import { mergeMap } from "rxjs";
import { isEmpty, last } from "lodash";
// Services
import {
  SameUserAgent,
  NodeRSADecryptService,
  ErrorResponseHandlerService,
} from "@src/common/services";

@Injectable()
export class HTTPInterceptor implements NestInterceptor {
  public async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<any> {
    const headers = context.switchToHttp().getRequest().headers;

    const authorization: string | null = headers["authorization"]
      ? last(headers["authorization"].split(" "))
      : null;

    if (
      isEmpty(authorization) ||
      isEmpty(NodeRSADecryptService(authorization))
    ) {
      return next.handle().pipe(
        mergeMap(() => {
          throw new ErrorResponseHandlerService(
            false,
            HttpStatus.UNAUTHORIZED,
            "Client request has not been completed because it lacks of valid authorization for the requested resource.",
          );
        }),
      );
    }

    const decryptedNodeRSAResult = NodeRSADecryptService(authorization);

    console.log("DWADAWDa", decryptedNodeRSAResult);

    const clientUserAgent =
      context.switchToHttp().getRequest()?.useragent?.source ||
      headers["user-agent"];

    const tokenUserAgent = decryptedNodeRSAResult.device.source;

    headers["token-payload"] = decryptedNodeRSAResult.payload;
    delete headers["authorization"];

    const sameUserAgent = SameUserAgent(clientUserAgent, tokenUserAgent);

    if (!sameUserAgent) {
      return next.handle().pipe(
        mergeMap(() => {
          throw new ErrorResponseHandlerService(
            false,
            HttpStatus.UNAUTHORIZED,
            "Session was expired. The request is unauthorized. Please login again.",
          );
        }),
      );
    } else {
      return next.handle();
    }
  }
}
