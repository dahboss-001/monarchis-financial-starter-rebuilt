import DashboardShell from "@/components/DashboardShell";
import AdminDashboard from "@/components/AdminDashboard";
import { auth } from "@/lib/auth/server";
import { getAdminOverview } from "@/lib/monarchis-data";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { data } = await auth.getSession();
  const email = data?.user?.email?.toLowerCase();
  const admins = (process.env.ADMIN_EMAILS || "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);

  if (!email) redirect("/auth");
  if (!admins.includes(email)) redirect("/dashboard");

  const overview = await getAdminOverview();

  return (
    <DashboardShell admin>
      <AdminDashboard initialData={overview} />
    </DashboardShell>
  );
}
