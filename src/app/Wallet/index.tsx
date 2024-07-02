import { useEffect, useMemo, useRef, useState } from "react";
import Table from "rc-table";
import React from "react";
interface Props {
  data: any[];
}
export default function Wallet({ data }: Props) {
  const columns = [
    {
      title: "walletName",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "type",
      dataIndex: "wallet_subtype",
      key: "wallet_subtype",
    },
    {
      title: "totalValue",
      dataIndex: "totalValue",
      key: "totalValue",
      render: (_: unknown, record: any) => (
        <span className="text-base text-black">
          {record.currency_symbol}
          &nbsp;
          {record.currency_value}
        </span>
      ),
    },
  ];
  return (
    <>
      <span className="mt-4 text-lg">Your Custodial Wallets:</span>
      <Table
        columns={columns}
        data={data || []}
        rowKey={"wallet_id"}
        className="mt-4"
      />
    </>
  );
}
