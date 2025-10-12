// lib/risk.ts
const RED_FLAGS = [
  "suicide","kill myself","end my life","self harm","cut myself","overdose",
  "i want to die","i don't want to live","no reason to live","jump off",
];
const URGENT_STATES = ["unresponsive", "dizzy", "bleeding", "can't breathe", "panic attack"];

export function riskLevel(userText: string, botText?: string): "low"|"high" {
  const t = `${userText} ${botText || ""}`.toLowerCase();
  if (RED_FLAGS.some(k => t.includes(k))) return "high";
  if (URGENT_STATES.some(k => t.includes(k))) return "high";
  return "low";
}
