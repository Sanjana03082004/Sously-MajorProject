// // "use client"

// // import { useState, useEffect, useRef, useCallback } from "react"

// // interface SpeechRecognitionResult {
// //   transcript: string
// //   confidence: number
// //   isFinal: boolean
// // }

// // interface UseSpeechRecognitionReturn {
// //   transcript: string
// //   isListening: boolean
// //   isSupported: boolean
// //   startListening: () => void
// //   stopListening: () => void
// //   resetTranscript: () => void
// //   error: string | null
// // }

// // export function useSpeechRecognition(): UseSpeechRecognitionReturn {
// //   const [transcript, setTranscript] = useState("")
// //   const [isListening, setIsListening] = useState(false)
// //   const [error, setError] = useState<string | null>(null)
// //   const recognitionRef = useRef<any>(null)

// //   const isSupported =
// //     typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)

// //   const startListening = useCallback(() => {
// //     if (!isSupported) {
// //       setError("Speech recognition not supported")
// //       return
// //     }

// //     const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
// //     recognitionRef.current = new SpeechRecognition()

// //     recognitionRef.current.continuous = true
// //     recognitionRef.current.interimResults = true
// //     recognitionRef.current.lang = "en-US"

// //     recognitionRef.current.onstart = () => {
// //       setIsListening(true)
// //       setError(null)
// //     }

// //     recognitionRef.current.onresult = (event: any) => {
// //       let finalTranscript = ""
// //       let interimTranscript = ""

// //       for (let i = event.resultIndex; i < event.results.length; i++) {
// //         const transcriptPart = event.results[i][0].transcript
// //         if (event.results[i].isFinal) {
// //           finalTranscript += transcriptPart
// //         } else {
// //           interimTranscript += transcriptPart
// //         }
// //       }

// //       setTranscript(finalTranscript + interimTranscript)
// //     }

// //     recognitionRef.current.onerror = (event: any) => {
// //       setError(`Speech recognition error: ${event.error}`)
// //       setIsListening(false)
// //     }

// //     recognitionRef.current.onend = () => {
// //       setIsListening(false)
// //     }

// //     recognitionRef.current.start()
// //   }, [isSupported])

// //   const stopListening = useCallback(() => {
// //     if (recognitionRef.current) {
// //       recognitionRef.current.stop()
// //     }
// //   }, [])

// //   const resetTranscript = useCallback(() => {
// //     setTranscript("")
// //   }, [])

// //   useEffect(() => {
// //     return () => {
// //       if (recognitionRef.current) {
// //         recognitionRef.current.stop()
// //       }
// //     }
// //   }, [])

// //   return {
// //     transcript,
// //     isListening,
// //     isSupported,
// //     startListening,
// //     stopListening,
// //     resetTranscript,
// //     error,
// //   }
// // }
// "use client"

// import { useState, useEffect, useRef, useCallback } from "react"

// interface UseSpeechRecognitionReturn {
//   transcript: string
//   isListening: boolean
//   isSupported: boolean
//   startListening: () => void
//   stopListening: () => void
//   resetTranscript: () => void
//   error: string | null
// }

// export function useSpeechRecognition(): UseSpeechRecognitionReturn {
//   const [transcript, setTranscript] = useState("")
//   const [isListening, setIsListening] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const recognitionRef = useRef<any>(null)

//   const isSupported =
//     typeof window !== "undefined" &&
//     ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)

//   const startListening = useCallback(() => {
//     if (!isSupported) {
//       setError("Speech recognition not supported on this browser.")
//       return
//     }

//     const SpeechRecognition =
//       (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
//     const recognition = new SpeechRecognition()
//     recognitionRef.current = recognition

//     recognition.continuous = true
//     recognition.interimResults = false
//     recognition.lang = "en-US"

//     recognition.onstart = () => {
//       setIsListening(true)
//       setError(null)
//     }

//     recognition.onresult = (event: any) => {
//       let text = ""
//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         text += event.results[i][0].transcript
//       }
//       setTranscript(text.trim())
//     }

//     recognition.onerror = (event: any) => {
//       setError(`Speech recognition error: ${event.error}`)
//       setIsListening(false)
//     }

//     recognition.onend = () => {
//       setIsListening(false)
//     }

//     recognition.start()
//   }, [isSupported])

//   const stopListening = useCallback(() => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop()
//       recognitionRef.current = null
//     }
//     setIsListening(false)
//   }, [])

//   const resetTranscript = useCallback(() => setTranscript(""), [])

//   useEffect(() => {
//     return () => {
//       if (recognitionRef.current) recognitionRef.current.stop()
//     }
//   }, [])

//   return {
//     transcript,
//     isListening,
//     isSupported,
//     startListening,
//     stopListening,
//     resetTranscript,
//     error,
//   }
// }
"use client"

import SpeechRecognition, {
  useSpeechRecognition as useBaseRecognition,
} from "react-speech-recognition"

interface UseSpeechRecognitionReturn {
  transcript: string
  isListening: boolean
  isSupported: boolean
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
  error: string | null
}

/**
 * ✅ Stable wrapper around react-speech-recognition
 * Prevents recursive import loops
 */
export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useBaseRecognition()

  return {
    transcript,
    isListening: listening,
    isSupported: browserSupportsSpeechRecognition,
    startListening: () =>
      SpeechRecognition.startListening({
        continuous: true,
        interimResults: true,
        language: "en-IN",
      }),
    stopListening: SpeechRecognition.stopListening,
    resetTranscript,
    error: browserSupportsSpeechRecognition ? null : "Speech recognition not supported",
  }
}
