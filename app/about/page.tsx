import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function Page() {
  return (
    <>
      <SiteNav />
      <header className="pagehead">
        <div className="eyebrow">ABOUT MONARCHIS</div>
        <h1>A measured approach to finance.</h1>
      </header>
      <main className="content">
        <section className="content-grid">
          <div>
            <h2>Our purpose</h2>
            <p>Monarchis Financial is designed to offer a premium, secured client-services experience focused on clarity, accountability and disciplined service delivery.</p>
            <p>Our approach combines professional client communication, transparent onboarding, and governance standards that reflect the expectations of modern financial service providers.</p>
          </div>
          <div>
            <h2>Our principles</h2>
            <ul className="list-points">
              <li>Clarity before complexity.</li>
              <li>Privacy and data stewardship.</li>
              <li>Responsible risk communication.</li>
              <li>Transparent operational review.</li>
            </ul>
          </div>
        </section>

        <section className="spacer-block">
          <h2>What clients can expect</h2>
          <p>Clients receive a clean interface for account access, risk disclosure, support requests and verification workflows. This experience is designed to reduce friction while maintaining appropriate governance.</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}