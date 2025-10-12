// import { NextResponse } from "next/server"

// export async function POST(req: Request) {
//   const { message } = await req.json()

//   const OLLAMA_BASE = process.env.OLLAMA_BASE || "http://127.0.0.1:11434"
//   const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2:3b"

//   const systemPrompt = `
// You are a helpful scheduling assistant.
// Extract structured task info (title, date/time) from natural text.
// Always return ONLY JSON in this format:
// {
//   "title": "<short clear title>",
//   "time": "<ISO date string or null>"
// }
// If date/time not found, ask a clarifying question instead of guessing.
// `

//   try {
//     const ollamaRes = await fetch(`${OLLAMA_BASE}/api/generate`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         model: OLLAMA_MODEL,
//         prompt: `${systemPrompt}\nUser: ${message}`,
//         stream: false,
//       }),
//     })

//     const data = await ollamaRes.json()
//     console.log("🧠 Ollama raw:", data)

//     // Handle all known Ollama response formats
//     const text =
//       data.response ||
//       data.output ||
//       data.message?.content ||
//       (typeof data === "string" ? data : "")

//     return NextResponse.json({ text })
//   } catch (error) {
//     console.error("❌ Ollama connection error:", error)
//     return NextResponse.json(
//       { error: "Failed to connect to Ollama or parse response" },
//       { status: 500 }
//     )
//   }
// }
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { message } = await req.json()

  const res = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2:3b", // or your actual model name
      prompt: message,
      stream: false,
    }),
  })

  const data = await res.json()
  return NextResponse.json({ text: data.response })
}
