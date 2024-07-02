import CryptoJS from "crypto-js";

export const decrypt = (encryptStr: string): string => {
  if (!encryptStr) return "";
  const hetKey = CryptoJS.enc.Hex.parse(
    "eb6fd3c8b95f36a2b520836deb5d1ffed63c6be215a92ef56fd9fbeebc40a250",
  );
  const iv = CryptoJS.enc.Hex.parse("885d3816d89de7a59965e12c3e31ca09");
  const encryptedHexStr = CryptoJS.enc.Hex.parse(encryptStr);
  const src = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decrypt = CryptoJS.AES.decrypt(src, hetKey, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypt.toString(CryptoJS.enc.Utf8).toString();
};
export const getRouteQueryValue = (value: string | string[] | undefined) => {
  if (value) {
    return typeof value === "string" ? value : value?.[0];
  }
  return "";
};

export function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );
  return JSON.parse(jsonPayload);
}

// export async function getPublicKey(kid: string) {
//   const key = await client.getSigningKey(kid);
//   const signingKey = key.getPublicKey();
//   return signingKey;
// }
