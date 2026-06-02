"use server";

import { getResend, getFromAddress, getAdminRecipients } from "@/lib/email/resend";
import { insertMembershipRequest } from "@/lib/data/inquiries";
import type { MembershipChapter } from "@/lib/types/inquiries";

export interface MembershipRequestData {
  name: string;
  email: string;
  chapter: string;
  note: string;
  hasSponsor: boolean;
  sponsorName: string;
}

function normalizeChapter(raw: string): MembershipChapter | null {
  if (raw === "mens" || raw === "womens") return raw;
  return null;
}

export async function submitMembershipRequest(
  data: MembershipRequestData
): Promise<{ ok: boolean; error?: string }> {
  // 1. Persist to Supabase first — the email is best-effort but the row is not.
  const insertResult = await insertMembershipRequest({
    name: data.name,
    email: data.email,
    chapter: normalizeChapter(data.chapter),
    hasSponsor: data.hasSponsor,
    sponsorName: data.hasSponsor && data.sponsorName ? data.sponsorName : null,
    note: data.note || null,
  });

  if ("error" in insertResult) {
    return { ok: false, error: insertResult.error };
  }

  // 2. Best-effort email fan-out. Failures here do not block the request
  //    because the row is already captured for triage.
  //
  // Recipient resolution: per-channel MEMBERSHIP_INBOX wins if set (single
  // address override). Otherwise fall back to the shared ADMIN_ALERT_RECIPIENTS
  // list, which is the same env var the retreats pipeline uses. This means
  // setting ADMIN_ALERT_RECIPIENTS alone is enough to receive alerts for
  // every channel (membership, partner, host retreat, buyout retreat). The
  // per-channel var stays available for later routing decisions.
  const adminInbox = process.env.MEMBERSHIP_INBOX;
  const recipients = adminInbox ? [adminInbox] : getAdminRecipients();

  try {
    const resend = getResend();
    const from = getFromAddress();

    const sponsorLine =
      data.hasSponsor && data.sponsorName ? `\nSponsor: ${data.sponsorName}` : "";

    if (recipients.length > 0) {
      await resend.emails.send({
        from,
        to: recipients,
        replyTo: data.email,
        subject: `Membership request — ${data.name}${
          data.chapter ? ` (${data.chapter} chapter)` : ""
        }`,
        text: [
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          `Chapter: ${data.chapter || "no preference"}`,
          sponsorLine,
          `\nNote:\n${data.note || "(none)"}`,
          `\n— Admin: https://www.monroemaine.com/admin/membership/${insertResult.id}`,
        ]
          .filter(Boolean)
          .join("\n"),
      });
    } else {
      console.warn(
        "No admin recipients configured (MEMBERSHIP_INBOX and ADMIN_ALERT_RECIPIENTS both unset) — membership alert email skipped."
      );
    }

    await resend.emails.send({
      from,
      to: [data.email],
      subject: "We received your request — Cambridge Gun & Rod Club",
      text: `Hi ${data.name},

Thank you for writing to the Cambridge Gun and Rod Club. We received your request. We read every note by hand. We'll be in touch.

Cambridge Gun and Rod Club
Camp Monroe · Lake Cobbosseecontee, Maine`,
    });
  } catch (err) {
    console.error("Membership request email error:", err);
    // Row is saved — still report success to the user.
  }

  return { ok: true };
}
