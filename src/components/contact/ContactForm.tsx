"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  BUDGET_OPTIONS_NGN,
  BUDGET_OPTIONS_USD,
  CURRENCY_OPTIONS,
  PROJECT_STAGE_OPTIONS,
  SERVICE_OPTIONS,
  validateEnquiry,
  type EnquiryErrors,
} from "@/lib/validation";

type TextField =
  | "fullName"
  | "email"
  | "company"
  | "website"
  | "location"
  | "serviceRequired"
  | "projectStage"
  | "budgetRange"
  | "projectDescription"
  | "preferredCurrency";

type FieldName = TextField | "privacyConsent";

type Values = Record<TextField, string> & { privacyConsent: boolean };

const emptyValues: Values = {
  fullName: "",
  email: "",
  company: "",
  website: "",
  location: "",
  serviceRequired: "",
  projectStage: "",
  budgetRange: "",
  projectDescription: "",
  preferredCurrency: "",
  privacyConsent: false,
};

type Status = "idle" | "submitting" | "success" | "error" | "unavailable";

interface ContactFormProps {
  initialService?: string;
  fallbackEmail: string | null;
  showBudget?: boolean;
}

const inputClass =
  "mt-2 w-full min-h-11 rounded-md border border-gold/70 bg-paper px-3.5 py-2.5 text-charcoal placeholder:text-muted focus:border-teal";

