"use client";

import dynamic from "next/dynamic";

export const Receipts = dynamic(
  () => import("./client").then((m) => m.Receipts),
  { ssr: false },
);
