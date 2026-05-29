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

  const [seasons, blackouts, bookedRanges, heldRanges] = await Promise.all([
    getActiveSeasons(),
    getPublicBlackouts(today),
    getBookedRanges(today),
    getHeldRanges(),
  ]);

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
        />
      </main>
      <Footer />
    </>
  );
}
