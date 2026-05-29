"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import { submitMembershipRequest } from "@/app/actions/membership";

type Sponsor = "yes" | "no" | "";

export default function RequestPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sponsor, setSponsor] = useState<Sponsor>("");
  const [sponsorName, setSponsorName] = useState("");
  const [chapter, setChapter] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const topRef = useRef<HTMLElement>(null);

  const firstName = name.trim().split(/\s+/)[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const result = await submitMembershipRequest({
      name,
      email,
      chapter,
      note,
      hasSponsor: sponsor === "yes",
      sponsorName,
    });
    setSubmitting(false);
    if (result.ok) {
      setDone(true);
      window.scrollTo({
        top: (topRef.current?.offsetTop ?? 0) - 80,
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
        <section className="phero phero-short">
          <div
            className="photo photo-archival"
            style={{ ["--photo" as string]: "url(/assets/photos/group-portrait-modern.jpg)" }}
          />
          <div className="hero-shot-meta">
            <span className="hero-tier">
              <span className="dot" />
              Archival · Members at the camp, mid-century
            </span>
            <span className="hero-shot-note">From the camp&rsquo;s archive</span>
          </div>
          <div className="wrap phero-inner">
            <div className="hero-loc reveal">
              <span className="tick" />
              <span className="tx">Membership · By sponsorship and application</span>
            </div>
            <h1 className="reveal d1" style={{ marginTop: 28 }}>
              Request an <em>invitation.</em>
            </h1>
          </div>
        </section>

        <section className="light" ref={topRef}>
          <div className="wrap">
            <div className="reqpage">
              {/* FORM */}
              <div className="reqpage-card">
                {done ? (
                  <div className="req-success reqpage-success">
                    <div className="req-check" aria-hidden="true">
                      ✓
                    </div>
                    <h2>
                      Your request
                      <br />
                      is in.
                    </h2>
                    <p>
                      Thank you{firstName ? `, ${firstName}` : ""}. A member of the committee will be in
                      touch. The line moves at the line&rsquo;s pace.
                    </p>
                    <div className="reqpage-success-row">
                      <Link className="btn btn-ink" href="/the-camp">
                        Explore the camp <span className="arr" />
                      </Link>
                      <Link className="btn btn-outline-ink" href="/history">
                        Read the history
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form className="req-form" onSubmit={handleSubmit}>
                    <div className="req-intro">
                      <span className="req-eyebrow">
                        By sponsorship · By application
                      </span>
                      <h2>A line, not a booking.</h2>
                      <p>Tell us who you are. We read every request by hand.</p>
                    </div>

                    <div className="req-field">
                      <label htmlFor="rq-name">Full name</label>
                      <input
                        id="rq-name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        autoComplete="name"
                      />
                    </div>

                    <div className="req-field">
                      <label htmlFor="rq-email">Email</label>
                      <input
                        id="rq-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com"
                        autoComplete="email"
                        inputMode="email"
                      />
                    </div>

                    <div className="req-field">
                      <label>Has a member sponsored you?</label>
                      <div
                        className="req-seg"
                        role="group"
                        aria-label="Has a member sponsored you?"
                      >
                        <button
                          type="button"
                          className={sponsor === "yes" ? "on" : ""}
                          onClick={() => setSponsor("yes")}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={sponsor === "no" ? "on" : ""}
                          onClick={() => setSponsor("no")}
                        >
                          Not yet
                        </button>
                      </div>
                    </div>

                    {sponsor === "yes" && (
                      <div className="req-field req-reveal">
                        <label htmlFor="rq-sponsor">
                          Your sponsor&rsquo;s name
                        </label>
                        <input
                          id="rq-sponsor"
                          value={sponsorName}
                          onChange={(e) => setSponsorName(e.target.value)}
                          placeholder="The member who put your name forward"
                        />
                      </div>
                    )}
                    {sponsor === "no" && (
                      <p className="req-hint req-reveal">
                        That&rsquo;s alright &mdash; tell us a little about yourself below, and we&rsquo;ll
                        make an introduction.
                      </p>
                    )}

                    <div className="req-field">
                      <label htmlFor="rq-chapter">Chapter of interest</label>
                      <div className="req-select">
                        <select
                          id="rq-chapter"
                          value={chapter}
                          onChange={(e) => setChapter(e.target.value)}
                        >
                          <option value="">No preference</option>
                          <option value="mens">
                            The men&rsquo;s chapter · est. 1893
                          </option>
                          <option value="womens">
                            The women&rsquo;s chapter · 2026
                          </option>
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
                      <label htmlFor="rq-note">
                        A few words{" "}
                        <span className="req-opt">— optional</span>
                      </label>
                      <textarea
                        id="rq-note"
                        rows={3}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Anything you'd like the membership to know."
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
                      {submitting ? "Sending…" : "Submit request"}{" "}
                      {!submitting && <span className="arr" />}
                    </button>
                    <p className="req-disclaim">
                      We read every request by hand. Expect a reply within the season.
                    </p>
                  </form>
                )}
              </div>

              {/* ASIDE */}
              <div className="reqpage-aside">
                <div className="eyebrow">After you submit</div>
                <p className="lead" style={{ marginTop: 20, fontSize: 16 }}>
                  This is the start of a conversation, not a checkout. Here is what happens once your request
                  is in.
                </p>
                <div className="steps" style={{ marginTop: 32 }}>
                  <div className="step">
                    <span className="sn">01</span>
                    <div>
                      <div className="st">We read it by hand</div>
                      <div className="sd">
                        A member of the committee reads every request personally &mdash; no automated
                        replies, no waitlist forms to chase.
                      </div>
                    </div>
                  </div>
                  <div className="step">
                    <span className="sn">02</span>
                    <div>
                      <div className="st">We write back</div>
                      <div className="sd">
                        You&rsquo;ll hear from us within the season. If you&rsquo;re not yet sponsored,
                        we&rsquo;ll make an introduction.
                      </div>
                    </div>
                  </div>
                  <div className="step">
                    <span className="sn">03</span>
                    <div>
                      <div className="st">Your name goes forward</div>
                      <div className="sd">
                        When the moment is right, your application is put to the membership &mdash; a
                        130-year tradition. The line moves at the line&rsquo;s pace.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="reqpage-reassure">
                  New to the club?{" "}
                  <Link
                    href="/membership"
                    className="ilink"
                    style={{
                      borderBottom: "1px solid currentColor",
                      paddingBottom: 2,
                    }}
                  >
                    Read how admission works
                  </Link>{" "}
                  &mdash; sponsorship, application, and a seat held for life.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
