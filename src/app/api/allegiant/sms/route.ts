/**
 * SMS al dueño desde el panel de Allegiant. URL histórica, conservada.
 * Solo el panel (con su código) puede dispararlo: si no, cualquiera gastaría
 * saldo de Twilio.
 */

import { adminAuthorized, adminConfigured, adminDenied } from "@/lib/admin";
import { sendLeadSms } from "@/lib/admin-sms";
import { getTenant } from "@/lib/tenants";

const tenant = getTenant("allegiant")!;

export async function POST(request: Request) {
  if (!adminConfigured(tenant) || !adminAuthorized(tenant, request)) return adminDenied(tenant);
  return sendLeadSms(tenant, request);
}
