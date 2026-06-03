import Link from "next/link";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import Counter from "@/components/site/Counter";
import CtaBand from "@/components/site/CtaBand";
import { getPageContent, t } from "@/lib/data/content";

export const metadata = {
  title: "Membership — Cambridge Gun & Rod Club",
};

// CMS-driven page: hero image is read on every request so staff edits
// in /admin propagate immediately. Without this, Next.js statically
// optimizes the page at build time and DB changes don't show until
// the next deploy. (Same bug pattern as /history before DL-039.)
export const dynamic = "force-dynamic";

export default async function MembershipPage() {
  const c = await getPageContent("membership");
  return (
    <>
      <Nav />
      <main>
        <section className="phero">
          <div
            className="photo photo-modern"
            style={{
              ["--photo" as string]: `url(${t(c, "hero.image_url", "/assets/photos/membership-hero.jpg")})`,
            }}
          />
          <div className="hero-shot-meta">
            <span className="hero-tier">
              <span className="dot" />
              A member, on the way in
            </span>
            <span className="hero-shot-note">Camp Monroe &middot; Maine</span>
          </div>
          <div className="wrap phero-inner">
            <div className="hero-loc reveal">
              <span className="tick" />
              <span className="tx">
                Sponsorship · Application · Member vote
              </span>
            </div>
            <h1 className="reveal d1" style={{ marginTop: 28 }}>
              The members are the <em>club.</em>
            </h1>
          </div>
        </section>

        <section className="light">
          <div className="wrap">
            <div className="mem-main">
              <div>
                <div className="eyebrow reveal">Membership</div>
                <h2 className="sec-h reveal d1" style={{ marginTop: 18 }}>
                  A club, not a hotel.
                </h2>
                <p
                  className="lead reveal d2"
                  style={{ marginTop: 28, fontSize: 18 }}
                >
                  Membership is membership in a 130-year-old club. Not a timeshare. Not a
                  booking discount. There are two chapters. The men&rsquo;s, founded in 1893.
                  The women&rsquo;s, opening in 2026. We admit by sponsorship and application.
                  We always have.
                </p>

                <div className="price-row reveal d3">
                  <div className="price">
                    <div className="pn">Buy-in</div>
                    <div className="pl">One-time, on admission</div>
                  </div>
                  <div className="price">
                    <div className="pn">Dues</div>
                    <div className="pl">Monthly</div>
                  </div>
                  <div className="price">
                    <div className="pn">Seats</div>
                    <div className="pl">Capped</div>
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
                        A current member puts your name forward.
                      </div>
                    </div>
                  </div>
                  <div className="step">
                    <span className="sn">02</span>
                    <div>
                      <div className="st">Application</div>
                      <div className="sd">
                        You apply to a chapter, with two letters of support.
                      </div>
                    </div>
                  </div>
                  <div className="step">
                    <span className="sn">03</span>
                    <div>
                      <div className="st">Approval</div>
                      <div className="sd">
                        The members vote.
                      </div>
                    </div>
                  </div>
                  <div className="step">
                    <span className="sn">04</span>
                    <div>
                      <div className="st">Your seat</div>
                      <div className="sd">
                        Yours for life. If a chapter is full, a waitlist forms.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CHAPTERS */}
            <div className="reveal" style={{ marginTop: 96 }}>
              <div className="eyebrow">Two chapters · One camp</div>
              <h3
                className="sec-h"
                style={{
                  marginTop: 14,
                  fontSize: "clamp(28px,3.6vw,46px)",
                  maxWidth: "24ch",
                }}
              >
                The men&rsquo;s chapter, and the women&rsquo;s.
              </h3>
            </div>
            <div className="chapters">
              <div className="chapter reveal">
                <div className="y">1893</div>
                <div className="nm">The men&rsquo;s chapter</div>
                <p>
                  Founded 1893. Open every August since. Still takes the first full week
                  of August at the camp.
                </p>
              </div>
              <div className="chapter reveal d1">
                <div className="y">2026</div>
                <div className="nm">The women&rsquo;s chapter</div>
                <p>
                  Opens in 2026.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT YOU JOIN */}
        <section className="dark">
          <div className="wrap">
            <div className="sec-head reveal">
              <div className="eyebrow">What you get</div>
              <h2 className="sec-h" style={{ marginTop: 14 }}>
                A camp, a chapter, a seat.
              </h2>
            </div>
            <div className="stat-band">
              <div className="stat reveal">
                <div className="num">
                  <Counter to={130} />
                </div>
                <div className="lab">Years on the lake</div>
                <div className="det">
                  Open every August since 1893.
                </div>
              </div>
              <div className="stat reveal d1">
                <div className="num">
                  <Counter to={5500} />
                </div>
                <div className="lab">Acres of lake</div>
                <div className="det">
                  Lake Cobbosseecontee.
                </div>
              </div>
              <div className="stat reveal d2">
                <div className="num">August</div>
                <div className="lab">The first full week</div>
                <div className="det">
                  Men&rsquo;s chapter, every August since 1893.
                </div>
              </div>
              <div className="stat reveal d3">
                <div className="num">For life</div>
                <div className="lab">Your seat</div>
                <div className="det">Transferable per the bylaws.</div>
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
