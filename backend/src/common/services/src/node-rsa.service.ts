// Packages
import * as NodeRSA from "node-rsa";

export const NodeRSAEncryptService = (data: object | string) => {
  try {
    const key = new NodeRSA();
    key.importKey(process.env.JINSHIN_COFFEE_PUBLIC_KEY, "pkcs8-public-pem");
    const dataType = typeof data === "string" ? data : JSON.stringify(data);
    const encrypted = key.encrypt(dataType, "base64");
    return encrypted;
  } catch (error) {
    console.log("NodeRSAEncryptService error", error);
    return null;
  }
};

export const NodeRSADecryptService = (data: string) => {
  try {
    let decryptedResult;
    const key = new NodeRSA();
    key.importKey(process.env.JINSHIN_COFFEE_PRIVATE_KEY, "pkcs1-pem");
    const decryptedString = key.decrypt(data, "utf8");
    if (
      (decryptedString.startsWith("{") && decryptedString.endsWith("}")) ||
      (decryptedString.startsWith("[") && decryptedString.endsWith("]"))
    ) {
      decryptedResult = JSON.parse(decryptedString);
    } else {
      decryptedResult = decryptedString;
    }
    return decryptedResult;
  } catch (error) {
    console.log("NodeRSADecryptService error", error);
    return null;
  }
};
