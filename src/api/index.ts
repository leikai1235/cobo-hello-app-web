import { request } from "../utils/request";

export const getCustodialWallet = async () => {
  return await request("/wallets", {
    method: "GET",
    params: {
      wallet_type: "Custodial",
      current_page: 1,
      page_size: 20,
    },
  });
};

export const postTransfer = async (data: any) => {
  return await request(
    "/transactions/transfer",
    {
      method: "POST",
      data,
    },
    false,
  );
};
