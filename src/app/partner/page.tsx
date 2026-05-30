import PartnerClient, { type PartnerWay } from "./PartnerClient";
import { getWaysToPartnerItems, getPageContent, t } from "@/lib/data/content";

export const metadata = {
  title: "Partner with us — Cambridge Gun & Rod Club",
};

// Fallback ways used if DB has no rows. Seeded by Block B1 migration so
// production should always have content; this is the safety net.
const FALLBACK_WAYS: PartnerWay[] = [
  {
    n: "01",
    t: "Capital & investment",
    d: "The 2026 renovation, and a second sporting property to come. Patient capital for buildings meant to stand another hundred years — not a quarter.",
  },
  {
    n: "02",
    t: "Heritage & preservation",
    d: "The longest-running Black outdoor heritage site in New England. We work with institutions and policymakers safeguarding the record, the land, and its designation.",
  },
  {
    n: "03",
    t: "Press & storytelling",
    d: "A 130-year record and the W.E.B. Files — letters, envelopes, schedules from the Du Bois Papers. For journalists, filmmakers, and scholars telling the story straight.",
  },
  {
    n: "04",
    t: "Community & corporate",
    d: "Group visits, sponsorship, and partnerships that open the camp to more of the communities it was built for. Off-season and shoulder weeks at the lake.",
  },
];

export default async function PartnerPage() {
  const [dbWays, c] = await Promise.all([
    getWaysToPartnerItems(),
    getPageContent("partner"),
  ]);
  const ways: PartnerWay[] =
    dbWays.length > 0
      ? dbWays.map((w) => ({ n: w.number, t: w.title, d: w.description }))
      : FALLBACK_WAYS;

  const heroImage = t(c, "hero.image_url", "/assets/photos/open-water-dusk.jpg");

  return <PartnerClient ways={ways} heroImage={heroImage} />;
}
