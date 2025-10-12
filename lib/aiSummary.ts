import { OpenAI } from "openai";

// Only initialize if API key available
const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * Summarize a list of mood entries and journals into a short paragraph.
 */
export async function generateMoodSummary(entries: { mood: string; reason?: string; journalText?: string }[]) {
  if (!entries || entries.length === 0) return "No data available to summarize yet.";

  const combinedText = entries
    .map((e) => `${e.mood}: ${e.reason || "no reason"}${e.journalText ? ` — ${e.journalText}` : ""}`)
    .join("\n");

  if (!client) {
    console.warn("⚠️ No AI key found, returning static summary.");
    return `You mostly felt ${entries[0].mood} lately. Common reasons included ${entries[0].reason || "general mood"} — keep reflecting and journaling!`;
  }

  const prompt = `
You are an empathetic wellbeing assistant. 
Given these daily mood entries and reflections, summarize the overall emotional pattern for the week in 2–3 gentle sentences.

Entries:
${combinedText}
`;

  try {
    const completion = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    const summary = completion.output_text || "No summary generated.";
    return summary.trim();
  } catch (err) {
    console.error("❌ AI Summary Error:", err);
    return "I'm sorry, I couldn't summarize your week right now.";
  }
}
