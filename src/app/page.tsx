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
import { getCustodialWallet } from "@/api";
import Wallet from "@/app/Wallet";
import Transfer from "@/app/Transfer";
import "rc-table/assets/index.css";
export default function Home() {
  const searchParams = useSearchParams();

  const encryptedVerityToken = searchParams?.get("verity_token") || undefined;

  const [verityToken, setVerityToken] = useState<string | undefined>();

  const [accessToken, setAccessToken] = useState<string | undefined>();

  const [userInfo, setUserInfo] = useState<
    | {
        email: string;
        roleNames: string[];
        roles: string[];
        orgID?: string;
      }
    | undefined
  >();

  const [wallets, setWallets] = useState<any[]>([]);

  useEffect(() => {
    const code = getRouteQueryValue(encryptedVerityToken);
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
    };
    getVerifyInfo();
  }, [verityToken]);

  useEffect(() => {
    const cb = async () => {
      if (!userInfo?.orgID) return;
      const token = await getAccessToken();
      setAccessToken(token);
    };
    cb();
  }, [userInfo?.orgID]);

  useEffect(() => {
    const getWallets = async () => {
      if (!accessToken) return;
      const result = await getCustodialWallet();
      setWallets(result?.data || []);
    };
    getWallets();
  }, [accessToken]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {userInfo?.email && (
        <h1 className="text-2xl">Welcome {userInfo?.email}</h1>
      )}
      <p className="text-lg">
        {userInfo?.roleNames &&
          `You have roles: ${userInfo?.roleNames.join(", ")}`}
      </p>
      <Transfer />
      <Wallet data={wallets} />
    </main>
  );
}
