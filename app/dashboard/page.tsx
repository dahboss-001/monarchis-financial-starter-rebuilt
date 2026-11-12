import DashboardShell from "@/components/DashboardShell";
import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { data, error } = await auth.getSession();
  if (error || !data?.user) redirect("/auth");
  return <DashboardShell>
    <div className="dashhead"><div><div className="eyebrow">CLIENT OVERVIEW</div><h1>Welcome to your portal.</h1><p className="muted">Signed in as {data.user.email}. Account and financial services remain subject to verification and approval.</p></div><span className="pill">AUTHENTICATED</span></div>
    <div className="stats">{[["Account status","Registration received"],["Verification","Review required"],["Documents","Not submitted"],["Support cases","0 open"]].map(([a,b])=><div className="stat" key={a}><small>{a}</small><strong>{b}</strong></div>)}</div>
    <div className="split"><section className="panel"><h3>Account checklist</h3><p>Your identity and account eligibility must be reviewed before any financial service is enabled.</p></section><section className="panel"><h3>Client support</h3><p>Contact support for assistance with your registration.</p></section></div>
  </DashboardShell>;
}
