import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function Page() {
  return (
    <>
      <SiteNav />
      <header className="pagehead">
        <div className="eyebrow">CONTACT</div>
        <h1>We welcome your enquiry.</h1>
      </header>
      <main className="content">
        <div className="notice">Replace this placeholder with a verified business email, approved support channel and compliance contact before public launch.</div>
        <div className="content-grid">
          <div>
            <h2>Support and onboarding</h2>
            <p>Email: hello@monarchis.example</p>
            <p>Response time: reviewed during business hours after verification is complete.</p>
          </div>
          <div>
            <h2>General enquiries</h2>
            <p>For account access, onboarding, compliance or reporting, use the secure client portal or contact the support team listed in your verified account communications.</p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}