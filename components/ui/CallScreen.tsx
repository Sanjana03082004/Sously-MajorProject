"use client";

import { useEffect, useRef, useState } from "react";
import CuteAvatar from "@/components/ui/CuteAvatar";



/* =========================== Env + Safe helpers =========================== */

// Are we inside the Android WebView with a JS interface?
const isAndroid = typeof window !== "undefined" && !!(window as any).Android;


// Safe accessors for Web Speech TTS
const getSynth = () =>
  typeof window !== "undefined" && "speechSynthesis" in window
    ? window.speechSynthesis
    : null;

const getVoicesSafe = (): SpeechSynthesisVoice[] => {
  const s = getSynth();
  return s?.getVoices?.() ?? [];
};

// Expose a hook so Android native code can push transcripts to the page
function ensureNativeHooks(onText: (text: string) => void) {
  if (typeof window === "undefined") return;
  (window as any).__onNativeTranscript = (text: string) => onText(text);
}

/* ================================ Types ================================== */

type Mouth = "rest" | "a" | "e" | "o" | "m";
type Msg = { role: "user" | "assistant"; content: string };

const toMouth = (ch: string): Mouth => {
  const c = ch.toLowerCase();
  if ("a".includes(c)) return "a";
  if ("eiy".includes(c)) return "e";
  if ("oquw".includes(c)) return "o";
  if ("bmp".includes(c)) return "m";
  return "rest";
};

/* ============================= Mood + Music ============================== */

function detectEmotion(text: string): "sad" | "anxious" | "angry" | "neutral" {
  const t = text.toLowerCase();
  if (/not pretty|ugly|worthless|hopeless|so sad|depressed|cry/.test(t)) return "sad";
  if (/anxious|nervous|panic|scared|fear/.test(t)) return "anxious";
  if (/angry|mad|furious|frustrated/.test(t)) return "angry";
  return "neutral";
}

const SPOTIFY_BY_MOOD: Record<string, string> = {
  sad: "https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp", // sample; replace
  anxious: "https://open.spotify.com/playlist/37i9dQZF1DX3PIPIT6lEg5",
  angry: "https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS",
};

function openSpotifyUrl(url?: string) {
  if (!url) return;
  window.open(url, "_blank");
}

/* ============================ Voice selection ============================ */

const FEMALE_NAMES = [
  // Windows
  "Aria",
  "Zira",
  "Jenny",
  // macOS
  "Samantha",
  "Victoria",
  "Karen",
  "Tessa",
  "Veena",
  // Chrome example
  "Google UK English Female",
];

function pickVoice(lang: string, savedName?: string) {
  const voices = getVoicesSafe();
  if (savedName) {
    const v = voices.find((vv) => vv.name === savedName);
    if (v) return v;
  }
  const byLang = voices.filter((v) => v.lang?.toLowerCase().startsWith(lang.toLowerCase()));
  const byName = [...byLang, ...voices].find((v) =>
    FEMALE_NAMES.some((n) => v.name.includes(n)),
  );
  return byName || byLang[0] || voices[0];
}

/* ================================ Component ============================== */

interface CallScreenProps {
  contactName?: string;
  hello?: string;
  voiceLang?: string;
  /** Start the greeting + listening automatically on mount */
  autoStart?: boolean;
  /** Hide the big “Call …” round button (we’ll still show a small End button) */
  hideCallButton?: boolean;
  /** Show a simple top bar with Back (useful in overlay/page) */
  showTopBar?: boolean;
  /** Handler for Back button */
  onClose?: () => void;
}

