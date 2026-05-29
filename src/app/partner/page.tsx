"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import Counter from "@/components/site/Counter";
import { submitPartnerInquiry } from "@/app/actions/partner";

const WAYS = [
  {
    n: "01",
    t: "Capital & investment",
    d: "The 2026 renovation, and a second sporting property to come. Patient capital for buildings meant to stand another hundred years — not a quarter.",
  },
  {
    n: "02",
    t: "Heritage & preservation",
    d: "The longest-running Black outdoor heritage site in New England. We work with institutions and policymakers safeguarding the record, the land, and its designation.",
  },
  {
    n: "03",
    t: "Press & storytelling",
    d: "A 130-year record and the W.E.B. Files — letters, envelopes, schedules from the Du Bois Papers. For journalists, filmmakers, and scholars telling the story straight.",
  },
  {
    n: "04",
    t: "Community & corporate",
    d: "Group visits, sponsorship, and partnerships that open the camp to more of the communities it was built for. Off-season and shoulder weeks at the lake.",
  },
];

export default function PartnerPage() {
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [context, setContext] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLElement>(null);

  const firstName = name.trim().split(/\s+/)[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const result = await submitPartnerInquiry({ name, org, email, context, message });
    setSubmitting(false);
    if (result.ok) {
      setDone(true);
      window.scrollTo({
        top: (formRef.current?.offsetTop ?? 0) - 80,
        behavior: "smooth",
      });
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Nav />
      <main>
        <section className="phero">
          <div
            className="photo photo-modern"
            style={{ ["--photo" as string]: "url(/assets/photos/open-water-dusk.jpg)" }}
          />
          <div className="hero-shot-meta">
            <span className="hero-tier">
              <span className="dot" />
              Photograph · Lake Cobbosseecontee at dusk
            </span>
            <span className="hero-shot-note">
              For partners, press &amp; policymakers
            </span>
          </div>
          <div className="wrap phero-inner">
            <div className="hero-loc reveal">
              <span className="tick" />
              <span className="tx">
                Partner with us · Investors, partners, press, policymakers
              </span>
            </div>
            <h1 className="reveal d1" style={{ marginTop: 28 }}>
              Finish what was <em>started.</em>
            </h1>
          </div>
        </section>

        {/* INTRO */}
        <section className="light">
          <div className="wrap">
            <div className="split">
              <div className="txt">
                <div className="eyebrow reveal">Partner with us</div>
                <h2 className="sec-h reveal d1" style={{ marginTop: 18 }}>
                  Not a museum &mdash; a continuation.
                </h2>
                <p className="lead reveal d2" style={{ marginTop: 28 }}>
                  The Cambridge Gun &amp; Rod Club has been open every season since 1893 &mdash; the
                  longest-running Black outdoor heritage site in New England, and the lake W.E.B. Du Bois
                  called his Walden. That continuity is the asset. We intend to extend it.
                </p>
                <p className="lead reveal d3" style={{ marginTop: 18 }}>
                  In 2026, three core buildings are renovated and unveiled on Juneteenth, a women&rsquo;s
                  chapter opens the line for the first time, and a second sporting property restores the
                  other half of the club&rsquo;s name. There is room here for partners who measure return in
                  decades.
                </p>
              </div>
              <div className="reveal d2">
                <div className="archival">
                  <img
                    src="/assets/photos/group-portrait.png"
                    alt="Members of the Cambridge Gun & Rod Club at the camp"
                  />
                  <div className="archival-cap">
                    Archival — members at the camp · W.E.B. Du Bois Papers, UMass Amherst
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WAYS TO PARTNER */}
        <section className="dark">
          <div className="wrap">
            <div className="sec-head reveal">
              <div className="eyebrow">Ways to partner</div>
              <h2 className="sec-h" style={{ marginTop: 14 }}>
                Four ways to be part of the next hundred years.
              </h2>
            </div>
            <div className="ways">
              {WAYS.map((w) => (
                <div className="way reveal" key={w.n}>
                  <div className="way-n">{w.n}</div>
                  <h3 className="way-t">{w.t}</h3>
                  <p className="way-d">{w.d}</p>
                </div>
              ))}
            </div>

            <div
              className="stat-band ways-stats reveal"
              style={{ marginTop: 96 }}
            >
              <div className="stat">
                <div className="num">
                  <Counter to={130} />
                </div>
                <div className="lab">Years, unbroken</div>
                <div className="det">Open every season since 1893.</div>
              </div>
              <div className="stat">
                <div className="num">
                  <Counter to={5500} />
                </div>
                <div className="lab">Acres of lake</div>
                <div className="det">Lake Cobbosseecontee, Maine.</div>
              </div>
              <div className="stat">
                <div className="num">2026</div>
                <div className="lab">Renovation unveiled</div>
                <div className="det">Three buildings. Juneteenth.</div>
              </div>
              <div className="stat">
                <div className="num">501(c)(7)</div>
                <div className="lab">Member-owned</div>
                <div className="det">A club, long before the form existed.</div>
              </div>
            </div>
          </div>
        </section>

        {/* PULL QUOTE */}
        <section className="pull">
          <div className="corner" />
          <div className="wrap" style={{ maxWidth: "880px" }}>
            <div className="eyebrow reveal" style={{ marginBottom: 32 }}>
              The case, in a line
            </div>
            <blockquote className="reveal d1">
              We are finishing what was started in 1893 &mdash; and we are looking for the people who want
              to help finish it.
            </blockquote>
            <cite className="reveal d2">
              The Cambridge Gun &amp; Rod Club · Camp Monroe
            </cite>
          </div>
        </section>

        {/* PARTNER CONTACT */}
        <section className="paper" ref={formRef}>
          <div className="wrap">
            <div className="reqpage reqpage-partner">
              <div className="reqpage-aside">
                <div className="eyebrow">Start a conversation</div>
                <h2
                  className="sec-h"
                  style={{
                    marginTop: 16,
                    fontSize: "clamp(30px,4vw,52px)",
                  }}
                >
                  Tell us how you&rsquo;d like to help.
                </h2>
                <p className="lead" style={{ marginTop: 24, fontSize: 16 }}>
                  Investment, preservation, press, or community &mdash; we read every note by hand and reply
                  to the ones that fit. Concrete is welcome: tell us what you do and what you have in mind.
                </p>
                <div className="reqpage-reassure">
                  Prefer email? Write us at{" "}
                  <a
                    href="mailto:partners@cambridgegunandrod.org"
                    className="ilink"
                    style={{
                      borderBottom: "1px solid currentColor",
                      paddingBottom: 2,
                    }}
                  >
                    partners@cambridgegunandrod.org
                  </a>
                  .
                </div>
              </div>

              <div className="reqpage-card">
                {done ? (
                  <div className="req-success reqpage-success">
                    <div className="req-check" aria-hidden="true">
                      ✓
                    </div>
                    <h2>Thank you.</h2>
                    <p>
                      Your note is in{firstName ? `, ${firstName}` : ""}. We&rsquo;ll be in touch about
                      how to take this forward.
                    </p>
                    <div className="reqpage-success-row">
                      <Link className="btn btn-ink" href="/renovation">
                        See the 2026 renovation <span className="arr" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form className="req-form" onSubmit={handleSubmit}>
                    <div className="req-intro">
                      <span className="req-eyebrow">
                        For partners, press &amp; policymakers
                      </span>
                      <h2>Partner with us</h2>
                      <p>A few details, and the right person will write back.</p>
                    </div>

                    <div className="req-field">
                      <label htmlFor="pt-name">Your name</label>
                      <input
                        id="pt-name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        autoComplete="name"
                      />
                    </div>

                    <div className="req-2col">
                      <div className="req-field">
                        <label htmlFor="pt-org">Organization</label>
                        <input
                          id="pt-org"
                          value={org}
                          onChange={(e) => setOrg(e.target.value)}
                          placeholder="Firm, outlet, or office"
                          autoComplete="organization"
                        />
                      </div>
                      <div className="req-field">
                        <label htmlFor="pt-email">
                          Email
                        </label>
                        <input
                          id="pt-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@email.com"
                          autoComplete="email"
                          inputMode="email"
                        />
                      </div>
                    </div>

                    <div className="req-field">
                      <label htmlFor="pt-interest">
                        How you&rsquo;d like to partner
                      </label>
                      <div className="req-select">
                        <select
                          id="pt-interest"
                          value={context}
                          onChange={(e) => setContext(e.target.value)}
                        >
                          <option value="">Select one</option>
                          <option value="capital">
                            Capital &amp; investment
                          </option>
                          <option value="heritage">
                            Heritage &amp; preservation
                          </option>
                          <option value="press">Press &amp; storytelling</option>
                          <option value="community">
                            Community &amp; corporate
                          </option>
                          <option value="other">Something else</option>
                        </select>
                        <svg
                          className="req-chev"
                          viewBox="0 0 12 12"
                          width="12"
                          height="12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 4l4 4 4-4" />
                        </svg>
                      </div>
                    </div>

                    <div className="req-field">
                      <label htmlFor="pt-note">What you have in mind</label>
                      <textarea
                        id="pt-note"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="A sentence or two is plenty to start."
                      />
                    </div>

                    {error && (
                      <p
                        className="req-hint"
                        style={{ color: "var(--color-amber)" }}
                      >
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="btn btn-amber req-submit"
                      disabled={submitting}
                    >
                      {submitting ? "Sending…" : "Start the conversation"}{" "}
                      {!submitting && <span className="arr" />}
                    </button>
                    <p className="req-disclaim">
                      We read every note by hand. Expect a reply within two weeks.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
