import Link from "next/link";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import CtaBand from "@/components/site/CtaBand";
import { getPageContent, t } from "@/lib/data/content";

export const metadata = {
  title: "Locations — Cambridge Gun & Rod Club",
};

export default async function LocationsPage() {
  const c = await getPageContent("locations");
  return (
    <>
      <Nav />
      <main>
        <section className="phero">
          <div
            className="photo photo-modern"
            style={{
              ["--photo" as string]: `url(${t(c, "hero.image_url", "/assets/photos/open-water-dusk.jpg")})`,
            }}
          />
          <div className="hero-shot-meta">
            <span className="hero-tier">
              <span className="dot" />
              Lake Cobbosseecontee at dusk
            </span>
            <span className="hero-shot-note">
              The properties
            </span>
          </div>
          <div className="wrap phero-inner">
            <div className="hero-loc reveal">
              <span className="tick" />
              <span className="tx">Camp Monroe · A sporting property to come</span>
            </div>
            <h1 className="reveal d1" style={{ marginTop: 28 }}>
              Camp Monroe.
              <br />
              And what&rsquo;s <em>next.</em>
            </h1>
          </div>
        </section>

        <section className="light">
          <div className="wrap">
            <div className="split">
              <div className="txt">
                <div className="eyebrow reveal">The club</div>
                <h2 className="sec-h reveal d1" style={{ marginTop: 18 }}>
                  The club is the constant.
                </h2>
              </div>
              <div className="reveal d2">
                <p className="lead">
                  The Cambridge Gun and Rod Club is the institution. Camp Monroe is the
                  place. We have held the camp on Lake Cobbosseecontee since 1893.
                </p>
                <p className="lead" style={{ marginTop: 18 }}>
                  A second property, a sporting one, is in the works. Same club. Same membership.
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
                    5,500 acres of water. Dining hall. Lodge. Dock. Open every August since 1893.
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
                    A hunting and fishing property to come. Same club. Same members.
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
