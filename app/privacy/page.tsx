import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const sections = [
  {
    title: "What we collect",
    copy: "Account details you provide (name, email), verification information submitted through KYC workflows, support conversations, and technical data needed to keep the service secure.",
  },
  {
    title: "Why we process it",
    copy: "Account administration, onboarding verification, service delivery, support handling, security monitoring, and legal or regulatory obligations. Data is processed only for clearly defined purposes.",
  },
  {
    title: "What we never do",
    copy: "We do not sell personal information, we do not ask for your password or wallet seed phrase by email or chat, and we do not share account data with third parties except the providers that operate the service under contract.",
  },
  {
    title: "Retention and security",
    copy: "Information is kept only as long as needed for the purposes above and any legal requirement, using access-controlled infrastructure and auditable workflows.",
  },
  {
    title: "Your rights",
    copy: "Where applicable law permits, you may request access, correction, restriction or deletion of your personal information through the support channel in your account.",
  },
];

export default function Page() {
  return (
    <>
      <SiteNav />
      <header className="pagehead">
        <div className="eyebrow">LEGAL</div>
        <h1>Privacy notice.</h1>
      </header>
      <main className="content">
        <div className="notice">Draft template. Qualified legal review and a registered operating entity are required before collecting personal information at scale.</div>
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
