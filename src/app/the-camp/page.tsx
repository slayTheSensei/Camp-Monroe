import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import Counter from "@/components/site/Counter";
import Ph from "@/components/site/Ph";
import CtaBand from "@/components/site/CtaBand";

export const metadata = {
  title: "The Camp — Camp Monroe, Maine",
};

export default function TheCampPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="phero">
          <div
            className="photo photo-modern"
            style={{ ["--photo" as string]: "url(/assets/photos/dining-hall-summer.jpg)" }}
          />
          <div className="hero-shot-meta">
            <span className="hero-tier">
              <span className="dot" />
              Photograph · the dining hall &amp; lake
            </span>
            <span className="hero-shot-note">West Gardiner, Maine</span>
          </div>
          <div className="wrap phero-inner">
            <div className="hero-loc reveal">
              <span className="tick" />
              <span className="tx">
                The flagship · Lake Cobbosseecontee, West Gardiner, Maine
              </span>
            </div>
            <h1 className="reveal d1" style={{ marginTop: 28 }}>
              Camp <em>Monroe.</em>
            </h1>
          </div>
        </section>

        <section className="light">
          <div className="wrap">
            <div className="split-bias">
              <div className="txt">
                <div className="eyebrow reveal">The place</div>
                <h2 className="sec-h reveal d1" style={{ marginTop: 18 }}>
                  A lake, a dining hall, a dock &mdash; and a hundred and thirty summers.
                </h2>
                <p className="lead reveal d2" style={{ marginTop: 28 }}>
                  Camp Monroe sits on Lake Cobbosseecontee in West Gardiner: fifteen minutes from Augusta,
                  under an hour from Portland, two and a half from Boston. The dining hall faces the sunset.
                  The dock is the heart of the place. Outside a handful of private events each season, the
                  camp belongs to its members.
                </p>
                <div className="facts reveal d3">
                  <div className="fact">
                    <div className="fk">Augusta</div>
                    <div className="fv">15 minutes by car</div>
                  </div>
                  <div className="fact">
                    <div className="fk">Portland</div>
                    <div className="fv">Under an hour</div>
                  </div>
                  <div className="fact">
                    <div className="fk">Boston</div>
                    <div className="fv">Two and a half hours</div>
                  </div>
                </div>
              </div>
              <div className="reveal d2">
                <Ph
                  src="/assets/photos/stone-steps.jpg"
                  alt="The stone steps down to the lake"
                  cap="Photograph — the stone steps down to the lake"
                />
              </div>
            </div>

            {/* GALLERY */}
            <div className="gallery">
              <div className="ph big" style={{ position: "relative" }}>
                <img
                  src="/assets/photos/lake-golden.jpg"
                  alt="Lake Cobbosseecontee at golden hour"
                  loading="lazy"
                />
                <span className="cap">
                  Photograph — Lake Cobbosseecontee, golden hour
                </span>
              </div>
              <div className="ph">
                <img
                  src="/assets/photos/lodge-exterior.jpg"
                  alt="The lodge — the main house"
                  loading="lazy"
                />
                <span className="cap">The lodge — the main house</span>
              </div>
              <div className="ph">
                <img
                  src="/assets/photos/canoe-sunset.jpg"
                  alt="Canoe at the shore at sunset"
                  loading="lazy"
                />
                <span className="cap">Canoes at the shore</span>
              </div>
              <div className="ph wide">
                <img
                  src="/assets/photos/open-water-dusk.jpg"
                  alt="Open water at dusk"
                  loading="lazy"
                />
                <span className="cap">Open water at dusk</span>
              </div>
              <div className="ph">
                <img
                  src="/assets/photos/shore-jeep.jpg"
                  alt="The shore in summer"
                  loading="lazy"
                />
                <span className="cap">The shore in summer</span>
              </div>
              <div className="ph">
                <img
                  src="/assets/photos/pines-forest.jpg"
                  alt="Pines and the path to the lake"
                  loading="lazy"
                />
                <span className="cap">Pines &amp; the path to the lake</span>
              </div>
              <div className="ph tall">
                <img
                  src="/assets/photos/table-sunset.jpg"
                  alt="Dock at dusk"
                  loading="lazy"
                />
                <span className="cap">The dock at dusk</span>
              </div>
              <div className="ph">
                <img
                  src="/assets/photos/lake-autumn.jpg"
                  alt="Autumn on the lake"
                  loading="lazy"
                />
                <span className="cap">Autumn on the water</span>
              </div>
              <div className="ph">
                <img
                  src="/assets/photos/camp-monroe-sign.jpg"
                  alt="Camp Monroe sign"
                  loading="lazy"
                />
                <span className="cap">The Camp Monroe sign at the front door</span>
              </div>
              <div className="ph">
                <img
                  src="/assets/photos/long-table.jpg"
                  alt="The long table"
                  loading="lazy"
                />
                <span className="cap">The long table at the lake&rsquo;s edge</span>
              </div>
            </div>
          </div>
        </section>

        {/* THE WATER */}
        <section className="dark">
          <div className="wrap">
            <div className="split rev">
              <div className="reveal">
                <Ph
                  src="/assets/photos/lake-autumn.jpg"
                  alt="Lake Cobbosseecontee, mid-October"
                  cap="Photograph — Lake Cobbosseecontee, mid-October"
                />
              </div>
              <div className="txt">
                <div className="eyebrow reveal">The water</div>
                <h2 className="sec-h reveal d1" style={{ marginTop: 18 }}>
                  One of the best bass lakes in the Northeast.
                </h2>
                <p className="lead reveal d2" style={{ marginTop: 28 }}>
                  Five and a half thousand acres of water, a hundred feet deep in places. Smallmouth and
                  largemouth, plus swimming, paddling, sailing, and open water for boats. Golf and the hills
                  of central Maine are minutes away; the coast is an hour off.
                </p>
                <div
                  className="stat-band reveal d3"
                  style={{ marginTop: 56 }}
                >
                  <div className="stat">
                    <div className="num">
                      <Counter to={5500} />
                    </div>
                    <div className="lab">Acres of lake</div>
                  </div>
                  <div className="stat">
                    <div className="num">
                      <Counter to={100} suffix="ft" />
                    </div>
                    <div className="lab">Depth, in places</div>
                  </div>
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
