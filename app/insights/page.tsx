// // "use client"

// // import { useEffect, useState } from "react"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Badge } from "@/components/ui/badge"
// // import { Progress } from "@/components/ui/progress"
// // import { ArrowLeft, TrendingUp, Heart, Brain, Smile, AlertCircle, Mic, MicOff } from "lucide-react"
// // import Link from "next/link"
// // import { useMoodAnalysis } from "@/hooks/useMoodAnalysis"
// // import { useVoiceRecorder } from "@/hooks/useVoiceRecorder"

// // export default function InsightsPage() {
// //   const { currentMood, moodHistory, loadMoodData } = useMoodAnalysis()
// //   const { isRecording, startRecording, stopRecording, audioUrl } = useVoiceRecorder()
// //   const [voiceMonitoringEnabled, setVoiceMonitoringEnabled] = useState(false)

// //   useEffect(() => {
// //     loadMoodData()

// //     // Check if voice monitoring is enabled
// //     const monitoring = localStorage.getItem("mindmate_voice_monitoring")
// //     setVoiceMonitoringEnabled(monitoring === "true")
// //   }, [loadMoodData])

// //   const toggleVoiceMonitoring = async () => {
// //     if (!voiceMonitoringEnabled) {
// //       try {
// //         await startRecording()
// //         setVoiceMonitoringEnabled(true)
// //         localStorage.setItem("mindmate_voice_monitoring", "true")
// //       } catch (error) {
// //         console.error("Failed to start voice monitoring:", error)
// //       }
// //     } else {
// //       stopRecording()
// //       setVoiceMonitoringEnabled(false)
// //       localStorage.setItem("mindmate_voice_monitoring", "false")
// //     }
// //   }

// //   // Generate mock mood data if none exists
// //   const moodData =
// //     moodHistory.length > 0
// //       ? moodHistory
// //       : [
// //           { day: "Mon", score: 7.2, energy: "high" },
// //           { day: "Tue", score: 6.8, energy: "medium" },
// //           { day: "Wed", score: 8.1, energy: "high" },
// //           { day: "Thu", score: 5.9, energy: "low" },
// //           { day: "Fri", score: 7.5, energy: "high" },
// //           { day: "Sat", score: 8.3, energy: "high" },
// //           { day: "Sun", score: currentMood?.score || 7.0, energy: currentMood?.energy || "medium" },
// //         ]

// //   const insights = [
// //     {
// //       type: "positive",
// //       title: "Great Progress!",
// //       description: `Your mood has improved ${moodData.length > 1 ? "15%" : "10%"} this week compared to last week.`,
// //       icon: TrendingUp,
// //       color: "text-green-600",
// //     },
// //     {
// //       type: "neutral",
// //       title: "Sleep Pattern",
// //       description: "Consider going to bed 30 minutes earlier for better energy levels.",
// //       icon: Heart,
// //       color: "text-blue-600",
// //     },
// //     {
// //       type: "attention",
// //       title: currentMood?.score && currentMood.score < 6 ? "Stress Indicator" : "Energy Levels",
// //       description:
// //         currentMood?.score && currentMood.score < 6
// //           ? "Your recent conversations suggest some stress. Would you like to talk about it?"
// //           : "Your energy levels have been consistent. Keep up the good work!",
// //       icon: AlertCircle,
// //       color: currentMood?.score && currentMood.score < 6 ? "text-orange-600" : "text-green-600",
// //     },
// //   ]

