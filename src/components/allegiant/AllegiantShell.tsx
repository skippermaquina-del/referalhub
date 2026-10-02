"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { business, copy, type Lang } from "@/data/allegiant";

type BookingContextValue = { openBook: () => void };

const BookingContext = createContext<BookingContextValue>({ openBook: () => {} });

/** Abre el panel de reserva desde cualquier botón de la página. */
export function useBooking() {
  return useContext(BookingContext);
}

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Envuelve cada página de Allegiant y mantiene a mano, siempre visibles, el
 * botón de reservar, el chat y el panel lateral con el formulario de visita.
 */
export function AllegiantShell({
  lang,
  children,
  floating = true,
}: {
  lang: Lang;
  children: React.ReactNode;
  floating?: boolean;
}) {
  const t = copy[lang];
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const firstField = useRef<HTMLInputElement>(null);

  const openBook = useCallback(() => {
    setChat(false);
    setOpen(true);
  }, []);

  const closeBook = useCallback(() => {
    setOpen(false);
    setStatus((s) => (s === "sent" ? "idle" : s));
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBook();
    };
    window.addEventListener("keydown", onKey);
    const focusTimer = setTimeout(() => firstField.current?.focus(), 400);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(focusTimer);
    };
  }, [open, closeBook]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/allegiant/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, lang }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const b = t.booking;

  return (
    <BookingContext.Provider value={{ openBook }}>
      {children}

      {floating && (
        <>
          <button
            type="button"
            className="al-chat-btn al-floating"
            data-hidden={open ? "" : undefined}
            aria-label={t.chat.title}
            aria-expanded={chat}
            onClick={() => setChat((v) => !v)}
          >
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#f4efe6" strokeWidth="1.6" aria-hidden="true">
              <path d="M4 5 H20 V16 H11 L6 20 V16 H4 Z" />
            </svg>
          </button>
          <button
            type="button"
            className="al-pill al-floating"
            data-hidden={open ? "" : undefined}
            onClick={openBook}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#08101e" strokeWidth="1.8" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 10 H21 M8 3 V7 M16 3 V7" />
            </svg>
            {t.nav.book}
          </button>
        </>
      )}

      {chat && !open && (
        <div className="al-chat" role="dialog" aria-label={t.chat.title}>
          <div className="al-chat-head">
            <div>
              <div className="al-eyebrow" style={{ letterSpacing: "0.12em" }}>{t.chat.title}</div>
              <div style={{ marginTop: 4, fontSize: 14, color: "var(--al-muted)" }}>{t.chat.sub}</div>
            </div>
            <button type="button" className="al-icon-btn" aria-label={b.close} onClick={() => setChat(false)}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#f4efe6" strokeWidth="1.8" aria-hidden="true">
                <path d="M5 5 L19 19 M19 5 L5 19" />
              </svg>
            </button>
          </div>
          <div className="al-chat-body">
            <div className="al-chat-bubble">{t.chat.hi}</div>
            <div className="al-chat-actions">
              <button type="button" className="primary" onClick={openBook}>{t.nav.book}</button>
              <a href={`tel:${business.phoneHref}`}>{t.chat.call}</a>
              <a href={`sms:${business.phoneHref}`}>{t.chat.text}</a>
            </div>
          </div>
        </div>
      )}

      <div className="al-backdrop" data-open={open ? "" : undefined} onClick={closeBook} aria-hidden="true" />
      <aside
        className="al-drawer"
        data-open={open ? "" : undefined}
        role="dialog"
        aria-modal="true"
        aria-labelledby="al-book-title"
        inert={!open}
      >
        <div className="al-drawer-head">
          <div id="al-book-title" className="al-eyebrow">{b.title}</div>
          <button type="button" className="al-icon-btn" aria-label={b.close} onClick={closeBook}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#f4efe6" strokeWidth="1.6" aria-hidden="true">
              <path d="M5 5 L19 19 M19 5 L5 19" />
            </svg>
          </button>
        </div>

        {status === "sent" ? (
          <div style={{ marginTop: 80, textAlign: "center" }}>
            <svg viewBox="0 0 48 48" width="56" height="56" fill="none" stroke="#f26f21" strokeWidth="1.8" aria-hidden="true">
              <circle cx="24" cy="24" r="21" />
              <path d="M14 25 L21 32 L34 16" />
            </svg>
            <h3 className="al-serif" style={{ margin: "28px 0 0", fontWeight: 400, fontSize: 44 }}>{b.thanks}</h3>
            <p role="status" style={{ margin: "16px 0 0", fontSize: 19, lineHeight: 1.7, color: "var(--al-muted)" }}>{b.thanksP}</p>
            <button type="button" className="al-btn-line" style={{ marginTop: 36 }} onClick={closeBook}>{b.close}</button>
          </div>
        ) : (
          <form className="al-form" onSubmit={onSubmit}>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.7, color: "var(--al-muted)" }}>{b.sub}</p>
            <p style={{ margin: 0, fontSize: 15, letterSpacing: "0.04em", color: "var(--al-faint)" }}>{b.hours}</p>
            <div className="al-field">
              <label htmlFor="al-name">{b.name}</label>
              <input ref={firstField} id="al-name" name="name" required maxLength={80} autoComplete="name" />
            </div>
            <div className="al-field">
              <label htmlFor="al-phone">{b.phone}</label>
              <input id="al-phone" name="phone" type="tel" required maxLength={30} autoComplete="tel" />
            </div>
            <div className="al-field">
              <label htmlFor="al-appliance">{b.appliance}</label>
              <select id="al-appliance" name="appliance" defaultValue={b.appliances[0]}>
                {b.appliances.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="al-field">
              <label htmlFor="al-brand">{b.brand}</label>
              <input id="al-brand" name="brand" maxLength={60} />
            </div>
            <div className="al-field-row">
              <div className="al-field">
                <label htmlFor="al-zip">{b.zip}</label>
                <input id="al-zip" name="zip" inputMode="numeric" maxLength={10} autoComplete="postal-code" />
              </div>
              <div className="al-field">
                <label htmlFor="al-time">{b.time}</label>
                <select id="al-time" name="time" defaultValue={b.times[0]}>
                  {b.times.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="al-field">
              <label htmlFor="al-message">{b.message}</label>
              <textarea id="al-message" name="message" rows={3} maxLength={800} />
            </div>
            {/* Campo trampa para bots: las personas no lo ven ni lo llenan. */}
            <div className="al-hp" aria-hidden="true">
              <label htmlFor="al-website">Website</label>
              <input id="al-website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            {status === "error" && (
              <p className="al-form-error" role="alert">{b.error}</p>
            )}
            <button type="submit" className="al-submit" disabled={status === "sending"}>
              {status === "sending" ? b.sending : b.send}
            </button>
            <div style={{ fontSize: 15, color: "var(--al-muted)", textAlign: "center" }}>
              {b.or}{" "}
              <a href={`tel:${business.phoneHref}`} style={{ borderBottom: "1px solid var(--al-line-3)" }}>
                {business.phoneDisplay}
              </a>
            </div>
          </form>
        )}
      </aside>
    </BookingContext.Provider>
  );
}
