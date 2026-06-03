import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import CtaBand from "@/components/site/CtaBand";

export const metadata = {
  title: "Du Bois at camp — The W.E.B. Files",
  description:
    "W.E.B. Du Bois was a member of the Cambridge Gun and Rod Club for more than two decades. Thirteen documents from the W.E.B. Du Bois Papers at UMass Amherst that touch the camp, between 1920 and 1947.",
};

// The thirteen archival items from the W.E.B. Du Bois Papers (MS 312)
// that touch the Cambridge Gun and Rod Club, in chronological order.
// Each item has a short year + title + Murray×Hemingway one-liner.
type FileItem = {
  src: string;
  alt: string;
  cap: string;
  year: string;
  title: string;
  desc: string;
};

const FILES: FileItem[] = [
  {
    src: "/assets/photos/group-portrait.png",
    alt: "W.E.B. Du Bois with members and guests at the camp, c. 1920",
    cap: "Group portrait at the camp, c. 1920",
    year: "1920",
    title: "Du Bois with members at the camp",
    desc: "The earliest known photograph of Du Bois at Camp Monroe.",
  },
  {
    src: "/assets/photos/wash-day-at-camp-monroe.png",
    alt: "W.E.B. Du Bois and another member at the lake's edge with washing buckets",
    cap: "Wash Day at Camp Monroe, 1925",
    year: "1925",
    title: "Wash Day at Camp Monroe",
    desc: "Du Bois and another member at the lake's edge.",
  },
  {
    src: "/assets/photos/dubois/1926-sorrento-article.png",
    alt: "Typed draft of an unpublished article by Du Bois about a Black resort at Sorrento on the Maine coast",
    cap: "Unpublished draft, c. 1926",
    year: "c. 1926",
    title: "Notes on a Maine resort",
    desc: "Unpublished draft. Du Bois is making the case for a Black resort at Sorrento, on the Maine coast.",
  },
  {
    src: "/assets/photos/dubois/1928-maine-savings-bank.png",
    alt: "Typed letter from W.E.B. Du Bois to the Maine Savings Bank in Portland, May 23, 1928",
    cap: "Letter to the Maine Savings Bank, 23 May 1928",
    year: "1928",
    title: "Letter to the Maine Savings Bank",
    desc: "Du Bois closes his daughter Yolande's account at the Portland branch.",
  },
  {
    src: "/assets/photos/maine-state-library-1933.png",
    alt: "Letter from the Maine State Library to W.E.B. Du Bois, October 24, 1933",
    cap: "Maine State Library to W.E.B. Du Bois, 24 October 1933",
    year: "1933",
    title: "Letter from the Maine State Library",
    desc: "Henry E. Dunnack, State Librarian, replying to Du Bois's request for the 1865 Maine statutes on vagrancy.",
  },
  {
    src: "/assets/photos/dubois/1937-vacation-schedule.png",
    alt: "W.E.B. Du Bois's typed vacation schedule for the summer of 1937",
    cap: "Vacation schedule, 7 June 1937",
    year: "1937",
    title: "Vacation schedule",
    desc: "Six weeks. Atlanta, New York, the Maine woods. Back to Atlanta.",
  },
  {
    src: "/assets/photos/dubois/1938-beekman-letter.png",
    alt: "Letter from W.E.B. Du Bois to Walter N. Beekman, June 2, 1938",
    cap: "Du Bois to Walter N. Beekman, 2 June 1938",
    year: "1938",
    title: "Letter to Walter N. Beekman",
    desc: "Enclosing his application to the Cambridge Gun and Rod Club for the season July 15 through August 6.",
  },
  {
    src: "/assets/photos/dubois/1938-shivery-letter.png",
    alt: "Letter from W.E.B. Du Bois in New York to Louie Shivery, July 11, 1938",
    cap: "Du Bois to Louie Shivery, 11 July 1938",
    year: "1938",
    title: "Letter to Louie Shivery",
    desc: "Du Bois is heading to the Maine woods. He asks her to write him at Cambridge Gun and Rod Club, Route 2, Litchfield, Maine.",
  },
  {
    src: "/assets/photos/dubois-hammock.png",
    alt: "W.E.B. Du Bois reading in a hammock at the camp, c. 1940",
    cap: "Du Bois at camp, c. 1940",
    year: "c. 1940",
    title: "Du Bois in the hammock",
    desc: "At the camp.",
  },
  {
    src: "/assets/photos/vacation-schedule-1945.png",
    alt: "NAACP vacation schedule, 1945, with Du Bois's dates circled",
    cap: "NAACP Vacation Schedule, 1945",
    year: "1945",
    title: "NAACP vacation schedule",
    desc: "Senior and junior executives. Du Bois's dates: August 6 through 18.",
  },
  {
    src: "/assets/photos/dubois/1946-groves-letter.png",
    alt: "Letter from W.E.B. Du Bois to Emma Groves, August 2, 1946",
    cap: "Du Bois to Emma Groves, 2 August 1946",
    year: "1946",
    title: "Letter to Emma Groves",
    desc: "Going to camp in Maine this weekend. He hopes to stop in Boston on the way back.",
  },
  {
    src: "/assets/photos/dubois/1946-return-to-sender.png",
    alt: "Envelope addressed to W.E.B. Du Bois at the Cambridge Gun and Rod Club in Litchfield, Maine, marked Return to Sender, August 16, 1946",
    cap: "Envelope, returned to sender, 16 August 1946",
    year: "1946",
    title: "Envelope, Return to Sender",
    desc: "Special delivery, air mail, addressed to him at the Cambridge Gun and Rod Club in Litchfield. He had already left.",
  },
  {
    src: "/assets/photos/letter-dorch-1947.png",
    alt: "Letter from W.E.B. Du Bois to Irwin T. Dorch, August 21, 1947",
    cap: "Du Bois to Irwin T. Dorch, 21 August 1947",
    year: "1947",
    title: "Letter to Irwin T. Dorch",
    desc: "Du Bois has a box stored at the camp. He asks Dorch to have it sent by railway express.",
  },
];

