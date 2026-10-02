"use client";

import { useState } from "react";
import { business, premiumBrands, services } from "@/data/allegiant";

/** Sin backend: arma un SMS prellenado para Vadim con los datos del cliente.
 * TODO: cambiar a un endpoint/email cuando haya dominio y correo propios. */
export function LeadForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [
      "Service request — Allegiant Appliances",
      `Name: ${f.get("name")}`,
      `Phone: ${f.get("phone")}`,
      `Address/ZIP: ${f.get("location")}`,
      `Appliance: ${f.get("service")}`,
      `Brand: ${f.get("brand") || "-"}`,
      `Problem: ${f.get("problem")}`,
    ].join("\n");
    window.location.href = `${business.smsHref}?&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  const field =
    "w-full rounded-lg border border-[color:var(--al-hairline)] bg-white px-4 py-3 text-[16px] outline-none focus:border-[color:var(--al-orange)]";

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Your name" autoComplete="name" className={field} />
        <input name="phone" required type="tel" placeholder="Phone" autoComplete="tel" className={field} />
      </div>
      <input name="location" required placeholder="Address or ZIP code" autoComplete="postal-code" className={field} />
      <select name="service" required defaultValue="" className={field}>
        <option value="" disabled>Appliance</option>
        {services.map((s) => (
          <option key={s.title}>{s.title}</option>
        ))}
        <option>Other</option>
      </select>
      <input name="brand" list="brands" placeholder="Brand (Sub-Zero, Wolf, Miele…)" className={field} />
      <datalist id="brands">
        {premiumBrands.map((b) => (
          <option key={b} value={b} />
        ))}
      </datalist>
      <textarea name="problem" required rows={3} placeholder="What's the problem? (brand, model, symptoms)" className={field} />
      <button type="submit" className="rounded-lg bg-[color:var(--al-orange)] px-7 py-4 text-[16px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[color:var(--al-orange-dim)]">
        Request Service
      </button>
      {sent && (
        <p className="text-[14px] text-[color:var(--al-ink-dim)]">
          Your messaging app should open with the request ready to send. Prefer to talk? Call {business.phone}.
        </p>
      )}
    </form>
  );
}
