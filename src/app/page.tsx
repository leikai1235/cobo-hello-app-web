"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  decrypt,
  getRouteQueryValue,
  setSetting,
  parseJwt,
  getAccessToken,
} from "@/utils";
export default function Home() {
  const searchParams = useSearchParams();
  const [verityToken, setVerityToken] = useState<string | undefined>();
  const [userInfo, setUserInfo] = useState<
    | {
        email: string;
        roleNames: string[];
        roles: string[];
        orgID?: string;
      }
    | undefined
  >();
  const verity_token = searchParams?.get("verity_token") || undefined;

  useEffect(() => {
    const code = getRouteQueryValue(verity_token);
    if (!code) return;
    setVerityToken(code);
  }, [searchParams]);

  useEffect(() => {
    const getVerifyInfo = async () => {
      if (!verityToken) return;
      const verifyObject = await JSON.parse(decrypt(verityToken) || "{}");
      const { token, orgID } = verifyObject;

      setSetting("orgID", orgID);

      if (!token) return;
      const jwtInfo = parseJwt(token);

      setUserInfo({
        email: jwtInfo.email,
        roleNames: jwtInfo.role_names,
        roles: jwtInfo.roles,
        orgID,
      });

      await getAccessToken();
    };
    getVerifyInfo();
  }, [verityToken]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {userInfo?.email && (
        <h1 className="text-2xl">Welcome {userInfo?.email}</h1>
      )}
      <p className="text-lg">
        {userInfo?.roleNames &&
          `You have roles: ${userInfo?.roleNames.join(", ")}`}
      </p>
    </main>
  );
}
