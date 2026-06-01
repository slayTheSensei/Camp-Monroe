import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import VisitClient from "./VisitClient";
import {
  getActiveSeasons,
  getPublicBlackouts,
  getBookedRanges,
  getHeldRanges,
} from "@/lib/data/retreats";
import type { BookedRange } from "@/lib/types/retreats";
import { getPageContent, t } from "@/lib/data/content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Visit — Camp Monroe, Maine",
};

export default async function VisitPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  const initialMode = mode === "buyout" ? "buyout" : "host";

  const today = new Date().toISOString().slice(0, 10);

  const [seasons, blackouts, bookedRanges, heldRanges, content] =
    await Promise.all([
      getActiveSeasons(),
      getPublicBlackouts(today),
      getBookedRanges(today),
      getHeldRanges(),
      getPageContent("visit"),
    ]);

  const copy = {
    hostHeadlinePart1: t(content, "hero.host_headline_p1", "A quiet lakefront for the work that"),
    hostHeadlineEmphasis: t(content, "hero.host_headline_emph", "matters."),
    buyoutHeadlinePart1: t(content, "hero.buyout_headline_p1", "A quiet week on the"),
    buyoutHeadlineEmphasis: t(content, "hero.buyout_headline_emph", "lake."),
    hostLead: t(
      content,
      "hero.host_lead",
      "A historic Maine lakefront for gatherings of 8 to 24 — wellness intensives, creative residencies, offsites, cultural convenings. You needn't be a member; request your dates and we read every inquiry by hand."
    ),
    buyoutLead: t(
      content,
      "hero.buyout_lead",
      "Between retreats, the camp opens select windows for whole-property stays — a getaway, a few friends, a stretch of creative work. Request the dates you have in mind and we'll confirm what's possible."
    ),
    hostCta: t(content, "hero.host_cta", "Request dates"),
    buyoutCta: t(content, "hero.buyout_cta", "Request a stay"),
    bridgeLine: t(
      content,
      "book.bridge_line",
      "Rather be a member than a guest? Membership is by sponsorship and application — request an invitation."
    ),
    heroImage: t(
      content,
      "hero.image_url",
      "/assets/photos/camp-golden-hour.jpg"
    ),
  };

  const seen = new Set<string>();
  const unavailableRanges: BookedRange[] = [];
  for (const r of [...bookedRanges, ...heldRanges]) {
    const key = `${r.startDate}|${r.endDate}`;
    if (!seen.has(key)) {
      seen.add(key);
      unavailableRanges.push(r);
    }
  }

  return (
    <>
      <Nav />
      <main>
        <VisitClient
          seasons={seasons}
          blackouts={blackouts}
          unavailableRanges={unavailableRanges}
          initialMode={initialMode}
          copy={copy}
        />
      </main>
      <Footer />
    </>
  );
}
