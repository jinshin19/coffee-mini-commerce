// Packages
import * as NodeRSA from "node-rsa";

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
                    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6f912d9Y8MbeiLtlQD+p
                    blY74A91oRBgIuNkY6LGUA+UANsYaGj/GrlsEubCCvchL3zag+S1GWLAlYkI/mtt
                    e9R0XYgJ9UHBQD0L/9QJHLSQm4H1JNeYupGDrIS+yDiwkM9o9WYVXDMKBF4H6pkM
                    bjIaL8P+rGgski5PN5FjRaSPGO4fNpYsh4XOvMrsK6xSiTbe+AeNBVdmvhebE8x5
                    rDg8OcbDdXdHxmyAdcD2ZX8sbrRwZDFq4sxGCaYH3xr68ZSqQTKpGYrYcfVWtV9+
                    pgNV8Qb+QpPiWeuECvf7bh3Qnz72cjHeLBM60WmsHeo8bSgTsNvAuSdkJ5gmMgWw
                    8wIDAQAB
                    -----END PUBLIC KEY-----`;

const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
                    MIIEpAIBAAKCAQEA6f912d9Y8MbeiLtlQD+pblY74A91oRBgIuNkY6LGUA+UANsY
                    aGj/GrlsEubCCvchL3zag+S1GWLAlYkI/mtte9R0XYgJ9UHBQD0L/9QJHLSQm4H1
                    JNeYupGDrIS+yDiwkM9o9WYVXDMKBF4H6pkMbjIaL8P+rGgski5PN5FjRaSPGO4f
                    NpYsh4XOvMrsK6xSiTbe+AeNBVdmvhebE8x5rDg8OcbDdXdHxmyAdcD2ZX8sbrRw
                    ZDFq4sxGCaYH3xr68ZSqQTKpGYrYcfVWtV9+pgNV8Qb+QpPiWeuECvf7bh3Qnz72
                    cjHeLBM60WmsHeo8bSgTsNvAuSdkJ5gmMgWw8wIDAQABAoIBAQCzDUs8n+8KruHx
                    dpOPiic3yryeQrYbvNATYjSbGR7ufD0gOoZ+vnkWFfRgsjqg8WFvWPZMHmGFP09m
                    HSnIpKNuMa+pMkOMa/hYE15vL+yZDoHovJS80EyJ1ncPN7RUuSxCYrNJtAd8OYHc
                    vacJGHuuhqALFMp3Wm9gnBb5ykJQMpiIWauhnSrYf6lK2md1lthg5NmPThx2Xn0i
                    M9/OeSPTGKkVqfFPBhg5Yhv3oVnwHA30xGovwMkVcQ6myKw0jIrztNMS7HOWGXni
                    2MSAaaVlGr0Rrwa9FqJzDxx4yUYnjtXRiMZRgl9UMJ3rOX8VKHYkt03WQvA6ZG3g
                    GFHjRD+hAoGBAP4YiA+96XTdLQetotK8gZQOUajq4yyiZbDrbfU/n8vP5cWQvWjj
                    pA7+u+nn9WeFB6wKa0gwvIpLSObxb/bAJCjLo6jfUbyKuHXfB4D6y0nADYZsc2Gz
                    e0rzCfH10kFAW1Iv259J8Mlwa/ZL6l3MYykqxNxAI/mi78Cd/87peCktAoGBAOvA
                    X0LE2yD16CJXm1XlhwKPaSZZEE4mPgAQnEh6oUNZ2+1TsBB2TXUFOPFpe4FkeBVJ
                    dnkvIgKuX0Tq4htYTGbc0fQXKnZltjn/pk75YOdKODQ0XjuQw3G4GifXFVsuxpIe
                    IBl/umOpdbgTmZg0C0uhuBZvLrV6dB7ET36IK1afAoGBAOC/8hl6cbTcrafM/ehI
                    tJSw1aoDmU0xl6EVnP0AeedczHAjxmWwdLyOtMgAVCBsmoyh6qK/+QSZ8rHTfKVU
                    7qbm+Ku2XCXYza/0xj5fltB0/4GXC7evea6hqnpKZN8yfZQEoM4UKNcEiXohS/wL
                    fOo82kO2uBtm84n8NvhdqdtBAoGARCRrpIIAEKvjeCG4bYCVoKDRNNtjgiM9ookq
                    kyyW9j+/+P5KksePJfbneagSodjneMeuLeL4wquiL+pwhpTkKItFSHd1t5k4rdT+
                    Pi+I2fGzAyvr3O3AAFvFe6SIsL15efypLJWly27M7vMDX2ITrb3F1v42ExCdBdOa
                    Yql7VWMCgYA5DB3usgfzY3Ta9WxlAh4MBOwBireA0gFpDBAX6vHNTsP2OKULFXyd
                    WMmvVM5FNYuSHksWoR187135DrtnDThFHix9W2/CgU9HjTBYwf6O4FuM1x5AMsti
                    BNa5hOzw1XJRZdmWriuTe2G7aE5/cQdZGfM+JW/O7eJL4d1aFtMcUQ==
                    -----END RSA PRIVATE KEY-----`;

export const NodeRSAEncryptService = (data: object | string) => {
  try {
    const key = new NodeRSA();
    key.importKey(PUBLIC_KEY, "pkcs8-public-pem");
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
    key.importKey(PRIVATE_KEY, "pkcs1-pem");
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
