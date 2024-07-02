import { baseRequest, RequestOptions } from "./base";
import { settings, setSetting } from "@/utils";

import * as ed25519 from "@noble/ed25519";
import CryptoJS from "crypto-js";
import { sha512 } from "@noble/hashes/sha512";

ed25519.etc.sha512Sync = (...m) => sha512(ed25519.etc.concatBytes(...m));

function beforeRequest(options: RequestOptions) {
  return {
    credentials: "include" as RequestCredentials,
    ...options,
    headers: {
      "BIZ-ORG-ID": settings.orgID,
      ...(options.headers || {}),
    },
  };
}

export const request = async (
  url: string,
  options: RequestOptions = {},
): Promise<any> => {
  let data: any = await baseRequest(url, options, {
    beforeRequest,
  });

  return data.result;
};

// get sign content
export const getSignContent = (api_nonce: string) => {
  const api_path = "web/v2/oauth/token";
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

// sha256 two times
async function sha256TwoTimes(message: string) {
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

// get access token from server
export const getAccessToken = async () => {
  if (
    !process.env.NEXT_PUBLIC_PRIVATE_API_KEY ||
    !process.env.NEXT_PUBLIC_API_KEY
  ) {
    return;
  }

  const timestamp = new Date().getTime().toString();

  setSetting("timestamp", timestamp);

  const { content, params } = getSignContent(timestamp);

  const signature = await signMessage(
    content,
    process.env.NEXT_PUBLIC_PRIVATE_API_KEY || "",
  );

  const url = "/oauth/token";

  const options = {
    method: "GET",
    credentials: "include" as RequestCredentials,
    headers: {
      "biz-api-key": process.env.NEXT_PUBLIC_API_KEY,
      "biz-api-nonce": timestamp,
      "biz-api-signature": signature,
    },
    params,
  };

  const data = await baseRequest(url, options);
  console.log(data);
  // setSetting("accessToken", data.accessToken);
  // return data.accessToken;
};
