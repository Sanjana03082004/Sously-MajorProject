"use client"

import React from "react"
import SpeechRecognition, {
  useSpeechRecognition as useBaseRecognition,
} from "react-speech-recognition"

export default function SpeechTest() {
  const { transcript, listening, browserSupportsSpeechRecognition, resetTranscript } =
    useBaseRecognition()

  if (!browserSupportsSpeechRecognition) {
    return <p>❌ Your browser does not support speech recognition.</p>
  }

  const start = () => {
    resetTranscript()
    SpeechRecognition.startListening({
      continuous: true,
      interimResults: true,
      language: "en-IN",
    })
  }

  const stop = () => {
    SpeechRecognition.stopListening()
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🎙️ Speech Recognition Test</h1>
      <p>Status: {listening ? "Listening..." : "Idle"}</p>

      <button
        onMouseDown={start}
        onMouseUp={stop}
        onTouchStart={start}
        onTouchEnd={stop}
        style={{
          background: listening ? "#f87171" : "#60a5fa",
          color: "white",
          padding: "1rem 2rem",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          marginTop: "1rem",
        }}
      >
        {listening ? "Listening..." : "Hold to Speak"}
      </button>

      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "#f1f5f9",
          borderRadius: "6px",
        }}
      >
        <strong>Transcript:</strong>
        <p>{transcript || "Say something..."}</p>
      </div>
    </div>
  )
}
