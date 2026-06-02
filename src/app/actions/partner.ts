"use server";

import { getResend, getFromAddress, getAdminRecipients } from "@/lib/email/resend";
import { insertPartnerInquiry } from "@/lib/data/inquiries";
import type { PartnerContext } from "@/lib/types/inquiries";

export interface PartnerInquiryData {
  name: string;
  org: string;
  email: string;
  context: string;
  message: string;
}

function normalizeContext(raw: string): PartnerContext | null {
  if (
    raw === "capital" ||
    raw === "heritage" ||
    raw === "press" ||
    raw === "community" ||
    raw === "other"
  )
    return raw;
  return null;
}

export async function submitPartnerInquiry(
  data: PartnerInquiryData
): Promise<{ ok: boolean; error?: string }> {
  // 1. Persist first.
  const insertResult = await insertPartnerInquiry({
    name: data.name,
    organization: data.org || null,
    email: data.email,
    context: normalizeContext(data.context),
    message: data.message || null,
  });

  if ("error" in insertResult) {
    return { ok: false, error: insertResult.error };
  }

  // 2. Best-effort email fan-out.
  //
  // Recipient resolution mirrors membership.ts: per-channel PARTNER_INBOX
  // wins if set (single address override). Otherwise fall back to the
  // shared ADMIN_ALERT_RECIPIENTS list used by the retreats pipeline.
  const adminInbox = process.env.PARTNER_INBOX;
  const recipients = adminInbox ? [adminInbox] : getAdminRecipients();

  try {
    const resend = getResend();
    const from = getFromAddress();

    if (recipients.length > 0) {
      await resend.emails.send({
        from,
        to: recipients,
        replyTo: data.email,
        subject: `Partner inquiry — ${data.name}${
          data.org ? ` · ${data.org}` : ""
        }`,
        text: [
          `Name: ${data.name}`,
          data.org ? `Organization: ${data.org}` : "",
          `Email: ${data.email}`,
          `Partnership context: ${data.context || "(not specified)"}`,
          `\nMessage:\n${data.message || "(none)"}`,
          `\n— Admin: https://www.monroemaine.com/admin/partner-inquiries/${insertResult.id}`,
        ]
          .filter(Boolean)
          .join("\n"),
      });
    } else {
      console.warn(
        "No admin recipients configured (PARTNER_INBOX and ADMIN_ALERT_RECIPIENTS both unset) — partner alert email skipped."
      );
    }

    await resend.emails.send({
      from,
      to: [data.email],
      subject: "We received your inquiry — Cambridge Gun & Rod Club",
      text: `Hi ${data.name},

Thank you for reaching out about partnering with the Cambridge Gun & Rod Club. We will review your message and follow up shortly.

Cambridge Gun & Rod Club
Camp Monroe · Lake Cobbosseecontee, Maine`,
    });
  } catch (err) {
    console.error("Partner inquiry email error:", err);
  }

  return { ok: true };
}
