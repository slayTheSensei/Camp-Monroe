import Link from "next/link";

export default function CtaBand() {
  return (
    <section className="ctaband">
      <div className="ctaband-inner">
        <p className="ctaband-line">Be part of the next hundred years.</p>
        <Link href="/request" className="ctaband-btn">
          Request an invitation
        </Link>
      </div>
    </section>
  );
}