// //   const currentMoodScore = currentMood?.score || 7.2
// //   const avgHeartRate = 72 + (currentMood?.energy === "high" ? 8 : currentMood?.energy === "low" ? -8 : 0)
// //   const focusScore = Math.min(95, Math.max(60, currentMoodScore * 10 + 15))
// //   const weeklyTrend =
// //     moodData.length > 1 ? ((moodData[moodData.length - 1].score - moodData[0].score) / moodData[0].score) * 100 : 15

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
// //       {/* Header */}
// //       <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
// //         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
// //           <div className="flex items-center space-x-4">
// //             <Link href="/">
// //               <Button variant="ghost" size="icon">
// //                 <ArrowLeft className="h-5 w-5" />
// //               </Button>
// //             </Link>
// //             <div className="flex items-center space-x-2">
// //               <Brain className="h-6 w-6 text-purple-600" />
// //               <h1 className="text-xl font-bold text-gray-800">Wellness Insights</h1>
// //             </div>
// //           </div>
// //           <Badge variant="secondary" className="bg-purple-100 text-purple-700">
// //             AI Analysis
// //           </Badge>
// //         </div>
// //       </header>

// //       <main className="container mx-auto px-4 py-8">
// //         {/* Current Status */}
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
// //           <Card>
// //             <CardContent className="p-6 text-center">
// //               <Smile className="h-8 w-8 text-green-500 mx-auto mb-2" />
// //               <div className="text-2xl font-bold text-green-600 mb-1">{currentMoodScore}</div>
// //               <div className="text-sm text-gray-600">Current Mood</div>
// //             </CardContent>
// //           </Card>

// //           <Card>
// //             <CardContent className="p-6 text-center">
// //               <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
// //               <div className="text-2xl font-bold text-red-600 mb-1">{avgHeartRate}</div>
// //               <div className="text-sm text-gray-600">Avg Heart Rate</div>
// //             </CardContent>
// //           </Card>

// //           <Card>
// //             <CardContent className="p-6 text-center">
// //               <Brain className="h-8 w-8 text-blue-500 mx-auto mb-2" />
// //               <div className="text-2xl font-bold text-blue-600 mb-1">{Math.round(focusScore)}%</div>
// //               <div className="text-sm text-gray-600">Focus Score</div>
// //             </CardContent>
// //           </Card>

// //           <Card>
// //             <CardContent className="p-6 text-center">
// //               <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
// //               <div className="text-2xl font-bold text-purple-600 mb-1">
// //                 {weeklyTrend > 0 ? "+" : ""}
// //                 {Math.round(weeklyTrend)}%
// //               </div>
// //               <div className="text-sm text-gray-600">Weekly Trend</div>
// //             </CardContent>
// //           </Card>
// //         </div>

// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// //           {/* Mood Chart */}
// //           <div className="lg:col-span-2">
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle>Weekly Mood Tracking</CardTitle>
// //                 <CardDescription>Based on voice analysis and self-reported data</CardDescription>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-4">
// //                   {moodData.map((day, index) => (
// //                     <div key={index} className="flex items-center space-x-4">
// //                       <div className="w-12 text-sm font-medium text-gray-600">
// //                         {typeof day === "object" && "day" in day ? day.day : `Day ${index + 1}`}
// //                       </div>
// //                       <div className="flex-1">
// //                         <div className="flex items-center justify-between mb-1">
// //                           <span className="text-sm text-gray-600">Mood Score</span>
// //                           <span className="text-sm font-medium">
// //                             {typeof day === "object" && "score" in day ? day.score : day}/10
// //                           </span>
// //                         </div>
// //                         <Progress
// //                           value={(typeof day === "object" && "score" in day ? day.score : day) * 10}
// //                           className="h-2"
// //                         />
// //                       </div>
// //                       <Badge
// //                         variant="secondary"
// //                         className={`${
// //                           (typeof day === "object" && "energy" in day ? day.energy : "medium") === "high"
// //                             ? "bg-green-100 text-green-700"
// //                             : (typeof day === "object" && "energy" in day ? day.energy : "medium") === "medium"
// //                               ? "bg-yellow-100 text-yellow-700"
// //                               : "bg-red-100 text-red-700"
// //                         }`}
// //                       >
// //                         {typeof day === "object" && "energy" in day ? day.energy : "medium"}
// //                       </Badge>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>

