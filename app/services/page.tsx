import type { Metadata } from "next";
export const metadata: Metadata = { title: " Monarchis Financial" };

import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const services = [
  ["Client account services", "Secure onboarding, account review and profile administration for registered users."],
  ["Financial planning information", "Structured educational guidance, portfolio framing and product review principles."],
  ["Secure document submission", "KYC and document journey management with explicit review checkpoints."],
  ["Client support", "Responsive assistance for onboarding, access, compliance and general enquiries."],
  ["Statements and records", "A transparent record-keeping flow designed to support clarity and auditability."],
  ["Identity and eligibility review", "Controlled review of user status, onboarding conditions and access requirements."],
];

export default function Page() {
  return (
    <>
      <SiteNav />
      <header className="pagehead">
        <div className="eyebrow">SERVICES</div>
        <h1>Support built around your needs.</h1>
        <p className="lead">A professional digital experience designed around thoughtful onboarding, secure review and clear communication.</p>
      </header>
      <main className="content">
        <div className="cards">
          {services.map(([title, copy], i) => (
            <article className="card" key={title}>
              <span>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <div className="cta-row spacer-block">
          <a className="goldbtn" href="/plans">View investment plans</a>
          <a className="outline" href="/auth">Open client portal</a>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}