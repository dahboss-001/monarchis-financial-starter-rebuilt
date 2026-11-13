import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/authorization";
import { getAdminOverview } from "@/lib/monarchis-data";
import { logDatabaseFailure } from "@/lib/postgres";

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  try {
    const data = await getAdminOverview();
    return NextResponse.json({ data });
  } catch (error) {
    logDatabaseFailure("administrator overview", error);
    return NextResponse.json({ message: "Persistent storage is unavailable." }, { status: 503 });
  }
}
