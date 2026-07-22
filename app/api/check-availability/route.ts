import { NextRequest, NextResponse } from "next/server";
import clientPromise, { DB_NAME, ENTRIES_COLLECTION } from "@/lib/mongodb";
import {
  EMAIL_RE,
  PHONE_RE,
  normalizeEmail,
  normalizePhone,
} from "@/lib/validation";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const field = searchParams.get("field");
  const rawValue = searchParams.get("value") || "";

  if (field !== "email" && field !== "phone") {
    return NextResponse.json(
      { error: "field must be 'email' or 'phone'" },
      { status: 400 }
    );
  }

  let query: Record<string, string>;
  if (field === "email") {
    const email = normalizeEmail(rawValue);
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ available: true });
    }
    query = { email };
  } else {
    if (!PHONE_RE.test(rawValue)) {
      return NextResponse.json({ available: true });
    }
    query = { phone: normalizePhone(rawValue) };
  }

  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(ENTRIES_COLLECTION);
  const existing = await collection.findOne(query, {
    projection: { _id: 1 },
  });

  return NextResponse.json({ available: !existing });
}
