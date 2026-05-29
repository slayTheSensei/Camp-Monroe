import Link from "next/link";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import CtaBand from "@/components/site/CtaBand";

export const metadata = {
  title: "Locations — Cambridge Gun & Rod Club",
};

export default function LocationsPage() {
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
              Coastal &amp; central · the properties
            </span>
          </div>
          <div className="wrap phero-inner">
            <div className="hero-loc reveal">
              <span className="tick" />
              <span className="tx">The properties · One club, growing</span>
            </div>
            <h1 className="reveal d1" style={{ marginTop: 28 }}>
              One club.
              <br />
              And where it&rsquo;s <em>headed.</em>
            </h1>
          </div>
        </section>

        <section className="light">
          <div className="wrap">
            <div className="split">
              <div className="txt">
                <div className="eyebrow reveal">The institution</div>
                <h2 className="sec-h reveal d1" style={{ marginTop: 18 }}>
                  The club is the constant. The places are a second layer.
                </h2>
              </div>
              <div className="reveal d2">
                <p className="lead">
                  The Cambridge Gun &amp; Rod Club has always been an institution first and a place second.
                  Camp Monroe is its home on the water &mdash; the lakefront camp the club has held since
                  1893. A second property, a sporting one, restores the other half of its name.
                </p>
                <p className="lead" style={{ marginTop: 18 }}>
                  One club. The same membership. The same line.
                </p>
              </div>
            </div>
          </div>

          <div className="wrap">
            <div className="locs">
              <div className="loc reveal">
                <div
                  className="lph"
                  style={{ ["--photo" as string]: "url(/assets/photos/lodge-exterior.jpg)" }}
                >
                  <span className="ghost">Camp Monroe</span>
                </div>
                <span className="badge open">Open · Est. 1893</span>
                <div className="inner">
                  <div
                    className="eyebrow"
                    style={{ color: "var(--color-amber)" }}
                  >
                    The flagship
                  </div>
                  <div className="nm" style={{ marginTop: 8 }}>
                    Camp Monroe
                  </div>
                  <div className="where">
                    Lake Cobbosseecontee · West Gardiner, ME
                  </div>
                  <p className="desc">
                    5,500 acres of water. Dining hall, lodge, dock. Open every season since 1893. The home
                    of the club.
                  </p>
                  <Link
                    className="ilink"
                    style={{ marginTop: 24, color: "var(--color-amber)", display: "inline-flex" }}
                    href="/the-camp"
                  >
                    Visit the camp <span className="arr" />
                  </Link>
                </div>
              </div>
              <div className="loc reveal d1">
                <div className="lph">
                  <span className="ghost">The Rod</span>
                </div>
                <span className="badge soon">In planning</span>
                <div className="inner">
                  <div
                    className="eyebrow muted"
                    style={{ color: "var(--cream-60)" }}
                  >
                    A second property
                  </div>
                  <div className="nm" style={{ marginTop: 8 }}>
                    A sporting property
                  </div>
                  <div className="where">Maine · to be announced</div>
                  <p className="desc">
                    Restoring the full &ldquo;Gun &amp; Rod&rdquo; &mdash; a working hunting and fishing
                    property to come, under the same club, the same membership, the same line.
                  </p>
                </div>
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
