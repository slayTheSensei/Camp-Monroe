import Link from "next/link";

const MANAGEMENT_COMPANY =
  process.env.MANAGEMENT_COMPANY_NAME ?? "Monroe Outdoor Hospitality LLC";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="foot-grid">
        <div className="foot-col">
          <p className="foot-brand">Camp Monroe</p>
          <p className="foot-sub">Lake Cobbosseecontee, Maine</p>
          <p className="foot-sub">Est. 1893</p>
        </div>

        <div className="foot-col">
          <p className="foot-head">The Club</p>
          <nav aria-label="Footer club links">
            <Link href="/the-camp">The Camp</Link>
            <Link href="/history">History</Link>
            <Link href="/membership">Membership</Link>
            <Link href="/locations">Locations</Link>
          </nav>
        </div>

        <div className="foot-col">
          <p className="foot-head">Visitors</p>
          <nav aria-label="Footer visitor links">
            <Link href="/visit">Visit &amp; Inquire</Link>
            <Link href="/visit?mode=host">Host a Retreat</Link>
            <Link href="/visit?mode=buyout">Whole-Camp Buyout</Link>
            <Link href="/renovation">2026 Renovation</Link>
          </nav>
        </div>

        <div className="foot-col">
          <p className="foot-head">Connect</p>
          <nav aria-label="Footer connect links">
            <Link href="/partner">Partner with Us</Link>
            <Link href="/request">Request Membership</Link>
          </nav>
        </div>
      </div>

      <div className="foot-meta">
        <span>
          &copy; {year} {MANAGEMENT_COMPANY}. Cambridge Gun &amp; Rod Club est.
          1893.
        </span>
        <span>All rights reserved.</span>
      </div>
    </footer>
  );
}
