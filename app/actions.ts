"use server";

import clientPromise, {
  DB_NAME,
  ENTRIES_COLLECTION,
  ensureEntryIndexes,
} from "@/lib/mongodb";
import { EMAIL_RE, PHONE_RE, normalizePhone } from "@/lib/validation";

export type RegisterState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<"name" | "email" | "phone", string>>;
};

export async function registerEntry(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const phone = String(formData.get("phone") || "").trim();

  const fieldErrors: RegisterState["fieldErrors"] = {};

  if (!name) fieldErrors.name = "Name is required.";
  if (!email) fieldErrors.email = "Email is required.";
  else if (!EMAIL_RE.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (!phone) fieldErrors.phone = "Phone number is required.";
  else if (!PHONE_RE.test(phone)) fieldErrors.phone = "Enter a valid phone number.";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors };
  }

  const normalizedPhone = normalizePhone(phone);

  try {
    await ensureEntryIndexes();
    const client = await clientPromise;
    const collection = client.db(DB_NAME).collection(ENTRIES_COLLECTION);

    const existing = await collection.findOne({
      $or: [{ email }, { phone: normalizedPhone }],
    });

    if (existing) {
      const duplicateField = existing.email === email ? "email" : "phone";
      return {
        status: "error",
        message:
          duplicateField === "email"
            ? "This email has already been registered."
            : "This phone number has already been registered.",
        fieldErrors: { [duplicateField]: "Already registered." },
      };
    }

    await collection.insertOne({
      name,
      email,
      phone: normalizedPhone,
      createdAt: new Date().toLocaleString("en-GB", {
        timeZone: "Asia/Colombo",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).replace(",", ""),
    });

    return {
      status: "success",
      message: "Thank you! You're entered for a chance to win.",
    };
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      const keyPattern = (error as { keyPattern?: Record<string, number> })
        .keyPattern;
      const duplicateField = keyPattern && "email" in keyPattern ? "email" : "phone";
      return {
        status: "error",
        message:
          duplicateField === "email"
            ? "This email has already been registered."
            : "This phone number has already been registered.",
        fieldErrors: { [duplicateField]: "Already registered." },
      };
    }
    console.error("registerEntry error:", error);
    return {
      status: "error",
      message: "Something went wrong. Please try again in a moment.",
    };
  }
}