export function ContactForm({ initialService, fallbackEmail }: ContactFormProps) {
  const [values, setValues] = useState<Values>({
    ...emptyValues,
    serviceRequired: SERVICE_OPTIONS.includes(initialService as (typeof SERVICE_OPTIONS)[number]) ? (initialService as string) : "",
  });
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const submittingRef = useRef(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof Values>(field: K, value: Values[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function errorId(field: FieldName) {
    return `error-${field}`;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return; // Prevent accidental double submissions.

    const localCheck = validateEnquiry({ ...values, privacyConsent: values.privacyConsent, website_confirm: honeypotRef.current?.value ?? "" });
    if (!localCheck.ok) {
      setErrors(localCheck.errors);
      setStatus("idle");
      setMessage("Please correct the highlighted fields.");
      document.getElementById(Object.keys(localCheck.errors)[0] ?? "")?.focus();
      return;
    }

    setErrors({});
    submittingRef.current = true;
    setStatus("submitting");
    setMessage("Sending your enquiry…");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          privacyConsent: values.privacyConsent,
          website_confirm: honeypotRef.current?.value ?? "",
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string; errors?: EnquiryErrors };

      if (response.status === 503) {
        setStatus("unavailable");
        setMessage(payload.message ?? "The enquiry form is not available right now.");
        return;
      }
      if (!response.ok || !payload.ok) {
        if (payload.errors) setErrors(payload.errors);
        setStatus("error");
        setMessage(payload.message ?? "Your enquiry could not be sent. Your details are still here, so please try again.");
        return;
      }
      setStatus("success");
      setMessage("Thank you for reaching out. Your enquiry has been received. I'll review the details and get back to you as soon as possible.");
      setValues({ ...emptyValues });
    } catch {
      setStatus("error");
      setMessage("Your enquiry could not be sent because of a connection problem. Your details are still here, so please try again.");
    } finally {
      submittingRef.current = false;
    }
  }

  const describedBy = (field: FieldName) => (errors[field] ? errorId(field) : undefined);

  if (status === "success") {
    return (
      <div role="status" className="card p-8">
        <h2 className="text-3xl">Enquiry received</h2>
        <p className="mt-4 text-charcoal/90">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6" aria-describedby="form-status">
      <p id="form-status" role="status" aria-live="polite" className={status === "error" || status === "unavailable" ? "text-clay font-medium" : "sr-only"}>
        {message}
      </p>

      {status === "unavailable" && fallbackEmail ? (
        <p className="card p-4">
          You can also email me directly at{" "}
          <a className="font-medium text-teal underline" href={`mailto:${fallbackEmail}`}>
            {fallbackEmail}
          </a>
          .
        </p>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Full name" required id="fullName" error={errors.fullName} describedBy={describedBy("fullName")}>
          <input id="fullName" name="fullName" type="text" autoComplete="name" required value={values.fullName} onChange={(e) => update("fullName", e.target.value)} className={inputClass} aria-invalid={Boolean(errors.fullName)} aria-describedby={describedBy("fullName")} />
        </Field>
        <Field label="Email" required id="email" error={errors.email} describedBy={describedBy("email")}>
          <input id="email" name="email" type="email" autoComplete="email" inputMode="email" required value={values.email} onChange={(e) => update("email", e.target.value)} className={inputClass} aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")} />
        </Field>
        <Field label="Company" id="company" error={errors.company} describedBy={describedBy("company")}>
          <input id="company" name="company" type="text" autoComplete="organization" value={values.company} onChange={(e) => update("company", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Website" id="website" error={errors.website} describedBy={describedBy("website")}>
          <input id="website" name="website" type="url" inputMode="url" placeholder="https://" value={values.website} onChange={(e) => update("website", e.target.value)} className={inputClass} aria-invalid={Boolean(errors.website)} aria-describedby={describedBy("website")} />
        </Field>
        <Field label="Location" id="location" error={errors.location} describedBy={describedBy("location")}>
          <input id="location" name="location" type="text" autoComplete="address-level2" value={values.location} onChange={(e) => update("location", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Service required" required id="serviceRequired" error={errors.serviceRequired} describedBy={describedBy("serviceRequired")}>
          <select id="serviceRequired" name="serviceRequired" required value={values.serviceRequired} onChange={(e) => update("serviceRequired", e.target.value)} className={inputClass} aria-invalid={Boolean(errors.serviceRequired)} aria-describedby={describedBy("serviceRequired")}>
            <option value="">Choose a service</option>
            {SERVICE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Project stage" id="projectStage" error={errors.projectStage} describedBy={describedBy("projectStage")}>
          <select id="projectStage" name="projectStage" value={values.projectStage} onChange={(e) => update("projectStage", e.target.value)} className={inputClass}>
            <option value="">Choose a stage (optional)</option>
            {PROJECT_STAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Preferred currency" id="preferredCurrency" error={errors.preferredCurrency} describedBy={describedBy("preferredCurrency")}>
          <select id="preferredCurrency" name="preferredCurrency" value={values.preferredCurrency} onChange={(e) => update("preferredCurrency", e.target.value)} className={inputClass}>
            <option value="">No preference (optional)</option>
            {CURRENCY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Budget range" id="budgetRange" error={errors.budgetRange} describedBy={describedBy("budgetRange")} hint="Optional. Choose the range that fits your preferred currency.">
          <select id="budgetRange" name="budgetRange" value={values.budgetRange} onChange={(e) => update("budgetRange", e.target.value)} className={inputClass}>
            <option value="">Prefer not to say (optional)</option>
            <optgroup label="Nigeria (NGN)">
              {BUDGET_OPTIONS_NGN.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </optgroup>
            <optgroup label="International (USD)">
              {BUDGET_OPTIONS_USD.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </optgroup>
          </select>
        </Field>
      </div>

      <Field label="Project description" required id="projectDescription" error={errors.projectDescription} describedBy={describedBy("projectDescription")} hint="Tell me what you're working on, what you're trying to achieve and where you are stuck.">
        <textarea id="projectDescription" name="projectDescription" rows={6} required value={values.projectDescription} onChange={(e) => update("projectDescription", e.target.value)} className={inputClass} aria-invalid={Boolean(errors.projectDescription)} aria-describedby={describedBy("projectDescription")} />
      </Field>

      {/* Honeypot: hidden from people and assistive technology. Bots tend to fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input ref={honeypotRef} type="text" name="website_confirm" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input id="privacyConsent" name="privacyConsent" type="checkbox" required checked={values.privacyConsent} onChange={(e) => update("privacyConsent", e.target.checked)} className="mt-1.5 h-5 w-5 accent-teal" aria-invalid={Boolean(errors.privacyConsent)} aria-describedby={describedBy("privacyConsent")} />
          <label htmlFor="privacyConsent" className="text-charcoal/90">
            I have read the{" "}
            <a href="/privacy" className="text-teal underline">
              Privacy Policy
            </a>{" "}
            and agree that my details may be used to respond to this enquiry. <span className="text-muted">(required)</span>
          </label>
        </div>
        {errors.privacyConsent ? (
          <p id={errorId("privacyConsent")} className="mt-2 text-sm font-medium text-clay">
            {errors.privacyConsent}
          </p>
        ) : null}
      </div>

      <div>
        <button type="submit" disabled={status === "submitting"} className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-teal px-8 py-3 font-medium text-paper transition-colors hover:bg-charcoal disabled:cursor-wait disabled:opacity-70 sm:w-auto">
          {status === "submitting" ? "Sending…" : "Send Enquiry"}
        </button>
        <p className="mt-3 text-sm text-muted">
          Fields marked required must be completed. Your details are used only to respond to your enquiry.
        </p>
      </div>
    </form>
  );
}

function Field({ label, id, required, error, describedBy, hint, children }: { label: string; id: string; required?: boolean; error?: string; describedBy?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block font-medium text-charcoal">
        {label} {required ? <span className="text-muted">(required)</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={describedBy} className="mt-2 text-sm font-medium text-clay">
          {error}
        </p>
      ) : null}
    </div>
  );
}
