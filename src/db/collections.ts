"use client";

import { createCollection } from "@tanstack/react-db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";

import type { ReceiptSelect } from "@/db/schema";

export const ReceiptCollection = createCollection<ReceiptSelect>(
  electricCollectionOptions<ReceiptSelect>({
    id: "receipts",
    shapeOptions: {
      url: `${process.env.NEXT_PUBLIC_URL}/api/collections/receipts`,
    },
    getKey: (item) => item.id,
  }),
);
