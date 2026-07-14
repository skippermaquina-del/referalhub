"use client";

import { useState } from "react";
import Link from "next/link";
import { getOfferBySlug } from "@/data/offers";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  recommendedSlugs?: string[];
}

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "¡Hola! Contame qué banco usás o qué te interesa (invertir, cashback, tarjetas) y te recomiendo la mejor oferta.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages((current) => [
          ...current,
          { role: "assistant", content: data.error ?? "Algo salió mal." },
        ]);
        return;
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply, recommendedSlugs: data.recommendedSlugs },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "No pude conectarme. Probá de nuevo." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 flex h-[28rem] w-80 flex-col rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between rounded-t-xl bg-emerald-500 px-4 py-3 text-white">
            <span className="font-medium">Asistente de ofertas</span>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((message, i) => (
              <div key={i} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className="max-w-[85%]">
                  <div
                    className={
                      message.role === "user"
                        ? "rounded-lg bg-emerald-500 px-3 py-2 text-sm text-white"
                        : "rounded-lg bg-neutral-100 px-3 py-2 text-sm dark:bg-neutral-800"
                    }
                  >
                    {message.content}
                  </div>
                  {message.recommendedSlugs && message.recommendedSlugs.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1.5">
                      {message.recommendedSlugs.map((slug) => {
                        const offer = getOfferBySlug(slug);
                        if (!offer) return null;
                        return (
                          <Link
                            key={slug}
                            href={`/go/${slug}`}
                            className="flex items-center justify-between rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400"
                          >
                            <span>
                              {offer.emoji} {offer.name}
                            </span>
                            <span>{offer.bonus}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-neutral-100 px-3 py-2 text-sm text-neutral-400 dark:bg-neutral-800">
                  Escribiendo…
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 border-t border-neutral-200 p-3 dark:border-neutral-800">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Escribí tu pregunta…"
              className="flex-1 rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-neutral-700"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
            >
              Enviar
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-2xl text-white shadow-lg hover:bg-emerald-600"
        aria-label="Abrir asistente"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
