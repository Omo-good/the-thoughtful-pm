"use client";

import { useRef, useState, type FormEvent } from "react";
import { SERVICE_OPTIONS, validateEnquiry, type EnquiryErrors } from "@/lib/validation";

type TextField =
  | "fullName"
  | "email"
  | "company"
  | "building"
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
  building: "",
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
  "mt-2 w-full min-h-12 border border-[rgba(28,24,19,0.22)] bg-white px-4 py-3 text-[15px] text-charcoal placeholder:text-muted focus:border-gold";

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

      <div className="grid gap-[22px] md:grid-cols-2">
        <Field label="Full name" id="fullName" error={errors.fullName} describedBy={describedBy("fullName")}>
          <input id="fullName" name="fullName" type="text" autoComplete="name" required value={values.fullName} onChange={(e) => update("fullName", e.target.value)} className={inputClass} aria-invalid={Boolean(errors.fullName)} aria-describedby={describedBy("fullName")} />
        </Field>
        <Field label="Email address" id="email" error={errors.email} describedBy={describedBy("email")}>
          <input id="email" name="email" type="email" autoComplete="email" inputMode="email" required value={values.email} onChange={(e) => update("email", e.target.value)} className={inputClass} aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")} />
        </Field>
      </div>

      <Field label="Company or startup name" id="company" error={errors.company} describedBy={describedBy("company")}>
        <input id="company" name="company" type="text" autoComplete="organization" value={values.company} onChange={(e) => update("company", e.target.value)} className={inputClass} />
      </Field>

      <Field label="What are you building?" id="building" error={errors.building} describedBy={describedBy("building")}>
        <input id="building" name="building" type="text" value={values.building} onChange={(e) => update("building", e.target.value)} className={inputClass} aria-invalid={Boolean(errors.building)} aria-describedby={describedBy("building")} />
      </Field>

      <Field label="What kind of help do you need?" id="serviceRequired" error={errors.serviceRequired} describedBy={describedBy("serviceRequired")}>
        <select id="serviceRequired" name="serviceRequired" required value={values.serviceRequired} onChange={(e) => update("serviceRequired", e.target.value)} className={inputClass} aria-invalid={Boolean(errors.serviceRequired)} aria-describedby={describedBy("serviceRequired")}>
          <option value="">Choose one</option>
          {SERVICE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Additional message" id="projectDescription" error={errors.projectDescription} describedBy={describedBy("projectDescription")}>
        <textarea id="projectDescription" name="projectDescription" rows={4} required value={values.projectDescription} onChange={(e) => update("projectDescription", e.target.value)} className={inputClass} aria-invalid={Boolean(errors.projectDescription)} aria-describedby={describedBy("projectDescription")} />
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

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-6">
        <p className="max-w-[320px] text-[13px] leading-[1.5] text-[#4A4034]">
          Your details are used only to reply to your enquiry. See the privacy policy.
        </p>
        <button type="submit" disabled={status === "submitting"} className="inline-flex h-[58px] w-full shrink-0 items-center justify-center bg-gold px-10 text-[15px] font-medium text-ivory transition-colors hover:bg-gold-deep disabled:cursor-wait disabled:opacity-70 md:w-auto">
          {status === "submitting" ? "Sending…" : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, id, required, error, describedBy, hint, children }: { label: string; id: string; required?: boolean; error?: string; describedBy?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="flex flex-col gap-2 text-[13px] font-medium tracking-[0.04em] text-charcoal">
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
