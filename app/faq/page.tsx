import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const faqs = [
  ["Is the client portal live?", "The portal is operational in a development and review environment. Secure authentication and onboarding checks continue before any live service activation."],
  ["Can I deposit or withdraw funds?", "No. The platform runs in demonstration mode. Deposit and withdrawal requests are captured for review only, no payment is collected and no funds move."],
  ["Are returns guaranteed?", "No. Financial products carry risk, including possible loss of capital. Any figure shown on this site is an annual target, never a promise. Any platform guaranteeing fixed daily profits should be avoided."],
  ["What does 2.0 to 3.0% target mean?", "It is the yearly net return each program aims for after fees. Real results will be higher or lower, and can be negative. Targets are reviewed and reported against, not guaranteed."],
  ["Is Monarchis licensed?", "Monarchis is completing its regulatory review and currently operates in demonstration mode only. Live investment services begin only after licensing is verified, and the details will be published on this site."],
  ["Do I need KYC before accessing services?", "Yes. Identity, eligibility and document review are part of onboarding before any financial service can be activated."],
  ["Does Monarchis pay referral bonuses?", "No. Monarchis does not pay referral commissions and never ties rewards to other people's deposits."],
  ["How is my data handled?", "Account data is stored through secure, access-controlled infrastructure. See the privacy page for the full policy."],
];

export default function Page() {
  return (
    <>
      <SiteNav />
      <header className="pagehead">
        <div className="eyebrow">HELP CENTRE</div>
        <h1>Frequently asked questions.</h1>
        <p className="lead">Straight answers about demo mode, targets, licensing and your account.</p>
      </header>
      <main className="content">
        <div className="faq-list">
          {faqs.map(([question, answer]) => (
            <div className="faq-item" key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </div>
          ))}
        </div>
        <div className="notice spacer-block">
          Still stuck? Signed-in clients can raise a ticket from the support panel in the dashboard, or use the <a href="/contact">contact page</a>.
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
