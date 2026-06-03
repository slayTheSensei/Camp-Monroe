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
            style={{
              ["--photo" as string]: `url(${t(c, "hero.image_url", "/assets/photos/lake-golden.jpg")})`,
            }}
          />
          <div className="hero-overlay" />
          <div className="hero-shot-meta">
            <span className="hero-tier">
              <span className="dot" />
              {t(c, "hero.tier_label", "Lake Cobbosseecontee at sunset")}
            </span>
            <span className="hero-shot-note">
              {t(c, "hero.location_label", "West Gardiner, Maine")}
            </span>
          </div>
          <div className="wrap hero-inner">
            <h1>
              {t(c, "hero.headline_line_1", "Every summer")}
              <br />
              {t(c, "hero.headline_line_2", "since")}
              <br />
              <em>{t(c, "hero.headline_emphasis", "1893.")}</em>
            </h1>
            <p className="hero-sub">
              {t(
                c,
                "hero.sub",
                "The Cambridge Gun and Rod Club is one of America's oldest Black sportsmen's clubs. Camp Monroe is its home on the water. We have kept the camp open one hundred and thirty seasons."
              )}
            </p>
            <div className="hero-cta">
              <Link className="btn btn-amber" href="/request">
                {t(c, "hero.primary_cta", "Request an invitation")}{" "}
                <span className="arr" />
              </Link>
              <Link className="btn btn-outline-cream" href="/the-camp">
                {t(c, "hero.secondary_cta", "See the camp")}
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
              The facts
            </div>
            <div className="stat-band">
              <div className="stat reveal">
                <div className="num">
                  <Counter to={130} />
                </div>
                <div className="lab">Years on the lake</div>
                <div className="det">Open every August since 1893.</div>
              </div>
              <div className="stat reveal d1">
                <div className="num">
                  <Counter to={60} />
                </div>
                <div className="lab">Memberships</div>
                <div className="det">Capped, held for life.</div>
              </div>
              <div className="stat reveal d2">
                <div className="num">
                  <Counter to={2} />
                </div>
                <div className="lab">Chapters</div>
                <div className="det">
                  Men&rsquo;s (1893) · Women&rsquo;s (2026).
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
                  {t(c, "story_split.eyebrow", "How it started")}
                </div>
                <h2 className="sec-h reveal d1" style={{ marginTop: 18 }}>
                  {t(
                    c,
                    "story_split.headline",
                    "A club. Not a resort."
                  )}
                </h2>
                <p className="lead reveal d2" style={{ marginTop: 28 }}>
                  {t(
                    c,
                    "story_split.body_p1",
                    "In 1893 a group of Black and Jewish men in Boston were shut out of the city's hunting and fishing clubs. So they built one of their own — on a lake in Maine. They named it the Cambridge Gun and Rod Club. We have opened it every August since."
                  )}
                </p>
                <p className="lead reveal d3" style={{ marginTop: 18 }}>
                  {t(
                    c,
                    "story_split.body_p2",
                    "By the 1920s the camp drew lawyers, judges, and scholars. W.E.B. Du Bois was a member, not a founder. He came back summer after summer and treated the camp like his Walden Pond. Joe Louis came as a guest. The men's chapter still takes the first full week of August. In 2026 a women's chapter joins."
                  )}
                </p>
                <Link
                  className="ilink reveal d4"
                  style={{ marginTop: 34, display: "inline-flex" }}
                  href="/history"
                >
                  {t(c, "story_split.ilink_label", "Read the history")}{" "}
                  <span className="arr" />
                </Link>
              </div>
              <div className="reveal d2">
                <Ph
                  cap={t(
                    c,
                    "story_split.image_caption",
                    "Cambridge Gun and Rod Club, Lake Cobbosseecontee, August 1897"
                  )}
                  src={t(
                    c,
                    "story_split.image_url",
                    "/assets/photos/cgr-club-1897.jpg"
                  )}
                  alt="Story image"
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
                What&rsquo;s here.
              </h2>
            </div>

            <div className="explore-blocks">
              <Link className="explore-block reveal" href="/the-camp">
                <div className="explore-photo">
                  <Ph
                    src="/assets/photos/camp-golden-hour.jpg"
                    alt="The camp shore at golden hour"
                  />
                </div>
                <div className="explore-copy">
                  <div className="explore-num">01</div>
                  <h3 className="explore-t">The Camp</h3>
                  <p className="explore-d">
                    Five thousand five hundred acres of water. One of the best bass lakes in the Northeast.
                  </p>
                  <span className="explore-cta">
                    Lake Cobbosseecontee <span className="arr" />
                  </span>
                </div>
              </Link>

              <Link className="explore-block reveal d1" href="/membership">
                <div className="explore-photo">
                  <Ph
                    src="/assets/photos/membership-hero.jpg"
                    alt="A member on the way in"
                  />
                </div>
                <div className="explore-copy">
                  <div className="explore-num">02</div>
                  <h3 className="explore-t">Membership</h3>
                  <p className="explore-d">By sponsorship. By application.</p>
                  <span className="explore-cta">
                    Request an invitation <span className="arr" />
                  </span>
                </div>
              </Link>

              <Link className="explore-block reveal" href="/history">
                <div className="explore-photo">
                  <Ph
                    src="/assets/photos/group-portrait.png"
                    alt="Members and guests at the camp, c. 1920"
                  />
                </div>
                <div className="explore-copy">
                  <div className="explore-num">03</div>
                  <h3 className="explore-t">History</h3>
                  <p className="explore-d">A hundred and thirty years on the lake.</p>
                  <span className="explore-cta">
                    Read the history <span className="arr" />
                  </span>
                </div>
              </Link>

              <Link className="explore-block reveal d1" href="/dubois">
                <div className="explore-photo">
                  <Ph
                    src="/assets/photos/dubois-banner.png"
                    alt="Archival materials from the W.E.B. Du Bois Papers"
                  />
                </div>
                <div className="explore-copy">
                  <div className="explore-num">04</div>
                  <h3 className="explore-t">The W.E.B. Files</h3>
                  <p className="explore-d">
                    Du Bois at camp, 1920–1947.
                  </p>
                  <span className="explore-cta">
                    See the Files <span className="arr" />
                  </span>
                </div>
              </Link>

              <Link className="explore-block reveal" href="/visit">
                <div className="explore-photo">
                  <Ph
                    src="/assets/photos/open-water-dusk.jpg"
                    alt="Open water at dusk — Maine"
                  />
                </div>
                <div className="explore-copy">
                  <div className="explore-num">05</div>
                  <h3 className="explore-t">Visit</h3>
                  <p className="explore-d">Private events. Retreats. Whole-camp buyouts.</p>
                  <span className="explore-cta">
                    Plan a stay <span className="arr" />
                  </span>
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
