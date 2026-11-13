import { NextResponse } from "next/server";
import { getCurrentSessionUser } from "@/lib/authorization";
import { createKycCase } from "@/lib/monarchis-data";
import { logDatabaseFailure } from "@/lib/postgres";

export async function POST(request: Request) {
  const session = await getCurrentSessionUser();
  if (!session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!session.user.email) {
    return NextResponse.json({ message: "Your authenticated account must have an email address." }, { status: 400 });
  }

  const body = await request.json();
  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const country = String(body.country ?? "").trim();
  const documentType = String(body.documentType ?? "").trim();
  const notes = String(body.notes ?? "").trim();

  if (!firstName || !lastName || !country || !documentType) {
    return NextResponse.json({ message: "Please complete the required KYC fields." }, { status: 400 });
  }

  try {
    const record = await createKycCase({
      applicantEmail: session.user.email,
      firstName,
      lastName,
      country,
      documentType,
      notes,
    });

    return NextResponse.json({ message: "KYC submission recorded for review.", record }, { status: 201 });
  } catch (error) {
    logDatabaseFailure("KYC submission", error);
    return NextResponse.json({ message: "Persistent storage is unavailable or the existing schema does not support this submission." }, { status: 503 });
  }
}
