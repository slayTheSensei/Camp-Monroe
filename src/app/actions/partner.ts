"use server";

import { getResend, getFromAddress } from "@/lib/email/resend";

export interface PartnerInquiryData {
  name: string;
  org: string;
  email: string;
  context: string;
  message: string;
}

export async function submitPartnerInquiry(
  data: PartnerInquiryData
): Promise<{ ok: boolean; error?: string }> {
  const inbox = process.env.PARTNER_INBOX;
  if (!inbox) {
    console.error("PARTNER_INBOX env var not set");
    return { ok: false, error: "Configuration error. Please email us directly." };
  }

  try {
    const resend = getResend();
    const from = getFromAddress();

    await resend.emails.send({
      from,
      to: [inbox],
      replyTo: data.email,
      subject: `Partner inquiry — ${data.name}${data.org ? ` · ${data.org}` : ""}`,
      text: [
        `Name: ${data.name}`,
        data.org ? `Organization: ${data.org}` : "",
        `Email: ${data.email}`,
        `Partnership context: ${data.context || "(not specified)"}`,
        `\nMessage:\n${data.message || "(none)"}`,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    await resend.emails.send({
      from,
      to: [data.email],
      subject: "We received your inquiry — Cambridge Gun & Rod Club",
      text: `Hi ${data.name},\n\nThank you for reaching out about partnering with the Cambridge Gun & Rod Club. We will review your message and follow up shortly.\n\nCambridge Gun & Rod Club\nCamp Monroe · Lake Cobbosseecontee, Maine`,
    });

    return { ok: true };
  } catch (err) {
    console.error("Partner inquiry email error:", err);
    return { ok: false, error: "Failed to send inquiry. Please try again." };
  }
}
