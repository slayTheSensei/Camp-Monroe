import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import CtaBand from "@/components/site/CtaBand";
import { getTimelineItems, getPageContent, t } from "@/lib/data/content";

export const metadata = {
  title: "History — Cambridge Gun & Rod Club",
};

// CMS-driven page: timeline_items + page_content are read on every request
// so staff edits in /admin propagate immediately. Without this, Next.js
// statically optimizes the page at build time and DB changes don't show
// until the next deploy.
export const dynamic = "force-dynamic";

// Fallback used when the DB has no rows (initial deploy, RLS issue, etc.).
// The seed migration populates these same values into timeline_items;
// keeping them inline preserves graceful rendering if the table is empty.
const FALLBACK_TIMELINE = [
  {
    year: "1893",
    head: "Founded",
    body: "A group of Black and Jewish men in Boston wanted a hunting and fishing camp of their own. They found Lake Cobbosseecontee, leased the land from the Goodwin family for a hundred years, and opened the Cambridge Gun and Rod Club that August.",
  },
  {
    year: "1920s–1950s",
    head: "A summer institution",
    body: "Doctors, lawyers, ministers, scholars — W.E.B. Du Bois among them — come back summer after summer. By the late 1940s the Jewish members no longer need a club of their own; they've been absorbed into white American institutions. The Cambridge Gun and Rod Club continues, primarily Black.",
  },
  {
    year: "1970s–2013",
    head: "Three decades on the lake",
    body: "Generations come back, year after year. Many take the first week at camp and meet their families on Martha's Vineyard for the rest of August. In 2013 the hundred-year lease ends; a group of members buys the camp from the Goodwin grandchildren. The Goodwin grandson stays on as the caretaker.",
  },
  {
    year: "2026",
    head: "The next chapter",
    body: "A women's chapter joins. The camp's core buildings — dining hall, dock, lodge — get a major renovation. The club starts looking at a second property. A place founded by people kept out keeps the door wide.",
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
              Du Bois at camp, c. 1935
            </span>
            <span className="hero-shot-note">Du Bois Papers · UMass</span>
          </div>
          <div className="wrap phero-inner">
            <div className="hero-loc reveal">
              <span className="tick" />
              <span className="tx">Every August since 1893</span>
            </div>
            <h1 className="reveal d1" style={{ marginTop: 28 }}>
              How it <em>started.</em>
            </h1>
          </div>
        </section>

        <section className="light">
          <div className="wrap">
            <div className="split">
              <div className="txt">
                <div className="eyebrow reveal">The founding</div>
                <h2 className="sec-h reveal d1" style={{ marginTop: 18 }}>
                  Shut out of Boston&rsquo;s clubs. So they built one of their own.
                </h2>
                <p className="lead reveal d2" style={{ marginTop: 28 }}>
                  In 1893 a group of Black and Jewish men in Boston were shut out of the
                  city&rsquo;s hunting and fishing clubs. So they built one of their own.
                  The Pullman porters among them scouted Lake Cobbosseecontee on the run
                  between Boston and Maine. They got to know the Goodwin family, who owned
                  land on the lake. The Goodwins leased it to them for one hundred years,
                  for one dollar. They built a dining hall and a lodge, named it the
                  Cambridge Gun and Rod Club, and opened it that August.
                </p>
                <p className="lead reveal d3" style={{ marginTop: 18 }}>
                  By the 1920s the camp drew lawyers, judges, ministers, and scholars.
                  W.E.B. Du Bois was a member, not a founder. He came back summer after
                  summer and treated the camp like his Walden Pond. The boxer Joe Louis
                  came as a guest. The men&rsquo;s chapter still takes the first full week
                  of August. In 2026 a women&rsquo;s chapter joins.
                </p>
                <p className="lead reveal d4" style={{ marginTop: 18 }}>
                  The grandson of the Goodwin who first leased the land is the caretaker
                  of the camp today.
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
                The beats.
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
                What&rsquo;s in the papers.
              </h2>
              <p className="lead" style={{ marginTop: 28 }}>
                A few documents from the Du Bois Papers at UMass Amherst. Letters. Envelopes.
                Vacation schedules. They show what we already knew: Du Bois came back to the
                camp summer after summer.
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
