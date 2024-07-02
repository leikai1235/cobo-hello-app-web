import React from "react";
import { postTransfer } from "@/api";
import { generateUuid } from "@/utils";
export default function Transfer() {
  const onTransfer = async () => {
    const params = {
      request_id: generateUuid(),
      from_address: "",
      from_wallet_id: "a998f43a-7e9b-46f3-abce-c540265106db",
      to_wallet_id: "65556d4a-c2d8-4ace-858c-96c338208193",
      to_address: "rfKyCMyoV6Ln2GZ7YDbrBrnXCbAyBbxRqB",
      token_id: "XRP",
      amount: "0.1",
      memo: "1235896177",
      send_all: false,
      force_internal: true,
      force_external: false,
    };
    try {
      const result = await postTransfer(params);
      if (result.txid) {
        alert("Please confirm the transfer in your cobo guard app");
      }
    } catch (error) {
      alert(error);
    }
  };
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
      onClick={onTransfer}
    >
      transfer
    </button>
  );
}
