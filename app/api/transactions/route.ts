import { NextResponse } from "next/server";
import { getCurrentSessionUser } from "@/lib/authorization";
import { createPaymentRequest, getDashboardOverview } from "@/lib/monarchis-data";
import { logDatabaseFailure } from "@/lib/postgres";

export async function GET() {
  const session = await getCurrentSessionUser();
  if (!session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!session.user.email) {
    return NextResponse.json({ message: "Your authenticated account must have an email address." }, { status: 400 });
  }

  try {
    const overview = await getDashboardOverview(session.user.email ?? null);
    return NextResponse.json({
      requests: overview.paymentRequests,
      message: "Transaction requests are for review only. No live money movement is enabled.",
    });
  } catch (error) {
    logDatabaseFailure("payment request listing", error);
    return NextResponse.json({ message: "Persistent storage is unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const session = await getCurrentSessionUser();
  if (!session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!session.user.email) {
    return NextResponse.json({ message: "Your authenticated account must have an email address." }, { status: 400 });
  }

  const body = await request.json();
  const type = String(body.type ?? "").trim();
  const amount = Number(body.amount ?? 0);
  const currency = String(body.currency ?? "USD").trim();
  const paymentMethod = String(body.paymentMethod ?? "").trim();
  const note = String(body.note ?? "").trim();

  if (!["deposit", "withdrawal"].includes(type)) {
    return NextResponse.json({ message: "Request type must be deposit or withdrawal." }, { status: 400 });
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ message: "Amount must be a positive number." }, { status: 400 });
  }

  if (!["USD", "EUR", "GBP"].includes(currency.toUpperCase()) || !paymentMethod) {
    return NextResponse.json({ message: "Choose USD, EUR, or GBP and provide a payment method." }, { status: 400 });
  }

  if (!Number.isSafeInteger(Math.round(amount * 100))) {
    return NextResponse.json({ message: "Amount is too large to process safely." }, { status: 400 });
  }

  try {
    const record = await createPaymentRequest({
      email: session.user.email,
      type: type as "deposit" | "withdrawal",
      amount,
      currency,
      paymentMethod,
      note,
    });

    return NextResponse.json({
      message: `Your ${type} request has been submitted for admin review. No funds are transferred automatically.`,
      record,
    }, { status: 201 });
  } catch (error) {
    logDatabaseFailure("payment request creation", error);
    return NextResponse.json({ message: "Persistent storage is unavailable or the existing schema does not support this request." }, { status: 503 });
  }
}
