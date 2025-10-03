"use client";

import { useLiveQuery } from "@tanstack/react-db";
import React from "react";

import { ReceiptCollection } from "@/db/collections";
import type { ReceiptSelect } from "@/db/schema";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../ui/table";

export function Receipts({
  preloadedReceipts,
}: {
  preloadedReceipts: ReceiptSelect[];
}) {
  const { data: freshData, status } = useLiveQuery((q) =>
    q
      .from({ receipt: ReceiptCollection })
      .select(({ receipt }) => ({ ...receipt })),
  );

  const receipts = React.useMemo(() => {
    if (status === "ready") {
      return freshData;
    }

    return preloadedReceipts;
  }, [status, freshData, preloadedReceipts]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Receipt ID</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Unit price</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Total price</TableCell>
          <TableCell>Date</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {receipts.map((receipt) => (
          <TableRow key={receipt.id}>
            <TableCell>{receipt.id}</TableCell>
            <TableCell>{receipt.name}</TableCell>
            <TableCell>{receipt.unit_price}</TableCell>
            <TableCell>{receipt.amount}</TableCell>
            <TableCell>{receipt.total_price}</TableCell>
            <TableCell>{receipt.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
