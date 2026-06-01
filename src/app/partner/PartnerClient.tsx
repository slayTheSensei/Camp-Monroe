"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Counter from "@/components/site/Counter";
import { submitPartnerInquiry } from "@/app/actions/partner";

export interface PartnerWay {
  n: string;
  t: string;
  d: string;
}

interface PartnerClientProps {
  ways: PartnerWay[];
  heroImage: string;
}

export default function PartnerClient({ ways, heroImage }: PartnerClientProps) {
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
    <main>
        <section className="phero">
          <div
            className="photo photo-modern"
            style={{ ["--photo" as string]: `url(${heroImage})` }}
          />
          <div className="hero-shot-meta">
            <span className="hero-tier">
              <span className="dot" />
              Lake Cobbosseecontee at dusk
            </span>
            <span className="hero-shot-note">
              For partners, press &amp; policymakers
            </span>
          </div>
          <div className="wrap phero-inner">
            <div className="hero-loc reveal">
              <span className="tick" />
              <span className="tx">
                For investors, press, and policymakers
              </span>
            </div>
            <h1 className="reveal d1" style={{ marginTop: 28 }}>
              Another century to <em>put in.</em>
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
                  Not a museum. A club, still open.
                </h2>
                <p className="lead reveal d2" style={{ marginTop: 28 }}>
                  The Cambridge Gun and Rod Club has been open every August since 1893. The
                  lake W.E.B. Du Bois treated like his Walden Pond. The longest-running
                  Black outdoor heritage site in New England. The continuity is the asset.
                  We&rsquo;re going to extend it.
                </p>
                <p className="lead reveal d3" style={{ marginTop: 18 }}>
                  Three buildings under renovation. A women&rsquo;s chapter opening. A second
                  sporting property in the works. There is room here for partners who measure
                  return in decades.
                </p>
              </div>
              <div className="reveal d2">
                <div className="archival">
                  <img
                    src="/assets/photos/group-portrait.png"
                    alt="Members of the Cambridge Gun & Rod Club at the camp"
                  />
                  <div className="archival-cap">
                    Members at the camp · W.E.B. Du Bois Papers, UMass Amherst
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
                Four ways to put in.
              </h2>
            </div>
            <div className="ways">
              {ways.map((w) => (
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
                <div className="lab">Years on the lake</div>
                <div className="det">Open every August since 1893.</div>
              </div>
              <div className="stat">
                <div className="num">
                  <Counter to={5500} />
                </div>
                <div className="lab">Acres of lake</div>
                <div className="det">Lake Cobbosseecontee.</div>
              </div>
              <div className="stat">
                <div className="num">2026</div>
                <div className="lab">Renovation</div>
                <div className="det">Three buildings under renovation.</div>
              </div>
              <div className="stat">
                <div className="num">501(c)(7)</div>
                <div className="lab">Member-owned</div>
                <div className="det">A club in the old sense.</div>
              </div>
            </div>
          </div>
        </section>

        {/* PULL QUOTE */}
        <section className="pull">
          <div className="corner" />
          <div className="wrap" style={{ maxWidth: "880px" }}>
            <div className="eyebrow reveal" style={{ marginBottom: 32 }}>
              On record
            </div>
            <blockquote className="reveal d1">
              We&rsquo;re not a museum. We&rsquo;re a club, still open. We&rsquo;d like to do
              another hundred years.
            </blockquote>
            <cite className="reveal d2">
              The Cambridge Gun and Rod Club · Camp Monroe
            </cite>
          </div>
        </section>

        {/* PARTNER CONTACT */}
        <section className="paper" ref={formRef}>
          <div className="wrap">
            <div className="reqpage reqpage-partner">
              <div className="reqpage-aside">
                <div className="eyebrow">Write to us</div>
                <h2
                  className="sec-h"
                  style={{
                    marginTop: 16,
                    fontSize: "clamp(30px,4vw,52px)",
                  }}
                >
                  Tell us what you do and what you have in mind.
                </h2>
                <p className="lead" style={{ marginTop: 24, fontSize: 16 }}>
                  Capital. Preservation. Press. Community. We read every note and write back
                  to the ones that fit.
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
                      <Link className="btn btn-ink" href="/history">
                        Read the history <span className="arr" />
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
  );
}
