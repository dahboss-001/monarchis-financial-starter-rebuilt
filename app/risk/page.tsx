import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function Page() {
  return (
    <>
      <SiteNav />
      <header className="pagehead">
        <div className="eyebrow">IMPORTANT INFORMATION</div>
        <h1>Risk disclosure.</h1>
      </header>
      <main className="content">
        <div className="notice">Capital is at risk. This platform does not promise or guarantee returns.</div>
        <p>Financial products and markets can involve market, liquidity, credit, currency, operational, regulatory and counterparty risks. You may receive less than you invest or lose the full amount invested. Seek independent advice where appropriate.</p>
        <ul className="list-points">
          <li>Market performance may fall below expectations.</li>
          <li>Illiquidity and valuation delays may affect access to funds.</li>
          <li>Operational, counterparty and legal controls must be validated before live financial execution.</li>
        </ul>
      </main>
      <SiteFooter />
    </>
  );
}