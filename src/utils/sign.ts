import * as ed25519 from "@noble/ed25519";
import { settings } from "./settings";
import CryptoJS from "crypto-js";
import { sha512 } from "@noble/hashes/sha512";
ed25519.etc.sha512Sync = (...m) => sha512(ed25519.etc.concatBytes(...m));

// sha256 two times
export async function sha256TwoTimes(message: string) {
  const hash1 = CryptoJS.SHA256(message);
  const hash2 = CryptoJS.SHA256(hash1);
  const hash2Hex = hash2.toString(CryptoJS.enc.Hex);
  return hash2Hex;
}

// get ed25519 signature
export async function signMessage(message: string, privateKeyHex: string) {
  const hash256 = await sha256TwoTimes(message);
  let signature = await ed25519.sign(hash256, privateKeyHex);
  return ed25519.etc.bytesToHex(signature);
}

// generate normal request sign content
export const generateNormalRequestSignContent = (
  method: string,
  api_nonce: string,
  url: string,
  params?: Record<string, any> | string,
  data?: Record<string, any> | string,
) => {
  const api_path = `/web/v2${url}`;
  return [
    method,
    api_path,
    api_nonce,
    params ? new URLSearchParams(params).toString() : "",
    data ? new URLSearchParams(params).toString() : "",
  ].join("|");
};

// generate get access token sign content
export const generateGetAccessTokenSignContent = (api_nonce: string) => {
  const api_path = "/web/v2/oauth/token";
  const params = {
    client_id: process.env.NEXT_PUBLIC_APPID || "",
    org_id: settings.orgID,
    grant_type: "org_implicit",
  };
  return {
    content: [
      "GET",
      api_path,
      api_nonce,
      new URLSearchParams(params).toString(),
      "",
    ].join("|"),
    params,
  };
};
