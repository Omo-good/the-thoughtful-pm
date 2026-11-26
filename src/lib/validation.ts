/**
 * Pure enquiry validation shared by the form (client) and the API route (server).
 * No imports, so it can be unit-tested directly. PRD §6.6, §13.
 */

export const SERVICE_OPTIONS = [
  "Product Discovery & MVP Planning",
  "PRD & Requirements Sprint",
  "Product Audit",
  "Fractional Product Management",
  "Product Consultation",
  "Partnership / Collaboration",
  "Speaking / Other",
] as const;

export const PROJECT_STAGE_OPTIONS = [
  "Idea stage",
  "Research and validation",
  "MVP planning",
  "Development in progress",
  "Existing product",
  "Product improvement",
  "Other",
] as const;

export const BUDGET_OPTIONS_NGN = [
  "Below ₦50,000",
  "₦50,000–₦100,000",
  "₦100,000–₦250,000",
  "₦250,000–₦500,000",
  "Above ₦500,000",
  "Not yet determined",
] as const;

export const BUDGET_OPTIONS_USD = [
  "Below $100",
  "$100–$250",
  "$250–$500",
  "$500–$1,000",
  "Above $1,000",
  "Not yet determined",
] as const;

export const CURRENCY_OPTIONS = ["NGN", "USD"] as const;

export const DESCRIPTION_MAX_LENGTH = 5000;

export interface EnquiryInput {
  fullName?: unknown;
  email?: unknown;
  company?: unknown;
  building?: unknown;
  website?: unknown;
  location?: unknown;
  serviceRequired?: unknown;
  projectStage?: unknown;
  budgetRange?: unknown;
  projectDescription?: unknown;
  preferredCurrency?: unknown;
  privacyConsent?: unknown;
  /** Honeypot. Real visitors leave this empty. */
  website_confirm?: unknown;
}

export interface Enquiry {
  fullName: string;
  email: string;
  company: string;
  building: string;
  website: string;
  location: string;
  serviceRequired: string;
  projectStage: string;
  budgetRange: string;
  projectDescription: string;
  preferredCurrency: string;
}

export type EnquiryErrors = Partial<Record<keyof Enquiry | "privacyConsent", string>>;

export type ValidationResult =
  | { ok: true; data: Enquiry }
  | { ok: false; errors: EnquiryErrors };

// Simple, deliberately permissive email shape check. Real delivery is the proof.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function text(value: unknown, max = 200): string {
  if (typeof value !== "string") return "";
  // Strip control characters and trim. Output is rendered as text, never as HTML.
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
}

function normaliseUrl(value: string): string | null {
  if (!value) return "";
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function oneOf<T extends readonly string[]>(value: string, options: T): boolean {
  return (options as readonly string[]).includes(value);
}

export function validateEnquiry(input: EnquiryInput): ValidationResult {
  const errors: EnquiryErrors = {};

  const fullName = text(input.fullName, 120);
  const email = text(input.email, 254);
  const company = text(input.company, 160);
  const building = text(input.building, 300);
  const websiteRaw = text(input.website, 300);
  const location = text(input.location, 120);
  const serviceRequired = text(input.serviceRequired, 120);
  const projectStage = text(input.projectStage, 120);
  const budgetRange = text(input.budgetRange, 120);
  const projectDescription = text(input.projectDescription, DESCRIPTION_MAX_LENGTH + 1);
  const preferredCurrency = text(input.preferredCurrency, 10);

  if (!fullName) errors.fullName = "Please enter your full name.";
  if (!email) errors.email = "Please enter your email address.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Please enter a valid email address, for example name@example.com.";

  const website = normaliseUrl(websiteRaw);
  if (website === null) errors.website = "Please enter a valid website address, or leave this blank.";

  if (!serviceRequired) errors.serviceRequired = "Please choose the service you are interested in.";
  else if (!oneOf(serviceRequired, SERVICE_OPTIONS)) errors.serviceRequired = "Please choose one of the listed services.";

  if (projectStage && !oneOf(projectStage, PROJECT_STAGE_OPTIONS)) errors.projectStage = "Please choose one of the listed project stages.";

  const allBudgets: readonly string[] = [...BUDGET_OPTIONS_NGN, ...BUDGET_OPTIONS_USD];
  // The budget question is optional (PRD §6.6).
  if (budgetRange && !allBudgets.includes(budgetRange)) errors.budgetRange = "Please choose one of the listed budget ranges.";

  if (!projectDescription) errors.projectDescription = "Please describe what you are working on.";
  else if (projectDescription.length > DESCRIPTION_MAX_LENGTH) errors.projectDescription = `Please keep your description under ${DESCRIPTION_MAX_LENGTH} characters.`;

  if (preferredCurrency && !oneOf(preferredCurrency, CURRENCY_OPTIONS)) errors.preferredCurrency = "Please choose NGN or USD.";

  if (input.privacyConsent !== true && input.privacyConsent !== "on" && input.privacyConsent !== "true") {
    errors.privacyConsent = "Please confirm you have read the privacy information.";
  }

  if (Object.keys(errors).length > 0 || website === null) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      fullName,
      email,
      company,
      building,
      website,
      location,
      serviceRequired,
      projectStage,
      budgetRange,
      projectDescription,
      preferredCurrency,
    },
  };
}

/** True when the honeypot field was filled, which indicates an automated submission. */
export function isSpamHoneypot(input: EnquiryInput): boolean {
  return typeof input.website_confirm === "string" && input.website_confirm.trim().length > 0;
}
