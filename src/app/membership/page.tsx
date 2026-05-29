import Link from "next/link";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import Counter from "@/components/site/Counter";
import CtaBand from "@/components/site/CtaBand";

export const metadata = {
  title: "Membership — Cambridge Gun & Rod Club",
};

export default function MembershipPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="phero">
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
              <span className="tx">
                Membership · By sponsorship and application
              </span>
            </div>
            <h1 className="reveal d1" style={{ marginTop: 28 }}>
              Sixty seats.
              <br />
              Held for a <em>lifetime.</em>
            </h1>
          </div>
        </section>

        <section className="light">
          <div className="wrap">
            <div className="mem-main">
              <div>
                <div className="eyebrow reveal">Membership</div>
                <h2 className="sec-h reveal d1" style={{ marginTop: 18 }}>
                  A line, not a booking.
                </h2>
                <p
                  className="lead reveal d2"
                  style={{ marginTop: 28, fontSize: 18 }}
                >
                  Membership in the Cambridge Gun &amp; Rod Club is membership in a 130-year-old
                  institution &mdash; not a timeshare, not a booking discount. Two chapters, a historic
                  men&rsquo;s and a new women&rsquo;s, share one home and identical standing. Admission is
                  by sponsorship and application, the way it has always been.
                </p>

                <div className="price-row reveal d3">
                  <div className="price">
                    <div className="pn">$1,000</div>
                    <div className="pl">One-time buy-in</div>
                  </div>
                  <div className="price">
                    <div className="pn">
                      $125<span className="per">/mo</span>
                    </div>
                    <div className="pl">Member dues</div>
                  </div>
                  <div className="price">
                    <div className="pn">60</div>
                    <div className="pl">Seats &middot; held for life</div>
                  </div>
                </div>

                <div
                  className="reveal d4"
                  style={{
                    marginTop: 44,
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <Link className="btn btn-ink" href="/request">
                    Request an invitation <span className="arr" />
                  </Link>
                  <Link className="btn btn-outline-ink" href="/the-camp">
                    Explore the camp
                  </Link>
                </div>
              </div>

              <div className="reveal d2">
                <div className="eyebrow muted" style={{ marginBottom: 24 }}>
                  How admission works
                </div>
                <div className="steps">
                  <div className="step">
                    <span className="sn">01</span>
                    <div>
                      <div className="st">Sponsorship</div>
                      <div className="sd">
                        A current member puts your name forward — by letter, in their own hand.
                      </div>
                    </div>
                  </div>
                  <div className="step">
                    <span className="sn">02</span>
                    <div>
                      <div className="st">Application</div>
                      <div className="sd">
                        You apply to your chapter, with two letters of support.
                      </div>
                    </div>
                  </div>
                  <div className="step">
                    <span className="sn">03</span>
                    <div>
                      <div className="st">Approval</div>
                      <div className="sd">
                        The membership votes &mdash; a 130-year tradition.
                      </div>
                    </div>
                  </div>
                  <div className="step">
                    <span className="sn">04</span>
                    <div>
                      <div className="st">Join the line</div>
                      <div className="sd">
                        Held for life. A waitlist forms when a chapter is full; the line moves at the
                        line&rsquo;s pace.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CHAPTERS */}
            <div className="reveal" style={{ marginTop: 96 }}>
              <div className="eyebrow">Two chapters · One home</div>
              <h3
                className="sec-h"
                style={{
                  marginTop: 14,
                  fontSize: "clamp(28px,3.6vw,46px)",
                  maxWidth: "24ch",
                }}
              >
                The line opens, for the first time.
              </h3>
            </div>
            <div className="chapters">
              <div className="chapter reveal">
                <div className="y">1893</div>
                <div className="nm">The men&rsquo;s chapter</div>
                <p>
                  Founded 1893. Continuous. The historic chapter still keeps the first full week of August
                  at the camp — a hundred and thirty-three Augusts, and counting.
                </p>
              </div>
              <div className="chapter reveal d1">
                <div className="y">2026</div>
                <div className="nm">The women&rsquo;s chapter</div>
                <p>
                  Opens the line for the first time, with identical standing. The same buy-in. The same
                  dues. The same hold for life.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT YOU JOIN */}
        <section className="dark">
          <div className="wrap">
            <div className="sec-head reveal">
              <div className="eyebrow">What you join</div>
              <h2 className="sec-h" style={{ marginTop: 14 }}>
                This is what&rsquo;s yours.
              </h2>
            </div>
            <div className="stat-band">
              <div className="stat reveal">
                <div className="num">
                  <Counter to={130} />
                </div>
                <div className="lab">Years of standing</div>
                <div className="det">
                  A 501(c)(7) since long before the form existed.
                </div>
              </div>
              <div className="stat reveal d1">
                <div className="num">
                  <Counter to={5500} />
                </div>
                <div className="lab">Acres of lake</div>
                <div className="det">
                  Lake Cobbosseecontee. Members&rsquo; use.
                </div>
              </div>
              <div className="stat reveal d2">
                <div className="num">August</div>
                <div className="lab">The first full week</div>
                <div className="det">
                  The historic men&rsquo;s week. Continuous since 1893.
                </div>
              </div>
              <div className="stat reveal d3">
                <div className="num">For life</div>
                <div className="lab">Your seat</div>
                <div className="det">Transferable to family per the bylaws.</div>
              </div>
            </div>
          </div>
        </section>

        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
