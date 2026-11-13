import { NextResponse } from "next/server";
import { getCurrentSessionUser } from "@/lib/authorization";
import { createSupportTicket } from "@/lib/monarchis-data";
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
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!subject || !message) {
    return NextResponse.json({ message: "Subject and message are required." }, { status: 400 });
  }

  try {
    const record = await createSupportTicket({
      email: session.user.email,
      subject,
      message,
    });

    return NextResponse.json({ message: "Support request created and sent to the review queue.", record }, { status: 201 });
  } catch (error) {
    logDatabaseFailure("support ticket creation", error);
    return NextResponse.json({ message: "Persistent storage is unavailable or the existing schema does not support this request." }, { status: 503 });
  }
}
