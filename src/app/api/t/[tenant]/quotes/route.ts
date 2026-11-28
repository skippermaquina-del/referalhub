/**
 * Cotizaciones del cotizador interno, por inquilino.
 *
 * Mismo portero que el panel: cada negocio entra con su propio
 * `<INQUILINO>_ADMIN_CODE` y solo ve y toca lo suyo.
 */

import { adminAuthorized, adminConfigured, adminDenied } from "@/lib/admin";
import { listQuotes, saveQuote, updateQuoteOutcome } from "@/lib/quotes";
import { getTenant, type Tenant } from "@/lib/tenants";

async function portero(
  request: Request,
  params: Promise<{ tenant: string }>,
): Promise<Tenant | Response> {
  const tenant = getTenant((await params).tenant);
  if (!tenant) return Response.json({ error: "unknown_tenant" }, { status: 404 });
  if (!adminConfigured(tenant) || !adminAuthorized(tenant, request)) return adminDenied(tenant);
  return tenant;
}

export async function GET(request: Request, { params }: { params: Promise<{ tenant: string }> }) {
  const t = await portero(request, params);
  return t instanceof Response ? t : listQuotes(t);
}

export async function POST(request: Request, { params }: { params: Promise<{ tenant: string }> }) {
  const t = await portero(request, params);
  return t instanceof Response ? t : saveQuote(t, request);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ tenant: string }> }) {
  const t = await portero(request, params);
  return t instanceof Response ? t : updateQuoteOutcome(t, request);
}
