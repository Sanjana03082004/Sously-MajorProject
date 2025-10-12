// // lib/speech.ts
// export function speak(text: string) {
//   if (typeof window === "undefined" || !text) return;

//   const synth = window.speechSynthesis;
//   if (!synth) return console.warn("SpeechSynthesis not supported");

//   // Prevent reading code or JSON
//   const cleaned = text
//     .replace(/[\{\}\[\]"']/g, "")
//     .replace(/\s+/g, " ")
//     .replace(/(title|time|completed|createdAt|true|false|null)/gi, "")
//     .trim();

//   if (!cleaned || cleaned.length < 2) return;

//   const loadVoices = new Promise<void>((resolve) => {
//     const voices = synth.getVoices();
//     if (voices.length) return resolve();
//     synth.onvoiceschanged = () => resolve();
//   });

//   loadVoices.then(() => {
//     synth.cancel();
//     const utter = new SpeechSynthesisUtterance(cleaned);
//     utter.lang = "en-US";
//     utter.rate = 1.0;
//     utter.pitch = 1.0;
//     utter.volume = 1.0;

//     const voices = synth.getVoices();
//     const preferred =
//       voices.find((v) => v.name.toLowerCase().includes("female")) ||
//       voices.find((v) => v.lang.toLowerCase().includes("en-us")) ||
//       voices[0];
//     if (preferred) utter.voice = preferred;

//     utter.onstart = () => console.log("🎙️ Speaking:", cleaned);
//     utter.onend = () => console.log("✅ Done speaking");

//     synth.speak(utter);
//   });
// }
// lib/speech.ts
export function speak(text: string) {
  if (typeof window === "undefined" || !text) return;

  const synth = window.speechSynthesis;
  if (!synth) {
    console.warn("⚠️ SpeechSynthesis not supported on this browser.");
    return;
  }

  // 🧹 Clean unwanted characters or code-like words
  const cleaned = text
    .replace(/[\{\}\[\]"']/g, "")
    .replace(/\s+/g, " ")
    .replace(/(title|time|completed|createdAt|true|false|null)/gi, "")
    .trim();

  if (!cleaned || cleaned.length < 2) return;

  // 🕓 Load voices asynchronously (Chrome bug workaround)
  const loadVoices = new Promise<void>((resolve) => {
    const voices = synth.getVoices();
    if (voices.length) return resolve();
    synth.onvoiceschanged = () => resolve();
  });

  loadVoices.then(() => {
    synth.cancel(); // Stop any current speech
    const utter = new SpeechSynthesisUtterance(cleaned);

    // 🎙️ Set language + pacing for smooth, natural flow
    utter.lang = "en-IN"; // Prioritize Indian English accent
    utter.rate = 1.05;    // Slightly faster for more conversational tone
    utter.pitch = 1.0;    // Balanced tone
    utter.volume = 1.0;

    // 🔊 Pick the best voice available on the system
    const voices = synth.getVoices();
    const preferred =
      voices.find(v => v.lang === "en-IN" && v.name.toLowerCase().includes("google")) ||
      voices.find(v => v.lang.startsWith("en")) ||
      voices[0];

    if (preferred) utter.voice = preferred;

    // 🧠 Natural pause management
    utter.text = cleaned
      .replace(/([.,!?])/g, "$1 ") // Add natural pause after punctuation
      .replace(/\s{2,}/g, " "); // Prevent double spacing

    // 🎧 Optional callbacks (debugging)
    utter.onstart = () => console.log("🎙️ Speaking:", utter.text);
    utter.onend = () => console.log("✅ Done speaking");

    // 🚀 Speak now
    synth.speak(utter);
  });
}
