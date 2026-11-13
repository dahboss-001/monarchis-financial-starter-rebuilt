import { NextResponse } from "next/server";
import { getCurrentSessionUser } from "@/lib/authorization";
import { getDashboardOverview } from "@/lib/monarchis-data";
import { logDatabaseFailure } from "@/lib/postgres";

export async function GET() {
  const session = await getCurrentSessionUser();
  if (!session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getDashboardOverview(
      session.user.email ?? null,
      session.user.id,
      session.user.name,
    );
    return NextResponse.json({ data });
  } catch (error) {
    logDatabaseFailure("client dashboard summary", error);
    return NextResponse.json({ message: "Persistent storage is unavailable." }, { status: 503 });
  }
}
