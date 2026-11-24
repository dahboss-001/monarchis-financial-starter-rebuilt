import type { Metadata } from "next";
export const metadata: Metadata = { title: " Monarchis Financial" };

import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const risks = [
  {
    title: "Market risk",
    copy: "Digital asset prices can fall sharply and without warning. A portfolio can lose value over any period, including the full amount allocated to a strategy.",
  },
  {
    title: "Liquidity risk",
    copy: "Some assets cannot be sold quickly at a fair price. Withdrawal timing can depend on market depth and settlement conditions.",
  },
  {
    title: "Counterparty and custody risk",
    copy: "Exchanges, custodians and payment partners can fail, be hacked or freeze withdrawals. Partner selection reduces this risk but never removes it.",
  },
  {
    title: "Regulatory risk",
    copy: "Rules for digital assets change across jurisdictions. New regulation can restrict products, delay payouts or require additional verification.",
  },
  {
    title: "Operational risk",
    copy: "Systems, processes and people can fail. Auditable workflows and access controls limit the impact, but no platform is error-free.",
  },
  {
    title: "Target risk",
    copy: "Annual targets are goals a strategy is managed toward. Real results will differ, can be negative, and past performance does not predict future results.",
  },
];

export default function Page() {
  return (
    <>
      <SiteNav />
      <header className="pagehead">
        <div className="eyebrow">IMPORTANT INFORMATION</div>
        <h1>Risk disclosure.</h1>
        <p className="lead">Read this before opening any account. If any part is unclear, ask before proceeding.</p>
      </header>
      <main className="content-wide">
        <div className="notice">Capital is at risk. This platform does not promise or guarantee returns, and it currently operates in demonstration mode with no live money movement.</div>
        <div className="cards">
          {risks.map((risk, i) => (
            <article className="card" key={risk.title}>
              <span>0{i + 1}</span>
              <h3>{risk.title}</h3>
              <p>{risk.copy}</p>
            </article>
          ))}
        </div>
        <section className="section-plain">
          <h2>Before you invest, anywhere</h2>
          <ul className="list-points">
            <li>Never invest money you cannot afford to lose.</li>
            <li>Treat guaranteed daily returns as a fraud warning sign, whoever offers them.</li>
            <li>Verify any licence claim directly on the regulator's public register.</li>
            <li>Seek independent advice where appropriate.</li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
