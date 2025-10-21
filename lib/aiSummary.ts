const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const MODEL = process.env.OLLAMA_MODEL || "llama3.2:3b";

/**
 * Summarize a list of mood entries and journals into a short paragraph
 * using your local Ollama model.
 */
export async function generateMoodSummary(
  entries: { mood: string; reason?: string; journalText?: string }[]
) {
  if (!entries || entries.length === 0) return "No data available to summarize yet.";

  const combinedText = entries
    .map(
      (e) =>
        `${e.mood}: ${e.reason || "no reason"}${
          e.journalText ? ` — ${e.journalText}` : ""
        }`
    )
    .join("\n");

  const prompt = `
You are an empathetic wellbeing assistant.
Given these daily mood entries and reflections, summarize the overall emotional pattern for the week in 2–3 gentle sentences.

Entries:
${combinedText}
`;

  try {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 150,  // short paragraph
        },
      }),
    });

    if (!res.ok) {
      console.error("❌ Ollama summary error:", await res.text());
      return "Sorry, I couldn't summarize your moods right now.";
    }

    const data = await res.json();
    const summary = data?.response || "No summary generated.";
    return summary.trim();
  } catch (err) {
    console.error("❌ AI Summary Fetch Error:", err);
    return "Sorry, I couldn't summarize your moods right now.";
  }
}
