"use client";

import { useState } from "react";
import { business, copy, paths, type Lang } from "@/data/superhman";
import { legalLabels } from "@/data/superhman-legal";

/**
 * Formulario de solicitud. Postea a `/api/t/superhman/lead`, el mismo núcleo
 * que usa Allegiant y que atiende el agente de voz.
 *
 * El campo del trabajo se manda como `appliance` porque así se llama la
 * columna en la base; la etiqueta que ve la persona la decide el inquilino.
 */
export function LeadForm({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const L = legalLabels[lang];
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/api/t/superhman/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          appliance: data.get("appliance"),
          zip: data.get("zip"),
          time: data.get("time"),
          message: data.get("message"),
          smsConsent: data.get("smsConsent") === "yes" ? "yes" : "no",
          website: data.get("website"),
          lang,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <p className="sh-form-msg ok" role="status">
        {t.ok}
      </p>
    );
  }

  return (
    <form className="sh-form" onSubmit={onSubmit} noValidate={false}>
      <div className="sh-row">
        <div className="sh-field">
          <label htmlFor="sh-name">{t.f.name}</label>
          <input id="sh-name" name="name" maxLength={80} required autoComplete="name" />
        </div>
        <div className="sh-field">
          <label htmlFor="sh-phone">{t.f.phone}</label>
          <input id="sh-phone" name="phone" type="tel" maxLength={30} required autoComplete="tel" inputMode="tel" />
        </div>
      </div>

      <div className="sh-field">
        <label htmlFor="sh-job">{t.f.job}</label>
        <input id="sh-job" name="appliance" maxLength={60} placeholder={t.f.jobPlaceholder} />
      </div>

      <div className="sh-row">
        <div className="sh-field">
          <label htmlFor="sh-zip">{t.f.zip}</label>
          <input id="sh-zip" name="zip" maxLength={10} inputMode="numeric" autoComplete="postal-code" />
        </div>
        <div className="sh-field">
          <label htmlFor="sh-time">{t.f.time}</label>
          <select id="sh-time" name="time" defaultValue={t.f.times[0]}>
            {t.f.times.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="sh-field">
        <label htmlFor="sh-message">{t.f.message}</label>
        <textarea id="sh-message" name="message" rows={3} maxLength={800} />
      </div>

      {/* Campo trampa para bots: las personas no lo ven ni lo llenan. */}
      <div className="sh-hp" aria-hidden="true">
        <label htmlFor="sh-website">Website</label>
        <input id="sh-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Aceptar textos es opcional y la casilla viene desmarcada: lo exigen las operadoras. */}
      <label className="sh-check">
        <input type="checkbox" name="smsConsent" value="yes" />
        <span>{L.smsOptIn}</span>
      </label>

      {status === "error" && (
        <p className="sh-form-msg bad" role="alert">
          {t.error}
        </p>
      )}

      <button type="submit" className="sh-submit" disabled={status === "sending"}>
        {status === "sending" ? t.f.sending : t.f.send}
      </button>

      {/* La derivación se declara acá, en la pantalla donde se entregan los
          datos, y no solo enterrada en la política. */}
      <p className="sh-consent">
        {L.callNote} {L.referral}{" "}
        <a href={paths(lang).privacy}>{L.privacy}</a>
      </p>

      <p className="sh-or">
        {t.f.or}{" "}
        <a href={`tel:${business.phoneHref}`}>{business.phoneDisplay}</a>
      </p>
    </form>
  );
}
