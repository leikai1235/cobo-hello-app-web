import { baseRequest, RequestOptions } from "./base";
import {
  settings,
  setSetting,
  signMessage,
  generateGetAccessTokenSignContent,
  generateNormalRequestSignContent,
} from "@/utils";

export const request = async (
  url: string,
  options: RequestOptions = {},
  needAuth = true,
): Promise<any> => {
  if (!settings.accessToken) {
    return;
  }
  const timestamp = new Date().getTime().toString();
  const content = generateNormalRequestSignContent(
    options.method || "GET",
    timestamp,
    url || "",
    options.params || "",
    options.data || "",
  );

  const signature = await signMessage(
    content,
    process.env.NEXT_PUBLIC_PRIVATE_API_KEY || "",
  );

  const newOptions = {
    ...options,
    headers: !!needAuth
      ? {
          "BIZ-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
          "BIZ-API-NONCE": timestamp,
          "BIZ-API-SIGNATURE": signature,
          AUTHORIZATION: `Bearer ${settings.accessToken}`,
          ...(options.headers || {}),
        }
      : {
          AUTHORIZATION: `Bearer ${settings.accessToken}`,
          ...(options.headers || {}),
        },
  };

  let data: any = await baseRequest(url, newOptions);
  return data.result || data;
};

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

  const { content, params } = generateGetAccessTokenSignContent(timestamp);

  const signature = await signMessage(
    content,
    process.env.NEXT_PUBLIC_PRIVATE_API_KEY || "",
  );

  const url = "/oauth/token";

  const options = {
    method: "GET",
    headers: {
      "BIZ-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
      "BIZ-API-NONCE": timestamp,
      "BIZ-API-SIGNATURE": signature,
    },
    params,
  };
  try {
    const data: any = await baseRequest(url, options);
    if (!!data) {
      const { access_token, refresh_token } = data;
      setSetting("accessToken", access_token);
      setSetting("refreshToken", refresh_token);
      return access_token;
    }
  } catch (error) {
    throw new Error("get access token failed");
  }
};
