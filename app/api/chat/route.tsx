// // // app/api/chat/route.ts
// // export const runtime = "nodejs";

// // type Msg = { role: "user" | "assistant"; content: string };

// // const SYSTEM_PROMPT = `You are a warm, supportive friend. Keep replies brief (<=2 sentences) and ask one gentle follow-up.
// // If the user seems in danger, FIRST LINE must be JSON: {"risk":"high"}; otherwise {"risk":"low"}.
// // Then add a newline and your friendly reply.`;

// // // ----- Config -----
// // const OLLAMA_BASE = process.env.OLLAMA_BASE || "http://127.0.0.1:11434";
// // const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1:8b";
// // // Android/device note: Use your PC's LAN IP for OLLAMA_BASE, e.g. http://192.168.1.50:11434

// // function regexRisk(s: string) {
// //   return /suicide|kill myself|hurt myself|self harm|end it|can.?t go on/i.test(s) ? "high" : "low";
// // }

// // function parseReply(text: string, userText: string) {
// //   let risk = "low";
// //   let reply = text || "I’m here. Tell me more.";
// //   const first = (text.split("\n")[0] || "").trim();
// //   try {
// //     const meta = JSON.parse(first);
// //     if (meta?.risk === "high" || meta?.risk === "low") {
// //       risk = meta.risk;
// //       reply = text.split("\n").slice(1).join("\n").trim() || reply;
// //     } else {
// //       risk = regexRisk(userText);
// //     }
// //   } catch {
// //     risk = regexRisk(userText);
// //   }
// //   return { reply, risk };
// // }

// // async function askOllama(history: Msg[], userText: string) {
// //   const messages = [
// //     { role: "system", content: SYSTEM_PROMPT },
// //     ...history.map((m) => ({ role: m.role, content: m.content })),
// //     { role: "user", content: userText },
// //   ];

// //   // timeout wrapper so fetch doesn’t hang forever
// //   const ctrl = new AbortController();
// //   const t = setTimeout(() => ctrl.abort(), 25_000);

// //   try {
// //     const res = await fetch(`${OLLAMA_BASE}/api/chat`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ model: OLLAMA_MODEL, messages, stream: false }),
// //       signal: ctrl.signal,
// //     });

// //     clearTimeout(t);

// //     if (!res.ok) {
// //       const errTxt = await res.text().catch(() => "");
// //       console.error("Ollama error:", res.status, errTxt);
// //       return null;
// //     }

// //     const data = await res.json(); // { message: { role, content }, ... }
// //     const text: string = data?.message?.content ?? data?.response ?? "";
// //     return parseReply(text, userText);
// //   } catch (e: any) {
// //     clearTimeout(t);
// //     console.error("Ollama fetch failed:", e?.message || e);
// //     return null;
// //   }
// // }

// // export async function POST(req: Request) {
// //   const { history = [], userText = "" } = await req.json();
// //   const o = await askOllama(history, userText);
// //   if (o) return Response.json(o);
// //   return Response.json({
// //     reply: "I’m here. Tell me more—what’s on your mind?",
// //     risk: regexRisk(userText),
// //   });
// // }
// // // import { NextResponse } from "next/server";
// // // import { riskLevel } from "@/lib/risk";

// // // // Switch here if you use cloud LLM instead of Ollama
// // // const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:3001";

// // // function buildPrompt(history: Array<{role:"user"|"assistant"; content:string}>, userText: string) {
// // //   const system = `You are a warm, supportive friend. Keep replies short (1–2 sentences), empathetic, and conversational.`;
// // //   const turns = [...history, { role: "user" as const, content: userText }]
// // //     .slice(-6) // <- keep short
// // //     .map(m => `${m.role === "user" ? "User" : "You"}: ${m.content}`)
// // //     .join("\n");

// // //   return `${system}\n\n${turns}\nYou:`;
// // // }

// // // export async function POST(req: Request) {
// // //   try {
// // //     const { history = [], userText = "" } = await req.json();

// // //     const controller = new AbortController();
// // //     const t = setTimeout(() => controller.abort(), 10_000); // 10s timeout

// // //     // Build prompt and call Ollama generate (non-stream for simplicity)
// // //     const prompt = buildPrompt(history, userText);
// // //     const r = await fetch(`${OLLAMA_URL}/api/generate`, {
// // //       method: "POST",
// // //       signal: controller.signal,
// // //       headers: { "Content-Type": "application/json" },
// // //       body: JSON.stringify({
// // //         model: "llama3.1:8b",
// // //         prompt,
// // //         // temperature: 0.6,
// // //         // num_predict: 120,
// // //         stream: false,
// // //       }),
// // //     }).finally(() => clearTimeout(t));

// // //     if (!r.ok) {
// // //       const txt = await r.text();
// // //       return NextResponse.json({ reply: "I’m here—say that again?", risk: "low", err: txt }, { status: 200 });
// // //     }