export default function DuBoisPage() {
  return (
    <>
      <Nav />
      <main>
        {/* HERO — the archival collage banner as the photo */}
        <section className="phero">
          <div
            className="photo photo-archival"
            style={{
              ["--photo" as string]:
                "url('/assets/photos/dubois-banner.png')",
            }}
          />
          <div className="hero-shot-meta">
            <span className="hero-tier">
              <span className="dot" />
              From the Du Bois Papers
            </span>
            <span className="hero-shot-note">UMass Amherst Libraries</span>
          </div>
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
                    src="/assets/photos/group-portrait.png"
                    alt="W.E.B. Du Bois with members and guests at the camp, c. 1920"
                  />
                  <div className="archival-cap">
                    Du Bois with members at the camp, c. 1920 &middot; Du Bois
                    Papers, UMass Amherst
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

        {/* THE FILES — thirteen archival documents */}
        <section className="light">
          <div className="wrap">
            <div className="sec-head reveal">
              <div className="eyebrow">The Files</div>
              <h2 className="sec-h" style={{ marginTop: 14 }}>
                Thirteen documents.
              </h2>
              <p className="lead" style={{ marginTop: 28, maxWidth: "62ch" }}>
                From the W.E.B. Du Bois Papers at the University of
                Massachusetts Amherst Libraries. Letters, photographs, vacation
                schedules, a returned envelope. Every document that touches the
                Cambridge Gun and Rod Club, between 1920 and 1947.
              </p>
            </div>
            <div className="dubois-files" style={{ marginTop: 64 }}>
              {FILES.map((f, i) => (
                <div className={`dubois-file reveal${i % 3 === 1 ? " d1" : i % 3 === 2 ? " d2" : ""}`} key={f.src}>
                  <div className="archival">
                    <img src={f.src} alt={f.alt} />
                    <div className="archival-cap">{f.cap}</div>
                  </div>
                  <div className="dubois-file-meta">
                    <div className="dubois-file-yr">{f.year}</div>
                    <div className="dubois-file-t">{f.title}</div>
                    <p className="dubois-file-d">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p
              className="reveal"
              style={{
                marginTop: 64,
                fontSize: 13,
                color: "var(--ink-60)",
                letterSpacing: "0.04em",
                maxWidth: "72ch",
              }}
            >
              All archival imagery courtesy of the W.E.B. Du Bois Papers (MS
              312), Special Collections and University Archives, W.E.B. Du Bois
              Library, University of Massachusetts Amherst.
            </p>
          </div>
        </section>

        {/* WHAT HE WROTE — six books published during his CGRC years */}
        <section className="dark">
          <div className="wrap">
            <div className="sec-head reveal">
              <div className="eyebrow">What he wrote during these years</div>
              <h2 className="sec-h" style={{ marginTop: 14 }}>
                Five books, and the years they were written.
              </h2>
            </div>
            <p
              className="lead reveal"
              style={{ marginTop: 32, maxWidth: "62ch" }}
            >
              Du Bois published five books during his time as a member of the
              Cambridge Gun and Rod Club:
            </p>
            <div className="dubois-works reveal d1" style={{ marginTop: 32 }}>
              <div className="work">
                <div className="work-yr">1928</div>
                <div className="work-bd">
                  <div className="work-t">Dark Princess: A Romance</div>
                  <p>A novel about race, class, and global politics.</p>
                </div>
              </div>
              <div className="work">
                <div className="work-yr">1935</div>
                <div className="work-bd">
                  <div className="work-t">
                    Black Reconstruction in America, 1860&ndash;1880
                  </div>
                  <p>
                    Du Bois&rsquo;s defining study of the Reconstruction era and
                    the Black contribution to its labor, politics, and ideas.
                  </p>
                </div>
              </div>
              <div className="work">
                <div className="work-yr">1939</div>
                <div className="work-bd">
                  <div className="work-t">Black Folk, Then and Now</div>
                  <p>
                    A history and sociology of Black people in Africa and the
                    Americas. The reach of slavery and colonialism.
                  </p>
                </div>
              </div>
              <div className="work">
                <div className="work-yr">1940</div>
                <div className="work-bd">
                  <div className="work-t">Dusk of Dawn</div>
                  <p>
                    Part autobiography, part social commentary. The &ldquo;color
                    line&rdquo; &mdash; the phrase he gave the century &mdash;
                    and his own life inside it.
                  </p>
                </div>
              </div>
              <div className="work">
                <div className="work-yr">1945</div>
                <div className="work-bd">
                  <div className="work-t">Color and Democracy: Colonies and Peace</div>
                  <p>
                    An argument for the decolonization of Africa and the
                    Caribbean as essential to world peace.
                  </p>
                </div>
              </div>
            </div>
            <p
              className="lead reveal d2"
              style={{ marginTop: 56, maxWidth: "68ch" }}
            >
              The camp was not where he wrote them. He wrote them in New York
              and Atlanta. The camp was where he could put the work down and
              pick it back up the following August. Across these same years he
              was also editing <em>The Crisis</em> at the NAACP.
            </p>
          </div>
        </section>

        {/* WHY THIS PAGE EXISTS + FURTHER READING */}
        <section className="light">
          <div className="wrap">
            <div className="split">
              <div className="txt">
                <div className="eyebrow reveal">What this page is for</div>
                <h2 className="sec-h reveal d1" style={{ marginTop: 18 }}>
                  A small piece of the record, in one place.
                </h2>
                <p className="lead reveal d2" style={{ marginTop: 28 }}>
                  The W.E.B. Du Bois Papers at UMass Amherst hold over a hundred
                  thousand items. The thirteen above are the ones that touch
                  the Cambridge Gun and Rod Club. They are easy to miss in the
                  larger record. We are putting them in one place because the
                  camp was a place he came back to, and that is worth saying
                  plainly.
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
