import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import Ph from "@/components/site/Ph";
import CtaBand from "@/components/site/CtaBand";
import { getPageContent, t } from "@/lib/data/content";

export const metadata = {
  title: "2026 Renovation — Camp Monroe, Maine",
};

const SCOPE_ITEMS = [
  {
    title: "Dining hall & kitchen",
    copy: "A restored hall facing the sunset, and a full commercial kitchen behind it — built for members' tables, gatherings, and the long days of August.",
    now: {
      src: "/assets/photos/dining-hall-summer.jpg",
      cap: "Photograph — the dining hall, summer afternoon",
    },
    then: {
      cap: "Rendering — the renovated dining hall & kitchen [2026]",
    },
  },
  {
    title: "The dock",
    copy: "A new deck on the original footing — the heart of the waterfront, for fishing, swimming, and the launch.",
    now: {
      src: "/assets/photos/stone-steps.jpg",
      cap: "Photograph — the stone steps down to the lake",
    },
    then: {
      cap: "Rendering — the rebuilt dock [2026]",
    },
  },
  {
    title: "The lodge",
    copy: "Refreshed rooms, refinished floors, and bathrooms — including a fully accessible one — so the lodge is ready for members and guests year-round.",
    now: {
      src: "/assets/photos/lodge-interior.jpg",
      cap: "Photograph — the lodge interior, looking through to the chimney",
    },
    then: {
      src: "/assets/photos/shower-rendering.png",
      cap: "Rendering — refreshed lodge bathrooms [2026]",
    },
  },
];

export default async function RenovationPage() {
  const c = await getPageContent("renovation");
  return (
    <>
      <Nav />
      <main>
        <section className="phero">
          <div
            className="photo photo-modern"
            style={{
              ["--photo" as string]: `url(${t(c, "hero.image_url", "/assets/photos/bathroom-rendering.png")})`,
            }}
          />
          <div className="hero-shot-meta">
            <span className="hero-tier">
              <span className="dot" />
              2026 Rendering · Lodge bathrooms
            </span>
            <span className="hero-shot-note">Draft · final June 2026</span>
          </div>
          <div className="wrap phero-inner">
            <div className="hero-loc reveal">
              <span className="tick" />
              <span className="tx">Coming June 19, 2026 · Unveiled Juneteenth</span>
            </div>
            <h1 className="reveal d1" style={{ marginTop: 28 }}>
              The next chapter of a place that <em>never closed.</em>
            </h1>
          </div>
        </section>

        <section className="light">
          <div className="wrap">
            <div className="split">
              <div className="txt">
                <div className="eyebrow reveal">The 2026 Renovation</div>
                <h2 className="sec-h reveal d1" style={{ marginTop: 18 }}>
                  Dining hall, kitchen, dock, lodge.
                </h2>
              </div>
              <div className="reveal d2">
                <p className="lead">
                  The club has welcomed members every summer for 130 years. In 2026, three of its core
                  buildings get a careful, top-to-bottom renovation &mdash; true to the place, ready for the
                  next century. The scope is deliberately tight: the buildings that the camp turns on.
                </p>
                <div className="facts" style={{ marginTop: 40, paddingTop: 32 }}>
                  <div className="fact">
                    <div className="fk">Scope</div>
                    <div className="fv">Dining hall, kitchen, dock, lodge.</div>
                  </div>
                  <div className="fact">
                    <div className="fk">Unveiled</div>
                    <div className="fv">June 19, 2026 — Juneteenth.</div>
                  </div>
                  <div className="fact">
                    <div className="fk">Open</div>
                    <div className="fv">The club, every summer since 1893.</div>
                  </div>
                </div>
              </div>
            </div>

            {SCOPE_ITEMS.map((item, i) => (
              <div
                key={item.title}
                className="reveal"
                style={{ marginTop: i === 0 ? 80 : 96 }}
              >
                <div className="reno-scope">
                  <div>
                    <div className="sn">Scope 0{i + 1}</div>
                    <h3 className="st">{item.title}</h3>
                  </div>
                  <p>{item.copy}</p>
                </div>
                <div className="reno-pair">
                  <Ph
                    src={item.now.src}
                    cap={item.now.cap}
                    tag="Today"
                  />
                  <Ph
                    src={item.then.src}
                    cap={item.then.cap}
                    tag="2026 Rendering"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