// // //     const data = await r.json(); // { response: "..." }
// // //     let reply = (data?.response || "").trim();

// // //     // Fallback if empty
// // //     if (!reply) reply = "I’m here and listening. Tell me more.";

// // //     // Lightweight safety check
// // //     const risk = riskLevel(userText, reply); // 'low' | 'high'

// // //     return NextResponse.json({ reply, risk }, { status: 200 });
// // //   } catch (e: any) {
// // //     return NextResponse.json({ reply: "I had a hiccup—can you repeat that?", risk: "low" }, { status: 200 });
// // //   }
// // // }
// // app/api/chat/route.ts
// import { NextResponse } from "next/server";

// const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
// const MODEL = process.env.OLLAMA_MODEL || "llama3.2:3b";

// function buildPrompt(
//   history: Array<{ role: "user" | "assistant"; content: string }>,
//   userText: string
// ) {
//   const system = "You are a warm, supportive friend. Reply in 1–2 short sentences.";
//   const turns = [...history, { role: "user" as const, content: userText }]
//     .slice(-4) // keep tiny for speed
//     .map((m) => `${m.role === "user" ? "User" : "You"}: ${m.content}`)
//     .join("\n");
//   return `${system}\n\n${turns}\nYou:`;
// }

// export async function POST(req: Request) {
//   const started = Date.now();
//   try {
//     const { history = [], userText = "" } = await req.json();

//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 20_000);

//     const r = await fetch(`${OLLAMA_URL}/api/generate`, {
//       method: "POST",
//       signal: controller.signal,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         model: MODEL,
//         prompt: buildPrompt(history, userText),
//         stream: false,
//         keep_alive: "30m",                 // <— keep loaded in RAM
//         options: {
//           num_predict: 60,                 // <— short replies
//           temperature: 0.7,
//           repeat_penalty: 1.05,
//           num_ctx: 1024,                   // <— smaller context = faster
//           stop: ["\nUser:", "\nYou:"],     // <— early stop
//         },
//       }),
//     }).finally(() => clearTimeout(timeout));

//     if (!r.ok) {
//       const txt = await r.text().catch(() => "");
//       console.error("OLLAMA_FAIL", r.status, txt);
//       return NextResponse.json({ reply: "I’m here—say that again?", risk: "low" }, { status: 200 });
//     }

//     const data = await r.json(); // { response: string }
//     const reply = (data?.response || "I’m here and listening. Tell me more.").trim();

//     console.log("CHAT_OK", MODEL, Date.now() - started, "ms");
//     return NextResponse.json({ reply, risk: "low" });
//   } catch (e: any) {
//     console.error("CHAT_ERR", e?.name || e, "after", Date.now() - started, "ms");
//     return NextResponse.json({ reply: "I had a hiccup—could you repeat that?", risk: "low" }, { status: 200 });
//   }
// }
import { NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const MODEL = process.env.OLLAMA_MODEL || "llama3.2:3b";

function buildPrompt(
  history: Array<{ role: "user" | "assistant"; content: string }>,
  userText: string
) {
  const system = "You are a warm, supportive friend. Reply in 1–2 short sentences.";
  const turns = [...history, { role: "user" as const, content: userText }]
    .slice(-4)
    .map((m) => `${m.role === "user" ? "User" : "You"}: ${m.content}`)
    .join("\n");
  return `${system}\n\n${turns}\nYou:`;
}

export async function POST(req: Request) {
  const started = Date.now();
  try {
    const { history = [], userText = "" } = await req.json();

    // 🧼 Sanitize incoming user text
    const cleanText = sanitizeHtml(userText, {
      allowedTags: [],
      allowedAttributes: {},
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);

    const r = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        prompt: buildPrompt(history, cleanText),
        stream: false,
        keep_alive: "30m",
        options: {
          num_predict: 60,
          temperature: 0.7,
          repeat_penalty: 1.05,
          num_ctx: 1024,
          stop: ["\nUser:", "\nYou:"],
        },
      }),
    }).finally(() => clearTimeout(timeout));

    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      console.error("OLLAMA_FAIL", r.status, txt);
      return NextResponse.json(
        { reply: "I’m here—say that again?", risk: "low" },
        { status: 200 }
      );
    }

    const data = await r.json();
    const reply = (data?.response || "I’m here and listening. Tell me more.").trim();

    console.log("CHAT_OK", MODEL, Date.now() - started, "ms");
    return NextResponse.json({ reply, risk: "low" });
  } catch (e: any) {
    console.error("CHAT_ERR", e?.name || e, "after", Date.now() - started, "ms");
    return NextResponse.json(
      { reply: "I had a hiccup—could you repeat that?", risk: "low" },
      { status: 200 }
    );
  }
}