// //           {/* Insights Panel */}
// //           <div className="space-y-6">
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle className="text-lg">AI Insights</CardTitle>
// //                 <CardDescription>Personalized observations from your data</CardDescription>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-4">
// //                   {insights.map((insight, index) => (
// //                     <div key={index} className="flex space-x-3 p-3 rounded-lg bg-gray-50">
// //                       <insight.icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
// //                       <div className="flex-1">
// //                         <div className="font-medium text-sm text-gray-800 mb-1">{insight.title}</div>
// //                         <div className="text-xs text-gray-600">{insight.description}</div>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             {/* Voice Monitoring Status */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle className="text-lg flex items-center justify-between">
// //                   Voice Monitoring
// //                   <Button
// //                     variant="outline"
// //                     size="sm"
// //                     onClick={toggleVoiceMonitoring}
// //                     className={voiceMonitoringEnabled ? "bg-green-50 border-green-200" : ""}
// //                   >
// //                     {voiceMonitoringEnabled ? (
// //                       <>
// //                         <Mic className="h-4 w-4 mr-2 text-green-600" />
// //                         Active
// //                       </>
// //                     ) : (
// //                       <>
// //                         <MicOff className="h-4 w-4 mr-2" />
// //                         Start
// //                       </>
// //                     )}
// //                   </Button>
// //                 </CardTitle>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-4">
// //                   <div className="flex items-center justify-between">
// //                     <span className="text-sm text-gray-600">Status</span>
// //                     <Badge
// //                       className={voiceMonitoringEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}
// //                     >
// //                       {voiceMonitoringEnabled ? "Recording" : "Inactive"}
// //                     </Badge>
// //                   </div>
// //                   <div className="flex items-center justify-between">
// //                     <span className="text-sm text-gray-600">Today's Analysis</span>
// //                     <span className="text-sm font-medium">{voiceMonitoringEnabled ? "4.2 hours" : "0 hours"}</span>
// //                   </div>
// //                   <div className="flex items-center justify-between">
// //                     <span className="text-sm text-gray-600">Mood Patterns</span>
// //                     <span className="text-sm font-medium">{currentMood?.emotions?.length || 0} detected</span>
// //                   </div>

// //                   {audioUrl && (
// //                     <div className="mt-4">
// //                       <audio controls className="w-full">
// //                         <source src={audioUrl} type="audio/wav" />
// //                         Your browser does not support audio playback.
// //                       </audio>
// //                     </div>
// //                   )}
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             {/* Recommendations */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle className="text-lg">Recommendations</CardTitle>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-3 text-sm">
// //                   <div className="p-2 bg-blue-50 rounded-lg">
// //                     <strong>💧 Hydration:</strong> Drink more water around 2 PM
// //                   </div>
// //                   <div className="p-2 bg-green-50 rounded-lg">
// //                     <strong>🚶 Movement:</strong> Take a 5-minute walk every hour
// //                   </div>
// //                   <div className="p-2 bg-purple-50 rounded-lg">
// //                     <strong>🧘 Mindfulness:</strong> Try 3 deep breaths when stressed
// //                   </div>
// //                   {currentMood?.score && currentMood.score < 6 && (
// //                     <div className="p-2 bg-orange-50 rounded-lg">
// //                       <strong>💙 Support:</strong> Consider talking to someone you trust
// //                     </div>
// //                   )}
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   )
// // }
// "use client"
// import { MoodCalendar } from "@/components/MoodCalendar"
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

// import { useState, useEffect } from "react"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { speak } from "@/lib/speech"
// import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Loader2, Mic, Sparkles } from "lucide-react"

// interface MoodEntry {
//   _id?: string
//   mood: string
//   reason: string
//   journalText?: string
//   createdAt: string
// }

// export default function InsightsPage() {
//   const [moods, setMoods] = useState<MoodEntry[]>([])
//   const [journal, setJournal] = useState("")
//   const [selectedMood, setSelectedMood] = useState<string | null>(null)
//   const [reason, setReason] = useState("")
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [checkedIn, setCheckedIn] = useState(false)
//   const [loading, setLoading] = useState(true)

//   const { transcript, isListening, startListening, stopListening, resetTranscript } = useSpeechRecognition()

