import Link from "next/link";
import { getPageContent, t } from "@/lib/data/content";

export default async function CtaBand() {
  const c = await getPageContent("site");
  return (
    <section className="ctaband">
      <div className="wrap">
        <div
          className="eyebrow muted reveal"
          style={{ marginBottom: 18, color: "rgba(26,46,26,0.65)" }}
        >
          {t(c, "cta_band.eyebrow", "Membership · By sponsorship")}
        </div>
        <h2 className="reveal d1">
          {t(c, "cta_band.headline", "Be part of the next hundred years.")}
        </h2>
        <p className="reveal d2">
          {t(
            c,
            "cta_band.body",
            "Request an invitation, or follow the camp through the 2026 season."
          )}
        </p>
        <div className="row reveal d3">
          <Link className="btn btn-ink" href="/request">
            {t(c, "cta_band.primary_label", "Request an invitation")}{" "}
            <span className="arr" />
          </Link>
          <Link className="btn btn-outline-ink" href="/the-camp">
            {t(c, "cta_band.secondary_label", "Explore the camp")}
          </Link>
        </div>
      </div>
    </section>
  );
}
