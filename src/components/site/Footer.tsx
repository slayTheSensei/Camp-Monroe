import Link from "next/link";

const MANAGEMENT_COMPANY =
  process.env.MANAGEMENT_COMPANY_NAME ?? "Monroe Outdoor Hospitality LLC";

export default function Footer() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="foot-grid foot">
          <div>
            <div className="l1">Cambridge Gun &amp; Rod Club</div>
            <div className="l2">Est. 1893 · Maine</div>
            <p>
              One of America&rsquo;s oldest Black sportsmen&rsquo;s clubs. Home at
              Camp Monroe on Lake Cobbosseecontee, West Gardiner, Maine.
            </p>
          </div>

          <div>
            <h5>The Club</h5>
            <Link href="/history">Our history</Link>
            <Link href="/membership">Membership</Link>
            <Link href="/locations">Locations</Link>
            <Link href="/request">Request an invitation</Link>
            <Link href="/partner">Partner with us</Link>
          </div>

          <div>
            <h5>The Camp</h5>
            <Link href="/the-camp">Lake Cobbosseecontee</Link>
            <Link href="/renovation">2026 Renovation</Link>
            <Link href="/visit">Visit &amp; private events</Link>
          </div>

          <div>
            <h5>Contact</h5>
            <a href="mailto:hello@cambridgegunandrod.org">
              hello@cambridgegunandrod.org
            </a>
            <address
              style={{
                display: "block",
                color: "var(--cream-60)",
                fontSize: "13.5px",
                marginBottom: "11px",
                fontStyle: "normal",
                lineHeight: 1.6,
              }}
            >
              Lake Cobbosseecontee
              <br />
              West Gardiner, Maine
            </address>
          </div>
        </div>

        <div className="foot-meta">
          <span>
            Cambridge Gun and Rod Club &mdash; a 501(c)(7) · Camp Monroe operated by{" "}
            {MANAGEMENT_COMPANY}.
          </span>
          <span>&copy; {new Date().getFullYear()} all rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
