"use server";

import { getResend, getFromAddress } from "@/lib/email/resend";

export interface MembershipRequestData {
  name: string;
  email: string;
  chapter: string;
  note: string;
  hasSponsor: boolean;
  sponsorName: string;
}

export async function submitMembershipRequest(
  data: MembershipRequestData
): Promise<{ ok: boolean; error?: string }> {
  const inbox = process.env.MEMBERSHIP_INBOX;
  if (!inbox) {
    console.error("MEMBERSHIP_INBOX env var not set");
    return { ok: false, error: "Configuration error. Please email us directly." };
  }

  try {
    const resend = getResend();
    const from = getFromAddress();

    const sponsorLine = data.hasSponsor && data.sponsorName
      ? `\nSponsor: ${data.sponsorName}`
      : "";

    await resend.emails.send({
      from,
      to: [inbox],
      replyTo: data.email,
      subject: `Membership request — ${data.name} (${data.chapter} chapter)`,
      text: [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Chapter: ${data.chapter}`,
        sponsorLine,
        `\nNote:\n${data.note || "(none)"}`,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    await resend.emails.send({
      from,
      to: [data.email],
      subject: "We received your request — Cambridge Gun & Rod Club",
      text: `Hi ${data.name},\n\nThank you for your interest in the Cambridge Gun & Rod Club. We have received your membership request and will be in touch.\n\nCambridge Gun & Rod Club\nCamp Monroe · Lake Cobbosseecontee, Maine`,
    });

    return { ok: true };
  } catch (err) {
    console.error("Membership request email error:", err);
    return { ok: false, error: "Failed to send request. Please try again." };
  }
}
