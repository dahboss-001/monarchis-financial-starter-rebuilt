import DashboardShell from "@/components/DashboardShell";
import ClientDashboard from "@/components/ClientDashboard";
import { auth } from "@/lib/auth/server";
import { getDashboardOverview } from "@/lib/monarchis-data";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { data, error } = await auth.getSession();
  if (error || !data?.user) redirect("/auth");

  const overview = await getDashboardOverview(data.user.email ?? null, data.user.id, data.user.name);

  return (
    <DashboardShell>
      <ClientDashboard initialData={overview} />
    </DashboardShell>
  );
}
