import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const runtime = "nodejs";

type BemSignature = {
  t: string;
  v1: string;
};

type TransformedContent = {
  date?: string;
  name?: string;
  amount?: number;
  unit_price?: number;
  total_price?: number;
};

type WebhookPayload = {
  transformedContent?: TransformedContent | null;
};

function parseBemSignatureHeader(header: string): BemSignature | null {
  // Example: "t=1492774577, v1=0734be64d748aa8e8ee9dfe87407665541f2c33f9b0ebf19dfd0dd80f08f504c"
  const parts = header
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  const out: Record<string, string> = {};
  for (const part of parts) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (key && val) {
      out[key] = val;
    }
  }

  if (!out.t || !out.v1) return null;
  return { t: out.t, v1: out.v1 };
}

function computeSignature(
  payload: string,
  timestamp: string,
  secret: string,
): string {
  const signedPayload = `${timestamp}.${payload}`;
  return crypto
    .createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  // Normalize casing
  const aNorm = a.toLowerCase();
  const bNorm = b.toLowerCase();

  const aBuf = Buffer.from(aNorm, "hex");
  const bBuf = Buffer.from(bNorm, "hex");

  if (aBuf.length !== bBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function isTimestampFresh(
  timestamp: string,
  toleranceSeconds: number,
): boolean {
  const t = Number(timestamp);
  if (!Number.isFinite(t)) return false;
  const nowSec = Math.floor(Date.now() / 1000);
  return Math.abs(nowSec - t) <= toleranceSeconds;
}

export async function POST(req: Request) {
  const secret = process.env.BEM_WEBHOOK_SECRET;

  if (!secret) {
    console.error(
      "Missing webhook signing secret. Please set BEM_WEBHOOK_SECRET.",
    );
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }

  const signatureHeader = req.headers.get("bem-signature");
  if (!signatureHeader) {
    return NextResponse.json(
      { error: "Missing bem-signature header" },
      { status: 400 },
    );
  }

  const bodyText = await req.text();
  if (!bodyText) {
    return NextResponse.json({ error: "Empty payload" }, { status: 400 });
  }

  const parsed = parseBemSignatureHeader(signatureHeader);
  if (!parsed) {
    return NextResponse.json(
      { error: "Invalid bem-signature header format" },
      { status: 400 },
    );
  }

  // Optional replay protection (default 5 minutes)
  const toleranceSec =
    Number(process.env.BEM_WEBHOOK_TOLERANCE_SEC ?? "") || 60 * 5;
  if (!isTimestampFresh(parsed.t, toleranceSec)) {
    return NextResponse.json({ error: "Stale timestamp" }, { status: 400 });
  }

  const expected = computeSignature(bodyText, parsed.t, secret);
  const valid = timingSafeEqualHex(expected, parsed.v1);

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Signature is valid; safely parse and handle the payload
  let json: WebhookPayload;
  try {
    json = JSON.parse(bodyText);
  } catch (e) {
    console.error("Failed to parse JSON payload:", e);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  console.log(json);

  const content = json?.transformedContent;
  if (content && typeof content === "object") {
    const { name, amount, unit_price, total_price, date } = content;
    const hasRequired =
      typeof name === "string" &&
      typeof amount === "number" &&
      typeof unit_price === "number" &&
      typeof total_price === "number";

    if (hasRequired) {
      await db.insert(schema.receipts).values({
        name,
        amount: amount.toFixed(2),
        unit_price: unit_price.toFixed(2),
        total_price: total_price.toFixed(2),
        date: date ?? undefined,
      });
      console.log("Receipt saved successfully");
    } else {
      console.warn(
        "Webhook payload missing required fields in transformedContent",
        content,
      );
    }
  }

  return NextResponse.json({ ok: true });
}