//   // 🧠 Fetch summary + check if already checked in today
//   useEffect(() => {
//     async function loadMoods() {
//       const res = await fetch("/api/moods")
//       const data = await res.json()
//       setMoods(data)
//       setLoading(false)

//       const today = new Date().toDateString()
//       const hasCheckedIn = data.some((m: MoodEntry) => new Date(m.createdAt).toDateString() === today)
//       setCheckedIn(hasCheckedIn)
//     }
//     loadMoods()
//   }, [])

//   // 🎙️ Listen for voice input
//   useEffect(() => {
//     if (!transcript) return
//     setReason(transcript)
//   }, [transcript])

//   // ✅ Submit check-in or journal
//   const submitMood = async (isJournal = false) => {
//     if (isJournal && !journal.trim()) return
//     if (!isJournal && !selectedMood) return

//     setIsSubmitting(true)
//     const body = isJournal
//       ? { mood: "journal", reason: "reflection", journal }
//       : { mood: selectedMood, reason }

//     const res = await fetch("/api/moods", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     })
//     const saved = await res.json()
//     setMoods((prev) => [saved, ...prev])
//     setIsSubmitting(false)

//     if (isJournal) {
//       speak("Journal saved successfully.")
//       setJournal("")
//     } else {
//       speak(`Got it. You are feeling ${selectedMood} because of ${reason}.`)
//       setCheckedIn(true)
//     }
//   }

//   // 💬 Ask daily mood on first app open (only once per day)
//   useEffect(() => {
//     if (!checkedIn && !loading) {
//       speak("Hi Sanjana, how are you feeling right now?")
//     }
//   }, [checkedIn, loading])

//   const moodsList = [
//     "happy", "sad", "angry", "anxious", "tired", "grateful", "hurt", "confused", "peaceful",
//   ]
//   return (
//   <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-6">
//     <div className="max-w-5xl mx-auto space-y-8">

//       {/* 🧠 Mood Calendar Section */}
//       <MoodCalendar moods={moods} />

//       {/* 📊 Mood Insights Chart */}
//       <Card className="border-pink-200 shadow-md p-4 bg-white/80">
//         <h2 className="text-lg font-semibold text-pink-600 mb-4 text-center">
//           💫 Mood Insights
//         </h2>

//         {moods.length === 0 ? (
//           <p className="text-center text-gray-500">No mood data yet.</p>
//         ) : (
//           <div className="flex flex-col lg:flex-row justify-around items-center gap-6">
//             {/* Pie Chart */}
//             <ResponsiveContainer width={300} height={250}>
//               <PieChart>
//                 <Pie
//                   data={Object.entries(
//                     moods.reduce((acc, m) => {
//                       acc[m.mood] = (acc[m.mood] || 0) + 1
//                       return acc
//                     }, {} as Record<string, number>)
//                   ).map(([name, value]) => ({ name, value }))}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   label
//                 >
//                   {["#f9a8d4", "#fda4af", "#c084fc", "#93c5fd", "#86efac", "#fcd34d"].map((color, i) => (
//                     <Cell key={i} fill={color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>

//             {/* Top 3 negative reasons */}
//             <div className="bg-pink-50 border border-pink-100 rounded-lg p-4 w-full lg:w-1/2">
//               <h3 className="text-pink-700 font-semibold mb-2">💭 Frequent Negative Feelings</h3>
//               {Object.entries(
//                 moods
//                   .filter((m) =>
//                     ["sad", "angry", "anxious", "hurt", "confused"].includes(m.mood)
//                   )
//                   .reduce((acc, m) => {
//                     acc[m.reason || "unspecified"] = (acc[m.reason || "unspecified"] || 0) + 1
//                     return acc
//                   }, {} as Record<string, number>)
//               )
//                 .sort((a, b) => b[1] - a[1])
//                 .slice(0, 3)
//                 .map(([reason, count]) => (
//                   <p key={reason} className="text-gray-700">
//                     {reason} — <span className="text-pink-600 font-semibold">{count}</span>x
//                   </p>
//                 ))}
//               <p className="text-xs text-gray-400 mt-2">
//                 Based on recent entries 💗
//               </p>
//             </div>
//           </div>
//         )}
//       </Card>

