import { NextResponse } from "next/server";
import { siteConfig } from "@/data/site-config";
import { isSpamHoneypot, validateEnquiry, type EnquiryInput } from "@/lib/validation";

const MAX_BODY_BYTES = 20_000;

/**
 * Server-side enquiry handler (PRD §6.6, §13).
 * - Validates again on the server; client validation is never trusted.
 * - Forwards to the Formspree endpoint held in FORMSPREE_ENDPOINT. The endpoint never reaches the browser.
 * - Returns 503 when no endpoint is configured, so the UI shows the email fallback instead of claiming success.
 * - Returns a generic success for honeypot hits, without forwarding them.
 */
export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, message: "That enquiry is too large to send. Please shorten it and try again." }, { status: 413 });
  }

  let input: EnquiryInput;
  try {
    input = JSON.parse(raw) as EnquiryInput;
  } catch {
    return NextResponse.json({ ok: false, message: "We could not read that enquiry. Please try again." }, { status: 400 });
  }

  if (isSpamHoneypot(input)) {
    return NextResponse.json({ ok: true, message: "Thank you for reaching out." });
  }

  const result = validateEnquiry(input);
  if (!result.ok) {
    return NextResponse.json({ ok: false, message: "Please correct the highlighted fields.", errors: result.errors }, { status: 422 });
  }

  const endpoint = siteConfig.formspreeEndpoint;
  if (!endpoint) {
    return NextResponse.json(
      {
        ok: false,
        message: siteConfig.email
          ? `The enquiry form is not available right now. Please email ${siteConfig.email} directly.`
          : "The enquiry form is not available right now. Please try again later.",
      },
      { status: 503 },
    );
  }

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...result.data,
        _subject: `New enquiry: ${result.data.serviceRequired} from ${result.data.fullName}`,
        _replyto: result.data.email,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!upstream.ok) {
      console.error(`[contact] Form service responded with status ${upstream.status}.`);
      return NextResponse.json({ ok: false, message: "Your enquiry could not be sent. Your details are still here, so please try again." }, { status: 502 });
    }
  } catch (error) {
    console.error("[contact] Form service request failed.", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ ok: false, message: "Your enquiry could not be sent. Your details are still here, so please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, message: "Thank you for reaching out. Your enquiry has been received." });
}

export function GET() {
  return NextResponse.json({ ok: false, message: "Method not allowed." }, { status: 405 });
}
