import { NextResponse } from "next/server";
import { databaseIsReachable, logDatabaseFailure } from "@/lib/postgres";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json({ status: "unconfigured" }, { status: 503 });
  }

  try {
    const connected = await databaseIsReachable();
    if (!connected) {
      return NextResponse.json({ status: "unavailable" }, { status: 503 });
    }
    return NextResponse.json({ status: "connected" });
  } catch (error) {
    logDatabaseFailure("health check", error);
    return NextResponse.json({ status: "unavailable" }, { status: 503 });
  }
}