//     <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-6">
//       <div className="max-w-3xl mx-auto space-y-8">
//         {/* Mood Check-in */}
//         <Card className="shadow-md border-pink-200">
//           <CardHeader>
//             <CardTitle className="text-lg flex items-center gap-2">
//               <Sparkles className="h-5 w-5 text-pink-500" />
//               Daily Mood Check-in
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {checkedIn ? (
//               <Alert className="bg-green-50 border-green-200 text-green-800">
//                 <AlertDescription>
//                   ✅ You’ve already checked in today. Come back tomorrow!
//                 </AlertDescription>
//               </Alert>
//             ) : (
//               <>
//                 <p className="text-gray-700">How are you feeling right now?</p>
//                 <div className="flex flex-wrap gap-2">
//                   {moodsList.map((m) => (
//                     <Badge
//                       key={m}
//                       onClick={() => setSelectedMood(m)}
//                       className={`cursor-pointer px-3 py-1 text-sm ${
//                         selectedMood === m
//                           ? "bg-pink-500 text-white"
//                           : "bg-white border border-pink-200 text-pink-600 hover:bg-pink-100"
//                       }`}
//                     >
//                       {m}
//                     </Badge>
//                   ))}
//                 </div>

//                 {selectedMood && (
//                   <div className="mt-4 space-y-2">
//                     <p className="text-gray-700">What made you feel {selectedMood}?</p>
//                     <Textarea
//                       placeholder="Type or speak your reason..."
//                       value={reason}
//                       onChange={(e) => setReason(e.target.value)}
//                     />
//                     <div className="flex items-center gap-2">
//                       <Button
//                         variant="outline"
//                         onMouseDown={() => {
//                           resetTranscript()
//                           startListening()
//                         }}
//                         onMouseUp={stopListening}
//                         className={`${isListening ? "border-pink-400 animate-pulse" : ""}`}
//                       >
//                         <Mic className="h-4 w-4 mr-2" /> {isListening ? "Listening..." : "Hold to Speak"}
//                       </Button>
//                       <Button
//                         className="bg-pink-500 hover:bg-pink-600 text-white"
//                         disabled={isSubmitting}
//                         onClick={() => submitMood(false)}
//                       >
//                         {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Check-in"}
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </CardContent>
//         </Card>

//         {/* Journal Writing */}
//         <Card className="shadow-md border-pink-200">
//           <CardHeader>
//             <CardTitle className="text-lg">Daily Journal</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <Textarea
//               placeholder="Write about your day..."
//               value={journal}
//               onChange={(e) => setJournal(e.target.value)}
//               rows={5}
//             />
//             <Button
//               className="bg-pink-500 hover:bg-pink-600 text-white"
//               disabled={isSubmitting}
//               onClick={() => submitMood(true)}
//             >
//               {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Journal"}
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Summary of past moods */}
//         <Card className="shadow-md border-pink-200">
//           <CardHeader>
//             <CardTitle className="text-lg">Recent Mood History</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {loading ? (
//               <p className="text-gray-500">Loading...</p>
//             ) : moods.length === 0 ? (
//               <p className="text-gray-500">No entries yet.</p>
//             ) : (
//               moods.slice(0, 5).map((m) => (
//                 <div
//                   key={m._id}
//                   className="border border-pink-100 rounded-md p-2 text-gray-700 bg-white"
//                 >
//                   <strong className="capitalize">{m.mood}</strong> — {m.reason}
//                   <div className="text-xs text-gray-400">
//                     {new Date(m.createdAt).toLocaleString()}
//                   </div>
//                 </div>
//               ))
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
"use client"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { MoodCalendar } from "@/components/MoodCalendar"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mic, Sparkles } from "lucide-react"
import { speak } from "@/lib/speech"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
import { TopReasonsChart } from "@/components/TopReasonsChart"
import { generateMoodSummary } from "@/lib/aiSummary"

