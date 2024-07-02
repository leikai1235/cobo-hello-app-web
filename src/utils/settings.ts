const store = typeof window !== "undefined" ? window.localStorage : null;
export interface ISettings {
  orgID: string;
  timestamp: string;
  accessToken: string;
  refreshToken: string;
}

export const settings: ISettings = {
  timestamp: store?.getItem("timestamp") || "",
  orgID: store?.getItem("orgID") || "",
  accessToken: store?.getItem("accessToken") || "",
  refreshToken: store?.getItem("refreshToken") || "",
};

export const setSetting = (k: keyof ISettings, v: any) => {
  settings[k] = v;
  store?.setItem(k, v);
};
