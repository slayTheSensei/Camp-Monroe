import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import CtaBand from "@/components/site/CtaBand";

export const metadata = {
  title: "Du Bois at camp — The W.E.B. Files",
  description:
    "W.E.B. Du Bois was a member of the Cambridge Gun and Rod Club for more than two decades. Letters, photographs, and an envelope marked Return to Sender — from the W.E.B. Du Bois Papers at UMass Amherst.",
};

export default function DuBoisPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="phero">
          <div className="wrap phero-inner">
            <div className="hero-loc reveal">
              <span className="tick" />
              <span className="tx">The W.E.B. Files</span>
            </div>
            <h1 className="reveal d1" style={{ marginTop: 28 }}>
              Du Bois at <em>camp.</em>
            </h1>
          </div>
        </section>

        {/* BANNER — the archival collage from the UMass Du Bois Papers */}
        <section className="light">
          <div className="wrap">
            <div className="archival reveal">
              <img
                src="/assets/photos/dubois-banner.png"
                alt="An archival collage from the W.E.B. Du Bois Papers: letters, photographs of Du Bois at the camp, and an envelope addressed to him at the Cambridge Gun and Rod Club in Litchfield, Maine."
              />
              <div className="archival-cap">
                Letters, photographs, and an envelope marked for the camp ·
                W.E.B. Du Bois Papers, UMass Amherst
              </div>
            </div>
          </div>
        </section>

        {/* A REGULAR AT THE CAMP */}
        <section className="light">
          <div className="wrap">
            <div className="split">
              <div className="txt">
                <div className="eyebrow reveal">A regular at the camp</div>
                <h2 className="sec-h reveal d1" style={{ marginTop: 18 }}>
                  He came back, year after year.
                </h2>
                <p className="lead reveal d2" style={{ marginTop: 28 }}>
                  W.E.B. Du Bois was a member of the Cambridge Gun and Rod Club
                  for more than two decades. The archive at UMass Amherst shows
                  letters from 1921 onward &mdash; letters from Du Bois at the
                  camp, letters to him at the camp, an envelope sent to him in
                  Maine in the summer of 1946 marked <em>Return to Sender</em>{" "}
                  because he had already left for New York.
                </p>
                <p className="lead reveal d3" style={{ marginTop: 18 }}>
                  He came in summer. He fished. He rested. He wrote. He went
                  back to the work.
                </p>
              </div>
              <div className="reveal d2">
                <div className="archival">
                  <img
                    src="/assets/photos/dubois-hammock.png"
                    alt="W.E.B. Du Bois reading in a hammock at the camp, c. 1935"
                  />
                  <div className="archival-cap">
                    Du Bois at camp, c. 1935 · Du Bois Papers, UMass Amherst
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT THE CAMP WAS TO HIM */}
        <section className="dark">
          <div className="wrap">
            <div className="sec-head reveal">
              <div className="eyebrow">What the camp was to him</div>
              <h2 className="sec-h" style={{ marginTop: 14, maxWidth: "22ch" }}>
                A place to put the work down.
              </h2>
            </div>
            <div className="split" style={{ marginTop: 56 }}>
              <div className="txt">
                <p className="lead reveal">
                  Du Bois was one of the most prolific intellectuals of the
                  twentieth century. He needed a place to stop being that. The
                  camp was private then. It is private now. He came back because
                  nobody at the lake was asking him to perform.
                </p>
                <p className="lead reveal d1" style={{ marginTop: 18 }}>
                  In the photographs he is reading in a hammock. He is in the
                  group portraits with the men who ran the club. He is at the
                  lake. He looks like a man on vacation, because that is what he
                  was.
                </p>
              </div>
              <div className="txt reveal d2">
                <p className="lead">
                  The Cambridge Gun and Rod Club had been open every August
                  since 1893. By the time Du Bois became a regular, the camp had
                  its own shape: a dining hall, a lodge, a dock, a lake. The
                  members ran it themselves and have for a hundred and thirty
                  years.
                </p>
                <p className="lead" style={{ marginTop: 18 }}>
                  Du Bois fit into that shape. He came back into it every
                  summer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT HE WROTE */}
        <section className="light">
          <div className="wrap">
            <div className="sec-head reveal">
              <div className="eyebrow">What he wrote during these years</div>
              <h2 className="sec-h" style={{ marginTop: 14 }}>
                Three books, and the years they were written.
              </h2>
            </div>
            <p
              className="lead reveal"
              style={{ marginTop: 32, maxWidth: "62ch" }}
            >
              Du Bois published three of his most enduring works during his time
              as a regular at the camp:
            </p>
            <div className="dubois-works reveal d1" style={{ marginTop: 32 }}>
              <div className="work">
                <div className="work-yr">1928</div>
                <div className="work-bd">
                  <div className="work-t">Dark Princess</div>
                  <p>A novel about race, class, and global politics.</p>
                </div>
              </div>
              <div className="work">
                <div className="work-yr">1935</div>
                <div className="work-bd">
                  <div className="work-t">Black Reconstruction in America</div>
                  <p>
                    Du Bois&rsquo;s defining study of the Reconstruction era and
                    the Black contribution to its labor, politics, and ideas.
                  </p>
                </div>
              </div>
              <div className="work">
                <div className="work-yr">1945</div>
                <div className="work-bd">
                  <div className="work-t">Color and Democracy</div>
                  <p>
                    An examination of colonialism and democratic theory after
                    the Second World War.
                  </p>
                </div>
              </div>
            </div>
            <p
              className="lead reveal d2"
              style={{ marginTop: 56, maxWidth: "62ch" }}
            >
              The camp was not where he wrote them. He wrote them in New York
              and Atlanta. The camp was where he could put the work down and
              pick it back up the following August.
            </p>
          </div>
        </section>

        {/* WHY THIS PAGE EXISTS */}
        <section className="dark">
          <div className="wrap">
            <div className="split">
              <div className="txt">
                <div className="eyebrow reveal">What this page is for</div>
                <h2 className="sec-h reveal d1" style={{ marginTop: 18 }}>
                  A small piece of the record, in one place.
                </h2>
                <p className="lead reveal d2" style={{ marginTop: 28 }}>
                  The W.E.B. Du Bois Papers at UMass Amherst hold over a hundred
                  thousand items. A small fraction of them touch the Cambridge
                  Gun and Rod Club. It is easy to miss them in the larger
                  record. We are putting them in one place because the camp was
                  a place he came back to, and that is worth saying plainly.
                </p>
              </div>
              <div className="txt reveal d2">
                <div className="eyebrow">Further reading</div>
                <ul className="dubois-links" style={{ marginTop: 18 }}>
                  <li>
                    <a
                      href="https://credo.library.umass.edu/view/collection/mums312"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      W.E.B. Du Bois Papers
                    </a>
                    <span className="dubois-link-note">
                      Special Collections and University Archives, UMass Amherst
                      Libraries
                    </span>
                  </li>
                  <li>
                    <a
                      href="https://naacp.org/find-resources/history-explained/civil-rights-leaders/web-du-bois"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      W.E.B. Du Bois at the NAACP
                    </a>
                    <span className="dubois-link-note">
                      Founding leader, editor of <em>The Crisis</em>
                    </span>
                  </li>
                  <li>
                    <a
                      href="https://www.loc.gov/collections/?fa=subject%3Adu+bois%2C+w.+e.+b.+%28william+edward+burghardt%29%2C+1868-1963"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Du Bois at the Library of Congress
                    </a>
                    <span className="dubois-link-note">
                      Digital collections, papers and photographs
                    </span>
                  </li>
                </ul>
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
