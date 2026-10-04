import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const toNumber = process.env.TWILIO_VADIM_PHONE;

export async function POST(req: NextRequest) {
  // Validar credenciales
  if (!accountSid || !authToken || !fromNumber || !toNumber) {
    return NextResponse.json(
      { error: "Twilio credentials not configured" },
      { status: 500 }
    );
  }

  try {
    const { leadName, leadPhone, appliance, brand, message: leadMessage } = await req.json();

    if (!leadName || !leadPhone) {
      return NextResponse.json(
        { error: "Missing required fields: leadName, leadPhone" },
        { status: 400 }
      );
    }

    const client = twilio(accountSid, authToken);

    // Construir mensaje SMS
    const smsBody = `New lead: ${leadName} (${leadPhone})
Appliance: ${appliance || "Not specified"}
Brand: ${brand || "Not specified"}
${leadMessage ? `Note: ${leadMessage.substring(0, 100)}...` : ""}`;

    // Enviar SMS a Vadim
    const message = await client.messages.create({
      body: smsBody,
      from: fromNumber,
      to: toNumber,
    });

    return NextResponse.json({
      ok: true,
      messageSid: message.sid,
      status: message.status,
    });
  } catch (error) {
    console.error("SMS Error:", error);
    return NextResponse.json(
      { error: "Failed to send SMS", details: String(error) },
      { status: 500 }
    );
  }
}
