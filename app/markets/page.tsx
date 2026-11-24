import type { Metadata } from "next";
export const metadata: Metadata = { title: " Monarchis Financial" };

import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const sampleMarkets = [
  { asset: "Bitcoin", symbol: "BTC", price: "$97,240", change: "+1.8%", cap: "$1.92T" },
  { asset: "Ethereum", symbol: "ETH", price: "$3,410", change: "+0.9%", cap: "$411B" },
  { asset: "Solana", symbol: "SOL", price: "$214", change: "-2.3%", cap: "$104B" },
  { asset: "USDC", symbol: "USDC", price: "$1.00", change: "0.0%", cap: "$42B" },
];

const sectors = [
  "Equities and listed securities",
  "Fixed-income and credit markets",
  "Multi-asset portfolios",
  "Alternative and private-market research",
];

const guides = [
  {
    title: "Volatility is normal",
    copy: "Digital asset prices can move sharply in both directions within hours. Position sizing matters more than timing.",
  },
  {
    title: "Yield has a source",
    copy: "Every return comes from somewhere: lending, staking, trading or business activity. If the source is unclear, treat the return as a warning sign.",
  },
  {
    title: "Guarantees do not exist",
    copy: "No legitimate investment guarantees daily profits. Any platform promising fixed daily returns should be avoided.",
  },
];

export default function Page() {
  return (
    <>
      <SiteNav />
      <header className="pagehead">
        <div className="eyebrow">MARKETS & INFORMATION</div>
        <h1>Understand before you act.</h1>
        <p className="lead">Context and education for digital asset markets. Nothing on this page is investment advice or a promise of performance.</p>
      </header>
      <main className="content">
        <section>
          <div className="section-head-row">
            <h2>Market snapshot</h2>
            <span className="badge badge-soft">SAMPLE DATA</span>
          </div>
          <p className="muted">
            The figures below are fixed sample data for layout illustration. They are not live prices, not delayed prices, and must not be used for any decision.
          </p>
          <div className="table-wrap">
            <table className="market-table">
              <thead>
                <tr><th>Asset</th><th>Symbol</th><th>Sample price</th><th>Sample 24h</th><th>Sample market cap</th></tr>
              </thead>
              <tbody>
                {sampleMarkets.map((row) => (
                  <tr key={row.symbol}>
                    <td>{row.asset}</td>
                    <td className="muted">{row.symbol}</td>
                    <td>{row.price}</td>
                    <td className={row.change.startsWith("-") ? "neg" : "pos"}>{row.change}</td>
                    <td className="muted">{row.cap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="spacer-block">
          <h2>What we monitor</h2>
          <ul className="list-points">
            {sectors.map((sector) => (
              <li key={sector}>{sector}</li>
            ))}
          </ul>
        </section>

        <section className="spacer-block">
          <h2>Three ideas worth keeping</h2>
          <div className="cards cards-three">
            {guides.map((guide, i) => (
              <article className="card" key={guide.title}>
                <span>0{i + 1}</span>
                <h3>{guide.title}</h3>
                <p>{guide.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-grid spacer-block">
          <div>
            <h2>Risk and suitability</h2>
            <p>Investments may lose value, including the amount invested. Past performance is not a reliable indicator of future results. Product suitability depends on risk tolerance, access rights and review requirements.</p>
          </div>
          <div>
            <h2>Market information</h2>
            <p>Financial markets can change quickly. Prices, liquidity, rates and economic conditions may move in either direction. The purpose of this information is to provide context, not to promise or imply performance outcomes.</p>
          </div>
        </section>

        <div className="notice">This page does not offer an investment product, trading facility or guaranteed return.</div>
      </main>
      <SiteFooter />
    </>
  );
}
