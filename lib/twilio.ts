// lib/twilio.ts
let twilioClient: any = null;
function getClient() {
  if (twilioClient) return twilioClient;
  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const token = process.env.TWILIO_AUTH_TOKEN!;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Twilio = require("twilio");
  twilioClient = new Twilio(sid, token);
  return twilioClient;
}

export async function sendSms(to: string, body: string) {
  const from = process.env.TWILIO_FROM!;
  if (!from) throw new Error("TWILIO_FROM missing");
  const client = getClient();
  return client.messages.create({ to, from, body });
}

// For voice calls, you need a TWILIO_VOICE_URL that returns TwiML (XML)
// Example URL can be a tiny API route you control which returns a <Say> message.
export async function makeCall(to: string) {
  const from = process.env.TWILIO_FROM!;
  const url = process.env.TWILIO_VOICE_URL!;
  const client = getClient();
  return client.calls.create({ to, from, url });
}
