import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const highlights = [
  "Portfolio oversight",
  "KYC and onboarding review",
  "Secure document workflow",
  "Client support and guidance",
];

const productCards = [
  { title: "Private client oversight", copy: "A clear account experience that helps clients track onboarding, documentation and service requests from one secure portal." },
  { title: "Institutional-grade risk review", copy: "Every service pathway is designed with clear disclosure, review checkpoints and responsible access controls." },
  { title: "Operational transparency", copy: "Client activity, support tickets and account actions remain visible through structured, auditable workflows." },
];

const steps = [
  "Register and create your secure account.",
  "Complete verification and review requirements.",
  "Access your dashboard, statements and support tools.",
];

const faqs = [
  { q: "Is Monarchis accepting live deposits today?", a: "No. The platform is designed to support secure review workflows, but live money movement remains disabled until operational and regulatory approvals are complete." },
  { q: "What is the role of risk disclosure?", a: "Every product and service is accompanied by clear risk information so clients understand the limits, governance and approval status of the platform." },
  { q: "Who can access the dashboard?", a: "Access is controlled through secure authentication and admin allowlisting. Account access remains limited to verified users and approved staff." },
];

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <section className="hero">
          <div className="hero-grid">
            <div>
              <div className="eyebrow">PRIVATE FINANCIAL SERVICES PLATFORM</div>
              <h1>Clarity for your <em>financial future.</em></h1>
              <p className="lead">
                Monarchis Financial brings together secure onboarding, portfolio insight, risk-aware account management and a premium client experience.
              </p>
              <div className="cta-row">
                <a className="goldbtn" href="/auth">Open client portal</a>
                <a className="outline" href="/services">Explore services</a>
              </div>
            </div>
            <div className="hero-panel">
              <div className="eyebrow">WHY CLIENTS CHOOSE US</div>
              <ul>
                {highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="eyebrow">OUR PHILOSOPHY</div>
          <h2>Confidence begins with clarity.</h2>
          <p>
            Monarchis Financial is building a client-first platform that combines secure digital access, accountable processing and transparent financial communication.
          </p>
        </section>

        <section className="section services">
          <div className="eyebrow">OUR SERVICES</div>
          <h2>Designed for stable, secure decision-making.</h2>
          <div className="cards">
            {productCards.map((card) => (
              <article className="card" key={card.title}>
                <span>0{productCards.indexOf(card) + 1}</span>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="eyebrow">HOW IT WORKS</div>
          <h2>A disciplined onboarding process.</h2>
          <div className="steps">
            {steps.map((step, index) => (
              <div className="step" key={step}>
                <strong>{index + 1}</strong>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section services">
          <div className="eyebrow">RISK DISCLOSURE</div>
          <h2>Responsible financial communication is essential.</h2>
          <p>
            All financial services carry market, liquidity, counterparty and operational risk. The platform does not promise returns or allow live money movement without verified controls and legal approval.
          </p>
        </section>

        <section className="section">
          <div className="eyebrow">FREQUENTLY ASKED QUESTIONS</div>
          <div className="faq-list">
            {faqs.map((item) => (
              <div className="faq-item" key={item.q}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="contact">
          <div className="eyebrow">GET IN TOUCH</div>
          <h2>Start a conversation.</h2>
          <p>Reach out to discuss onboarding, support, risk disclosure, or general platform questions.</p>
          <a className="goldbtn" href="/contact">Contact us ↗</a>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}