import { date, decimal, pgTable, serial, text } from "drizzle-orm/pg-core";

export const receipts = pgTable("receipts", {
  id: serial("id").primaryKey(),

  name: text("name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),

  date: date("date"),
});
