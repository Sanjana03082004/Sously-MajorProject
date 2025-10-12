// "use client"

// import { useCallback } from "react"

// interface VoiceCommand {
//   pattern: RegExp
//   action: (matches: RegExpMatchArray) => void
//   description: string
// }

// export function useVoiceCommands() {
//   const processCommand = useCallback((transcript: string) => {
//     const commands: VoiceCommand[] = [
//       {
//         pattern: /set (alarm|reminder) (?:for )?(.+)/i,
//         action: (matches) => {
//           const type = matches[1]
//           const time = matches[2]
//           console.log(`Setting ${type} for ${time}`)
//           return { type: "schedule", data: { type, time } }
//         },
//         description: "Set alarm or reminder",
//       },
//       {
//         pattern: /schedule (?:a )?meeting (?:with )?(.+) (?:at|for) (.+)/i,
//         action: (matches) => {
//           const person = matches[1]
//           const time = matches[2]
//           console.log(`Scheduling meeting with ${person} at ${time}`)
//           return { type: "meeting", data: { person, time } }
//         },
//         description: "Schedule a meeting",
//       },
//       {
//         pattern: /add task (.+)/i,
//         action: (matches) => {
//           const task = matches[1]
//           console.log(`Adding task: ${task}`)
//           return { type: "task", data: { task } }
//         },
//         description: "Add a new task",
//       },
//       {
//         pattern: /how (?:am i|do i) feel(?:ing)?/i,
//         action: () => {
//           console.log("Mood check requested")
//           return { type: "mood_check", data: {} }
//         },
//         description: "Check current mood",
//       },
//       {
//         pattern: /start focus (?:mode|session)/i,
//         action: () => {
//           console.log("Starting focus session")
//           return { type: "focus_start", data: {} }
//         },
//         description: "Start focus session",
//       },
//     ]

//     for (const command of commands) {
//       const matches = transcript.match(command.pattern)
//       if (matches) {
//         return command.action(matches)
//       }
//     }

//     return null
//   }, [])

//   return { processCommand }
// }
"use client"

export function useVoiceCommands() {
  const processWithAI = async (transcript: string) => {
    try {
      const res = await fetch("/api/ai/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `
You are a scheduling assistant.
Return ONLY a concise JSON with keys "title" and "time" for this command.

Examples:
User: "Remind me to sleep at 10 pm"
Output:
{
  "title": "Sleep",
  "time": "today at 10 pm"
}

User: "Set alarm to water plants tomorrow morning"
Output:
{
  "title": "Water plants",
  "time": "tomorrow at 8 am"
}

Now extract JSON for this user message:
"${transcript}"
`,
        }),
      })

      const data = await res.json()
      // Some LLaMA versions return { response: "..." } instead of { text: "..." }
      const raw = data.text || data.response || ""
      console.log("🧠 AI Raw Response:", raw)
      return raw
    } catch (err) {
      console.error("AI process error:", err)
      return ""
    }
  }

  return { processWithAI }
}

