import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import CtaBand from "@/components/site/CtaBand";
import { getTimelineItems, getPageContent, t } from "@/lib/data/content";

export const metadata = {
  title: "History — Cambridge Gun & Rod Club",
};

// Fallback used when the DB has no rows (initial deploy, RLS issue, etc.).
// The seed migration populates these same values into timeline_items;
// keeping them inline preserves graceful rendering if the table is empty.
const FALLBACK_TIMELINE = [
  {
    year: "1893",
    head: "The club is founded",
    body: "A circle of Black Bostonians — Pullman porters and professionals shut out of America's clubs — incorporate the Cambridge Gun & Rod Club and claim a stretch of Lake Cobbosseecontee for themselves.",
  },
  {
    year: "1920s",
    head: "A summer institution takes shape",
    body: "The dining hall and lodge anchor the season. The camp becomes a destination for Black professional families across New England and the mid-Atlantic — and a working part of the era's Black summer geography.",
  },
  {
    year: "1928",
    head: "W.E.B. Du Bois begins his Maine summers",
    body: 'Du Bois opens an account at the Maine Savings Bank and begins summering near Cobbosseecontee. Over the next two decades he returns again and again, writing letters from the lake — “his Walden.”',
  },
  {
    year: "1947",
    head: "“I have a box at the Cambridge Gun and Rod Club”",
    body: "Du Bois writes Mr. Dorch from the road, asking for his trunk to be sent by railway express. The letter survives in the Du Bois Papers at UMass Amherst — small evidence of a long affiliation.",
  },
  {
    year: "Mid-c.",
    head: "Joe Louis among the guests",
    body: "The champion Joe Louis visits the camp. The line of guests across the century reads like a quiet ledger of Black American life — figures who came not to perform, but to rest.",
  },
  {
    year: "2026",
    head: "A women's chapter opens the line",
    body: "For the first time in 133 years, the line opens to a women's chapter — identical standing, the same buy-in, the same hold for life. The same summer. The camp's core buildings are renovated for the next hundred years.",
  },
];

export default async function HistoryPage() {
  const [dbItems, c] = await Promise.all([
    getTimelineItems(),
    getPageContent("history"),
  ]);
  const timeline =
    dbItems.length > 0
      ? dbItems.map((d) => ({ year: d.year, head: d.head, body: d.body }))
      : FALLBACK_TIMELINE;
  return (
    <>
      <Nav />
      <main>
        <section className="phero">
          <div
            className="photo photo-archival"
            style={{
              ["--photo" as string]: `url(${t(c, "hero.image_url", "/assets/photos/dubois-hammock.png")})`,
            }}
          />
          <div className="hero-shot-meta">
            <span className="hero-tier">
              <span className="dot" />
              Archival · Du Bois at camp, c.1935
            </span>
            <span className="hero-shot-note">Du Bois Papers · UMass</span>
          </div>
          <div className="wrap phero-inner">
            <div className="hero-loc reveal">
              <span className="tick" />
              <span className="tx">The history · Since 1893, every season</span>
            </div>
            <h1 className="reveal d1" style={{ marginTop: 28 }}>
              The coalition of the <em>excluded.</em>
            </h1>
          </div>
        </section>

        <section className="light">
          <div className="wrap">
            <div className="split">
              <div className="txt">
                <div className="eyebrow reveal">The founding</div>
                <h2 className="sec-h reveal d1" style={{ marginTop: 18 }}>
                  They were shut out of America&rsquo;s clubs. So they built their own &mdash; and never
                  gave it back.
                </h2>
                <p className="lead reveal d2" style={{ marginTop: 28 }}>
                  In 1893, a circle of Black Bostonians &mdash; Pullman porters, ministers, doctors, lawyers
                  &mdash; claimed a piece of Lake Cobbosseecontee for themselves. They called it the
                  Cambridge Gun &amp; Rod Club. Over the next century it became one of the most enduring
                  Black institutions in the country: a place of rest and standing.
                </p>
                <p className="lead reveal d3" style={{ marginTop: 18 }}>
                  Its most renowned member was W.E.B. Du Bois &mdash; not a founder; a member &mdash; who
                  returned summer after summer and called the camp his Walden. The champion Joe Louis was a
                  guest. The historic men&rsquo;s chapter still keeps the first full week of August. In 2026
                  a women&rsquo;s chapter opens the line for the first time.
                </p>
              </div>
              <div className="reveal d2">
                <div className="archival">
                  <img
                    src="/assets/photos/wash-day-at-camp-monroe.png"
                    alt="Wash Day at Camp Monroe — a member at the lake's edge"
                  />
                  <div className="archival-cap">
                    &ldquo;Wash Day at Camp Monroe&rdquo; · W.E.B. Du Bois Papers, UMass Amherst
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section className="dark">
          <div className="wrap">
            <div className="sec-head reveal">
              <div className="eyebrow">The record</div>
              <h2 className="sec-h" style={{ marginTop: 14 }}>
                One hundred and thirty years, in beats.
              </h2>
            </div>
            <div className="tl">
              {timeline.map((item, i) => (
                <div
                  key={`${item.year}-${i}`}
                  className={`tl-item reveal${i % 2 === 1 ? " d1" : ""}`}
                >
                  <div className="tl-yr">{item.year}</div>
                  <div className="tl-bd">
                    <div className="h">{item.head}</div>
                    <p>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* THE W.E.B. FILES */}
        <section className="light">
          <div className="wrap">
            <div className="sec-head reveal">
              <div className="eyebrow">The W.E.B. Files</div>
              <h2 className="sec-h" style={{ marginTop: 14, maxWidth: "24ch" }}>
                The evidence is in the paper.
              </h2>
              <p className="lead" style={{ marginTop: 28 }}>
                A handful of primary sources from the W.E.B. Du Bois Papers at the University of
                Massachusetts Amherst &mdash; letters, envelopes, vacation schedules &mdash; document the
                long association between Du Bois and the Cambridge Gun &amp; Rod Club.
              </p>
            </div>
            <div className="archival-strip">
              <div className="reveal">
                <div className="archival">
                  <img
                    src="/assets/photos/letter-dorch-1947.png"
                    alt="Letter from W.E.B. Du Bois to Mr. Dorch, 1947"
                  />
                  <div className="archival-cap">
                    Letter · Du Bois to Mr. Dorch, 21 August 1947
                  </div>
                </div>
              </div>
              <div className="reveal d1">
                <div className="archival">
                  <img
                    src="/assets/photos/vacation-schedule-1945.png"
                    alt="NAACP vacation schedule, 1945"
                  />
                  <div className="archival-cap">
                    NAACP Vacation Schedule, 1945 · Du Bois&rsquo;s camp dates circled
                  </div>
                </div>
              </div>
              <div className="reveal d2">
                <div className="archival">
                  <img
                    src="/assets/photos/maine-state-library-1933.png"
                    alt="Letter from the Maine State Library to W.E.B. Du Bois, 1933"
                  />
                  <div className="archival-cap">
                    Maine State Library to W.E.B. Du Bois, October 1933
                  </div>
                </div>
              </div>
            </div>
            <p
              className="lead reveal"
              style={{
                marginTop: 48,
                fontSize: 13,
                color: "var(--ink-60)",
                letterSpacing: "0.04em",
              }}
            >
              All archival imagery courtesy of the W.E.B. Du Bois Papers (MS 312), Special Collections and
              University Archives, W.E.B. Du Bois Library, University of Massachusetts Amherst.
            </p>
          </div>
        </section>

        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