interface MoodEntry {
  _id?: string
  mood: string
  reason: string
  journalText?: string
  createdAt: string
}

export default function InsightsPage() {
  const [moods, setMoods] = useState<MoodEntry[]>([])
  const [journal, setJournal] = useState("")
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkedIn, setCheckedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const { transcript, isListening, startListening, stopListening, resetTranscript } =
    useSpeechRecognition()

  // 🧠 Fetch moods + check if user checked in today
  useEffect(() => {
    async function loadMoods() {
      const res = await fetch("/api/moods")
      const data = await res.json()
      setMoods(data)
      setLoading(false)

      const today = new Date().toDateString()
      const hasCheckedIn = data.some(
        (m: MoodEntry) => new Date(m.createdAt).toDateString() === today
      )
      setCheckedIn(false)
    }
    loadMoods()
  }, [])

  // 🎙️ Voice transcription to reason
  useEffect(() => {
    if (transcript) setReason(transcript)
  }, [transcript])

  // ✅ Submit check-in or journal
  const submitMood = async (isJournal = false) => {
    if (isJournal && !journal.trim()) return
    if (!isJournal && !selectedMood) return

    setIsSubmitting(true)
    const body = isJournal
      ? { mood: "journal", reason: "reflection", journal }
      : { mood: selectedMood, reason }

    const res = await fetch("/api/moods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const saved = await res.json()
    setMoods((prev) => [saved, ...prev])
    setIsSubmitting(false)

    if (isJournal) {
      speak("Journal saved successfully.")
      setJournal("")
    } else {
      speak(`Got it. You are feeling ${selectedMood} because of ${reason}.`)
      setCheckedIn(true)
    }
  }

  // 💬 Ask daily check-in on first open
  useEffect(() => {
    if (!checkedIn && !loading) {
      speak("Hi Sanjana, how are you feeling right now?")
    }
  }, [checkedIn, loading])

  const moodsList = [
    "happy",
    "sad",
    "angry",
    "anxious",
    "tired",
    "grateful",
    "hurt",
    "confused",
    "peaceful",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-6">
    {/* 🔙 Top bar with back button */}
    <div className="flex items-center mb-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-pink-600 hover:text-pink-800 font-medium"
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </button>
    </div>
         <div className="max-w-5xl mx-auto space-y-10">
        {/* 🌸 Mood Calendar */}
        <MoodCalendar moods={moods} />

        {/* 💫 Mood Insights Chart */}
        <Card className="border-pink-200 shadow-md p-4 bg-white/80">
          <h2 className="text-lg font-semibold text-pink-600 mb-4 text-center">
            💫 Mood Insights
          </h2>
          

          {moods.length === 0 ? (
            <p className="text-center text-gray-500">No mood data yet.</p>
          ) : (
            <div className="flex flex-col lg:flex-row justify-around items-center gap-6">
              {/* Pie Chart */}
              <ResponsiveContainer width={300} height={250}>
                <PieChart>
                  <Pie
                    data={Object.entries(
                      moods.reduce((acc, m) => {
                        acc[m.mood] = (acc[m.mood] || 0) + 1
                        return acc
                      }, {} as Record<string, number>)
                    ).map(([name, value]) => ({ name, value }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {[
                      "#f9a8d4",
                      "#fda4af",
                      "#c084fc",
                      "#93c5fd",
                      "#86efac",
                      "#fcd34d",
                    ].map((color, i) => (
                      <Cell key={i} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              {/* Top 3 negative reasons */}
              <div className="bg-pink-50 border border-pink-100 rounded-lg p-4 w-full lg:w-1/2">
                <h3 className="text-pink-700 font-semibold mb-2">
                  💭 Frequent Negative Feelings
                </h3>
                {Object.entries(
                  moods
                    .filter((m) =>
                      ["sad", "angry", "anxious", "hurt", "confused"].includes(m.mood)
                    )
                    .reduce((acc, m) => {
                      acc[m.reason || "unspecified"] =
                        (acc[m.reason || "unspecified"] || 0) + 1
                      return acc
                    }, {} as Record<string, number>)
                )
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([reason, count]) => (
                    <p key={reason} className="text-gray-700">
                      {reason} —{" "}
                      <span className="text-pink-600 font-semibold">{count}</span>x
                    </p>
                  ))}
                <p className="text-xs text-gray-400 mt-2">
                  Based on recent entries 💗
                </p>
              </div>
            </div>
          )}
        </Card>
        {/* 💭 Top Reasons & AI Summary Section */}
<div className="space-y-6 mt-6">
  {/* Bar chart of most frequent reasons */}
  <TopReasonsChart moods={moods} />

  {/* AI summary button and text */}
  <Card className="border-pink-200 bg-white/90 shadow-sm p-6 text-center">
    <h2 className="text-lg font-semibold text-pink-700 mb-3">✨ Weekly Emotional Summary</h2>
    <p className="text-gray-600 mb-4">
      Generate a short reflection based on your recent moods and journal entries.
    </p>
    <Button
      className="bg-pink-500 hover:bg-pink-600 text-white"
      onClick={async () => {
        const summary = await generateMoodSummary(moods);
        alert(summary);
      }}
    >
      ✨ Generate Weekly AI Summary
    </Button>
  </Card>
</div>

        {/* 🌿 Daily Mood Check-in */}
        <Card className="shadow-md border-pink-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-pink-500" />
              Daily Mood Check-in
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {checkedIn ? (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <AlertDescription>
                  ✅ You’ve already checked in today. Come back tomorrow!
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <p className="text-gray-700">How are you feeling right now?</p>
                <div className="flex flex-wrap gap-2">
                  {moodsList.map((m) => (
                    <Badge
                      key={m}
                      onClick={() => setSelectedMood(m)}
                      className={`cursor-pointer px-3 py-1 text-sm ${
                        selectedMood === m
                          ? "bg-pink-500 text-white"
                          : "bg-white border border-pink-200 text-pink-600 hover:bg-pink-100"
                      }`}
                    >
                      {m}
                    </Badge>
                  ))}
                </div>

                {selectedMood && (
                  <div className="mt-4 space-y-2">
                    <p className="text-gray-700">
                      What made you feel {selectedMood}?
                    </p>
                    <Textarea
                      placeholder="Type or speak your reason..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onMouseDown={() => {
                          resetTranscript()
                          startListening()
                        }}
                        onMouseUp={stopListening}
                        className={`${isListening ? "border-pink-400 animate-pulse" : ""}`}
                      >
                        <Mic className="h-4 w-4 mr-2" />{" "}
                        {isListening ? "Listening..." : "Hold to Speak"}
                      </Button>
                      <Button
                        className="bg-pink-500 hover:bg-pink-600 text-white"
                        disabled={isSubmitting}
                        onClick={() => submitMood(false)}
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Save Check-in"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* ✍️ Daily Journal */}
        <Card className="shadow-md border-pink-200">
          <CardHeader>
            <CardTitle className="text-lg">Daily Journal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Write about your day..."
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              rows={5}
            />
            <Button
              className="bg-pink-500 hover:bg-pink-600 text-white"
              disabled={isSubmitting}
              onClick={() => submitMood(true)}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Journal"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* 📜 Recent Mood History */}
        <Card className="shadow-md border-pink-200">
          <CardHeader>
            <CardTitle className="text-lg">Recent Mood History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : moods.length === 0 ? (
              <p className="text-gray-500">No entries yet.</p>
            ) : (
              moods.slice(0, 5).map((m) => (
                <div
                  key={m._id}
                  className="border border-pink-100 rounded-md p-2 text-gray-700 bg-white"
                >
                  <strong className="capitalize">{m.mood}</strong> — {m.reason}
                  <div className="text-xs text-gray-400">
                    {new Date(m.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
