import DashboardShell from "@/components/DashboardShell";
import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { data } = await auth.getSession();
  const email = data?.user?.email?.toLowerCase();
  const admins = (process.env.ADMIN_EMAILS || "").split(",").map(x => x.trim().toLowerCase()).filter(Boolean);
  if (!email) redirect("/auth");
  if (!admins.includes(email)) redirect("/dashboard");
  return <DashboardShell admin><div className="dashhead"><div><div className="eyebrow">ADMINISTRATION</div><h1>Operations overview</h1><p className="muted">Restricted administrator area. No financial transactions are enabled.</p></div><span className="pill">ADMIN ACCESS</span></div><div className="stats">{[["Client records","0"],["KYC queue","0"],["Open support","0"],["Audit events","0"]].map(([a,b])=><div className="stat" key={a}><small>{a}</small><strong>{b}</strong></div>)}</div><div className="panel"><h3>Access control</h3><p>Administrator access is controlled by the server-side ADMIN_EMAILS allowlist. Add only trusted administrator email addresses to the deployment environment.</p></div></DashboardShell>;
}
