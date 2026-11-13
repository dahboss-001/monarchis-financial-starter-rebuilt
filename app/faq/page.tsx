import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const faqs = [
  ["Is the client portal live?", "The portal is operational in a development and review environment. Secure authentication and onboarding checks continue before any live service activation."],
  ["Can I deposit or withdraw funds?", "No live money movement is enabled. Deposit and withdrawal requests are captured for review only and are subject to admin approval and provider verification."],
  ["Are returns guaranteed?", "No. Financial products carry risk, including potential loss of capital. All returns must be explicitly defined in product terms and approved operational controls."],
  ["Do I need KYC before accessing services?", "Yes. Identity, eligibility and document review are part of the onboarding process before any financial service can be activated."],
];

export default function Page() {
  return (
    <>
      <SiteNav />
      <header className="pagehead">
        <div className="eyebrow">HELP CENTRE</div>
        <h1>Frequently asked questions.</h1>
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
      </main>
      <SiteFooter />
    </>
  );
}