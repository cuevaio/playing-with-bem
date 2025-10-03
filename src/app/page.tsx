import { Receipts } from "@/components/receipts";
import { Upload } from "@/components/upload";
import { db } from "@/db";
import { receipts } from "@/db/schema";

export const revalidate = 60;

export default async function Home() {
  const preloadedReceipts = await db.select().from(receipts);

  return (
    <div className="space-y-4">
      <h1 className="font-bold text-xl">Trying BEM!</h1>
      <p>
        With BEM, your users never need to reformat their data to fit a rigid
        structure. Instead, BEM leverages AI to intelligently extract and
        process your users' data—no matter the format they prefer.
      </p>
      <p>
        Take receipts, for example: Upload them in any file type you like—PDF,
        Excel, TXT, or anything else. BEM automatically parses the content and
        transforms it into the exact schema the app requires. Once processed,
        the data flows seamlessly into our database and appears on-screen in
        real time.
      </p>

      <Upload />
      <span className="text-muted-foreground">
        Some files like PDFs can take up to 1 minute to parse after uploaded
      </span>

      <Receipts preloadedReceipts={preloadedReceipts} />
      <div className="flex space-x-4">
        <a
          href="http://bem.ai/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          BEM.ai
        </a>
        <a
          href="https://github.com/cuevaio/playing-with-bem"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          GitHub repo
        </a>
        <a
          href="https://drive.google.com/drive/folders/1BC-5-JD8q8bDh2SQMTAZ5hP39g0nR1pP?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Google Drive with sample files
        </a>
      </div>
    </div>
  );
}
