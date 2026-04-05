// NestJs Imports
import { DateTime } from "luxon";
// Services
import { NodeRSAEncryptService } from "@src/common/services";

export const GenerateAuthorizationToken = async (
  params: TokenPayloadI,
): Promise<{
  generatedXAuthToken: string;
  tokenPayload: IAuthTokenPayloadI;
}> => {
  return new Promise(async (resolve) => {
    try {
      const tokenPayload = {
        account: params.subId,
        role: params.role,
        device: { source: params.userAgent },
        interval: {
          expireAt: DateTime.now().plus({ days: 7 }).toISO(),
        },
      };

      const generatedXAuthToken = NodeRSAEncryptService(tokenPayload);

      resolve({ generatedXAuthToken, tokenPayload: tokenPayload });
    } catch (error) {
      console.log("GenerateAuthorizationToken trycatch", error);
      resolve(null);
    }
  });
};

export interface TokenPayloadI {
  subId: string;
  userAgent: string;
  username: string;
  role: string;
}

export interface IAuthTokenPayloadI {
  account: string;
  role: string;
  device: {
    source: string;
  };
  interval: {
    expireAt: DateTime;
  };
}
