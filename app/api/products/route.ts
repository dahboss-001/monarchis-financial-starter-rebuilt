import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/authorization";
import { createProduct, listProducts } from "@/lib/monarchis-data";
import { logDatabaseFailure } from "@/lib/postgres";
import type { RiskBand } from "@/lib/monarchis-data";

const riskBands: RiskBand[] = ["Conservative", "Balanced", "Growth", "Opportunistic"];

function isRiskBand(value: string): value is RiskBand {
  return riskBands.some((band) => band === value);
}

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  try {
    return NextResponse.json({ products: await listProducts() });
  } catch (error) {
    logDatabaseFailure("product listing", error);
    return NextResponse.json({ message: "Persistent storage is unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const admin = await requireAdminSession();
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const summary = String(body.summary ?? "").trim();
  const riskBand = String(body.riskBand ?? "Balanced").trim();
  const minAmount = Number(body.minAmount ?? 0);
  const maxAmount = Number(body.maxAmount ?? 0);
  const feePercent = Number(body.feePercent ?? 0);
  const durationMonths = Number(body.durationMonths ?? 0);
  const currency = String(body.currency ?? "USD").trim();

  if (!isRiskBand(riskBand)) {
    return NextResponse.json({ message: "Choose a supported risk band." }, { status: 400 });
  }
  if (!name || !summary || name.length > 120 || summary.length > 2000) {
    return NextResponse.json({ message: "Name and summary are required." }, { status: 400 });
  }

  if (!Number.isFinite(minAmount) || !Number.isFinite(maxAmount) || minAmount <= 0 || maxAmount <= 0 || minAmount > maxAmount) {
    return NextResponse.json({ message: "Investment limits must be valid and ordered correctly." }, { status: 400 });
  }
  if (!Number.isFinite(feePercent) || feePercent < 0 || !Number.isInteger(durationMonths) || durationMonths < 1) {
    return NextResponse.json({ message: "Fee must be non-negative and duration must be at least one month." }, { status: 400 });
  }
  if (!["USD", "EUR", "GBP"].includes(currency.toUpperCase())) {
    return NextResponse.json({ message: "Choose a supported currency." }, { status: 400 });
  }

  try {
    const product = await createProduct({
      name,
      summary,
      riskBand,
      minAmount,
      maxAmount,
      feePercent,
      durationMonths,
      currency,
      status: "draft",
      actor: admin.user?.email ?? "admin",
    });

    return NextResponse.json({ message: "Investment product created and placed in draft review.", product }, { status: 201 });
  } catch (error) {
    logDatabaseFailure("product creation", error);
    return NextResponse.json({ message: "Persistent storage is unavailable or the existing schema does not support products." }, { status: 503 });
  }
}