export default function CallScreen({
  
  contactName = "Lily",
  hello = "Hey! I’m here. What’s on your mind?",
  voiceLang = "en-US",
  autoStart = true,
  hideCallButton = true,
  showTopBar = true,
  onClose,
}: CallScreenProps) {
  const [phase, setPhase] = useState<"idle" | "calling" | "connected" | "listening">("idle");
  const [blink, setBlink] = useState(false);
  const [mouth, setMouth] = useState<Mouth>("rest");
  const [status, setStatus] = useState("Ready to call");

const shuttingDownRef = useRef(false);               // <— ADD THIS

  const historyRef = useRef<Msg[]>([]);
  const recRef = useRef<any>(null);
  const talkAnimRef = useRef<number | null>(null);

  // ---- TTS voice state (only useful when Web TTS exists) ----
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("ttsVoiceName") : null,
  );

  // Load voices safely
  useEffect(() => {
    const s = getSynth();
    if (!s) return; // WebView may not have speechSynthesis
    const load = () => setVoices(getVoicesSafe());
    load();
    s.addEventListener?.("voiceschanged", load);
    return () => s.removeEventListener?.("voiceschanged", load);
  }, []);

  // Persist chosen voice
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (voiceName) localStorage.setItem("ttsVoiceName", voiceName);
      else localStorage.removeItem("ttsVoiceName");
    }
  }, [voiceName]);

  useEffect(() => {
    (window as any).__startListening = () => listen();
    (window as any).__sttStatus = (code: string) => {
      if (code === "stt_unavailable") {
        setStatus(
          "Speech recognition not available. Update Google app / Speech Services and enable Google voice input, then try again.",
        );
      }
    };
  }, []);

  // Gentle blink loop
 useEffect(() => {
  let t: ReturnType<typeof setInterval> | null = null;

  const loop = () => {
    setBlink(true);
    setTimeout(() => setBlink(false), 500);
  };

  t = setInterval(loop, 2000);

  return () => {
    if (t) clearInterval(t);
  };
}, []);

  

  // Auto-start call on mount if requested
  useEffect(() => {
    if (autoStart) {
      const t = setTimeout(() => startCall(), 400);
      return () => clearTimeout(t);
    }
  }, [autoStart]);

  /* ------------------------------- TTS ------------------------------- */

  function speak(text: string, onDone?: () => void) {
    // Prefer native Android TTS if available
    if (isAndroid && (window as any).Android?.speak) {
      try {
        (window as any).Android.speak(text);
        // simple local mouth animation estimate
        const estMs = Math.max(1200, Math.floor(text.split(/\s+/).length * 350));
        const iv = window.setInterval(() => {
          setMouth((m) => (m === "a" ? "e" : m === "e" ? "o" : "a"));
        }, 120);
        setPhase("connected");
        setStatus(`${contactName} is speaking…`);
        setTimeout(() => {
          clearInterval(iv);
          setMouth("rest");
          onDone?.();
        }, estMs);
        return;
      } catch {
        // fall through to web TTS
      }
    }

    // Web TTS fallback
    const synth = getSynth();
    if (!synth) {
      console.warn("speechSynthesis not available; skipping voice");
      onDone?.();
      return;
    }

    const u = new SpeechSynthesisUtterance(text);
    u.lang = voiceLang;
    u.pitch = 1.15; // gentle female vibe
    u.rate = 0.98;

    const saved =
      voiceName || (typeof window !== "undefined" ? localStorage.getItem("ttsVoiceName") : undefined) || undefined;
    const v = pickVoice(voiceLang, saved);
    if (v) u.voice = v;

    u.onstart = () => {
      setPhase("connected");
      setStatus(`${contactName} is speaking…`);
      if (talkAnimRef.current) clearInterval(talkAnimRef.current);
      talkAnimRef.current = window.setInterval(() => {
        setMouth((m) => (m === "a" ? "e" : m === "e" ? "o" : "a"));
      }, 120);
    };

    u.onboundary = (e: any) => {
      const ch = (text[(e.charIndex ?? 0)] || " ").toString();
      setMouth(toMouth(ch));
    };

    u.onend = () => {
      setMouth("rest");
      if (talkAnimRef.current) {
        clearInterval(talkAnimRef.current);
        talkAnimRef.current = null;
      }
      onDone?.();
    };

    synth.cancel();
    synth.speak(u);
  }

  /* ------------------------------- STT ------------------------------- */

  function listen() {
    // Prefer native Android STT
    if (isAndroid && (window as any).Android?.startListening) {
      ensureNativeHooks(handleTranscriptFromNative);
      setPhase("listening");
      setStatus("Listening…");
      try {
        (window as any).Android.startListening();
      } catch {
        setStatus("Microphone not available.");
      }
      return;
    }

    // Web Speech Recognition fallback
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) {
      setStatus("SpeechRecognition not supported in this browser.");
      return;
    }
    const rec = new SR();
    recRef.current = rec;
    rec.lang = voiceLang;
    rec.continuous = false;
    rec.interimResults = true;

    let finalText = "";

    rec.onstart = () => {
      setPhase("listening");
      setStatus("Listening…");
    };

    rec.onresult = (e: any) => {
      const parts = Array.from(e.results).map((r: any) => r[0].transcript);
      finalText = parts.join(" ");
      setStatus("You: " + finalText);
    };

    rec.onend = async () => {
      if (shuttingDownRef.current) {
    setPhase("idle");
    setStatus("Ready to call");
    return;                                         // <— ADD THIS
  }

      if (!finalText.trim()) {
        setStatus("Didn’t catch that. Say it again?");
        return listen();
      }

      historyRef.current.push({ role: "user", content: finalText });

      const payload = {
        history: historyRef.current.slice(-6),
        userText: finalText,
      };

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        const reply = data?.reply || "I’m here. Tell me more.";
        const risk: "low" | "high" = data?.risk || "low";

if (risk === "high") {
  // Fire and forget – do not block the UI
  fetch("/api/escalate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reason: "risk_high",
      lastUserText: finalText,   // whatever variable holds user input
    }),
  }).catch(() => {});
}


        historyRef.current.push({ role: "assistant", content: reply });

        const mood = detectEmotion(finalText);
        speak(reply, () => {
          if (risk === "low" && mood !== "neutral") {
            openSpotifyUrl(SPOTIFY_BY_MOOD[mood]);
          }
          listen();
        });
      } catch (err) {
        console.error(err);
        speak("I had a hiccup. Can you say that again?", () => listen());
      }
    };

    rec.start();
  }

  // Handler used when Android native sends back transcripts
  function handleTranscriptFromNative(finalText: string) {
    if (!finalText?.trim()) {
      setStatus("Didn’t catch that. Say it again?");
      return listen();
    }
    historyRef.current.push({ role: "user", content: finalText });

    const payload = {
      history: historyRef.current.slice(-6),
      userText: finalText,
    };

    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((data) => {
        const reply = data?.reply || "I’m here. Tell me more.";
        historyRef.current.push({ role: "assistant", content: reply });
        speak(reply, () => listen());
      })
      .catch(() => speak("I had a hiccup. Can you say that again?", () => listen()));
  }

  /* ----------------------------- Call flow ---------------------------- */

  function startCall() {
    shuttingDownRef.current = false; 
    setPhase("calling");
    setStatus(`Calling ${contactName}…`);
    setTimeout(() => speak(hello, () => listen()), 700);
  }

  function endCall() {
  shuttingDownRef.current = true;

  const s = getSynth();
  s?.cancel();
  try {
    recRef.current?.stop?.();
    recRef.current = null;
  } catch {}

  if (talkAnimRef.current) {
    clearInterval(talkAnimRef.current);
    talkAnimRef.current = null;
  }

  setMouth("rest");
  setPhase("idle");
  setStatus("Ready to call");

  if (typeof onClose === "function") onClose();
}

  const isCalling = phase === "calling";
  const isConnected = phase === "connected" || phase === "listening";

  /* -------------------------------- UI -------------------------------- */

  return (
    // Full screen container (change bg to bg-green-50 if you want light green here)
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-b from-[#5b3cc5] to-[#2d1a77] text-white">
      {/* Top bar */}
      {showTopBar && (
        <div className="flex items-center justify-between px-4 py-3 bg-black/10">
          {onClose ? (
            <button
              onClick={onClose}
              className="bg-white/90 text-[#2d1a77] rounded px-3 py-1 shadow"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}
          {/* Small end button when in-call */}
          {isConnected || isCalling ? (
            <button
              onClick={endCall}
              className="bg-red-500 hover:bg-red-400 px-3 py-1 rounded shadow"
            >
              End
            </button>
          ) : (
            <div />
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* (Optional) voice selector – keep if useful; hide if you want super minimal */}
        {voices.length > 0 && (
          <div className="mb-4 flex items-center justify-center gap-2 text-xs opacity-85">
            <span>Voice:</span>
            <select
              className="bg-black/10 border border-white/20 rounded px-2 py-1"
              value={voiceName ?? ""}
              onChange={(e) => setVoiceName(e.target.value || null)}
            >
              <option value="">(auto)</option>
              {voices
                .filter((v) => v.lang?.toLowerCase().startsWith(voiceLang.toLowerCase()))
                .map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Avatar */}
        <div className={`grid place-items-center ${isConnected ? "mt-2" : "mt-6"}`}>
          {isCalling ? (
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-white/10 animate-ping" />
              <div className="w-36 h-36 rounded-full grid place-items-center bg-gradient-to-b from-[#6e56f0] to-[#3722a3] border border-white/20">
                <div className="text-sm opacity-80">Calling {contactName}…</div>
              </div>
            </div>
          ) : (
            <div className={`${isConnected ? "scale-105" : "scale-100"} transition-transform`}>
              <CuteAvatar mouth={mouth} hairColor="#6B4D3E" />

            </div>
          )}
        </div>

        {/* Status */}
        <div className="mt-6 text-center text-lg">{status}</div>
      </div>

      {/* Bottom big button (hidden by default) */}
      {!hideCallButton && (
        <div className="pb-6 flex items-center justify-center">
          {phase === "idle" ? (
            <button
              onClick={startCall}
              className="px-6 py-3 rounded-full bg-emerald-400 text-black font-semibold shadow hover:bg-emerald-300"
            >
              Call {contactName}
            </button>
          ) : (
            <button
              onClick={endCall}
              className="w-16 h-16 rounded-full bg-red-500 grid place-items-center text-2xl shadow hover:bg-red-400"
              aria-label="End call"
            >
              ⛔
            </button>
          )}
        </div>
      )}
    </div>
  );
}
// "use client";

// import { useEffect, useRef, useState } from "react";
// import CuteAvatar from "@/components/ui/CuteAvatar";

// type Mouth = "rest" | "a" | "e" | "o" | "m";
// const toMouth = (ch: string): Mouth => {
//   const c = ch.toLowerCase();
//   if ("a".includes(c)) return "a";
//   if ("eiy".includes(c)) return "e";
//   if ("oquw".includes(c)) return "o";
//   if ("bmp".includes(c)) return "m";
//   return "rest";
// };

// type CallScreenProps = {
//   contactName?: string;
//   voiceLang?: string;
//   autoStart?: boolean;     // start greeting + listen on mount
//   hideCallButton?: boolean;
//   showTopBar?: boolean;
//   onClose?: () => void;    // parent closes overlay
// };

// export default function CallScreen({
//   contactName = "MindMate",
//   voiceLang = "en-US",
//   autoStart = false,
//   hideCallButton = false,
//   showTopBar = true,
//   onClose,
// }: CallScreenProps) {
//   const [phase, setPhase] = useState<"idle"|"calling"|"connected"|"listening">("idle");
//   const [status, setStatus] = useState("Ready to call");
//   const [blink, setBlink] = useState(false);
//   const [mouth, setMouth] = useState<Mouth>("rest");

//   const recRef = useRef<any>(null);
//   const talkAnimRef = useRef<number | null>(null);

//   // Blink loop
//   useEffect(() => {
//     let t: number | null = null;
//     const loop = () => {
//       setBlink(true);
//       setTimeout(() => setBlink(false), 120);
//       t = window.setTimeout(loop, 2000 + Math.random() * 4000);
//     };
//     t = window.setTimeout(loop, 1000);
//     return () => { if (t) clearTimeout(t); };
//   }, []);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       try { recRef.current?.stop?.(); } catch {}
//       speechSynthesis.cancel();
//       if (talkAnimRef.current) clearInterval(talkAnimRef.current);
//     };
//   }, []);

//   function speak(text: string, onDone?: () => void) {
//     if (!("speechSynthesis" in window)) {
//       onDone?.(); return;
//     }
//     const u = new SpeechSynthesisUtterance(text);
//     u.lang = voiceLang; u.rate = 1; u.pitch = 1;

//     const pick = speechSynthesis.getVoices().find(v => v.lang?.startsWith(voiceLang));
//     if (pick) u.voice = pick;

//     u.onstart = () => {
//       setPhase("connected");
//       setStatus(`${contactName} is speaking…`);
//       if (talkAnimRef.current) clearInterval(talkAnimRef.current);
//       talkAnimRef.current = window.setInterval(() => {
//         setMouth(m => (m === "a" ? "e" : m === "e" ? "o" : "a"));
//       }, 120);
//     };
//     u.onboundary = (e: any) => {
//       const ch = (text[(e.charIndex ?? 0)] || " ").toString();
//       setMouth(toMouth(ch));
//     };
//     u.onend = () => {
//       setMouth("rest");
//       if (talkAnimRef.current) { clearInterval(talkAnimRef.current); talkAnimRef.current = null; }
//       onDone?.();
//     };

//     speechSynthesis.cancel();
//     speechSynthesis.speak(u);
//   }

//   function listen() {
//     const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
//     if (!SR) { setStatus("SpeechRecognition not supported."); return; }
//     const rec = new SR();
//     recRef.current = rec;
//     rec.lang = voiceLang; rec.continuous = false; rec.interimResults = true;

//     let finalText = "";
//     rec.onstart = () => { setPhase("listening"); setStatus("Listening…"); };
//     rec.onresult = (e: any) => {
//       const parts = Array.from(e.results).map((r: any) => r[0].transcript);
//       finalText = parts.join(" ");
//       setStatus("You: " + finalText);
//     };
//     rec.onend = async () => {
//       if (!finalText.trim()) { setStatus("Didn’t catch that. Say it again?"); return listen(); }
//       // Dummy bot reply (replace with /api/chat if you wish)
//       const reply = getFriendlyReply(finalText);
//       speak(reply, () => listen());
//     };
//     rec.start();
//   }

//   function startCall() {
//     setPhase("calling");
//     setStatus(`Calling ${contactName}…`);
//     setTimeout(() => speak("Hey! I’m here. What’s on your mind?", () => listen()), 600);
//   }

//   function endCall() {
//     try { recRef.current?.stop?.(); } catch {}
//     speechSynthesis.cancel();
//     setPhase("idle");
//     setStatus("Ready to call");
//     onClose?.();
//   }

//   useEffect(() => {
//     if (autoStart) startCall();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [autoStart]);

//   return (
//     <div className="w-[360px] max-w-[92vw] aspect-[9/16] rounded-[28px] shadow-2xl bg-gradient-to-b from-[#5b3cc5] to-[#2d1a77] border border-white/10 p-6 relative overflow-hidden text-white">
//       {/* Top bar */}
//       {showTopBar && (
//         <div className="flex items-center justify-between opacity-80 text-sm">
//           <button onClick={endCall} aria-label="Close">◀︎</button>
//           <div>🔊</div>
//           <div>⛶</div>
//         </div>
//       )}

//       {/* Avatar */}
//       <div className="mt-6 grid place-items-center">
//         <CuteAvatar blink={blink} mouth={mouth} />
//       </div>

//       {/* Status */}
//       <div className="mt-4 text-center text-lg">{status}</div>

//       {/* Bottom call button (hidden on overlay usage) */}
//       {!hideCallButton && (
//         <div className="absolute bottom-6 inset-x-0 flex items-center justify-center">
//           {phase === "idle" ? (
//             <button
//               className="px-6 py-3 rounded-full bg-emerald-400 text-black font-semibold shadow hover:bg-emerald-300"
//               onClick={startCall}
//             >
//               Call {contactName}
//             </button>
//           ) : (
//             <button
//               className="w-16 h-16 rounded-full bg-red-500 grid place-items-center text-2xl shadow hover:bg-red-400"
//               onClick={endCall}
//               aria-label="End call"
//             >
//               ⛔
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// function getFriendlyReply(userText: string) {
//   const t = userText.toLowerCase();
//   if (/sad|down|not good|upset|cry/.test(t)) return "I’m here with you. Want to try a tiny 2-minute reset and talk it through?";
//   if (/stress|anxious|worry|panic/.test(t)) return "That sounds heavy. Let’s take one slow breath together, then tell me more.";
//   if (/happy|great|good/.test(t)) return "Yay! I’m smiling with you. What made it good?";
//   return "Got it. Tell me more—what’s on your mind right now?";
// }
