import Link from "next/link";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import Counter from "@/components/site/Counter";
import Ph from "@/components/site/Ph";
import CtaBand from "@/components/site/CtaBand";
import FollowAlong from "@/components/site/FollowAlong";
import { getPageContent, t } from "@/lib/data/content";

export const metadata = {
  title: "Cambridge Gun & Rod Club — Camp Monroe, Maine",
};

export default async function HomePage() {
  const c = await getPageContent("home");
  return (
    <>
      <Nav />
      <main>
        {/* HERO */}
        <section className="hero hero-home">
          <div
            className="photo photo-modern"
            style={{ ["--photo" as string]: "url(/assets/photos/lake-golden.jpg)" }}
          />
          <div className="hero-overlay" />
          <div className="hero-shot-meta">
            <span className="hero-tier">
              <span className="dot" />
              {t(c, "hero.tier_label", "Photograph · Lake Cobbosseecontee at sunset")}
            </span>
            <span className="hero-shot-note">
              {t(c, "hero.location_label", "West Gardiner, Maine")}
            </span>
          </div>
          <div className="wrap hero-inner">
            <h1>
              {t(c, "hero.headline_line_1", "One hundred")}
              <br />
              {t(c, "hero.headline_line_2", "and thirty years,")}
              <br />
              <em>{t(c, "hero.headline_emphasis", "unbroken.")}</em>
            </h1>
            <p className="hero-sub">
              {t(
                c,
                "hero.sub",
                "One of America's oldest Black sportsmen's clubs — founded 1893, open every season since. Camp Monroe is its home on the water."
              )}
            </p>
            <div className="hero-cta">
              <Link className="btn btn-amber" href="/request">
                {t(c, "hero.primary_cta", "Request an invitation")}{" "}
                <span className="arr" />
              </Link>
              <Link className="btn btn-outline-cream" href="/the-camp">
                {t(c, "hero.secondary_cta", "Explore the camp")}
              </Link>
            </div>
          </div>
        </section>

        {/* STAT BAND */}
        <section
          className="dark"
          style={{
            paddingTop: "clamp(72px,8vw,112px)",
            paddingBottom: "clamp(72px,8vw,112px)",
          }}
        >
          <div className="wrap">
            <div className="eyebrow reveal" style={{ marginBottom: 48 }}>
              The line, in numbers
            </div>
            <div className="stat-band">
              <div className="stat reveal">
                <div className="num">
                  <Counter to={130} />
                </div>
                <div className="lab">Years, unbroken</div>
                <div className="det">Open every season since 1893.</div>
              </div>
              <div className="stat reveal d1">
                <div className="num">
                  <Counter to={60} />
                </div>
                <div className="lab">Memberships</div>
                <div className="det">Held for life. Two chapters.</div>
              </div>
              <div className="stat reveal d2">
                <div className="num">
                  <Counter to={2} />
                </div>
                <div className="lab">Chapters</div>
                <div className="det">
                  Historic men&rsquo;s · new women&rsquo;s, 2026.
                </div>
              </div>
              <div className="stat reveal d3">
                <div className="num">
                  <Counter to={5500} />
                </div>
                <div className="lab">Acres of lake</div>
                <div className="det">Lake Cobbosseecontee, Maine.</div>
              </div>
            </div>
          </div>
        </section>

        {/* THE STORY */}
        <section className="light">
          <div className="wrap">
            <div className="split">
              <div className="txt">
                <div className="eyebrow reveal">
                  {t(c, "story_split.eyebrow", "The institution")}
                </div>
                <h2 className="sec-h reveal d1" style={{ marginTop: 18 }}>
                  {t(
                    c,
                    "story_split.headline",
                    "A club, not a resort. A line, not a season."
                  )}
                </h2>
                <p className="lead reveal d2" style={{ marginTop: 28 }}>
                  {t(
                    c,
                    "story_split.body_p1",
                    "In 1893 a circle of Black Bostonians — Pullman porters, doctors, ministers, lawyers shut out of America's clubs — claimed this lake for themselves. For 130 unbroken years it has been one of the country's most enduring Black institutions: a place of rest and standing."
                  )}
                </p>
                <p className="lead reveal d3" style={{ marginTop: 18 }}>
                  {t(
                    c,
                    "story_split.body_p2",
                    "W.E.B. Du Bois called it his Walden. Joe Louis came as a guest. The men's chapter still keeps the first full week of August. In 2026, a women's chapter opens the line for the first time."
                  )}
                </p>
                <Link
                  className="ilink reveal d4"
                  style={{ marginTop: 34, display: "inline-flex" }}
                  href="/history"
                >
                  {t(c, "story_split.ilink_label", "Read the full history")}{" "}
                  <span className="arr" />
                </Link>
              </div>
              <div className="reveal d2">
                <Ph
                  cap="Archival — Cambridge Gun & Rod Club at Cobbosseecontee Lake, August 1897"
                  src="/assets/photos/cgr-club-1897.jpg"
                  alt="Cambridge Gun & Rod Club members at Lake Cobbosseecontee, 1897"
                />
              </div>
            </div>
          </div>
        </section>

        {/* TEASERS */}
        <section className="dark">
          <div className="wrap">
            <div className="sec-head reveal">
              <div className="eyebrow">Explore</div>
              <h2 className="sec-h" style={{ marginTop: 14 }}>
                What you&rsquo;ll find on this line.
              </h2>
            </div>

            <div className="teasers">
              <Link className="teaser tlg reveal" href="/the-camp">
                <Ph
                  src="/assets/photos/camp-golden-hour.jpg"
                  alt="The camp shore at golden hour"
                  cap="Photograph — the camp shore at golden hour"
                />
                <div className="body">
                  <div className="num">01</div>
                  <div className="tn">The Camp</div>
                  <div className="td">
                    Five and a half thousand acres of water. One of the best bass lakes in the Northeast.
                  </div>
                  <div className="ig">
                    Lake Cobbosseecontee <span className="arr" />
                  </div>
                </div>
              </Link>
              <Link className="teaser tmd reveal d1" href="/renovation">
                <Ph
                  src="/assets/photos/bathroom-rendering.png"
                  alt="Rendering of refreshed lodge bathrooms for 2026"
                  cap="Rendering — refreshed lodge bathrooms [2026]"
                />
                <div className="body">
                  <div className="num">02</div>
                  <div className="tn">The 2026 Renovation</div>
                  <div className="td">Dining hall, kitchen, dock, lodge. Unveiled June 19th.</div>
                  <div className="ig">
                    See the plans <span className="arr" />
                  </div>
                </div>
              </Link>
              <Link className="teaser tsm reveal" href="/membership">
                <Ph cap="Sixty seats. Held for life." />
                <div className="body">
                  <div className="num">03</div>
                  <div className="tn">Membership</div>
                  <div className="td">By sponsorship. By application.</div>
                  <div className="ig">
                    Request an invitation <span className="arr" />
                  </div>
                </div>
              </Link>
              <Link className="teaser tlg2 reveal d1" href="/history">
                <Ph
                  cap="Archival — Du Bois at the camp"
                  src="/assets/photos/dubois-hammock.png"
                  alt="W.E.B. Du Bois at the camp"
                />
                <div className="body">
                  <div className="num">04</div>
                  <div className="tn">The History</div>
                  <div className="td">From 1893 to the next hundred years.</div>
                  <div className="ig">
                    Read the history <span className="arr" />
                  </div>
                </div>
              </Link>
              <Link className="teaser tsm reveal d2" href="/locations">
                <Ph
                  src="/assets/photos/open-water-dusk.jpg"
                  alt="Open water at dusk — Maine"
                  cap="Maine · one club, growing"
                />
                <div className="body">
                  <div className="num">05</div>
                  <div className="tn">Locations</div>
                  <div className="td">
                    Camp Monroe is the flagship. A sporting property restores the Rod.
                  </div>
                  <div className="ig">
                    One club, growing <span className="arr" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* PULL QUOTE */}
        <section className="pull">
          <div className="corner" />
          <div className="wrap" style={{ maxWidth: "880px" }}>
            <div className="eyebrow reveal" style={{ marginBottom: 32 }}>
              {t(c, "pull_quote.eyebrow", "From the record")}
            </div>
            <blockquote className="reveal d1">
              &ldquo;
              {t(
                c,
                "pull_quote.quote",
                "I have a box at the Cambridge Gun and Rod Club. Will you please have it sent to me by railway express?"
              )}
              &rdquo;
            </blockquote>
            <cite className="reveal d2">
              {t(
                c,
                "pull_quote.citation",
                "W.E.B. Du Bois, in correspondence · 21 August 1947"
              )}
            </cite>
          </div>
        </section>

        <CtaBand />

        <FollowAlong />
      </main>
      <Footer />
    </>
  );
}
