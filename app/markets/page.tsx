import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const sectors = [
  "Equities and listed securities",
  "Fixed-income and credit markets",
  "Multi-asset portfolios",
  "Alternative and private-market research",
];

export default function Page() {
  return (
    <>
      <SiteNav />
      <header className="pagehead">
        <div className="eyebrow">MARKETS & INFORMATION</div>
        <h1>Understand before you act.</h1>
      </header>
      <main className="content">
        <section className="content-grid">
          <div>
            <h2>Market information</h2>
            <p>Financial markets can change quickly. Prices, liquidity, rates and economic conditions may move in either direction. The purpose of this information is to provide context, not to promise or imply performance outcomes.</p>
          </div>
          <div>
            <h2>Risk and suitability</h2>
            <p>Investments may lose value, including the amount invested. Past performance is not a reliable indicator of future results. Product suitability depends on risk tolerance, access rights and review requirements.</p>
          </div>
        </section>

        <section className="spacer-block">
          <h2>What we monitor</h2>
          <ul className="list-points">
            {sectors.map((sector) => (
              <li key={sector}>{sector}</li>
            ))}
          </ul>
          <div className="notice">This page does not offer an investment product, trading facility or guaranteed return.</div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}