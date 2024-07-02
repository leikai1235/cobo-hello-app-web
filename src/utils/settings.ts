const store = typeof window !== "undefined" ? window.localStorage : null;
export interface ISettings {
  orgID: string;
  timestamp: string;
  accessToken: string;
}

export const settings: ISettings = {
  timestamp: store?.getItem("timestamp") || "",
  orgID: store?.getItem("orgID") || "",
  accessToken: store?.getItem("accessToken") || "",
};

export const setSetting = (k: keyof ISettings, v: any) => {
  settings[k] = v;
  store?.setItem(k, v);
};
