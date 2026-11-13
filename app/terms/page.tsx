import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function Page() {
  return (
    <>
      <SiteNav />
      <header className="pagehead">
        <div className="eyebrow">LEGAL</div>
        <h1>Terms of use.</h1>
      </header>
      <main className="content">
        <div className="notice">Draft template — not legal advice. Obtain qualified legal review before publication to confirm jurisdiction, governing law and dispute procedures.</div>
        <p>This website provides general information only. It is not personal financial, legal or tax advice and does not create a client relationship by itself.</p>
        <p>Users are responsible for reviewing account terms, risk disclosures and service conditions before using any part of the platform. Product offerings remain subject to legal, regulatory and operational approval.</p>
      </main>
      <SiteFooter />
    </>
  );
}