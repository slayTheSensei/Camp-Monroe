"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Season, PublicBlackout, BookedRange } from "@/lib/types/retreats";

// ---------- Types ----------
type Mode = "host" | "buyout";

interface DateRange {
  start: string;
  end: string;
  nights: number;
  valid: boolean;
}

export interface VisitCopy {
  hostHeadlinePart1: string;
  hostHeadlineEmphasis: string;
  buyoutHeadlinePart1: string;
  buyoutHeadlineEmphasis: string;
  hostLead: string;
  buyoutLead: string;
  hostCta: string;
  buyoutCta: string;
  bridgeLine: string;
  heroImage: string;
}

interface Props {
  seasons: Season[];
  blackouts: PublicBlackout[];
  unavailableRanges: BookedRange[];
  initialMode: Mode;
  copy: VisitCopy;
}

// ---------- Date helpers ----------
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const MONTHS_SHORT = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];
const WEEKDAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const MIN_NIGHTS = 3;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function ymd(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function todayISO() {
  return ymd(new Date());
}
function addDays(iso: string, n: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  return ymd(dt);
}
function within(iso: string, a: string, b: string) {
  return iso >= a && iso <= b;
}
function nightsBetween(a: string, b: string) {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  return Math.round(
    (new Date(by, bm - 1, bd).getTime() - new Date(ay, am - 1, ad).getTime()) /
      86400000
  );
}
function fmtRange(a: string, b: string) {
  const [ay, am, ad] = a.split("-").map(Number);
  const [, bm, bd] = b.split("-").map(Number);
  const [by] = b.split("-").map(Number);
  const sameYear = ay === by;
  const s = `${MONTHS_SHORT[am - 1]} ${ad}${sameYear ? "" : ", " + ay}`;
  const e = `${MONTHS_SHORT[bm - 1]} ${bd}, ${by}`;
  const n = nightsBetween(a, b);
  return `${s} – ${e} · ${n} night${n === 1 ? "" : "s"}`;
}

function leadDaysFor(mode: Mode) {
  return mode === "host" ? 14 : 7;
}

// ---------- Calendar ----------
interface CalMonthProps {
  year: number;
  month: number;
  mode: Mode;
  seasons: Season[];
  blackouts: PublicBlackout[];
  unavailableRanges: BookedRange[];
  selStart: string | null;
  selEnd: string | null;
  hoverEnd: string | null;
  onPick: (iso: string) => void;
  onHover: (iso: string) => void;
}

function dayStatus(
  iso: string,
  mode: Mode,
  seasons: Season[],
  blackouts: PublicBlackout[],
  unavailableRanges: BookedRange[]
): string {
  const inSeason = seasons.some((s) => within(iso, s.startDate, s.endDate));
  if (!inSeason) return "outside";
  if (iso < addDays(todayISO(), leadDaysFor(mode))) return "lead";
  for (const b of blackouts) {
    if (within(iso, b.startDate, b.endDate)) return "unavail";
  }
  for (const r of unavailableRanges) {
    if (within(iso, r.startDate, r.endDate)) return "unavail";
  }
  return "available";
}

function firstBlockedAfter(
  start: string,
  mode: Mode,
  seasons: Season[],
  blackouts: PublicBlackout[],
  unavailableRanges: BookedRange[]
): string | null {
  for (let i = 1; i <= 365; i++) {
    const iso = addDays(start, i);
    if (dayStatus(iso, mode, seasons, blackouts, unavailableRanges) !== "available") {
      return iso;
    }
  }
  return null;
}

function CalMonth({
  year,
  month,
  mode,
  seasons,
  blackouts,
  unavailableRanges,
  selStart,
  selEnd,
  hoverEnd,
  onPick,
  onHover,
}: CalMonthProps) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="cal-month">
      <div className="cal-mlabel">
        {MONTHS[month]} {year}
      </div>
      <div className="cal-weekdays">
        {WEEKDAYS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className="cal-grid">
        {cells.map((d, i) => {
          if (d === null)
            return (
              <span key={"e" + i} className="cal-cell cal-empty" aria-hidden="true" />
            );
          const iso = `${year}-${pad2(month + 1)}-${pad2(d)}`;
          const status = dayStatus(iso, mode, seasons, blackouts, unavailableRanges);
          let disabled = status !== "available";

          if (selStart && !selEnd && !disabled) {
            const minEnd = addDays(selStart, MIN_NIGHTS);
            const fb = firstBlockedAfter(selStart, mode, seasons, blackouts, unavailableRanges);
            if (iso !== selStart) {
              if (iso < minEnd) disabled = true;
              if (fb && iso >= fb) disabled = true;
              if (iso < selStart) disabled = true;
            }
          }

          const isStart = iso === selStart;
          const isEnd = iso === selEnd;
          const effEnd = selEnd || hoverEnd;
          const inRange =
            selStart && effEnd && iso > selStart && iso < effEnd;
          const isToday = iso === todayISO();

          const cls = ["cal-cell", "cal-day"];
          if (disabled) cls.push("is-disabled");
          if (status === "outside") cls.push("is-outside");
          if (isStart || isEnd) cls.push("is-end");
          if (inRange) cls.push("is-mid");
          if (isToday && !isStart && !isEnd) cls.push("is-today");

          return (
            <button
              key={iso}
              type="button"
              className={cls.join(" ")}
              disabled={disabled}
              onClick={() => !disabled && onPick(iso)}
              onMouseEnter={() => !disabled && onHover(iso)}
              aria-label={iso}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface VisitCalendarProps {
  mode: Mode;
  seasons: Season[];
  blackouts: PublicBlackout[];
  unavailableRanges: BookedRange[];
  selStart: string | null;
  selEnd: string | null;
  onPick: (iso: string) => void;
}

function VisitCalendar({
  mode,
  seasons,
  blackouts,
  unavailableRanges,
  selStart,
  selEnd,
  onPick,
}: VisitCalendarProps) {
  const now = new Date();
  const minY = now.getFullYear();
  const minM = now.getMonth();
  const [view, setView] = useState({ y: minY, m: minM });
  const [hoverEnd, setHoverEnd] = useState<string | null>(null);

  const secondM = (view.m + 1) % 12;
  const secondY = view.m === 11 ? view.y + 1 : view.y;

  const lastSeason = seasons.reduce(
    (acc, s) => (s.endDate > acc ? s.endDate : acc),
    ""
  );
  const endY = lastSeason ? Number(lastSeason.slice(0, 4)) : minY + 1;
  const endM = lastSeason ? Number(lastSeason.slice(5, 7)) - 1 : 11;

  const atMin = view.y === minY && view.m === minM;
  const atMax =
    view.y > endY || (view.y === endY && view.m >= endM);

  const page = (dir: number) => {
    setHoverEnd(null);
    setView((v) => {
      const idx = v.y * 12 + v.m + dir;
      return { y: Math.floor(idx / 12), m: idx % 12 };
    });
  };

  const lead = leadDaysFor(mode);

  return (
    <div className="cal">
      <div className="cal-legend">
        <span className="cal-key">
          <span className="cal-dot cal-dot-avail" />
          Available
        </span>
        <span className="cal-key">
          <span className="cal-dot cal-dot-unavail" />
          Unavailable
        </span>
        <span className="cal-key">
          <span className="cal-dot cal-dot-sel" />
          Your selection
        </span>
      </div>
      <p className="cal-help">
        Select a start date, then an end date. {MIN_NIGHTS}-night minimum,{" "}
        {lead}-day lead time.
      </p>

      <div className="cal-panel">
        <div className="cal-nav">
          <button
            type="button"
            className="cal-arrow"
            onClick={() => page(-1)}
            disabled={atMin}
            aria-label="Previous month"
          >
            <svg
              viewBox="0 0 12 12"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7.5 2.5 4 6l3.5 3.5" />
            </svg>
          </button>
          <button
            type="button"
            className="cal-arrow"
            onClick={() => page(1)}
            disabled={atMax}
            aria-label="Next month"
          >
            <svg
              viewBox="0 0 12 12"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4.5 2.5 8 6l-3.5 3.5" />
            </svg>
          </button>
        </div>
        <div className="cal-months" onMouseLeave={() => setHoverEnd(null)}>
          <CalMonth
            year={view.y}
            month={view.m}
            mode={mode}
            seasons={seasons}
            blackouts={blackouts}
            unavailableRanges={unavailableRanges}
            selStart={selStart}
            selEnd={selEnd}
            hoverEnd={hoverEnd}
            onPick={onPick}
            onHover={setHoverEnd}
          />
          <CalMonth
            year={secondY}
            month={secondM}
            mode={mode}
            seasons={seasons}
            blackouts={blackouts}
            unavailableRanges={unavailableRanges}
            selStart={selStart}
            selEnd={selEnd}
            hoverEnd={hoverEnd}
            onPick={onPick}
            onHover={setHoverEnd}
          />
        </div>
      </div>
    </div>
  );
}

// ---------- Shared pieces ----------
function RangeChip({
  range,
  onClear,
}: {
  range: DateRange | null;
  onClear: () => void;
}) {
  if (range) {
    return (
      <div className="vf-range">
        <div>
          <span className="vf-range-k">Selected dates</span>
          <span className="vf-range-v">
            {fmtRange(range.start, range.end)}
          </span>
        </div>
        <button type="button" className="vf-range-clear" onClick={onClear}>
          Change
        </button>
      </div>
    );
  }
  return (
    <div className="vf-range vf-range-empty">
      <span className="vf-range-v">
        Select dates on the calendar above to continue.
      </span>
    </div>
  );
}

function VSelect({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="vf-field">
      <label htmlFor={id}>{label}</label>
      <div className="vf-select">
        <select id={id} value={value} onChange={onChange}>
          {children}
        </select>
        <svg
          className="vf-chev"
          viewBox="0 0 12 12"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 4l4 4 4-4" />
        </svg>
      </div>
    </div>
  );
}

function SuccessState({ kind, name }: { kind: Mode; name: string }) {
  const first = name.trim().split(/\s+/)[0];
  return (
    <div className="vf-success">
      <div className="vf-tick" aria-hidden="true">
        ✓
      </div>
      <h3>
        Your {kind === "host" ? "inquiry" : "request"}
        <br />
        is in.
      </h3>
      <p>
        Thank you{first ? `, ${first}` : ""}. We read every{" "}
        {kind === "host" ? "inquiry" : "request"} by hand and follow up within 48 hours.
      </p>
      <div className="vf-success-row">
        <Link className="btn btn-amber" href="/the-camp">
          Explore the camp <span className="arr" />
        </Link>
        <Link className="btn btn-outline-cream" href="/history">
          Read the history
        </Link>
      </div>
    </div>
  );
}

// ---------- Supabase anon client (browser) ----------
function getAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

async function triggerEmailFanOut(type: "host" | "buyout", id: string) {
  try {
    await fetch("/api/retreats/post-submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id }),
    });
  } catch {
    // Non-blocking — email fan-out failure should not surface to the user
  }
}

// ---------- Support opts ----------
const SUPPORT_OPTS = [
  {
    v: "lodging",
    t: "Lodging only",
    d: "Just the grounds — beds, kitchens, common spaces. You handle the rest.",
  },
  {
    v: "meals",
    t: "Meals & catering",
    d: "We connect you with local catering partners and coordinate meal service.",
  },
  {
    v: "facil",
    t: "Facilitation",
    d: "Introductions to trusted facilitators and practitioners in our network.",
  },
  {
    v: "full",
    t: "Full-service",
    d: "Lodging, meals, facilitation and logistics, coordinated end to end.",
  },
];

// ---------- HOST FORM ----------
function HostForm({
  range,
  onClear,
}: {
  range: DateRange | null;
  onClear: () => void;
}) {
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [concept, setConcept] = useState("");
  const [audience, setAudience] = useState("");
  const [group, setGroup] = useState("");
  const [notes, setNotes] = useState("");
  const [support, setSupport] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const toggle = (v: string) =>
    setSupport((p) =>
      p.includes(v) ? p.filter((x) => x !== v) : [...p, v]
    );

  const valid = name && email && concept && range?.valid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || !range) return;
    setSubmitting(true);
    setError("");
    const id = crypto.randomUUID();
    const supabase = getAnonClient();
    const { error: insertError } = await supabase
      .from("host_inquiries")
      .insert({
        id,
        name,
        organization: org || null,
        email,
        phone: phone || null,
        retreat_concept: concept,
        audience_type: audience || null,
        group_size: group ? parseInt(group, 10) : null,
        start_date: range.start,
        end_date: range.end,
        support_needs: support,
        additional_notes: notes || null,
        status: "new",
      });
    if (insertError) {
      console.error("host inquiry insert:", insertError);
      setError("Something went wrong. Please try again or email us directly.");
      setSubmitting(false);
      return;
    }
    await triggerEmailFanOut("host", id);
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSubmitting(false);
  };

  if (done) return <SuccessState kind="host" name={name} />;

  return (
    <form className="vf" onSubmit={handleSubmit}>
      <div className="vf-intro">
        <span className="vf-eyebrow">Your details</span>
        <h3>Tell us about the gathering.</h3>
      </div>
      <RangeChip range={range} onClear={onClear} />

      <div className="vf-2col">
        <div className="vf-field">
          <label htmlFor="h-name">Your name</label>
          <input
            id="h-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
        </div>
        <div className="vf-field">
          <label htmlFor="h-org">
            Organization <span className="vf-opt">— optional</span>
          </label>
          <input
            id="h-org"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            placeholder="Firm, studio, or group"
            autoComplete="organization"
          />
        </div>
      </div>

      <div className="vf-2col">
        <div className="vf-field">
          <label htmlFor="h-email">Email</label>
          <input
            id="h-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
            inputMode="email"
          />
        </div>
        <div className="vf-field">
          <label htmlFor="h-phone">
            Phone <span className="vf-opt">— optional</span>
          </label>
          <input
            id="h-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(000) 000-0000"
            autoComplete="tel"
            inputMode="tel"
          />
        </div>
      </div>

      <div className="vf-field">
        <label htmlFor="h-concept">Retreat concept</label>
        <textarea
          id="h-concept"
          rows={4}
          required
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          placeholder="A few sentences on the nature of the gathering, who it's for, and what you hope it feels like."
        />
      </div>

      <div className="vf-2col">
        <VSelect
          id="h-aud"
          label="Audience"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        >
          <option value="">Select…</option>
          <option value="wellness">Wellness</option>
          <option value="creative">Creative / residency</option>
          <option value="corporate">Corporate / team offsite</option>
          <option value="cultural">Cultural / community</option>
          <option value="other">Other</option>
        </VSelect>
        <div className="vf-field">
          <label htmlFor="h-group">Group size</label>
          <input
            id="h-group"
            type="number"
            min="1"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            placeholder="e.g. 12"
            inputMode="numeric"
          />
        </div>
      </div>

      <div className="vf-field">
        <label>Support needs</label>
        <div className="vf-checks">
          {SUPPORT_OPTS.map((o) => {
            const on = support.includes(o.v);
            return (
              <label key={o.v} className={`vf-check${on ? " on" : ""}`}>
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(o.v)}
                />
                <span className="vf-box" aria-hidden="true">
                  <svg
                    viewBox="0 0 10 10"
                    width="10"
                    height="10"
                    fill="none"
                    stroke="#1a2e1a"
                    strokeWidth="2.2"
                  >
                    <path
                      d="M1 5l2.5 2.5L9 2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="vf-check-body">
                  <span className="vf-check-t">{o.t}</span>
                  <span className="vf-check-d">{o.d}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="vf-field">
        <label htmlFor="h-notes">
          Anything else? <span className="vf-opt">— optional</span>
        </label>
        <textarea
          id="h-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Dates flexibility, accessibility needs, anything we should know."
        />
      </div>

      {error && (
        <p className="vf-hint" style={{ color: "var(--color-amber)" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        className="btn btn-amber vf-submit"
        disabled={!valid || submitting}
      >
        {submitting ? "Sending…" : "Send inquiry"}{" "}
        {!submitting && <span className="arr" />}
      </button>
      <p className="vf-disclaim">
        We review every inquiry personally and respond within 48 hours.
      </p>
    </form>
  );
}

// ---------- BUYOUT FORM ----------
function BuyoutForm({
  range,
  onClear,
}: {
  range: DateRange | null;
  onClear: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [party, setParty] = useState("");
  const [purpose, setPurpose] = useState("");
  const [affil, setAffil] = useState("");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const valid = name && email && range?.valid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || !range) return;
    setSubmitting(true);
    setError("");
    const id = crypto.randomUUID();
    const supabase = getAnonClient();
    const { error: insertError } = await supabase
      .from("buyout_inquiries")
      .insert({
        id,
        name,
        email,
        start_date: range.start,
        end_date: range.end,
        party_size: party ? parseInt(party, 10) : null,
        purpose_of_stay: purpose || null,
        affiliation: affil || null,
        additional_notes: notes || null,
        status: "new",
      });
    if (insertError) {
      console.error("buyout inquiry insert:", insertError);
      setError("Something went wrong. Please try again or email us directly.");
      setSubmitting(false);
      return;
    }
    await triggerEmailFanOut("buyout", id);
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSubmitting(false);
  };

  if (done) return <SuccessState kind="buyout" name={name} />;

  return (
    <form className="vf" onSubmit={handleSubmit}>
      <div className="vf-intro">
        <span className="vf-eyebrow">Your details</span>
        <h3>Request your week.</h3>
      </div>
      <RangeChip range={range} onClear={onClear} />

      <div className="vf-2col">
        <div className="vf-field">
          <label htmlFor="b-name">Your name</label>
          <input
            id="b-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
        </div>
        <div className="vf-field">
          <label htmlFor="b-email">Email</label>
          <input
            id="b-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
            inputMode="email"
          />
        </div>
      </div>

      <div className="vf-2col">
        <div className="vf-field">
          <label htmlFor="b-party">Party size</label>
          <input
            id="b-party"
            type="number"
            min="1"
            value={party}
            onChange={(e) => setParty(e.target.value)}
            placeholder="e.g. 12"
            inputMode="numeric"
          />
        </div>
        <VSelect
          id="b-purpose"
          label="Purpose of stay"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        >
          <option value="">Select…</option>
          <option value="personal">Personal getaway</option>
          <option value="creative">Creative / writing</option>
          <option value="friends">Friends / family group</option>
          <option value="adjacent">Pre- or post-retreat</option>
          <option value="other">Other</option>
        </VSelect>
      </div>

      <VSelect
        id="b-affil"
        label="Are you connected to the club?"
        value={affil}
        onChange={(e) => setAffil(e.target.value)}
      >
        <option value="">Select…</option>
        <option value="member">Member or past guest</option>
        <option value="new">Recently joined</option>
        <option value="prospective">Prospective member</option>
        <option value="none">Not yet — just curious</option>
      </VSelect>

      <div className="vf-field">
        <label htmlFor="b-notes">
          Anything else? <span className="vf-opt">— optional</span>
        </label>
        <textarea
          id="b-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What you have in mind for the week."
        />
      </div>

      {error && (
        <p className="vf-hint" style={{ color: "var(--color-amber)" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        className="btn btn-amber vf-submit"
        disabled={!valid || submitting}
      >
        {submitting ? "Sending…" : "Send request"}{" "}
        {!submitting && <span className="arr" />}
      </button>
      <p className="vf-disclaim">
        You needn&rsquo;t be a member. We confirm what&rsquo;s possible within 48 hours.
      </p>
    </form>
  );
}

// ---------- Specs band ----------
const HOST_SPECS = [
  {
    k: "Capacity",
    items: [
      "8 to 24 guests",
      "Lodge and cabin lodging",
      "Built for groups that need quiet",
    ],
  },
  {
    k: "Included",
    items: [
      "The whole property",
      "Private lake frontage",
      "Common rooms",
      "Dining hall and lodge",
    ],
  },
  {
    k: "Support, optional",
    items: [
      "Meals and catering",
      "Facilitators",
      "Transport",
      "Full-service end to end",
    ],
  },
];
const BUYOUT_SPECS = [
  {
    k: "The buyout",
    items: ["The whole property", "Lodge, cabins, dining hall", "Up to 24 guests"],
  },
  {
    k: "Included",
    items: [
      "Private lake frontage",
      "Canoes and the dock",
      "Common rooms",
      "Run of the grounds",
    ],
  },
  {
    k: "Good to know",
    items: ["3-night minimum", "7 days' lead time", "Select windows between retreats"],
  },
];

function SpecBand({ mode }: { mode: Mode }) {
  const specs = mode === "host" ? HOST_SPECS : BUYOUT_SPECS;
  return (
    <section className="paper">
      <div className="wrap">
        <div className="visit-specs">
          {specs.map((c) => (
            <div className="visit-spec" key={c.k}>
              <div className="eyebrow">{c.k}</div>
              <ul>
                {c.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Main client ----------
export default function VisitClient({
  seasons,
  blackouts,
  unavailableRanges,
  initialMode,
  copy,
}: Props) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [selStart, setSelStart] = useState<string | null>(null);
  const [selEnd, setSelEnd] = useState<string | null>(null);
  const [range, setRange] = useState<DateRange | null>(null);
  const bookRef = useRef<HTMLElement>(null);

  const switchMode = useCallback(
    (m: Mode) => {
      if (m === mode) return;
      setMode(m);
      setSelStart(null);
      setSelEnd(null);
      setRange(null);
    },
    [mode]
  );

  const onPick = useCallback(
    (iso: string) => {
      if (!selStart || (selStart && selEnd)) {
        setSelStart(iso);
        setSelEnd(null);
        setRange(null);
        return;
      }
      if (iso > selStart) {
        const n = nightsBetween(selStart, iso);
        setSelEnd(iso);
        setRange({ start: selStart, end: iso, nights: n, valid: n >= MIN_NIGHTS });
      } else {
        setSelStart(iso);
        setSelEnd(null);
        setRange(null);
      }
    },
    [selStart, selEnd]
  );

  const clearSel = useCallback(() => {
    setSelStart(null);
    setSelEnd(null);
    setRange(null);
  }, []);

  const scrollToBook = () => {
    const y = (bookRef.current?.offsetTop ?? 0) - 64;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const isHost = mode === "host";

  return (
    <>
      <section className="phero phero-short">
        <div
          className="photo photo-modern"
          style={{
            ["--photo" as string]: `url(${copy.heroImage})`,
            ["--photo-pos" as string]: "center 42%",
          }}
        />
        <div className="hero-shot-meta">
          <span className="hero-tier">
            <span className="dot" />
            Photograph · Camp Monroe at golden hour
          </span>
          <span className="hero-shot-note">Retreats &amp; private stays</span>
        </div>
        <div className="wrap phero-inner">
          <div className="hero-loc">
            <span className="tick" />
            <span className="tx">
              {isHost ? "Visit · Host a retreat" : "Visit · A private stay"}
            </span>
          </div>

          <div
            className="visit-toggle"
            role="group"
            aria-label="What would you like to do?"
          >
            <button
              type="button"
              className={isHost ? "on" : ""}
              onClick={() => switchMode("host")}
            >
              Host a retreat
            </button>
            <button
              type="button"
              className={!isHost ? "on" : ""}
              onClick={() => switchMode("buyout")}
            >
              Stay at the lake
            </button>
          </div>

          <h1 style={{ marginTop: 26 }}>
            {isHost ? (
              <>
                {copy.hostHeadlinePart1}{" "}
                <em>{copy.hostHeadlineEmphasis}</em>
              </>
            ) : (
              <>
                {copy.buyoutHeadlinePart1}{" "}
                <em>{copy.buyoutHeadlineEmphasis}</em>
              </>
            )}
          </h1>

          <p className="visit-hero-lead">
            {isHost ? copy.hostLead : copy.buyoutLead}
          </p>

          <div className="visit-hero-row">
            <button
              type="button"
              className="btn btn-amber"
              onClick={scrollToBook}
            >
              {isHost ? copy.hostCta : copy.buyoutCta}{" "}
              <span className="arr" />
            </button>
          </div>
        </div>
      </section>

      <SpecBand mode={mode} />

      {/* AVAILABILITY + INQUIRY */}
      <section className="dark visit-book" ref={bookRef}>
        <div className="wrap">
          <div className="visit-book-inner">
            <div className="sec-head" style={{ marginBottom: 40 }}>
              <div className="eyebrow">Check availability</div>
              <h2 className="sec-h" style={{ marginTop: 14 }}>
                Pick your dates.
              </h2>
              <p
                className="lead"
                style={{ marginTop: 22, color: "var(--cream-70)" }}
              >
                {isHost
                  ? "Grayed-out dates are outside the season or already held. Select a start date, then an end — a 3-night minimum, with 14 days’ lead time for retreats."
                  : "A private stay is a whole-property buyout. Grayed-out dates are outside the season or already taken. Select a start date, then an end — a 3-night minimum, 7 days’ lead time."}
              </p>
            </div>

            <VisitCalendar
              mode={mode}
              seasons={seasons}
              blackouts={blackouts}
              unavailableRanges={unavailableRanges}
              selStart={selStart}
              selEnd={selEnd}
              onPick={onPick}
            />

            <div className="vf-card">
              {isHost ? (
                <HostForm range={range} onClear={clearSel} />
              ) : (
                <BuyoutForm range={range} onClear={clearSel} />
              )}
            </div>

            <p className="visit-bridge">
              {copy.bridgeLine.split(' — ').length === 2 ? (
                <>
                  {copy.bridgeLine.split(' — ')[0]} &mdash;{" "}
                  <Link href="/request" className="ilink">
                    {copy.bridgeLine
                      .split(' — ')[1]
                      .replace(/\.$/, '')
                      .trim()}
                  </Link>
                  .
                </>
              ) : (
                copy.bridgeLine
              )}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
