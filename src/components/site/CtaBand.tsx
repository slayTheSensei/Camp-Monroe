import Link from "next/link";

export default function CtaBand() {
  return (
    <section className="ctaband">
      <div className="wrap">
        <div
          className="eyebrow muted reveal"
          style={{ marginBottom: 18, color: "rgba(26,46,26,0.65)" }}
        >
          Membership · By sponsorship
        </div>
        <h2 className="reveal d1">Be part of the next hundred years.</h2>
        <p className="reveal d2">
          Request an invitation, or follow the camp through the 2026 season.
        </p>
        <div className="row reveal d3">
          <Link className="btn btn-ink" href="/request">
            Request an invitation <span className="arr" />
          </Link>
          <Link className="btn btn-outline-ink" href="/the-camp">
            Explore the camp
          </Link>
        </div>
      </div>
    </section>
  );
}
