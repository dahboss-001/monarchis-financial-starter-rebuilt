import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const plans = [
  {
    name: "Monarchis Core",
    tag: "Entry",
    min: "$250",
    target: "2.0%",
    horizon: "12 months",
    risk: "Conservative",
    featured: false,
    points: [
      "Diversified large-cap digital asset exposure",
      "Quarterly statements and performance reviews",
      "Demo portfolio tracking in your client portal",
    ],
  },
  {
    name: "Monarchis Growth",
    tag: "Most selected",
    min: "$2,500",
    target: "2.5%",
    horizon: "12 months",
    risk: "Balanced",
    featured: true,
    points: [
      "Blend of digital assets and yield-bearing instruments",
      "Monthly statements and priority support",
      "Dedicated onboarding review",
    ],
  },
  {
    name: "Monarchis Prestige",
    tag: "Private clients",
    min: "$25,000",
    target: "3.0%",
    horizon: "12 months",
    risk: "Balanced+",
    featured: false,
    points: [
      "Tailored allocation built with an account reviewer",
      "Direct line to the client services team",
      "Enhanced reporting and audit trail",
    ],
  },
];

const principles = [
  {
    title: "Targets, never promises",
    copy: "Every figure on this page is an annual target. It is not a guarantee, a projection of certain profit, or a promise of daily returns. Real portfolios move up and down.",
  },
  {
    title: "Demo first",
    copy: "Today the platform runs in demonstration mode. You can open an account, complete verification and follow a simulated portfolio. No real deposit is accepted.",
  },
  {
    title: "Licensed before live",
    copy: "Live investing only begins after regulatory licensing is verified and a licensed payment and custody partner is connected. Until then, money movement stays off.",
  },
];

export default function Page() {
  return (
    <>
      <SiteNav />
      <header className="pagehead">
        <div className="eyebrow">INVESTMENT PROGRAMS</div>
        <h1>Clear plans. Honest numbers.</h1>
        <p className="lead">
          Three programs built around realistic annual targets of 2.0 to 3.0 percent. Every target is a goal, not a guarantee, and your capital is always at risk.
        </p>
        <div className="notice pagehead-notice">
          Demonstration mode: Monarchis is not accepting deposits. Figures below are illustrative annual targets, not promised returns.
        </div>
      </header>

      <main className="content-wide">
        <div className="plan-grid">
          {plans.map((plan) => (
            <article className={plan.featured ? "plan plan-featured" : "plan"} key={plan.name}>
              {plan.featured ? <div className="plan-flag">MOST SELECTED</div> : null}
              <div className="eyebrow">{plan.tag}</div>
              <h2>{plan.name}</h2>
              <div className="plan-target">
                <strong>{plan.target}</strong>
                <span>target net return, per annum</span>
              </div>
              <div className="plan-meta">
                <div><small>Minimum</small><span>{plan.min}</span></div>
                <div><small>Horizon</small><span>{plan.horizon}</span></div>
                <div><small>Risk profile</small><span>{plan.risk}</span></div>
              </div>
              <ul>
                {plan.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <a className={plan.featured ? "goldbtn plan-cta" : "outline plan-cta"} href="/auth">
                Start in demo mode
              </a>
              <p className="plan-fine">
                Target only, not guaranteed. Capital at risk. Simulated until live activation.
              </p>
            </article>
          ))}
        </div>

        <section className="section-plain">
          <div className="eyebrow">HOW WE TALK ABOUT RETURNS</div>
          <h2>What these numbers mean.</h2>
          <div className="cards cards-three">
            {principles.map((item) => (
              <article className="card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-plain">
          <div className="notice">
            If anyone offers you guaranteed daily profits of 10 percent or more, it is not investing. Monarchis will never make that claim. Read our full <a href="/risk">risk disclosure</a>.
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
