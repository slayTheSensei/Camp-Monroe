import Link from "next/link";
import { getPageContent, t } from "@/lib/data/content";

const MANAGEMENT_COMPANY =
  process.env.MANAGEMENT_COMPANY_NAME ?? "Monroe Outdoor Hospitality LLC";

export default async function Footer() {
  const c = await getPageContent("site");
  const year = new Date().getFullYear();
  const email = t(c, "footer.contact_email", "hello@cambridgegunandrod.org");

  return (
    <footer className="site">
      <div className="wrap">
        <div className="foot-grid foot">
          <div>
            <div className="l1">
              {t(c, "footer.brand_l1", "Cambridge Gun & Rod Club")}
            </div>
            <div className="l2">
              {t(c, "footer.brand_l2", "Est. 1893 · Maine")}
            </div>
            <p>
              {t(
                c,
                "footer.brand_p",
                "One of America's oldest Black sportsmen's clubs. Home at Camp Monroe on Lake Cobbosseecontee, West Gardiner, Maine."
              )}
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
            <a href={`mailto:${email}`}>{email}</a>
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
              {t(c, "footer.address_l1", "Lake Cobbosseecontee")}
              <br />
              {t(c, "footer.address_l2", "West Gardiner, Maine")}
            </address>
          </div>
        </div>

        <div className="foot-meta">
          <span>
            {t(
              c,
              "footer.meta_left",
              `Cambridge Gun and Rod Club — a 501(c)(7) · Camp Monroe operated by ${MANAGEMENT_COMPANY}.`
            )}
          </span>
          <span>&copy; {year} all rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
