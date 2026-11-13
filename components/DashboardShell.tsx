import Link from "next/link";
import SiteNav from "./SiteNav";
import { SignOutButton } from "./SignOutButton";

export default function DashboardShell({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const items = admin
    ? ["Overview", "Client records", "KYC reviews", "Support queue", "Audit activity"]
    : ["Overview", "Portfolio", "Documents", "Statements", "Support"];

  return (
    <>
      <SiteNav />
      <div className="dashlayout">
        <aside className="sidebar">
          <div className="sidebar-title">{admin ? "ADMINISTRATION" : "CLIENT SPACE"}</div>
          {items.map((item) => (
            <Link href={admin ? "/admin" : "/dashboard"} key={item}>
              {item}
            </Link>
          ))}
          <SignOutButton />
        </aside>
        <main className="dashmain">{children}</main>
      </div>
    </>
  );
}