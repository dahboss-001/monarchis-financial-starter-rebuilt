import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const sections = [
  {
    title: "1. What this site is",
    copy: "This website provides general information and a demonstration client experience. It is not personal financial, legal or tax advice, and using it does not by itself create a client relationship.",
  },
  {
    title: "2. Demonstration mode",
    copy: "The platform currently operates in demonstration mode. No deposits are accepted, no withdrawals are paid and no investment is executed. Simulated balances and requests exist for evaluation only and carry no monetary value.",
  },
  {
    title: "3. Accounts",
    copy: "You are responsible for keeping your sign-in credentials confidential and for the accuracy of the information you submit, including verification documents. Access can be suspended where information is false, misleading or incomplete.",
  },
  {
    title: "4. Acceptable use",
    copy: "You must not misuse the platform, attempt to access another person's account, probe or disrupt the service, or use it for money laundering, fraud or any unlawful purpose.",
  },
  {
    title: "5. Return figures",
    copy: "Any return figure on this site is an annual target, not a guarantee or projection of certain profit. Capital is at risk. See the risk disclosure for the full picture.",
  },
  {
    title: "6. Changes and availability",
    copy: "Content, products and features may change, and the service may be unavailable from time to time. Product offerings remain subject to legal, regulatory and operational approval.",
  },
];

export default function Page() {
  return (
    <>
      <SiteNav />
      <header className="pagehead">
        <div className="eyebrow">LEGAL</div>
        <h1>Terms of use.</h1>
      </header>
      <main className="content">
        <div className="notice">Draft template, not legal advice. Qualified legal review is required before publication to confirm jurisdiction, governing law and dispute procedures.</div>
        {sections.map((section) => (
          <section className="legal-section" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.copy}</p>
          </section>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}
