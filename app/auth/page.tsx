import SiteNav from "@/components/SiteNav";
import AuthPanel from "@/components/AuthPanel";

const reassurances = [
  "Demo mode: explore with a simulated portfolio, no deposit needed.",
  "Targets, never promises: every return figure is an annual goal, not a guarantee.",
  "We will never ask for your password, wallet seed phrase or payment by gift card.",
];

export default function Page() {
  return (
    <>
      <SiteNav />
      <main className="auth-split">
        <aside className="auth-side">
          <div className="eyebrow">CLIENT PORTAL</div>
          <h1>Your account, kept honest.</h1>
          <p className="lead">
            Sign in or create an account to follow a simulated portfolio, submit verification documents and track support requests in one secure place.
          </p>
          <ul className="auth-points">
            {reassurances.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
        <div className="auth-panel-wrap">
          <AuthPanel />
        </div>
      </main>
    </>
  );
}
