import type { Metadata } from "next";
export const metadata: Metadata = { title: " Monarchis Financial" };

import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const channels = [
  {
    title: "Client support",
    copy: "Signed-in clients get the fastest response through the support panel in the client dashboard, where every ticket is tracked to resolution.",
    action: { label: "Open client portal", href: "/auth" },
  },
  {
    title: "Onboarding and verification",
    copy: "Questions about KYC, documents or account review are handled through the secure document workflow inside your account.",
    action: { label: "Read the FAQ", href: "/faq" },
  },
  {
    title: "General enquiries",
    copy: "For partnerships, press or anything else, reach the team through the verified contact details shared during onboarding.",
    action: { label: "Review our plans", href: "/plans" },
  },
];

export default function Page() {
  return (
    <>
      <SiteNav />
      <header className="pagehead">
        <div className="eyebrow">CONTACT</div>
        <h1>We welcome your enquiry.</h1>
        <p className="lead">Choose the channel that fits your question. Verified clients should start inside the secure portal.</p>
      </header>
      <main className="content-wide">
        <div className="cards cards-three">
          {channels.map((channel, i) => (
            <article className="card contact-card" key={channel.title}>
              <span>0{i + 1}</span>
              <h3>{channel.title}</h3>
              <p>{channel.copy}</p>
              <a className="outline" href={channel.action.href}>{channel.action.label}</a>
            </article>
          ))}
        </div>
        <div className="notice spacer-block">
          Direct email and phone details are published once verification and compliance review are complete. Monarchis staff will never ask for your password, wallet seed phrase or payment by gift card or crypto transfer.
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
