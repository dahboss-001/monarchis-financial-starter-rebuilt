import Link from "next/link";

export default function SiteNav() {
  return (
    <nav className="nav">
      <Link className="brand" href="/">MONARCHIS<span> FINANCIAL</span></Link>
      <div className="navlinks">
        <Link href="/about">About</Link>
        <Link href="/services">Services</Link>
        <Link href="/markets">Markets</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/contact">Contact</Link>
        <Link className="navbtn" href="/auth">Client portal</Link>
      </div>
    </nav>
  );
}