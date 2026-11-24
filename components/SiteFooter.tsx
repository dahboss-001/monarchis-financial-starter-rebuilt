export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <div className="brand footer-brand">MONARCHIS<span> FINANCIAL</span></div>
          <p>
            A premium client-services platform for digital asset investing, currently operating in demonstration mode.
          </p>
        </div>
        <div>
          <h4>Platform</h4>
          <a href="/about">About</a>
          <a href="/services">Services</a>
          <a href="/plans">Investment plans</a>
          <a href="/markets">Markets</a>
        </div>
        <div>
          <h4>Support</h4>
          <a href="/faq">FAQ</a>
          <a href="/contact">Contact</a>
          <a href="/auth">Client portal</a>
        </div>
        <div>
          <h4>Legal</h4>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/risk">Risk disclosure</a>
        </div>
      </div>
      <div className="footer-legal">
        <span>© {new Date().getFullYear()} Monarchis Financial. All rights reserved.</span>
        <span>
          Monarchis Financial does not currently accept deposits or offer live investment products. Return figures shown on this site are annual targets, not guarantees. Capital is at risk.
        </span>
      </div>
    </footer>
  );
}
