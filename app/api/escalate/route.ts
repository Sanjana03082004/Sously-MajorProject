import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { sendEscalationEmail } from "@/lib/mailer";
// import { sendSms, makeCall } from "@/lib/twilio";

export const runtime = "nodejs"; // ensures Node APIs available

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const reason = body?.reason || "risk_high";
    const lastUserText = body?.lastUserText || "";
    const userId = body?.userId; // optional if you pass it

    // Load user to get emergency contacts (or pass contacts directly from client if you prefer)
    let contacts: Array<{ name: string; phone: string }> = [];
    let userEmail = "";

    try {
      const client = await clientPromise;
      const db = client.db();
      // If you have auth, map userId from session or token instead of trusting body
      const user = userId ? await db.collection("users").findOne({ _id: new (await import("mongodb")).ObjectId(userId) }) : null;

      contacts = (user?.emergencyContacts || []).map((c: any) => ({ name: c.name, phone: c.phone }));
      userEmail = user?.email || "";
    } catch {}

    // If no contacts found, you can allow client to pass fallback numbers:
    if ((!contacts || contacts.length === 0) && Array.isArray(body?.contacts)) {
      contacts = body.contacts;
    }

    const alertText = [
      `MindMate Safety Alert`,
      `Reason: ${reason}`,
      userEmail ? `User: ${userEmail}` : "",
      lastUserText ? `Last message: "${lastUserText}"` : "",
      `Time: ${new Date().toLocaleString()}`,
    ].filter(Boolean).join("\n");

    let smsOk = false;
    let callOk = false;

    // 1) Try SMS to all contacts (if Twilio configured)
    // if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM) {
    //   for (const c of contacts) {
    //     try {
    //       await sendSms(c.phone, alertText);
    //       smsOk = true;
    //     } catch {}
    //   }

    //   // 2) Optional: call the first contact
    //   if (contacts[0]?.phone && process.env.TWILIO_VOICE_URL) {
    //     try {
    //       await makeCall(contacts[0].phone);
    //       callOk = true;
    //     } catch {}
    //   }
    //}

    // 3) Always send a fallback email to helpline
    const emailOk = await sendEscalationEmail({
      to: process.env.HELPLINE_EMAIL_TO!,
      subject: "MindMate Safety Alert",
      text: alertText,
    }).catch(() => false);

    return NextResponse.json({
      ok: true,
      smsOk,
      callOk,
      emailOk: !!emailOk,
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Escalation failed" }, { status: 500 });
  }
}
