import { Receipts } from "@/components/receipts";
import { Upload } from "@/components/upload";
import { db } from "@/db";
import { receipts } from "@/db/schema";

export default async function Home() {
  const preloadedReceipts = await db.select().from(receipts);

  return (
    <div className="space-y-4">
      <h1>Trying BEM!</h1>
      <Upload />
      <span className="text-muted-foreground">
        Data can take up to 1 minute to parse after upload
      </span>
      <Receipts preloadedReceipts={preloadedReceipts} />
    </div>
  );
}
