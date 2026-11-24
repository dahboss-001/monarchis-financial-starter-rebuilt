import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main className="notfound">
        <div className="eyebrow">PAGE NOT FOUND</div>
        <h1>This page has moved or never existed.</h1>
        <p className="lead">Check the address, or head back to the homepage.</p>
        <div className="cta-row">
          <a className="goldbtn" href="/">Back to home</a>
          <a className="outline" href="/plans">View plans</a>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
