import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const principles = [
  { title: "Clarity before complexity", copy: "Every screen, statement and figure is written to be understood on first reading." },
  { title: "Privacy and data stewardship", copy: "Client information is handled through secure workflows with controlled access and review." },
  { title: "Responsible risk communication", copy: "Targets are labelled as targets. Risk is stated next to every opportunity, not hidden in fine print." },
  { title: "Transparent operations", copy: "Account actions, reviews and support requests follow auditable, visible processes." },
];

const journey = [
  { when: "Foundation", what: "Monarchis Financial is established around a simple idea: premium financial service with honest numbers." },
  { when: "Platform build", what: "Secure onboarding, KYC review, client and admin dashboards, and auditable workflows are developed and tested." },
  { when: "Today", what: "The platform operates in demonstration mode while regulatory licensing and licensed payment partnerships are completed." },
  { when: "Next", what: "Live investment services activate only after licensing is verified and independent security review is complete." },
];

export default function Page() {
  return (
    <>
      <SiteNav />
      <header className="pagehead">
        <div className="eyebrow">ABOUT MONARCHIS</div>
        <h1>A measured approach to finance.</h1>
        <p className="lead">Monarchis Financial is designed to offer a premium, secure client-services experience focused on clarity, accountability and disciplined delivery.</p>
      </header>
      <main className="content-wide">
        <section className="content-grid">
          <div>
            <h2>Our purpose</h2>
            <p>Our approach combines professional client communication, transparent onboarding, and governance standards that reflect the expectations of modern financial service providers.</p>
          </div>
          <div>
            <h2>What clients can expect</h2>
            <p>A clean interface for account access, risk disclosure, support requests and verification workflows, designed to reduce friction while maintaining appropriate governance.</p>
          </div>
        </section>

        <section className="section-plain">
          <div className="eyebrow">OUR PRINCIPLES</div>
          <h2>How we work.</h2>
          <div className="cards">
            {principles.map((item, i) => (
              <article className="card" key={item.title}>
                <span>0{i + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-plain">
          <div className="eyebrow">WHERE WE ARE</div>
          <h2>Our journey.</h2>
          <div className="timeline">
            {journey.map((step, i) => (
              <div className="timeline-item" key={step.when}>
                <strong>{i + 1}</strong>
                <div>
                  <h3>{step.when}</h3>
                  <p>{step.what}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
