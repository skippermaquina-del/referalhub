/**
 * Cotizaciones del cotizador interno, por inquilino.
 *
 * Mismo portero que el panel: cada negocio entra con su propio
 * `<INQUILINO>_ADMIN_CODE` y solo ve y toca lo suyo.
 */

import { adminGate } from "@/lib/admin";
import { listQuotes, saveQuote, updateQuoteOutcome } from "@/lib/quotes";

export async function GET(request: Request, { params }: { params: Promise<{ tenant: string }> }) {
  const t = await adminGate(request, params);
  return t instanceof Response ? t : listQuotes(t);
}

export async function POST(request: Request, { params }: { params: Promise<{ tenant: string }> }) {
  const t = await adminGate(request, params);
  return t instanceof Response ? t : saveQuote(t, request);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ tenant: string }> }) {
  const t = await adminGate(request, params);
  return t instanceof Response ? t : updateQuoteOutcome(t, request);
}
