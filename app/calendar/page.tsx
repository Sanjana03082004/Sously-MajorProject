
// // // "use client"

// // // import { useState, useEffect } from "react"
// // // import { Button } from "@/components/ui/button"
// // // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// // // import { Input } from "@/components/ui/input"
// // // import { Badge } from "@/components/ui/badge"
// // // import { Alert, AlertDescription } from "@/components/ui/alert"
// // // import { Calendar, Clock, Mic, Plus, ArrowLeft, CheckCircle, Trash2 } from "lucide-react"
// // // import Link from "next/link"
// // // import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
// // // import { useVoiceCommands } from "@/hooks/useVoiceCommands"
// // // import * as chrono from "chrono-node"
// // // import { speak } from "@/lib/speech"


// // // interface Task {
// // //   _id?: string
// // //   id?: number
// // //   title: string
// // //   time: string
// // //   completed: boolean
// // //   priority: "high" | "medium" | "low"
// // //   createdAt: Date
// // // }

// // // export default function CalendarPage() {
// // //   const [tasks, setTasks] = useState<Task[]>([])
// // //   const [newTaskTitle, setNewTaskTitle] = useState("")
// // //   const [voiceCommand, setVoiceCommand] = useState("")

// // //   const { transcript, isListening, startListening, stopListening, resetTranscript, error } = useSpeechRecognition()
// // // const { processWithAI } = useVoiceCommands()


// // //   // 🧠 Load tasks from MongoDB
// // //   useEffect(() => {
// // //     fetch("/api/calendar")
// // //       .then((res) => res.json())
// // //       .then((data) => Array.isArray(data) && setTasks(data))
// // //       .catch((err) => console.error("Failed to load tasks:", err))
// // //   }, [])

// // //   // 🧠 Process transcript
// // // useEffect(() => {
// // //   if (!transcript) return;

// // //   (async () => {
// // //     const aiResponse = await processWithAI(transcript);
// // //     console.log("🤖 Raw AI Response:", aiResponse);

// // //     let toSpeak = "";
// // //     let title = "";
// // //     let timeString = "";
// // //     let parsedTime: Date | null = null;

// // //     try {
// // //       // Try extracting JSON from AI
// // //       const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
// // //       if (jsonMatch) {
// // //         const parsed = JSON.parse(jsonMatch[0]);
// // //         title = parsed.title || "task";
// // //         timeString = parsed.time || "";
// // //       }

// // //       // If AI didn’t give a valid ISO time → use chrono-node to parse it
// // //       if (timeString && !Date.parse(timeString)) {
// // //         parsedTime = chrono.parseDate(timeString);
// // //       } else if (timeString) {
// // //         parsedTime = new Date(timeString);
// // //       }

// // //       if (title && parsedTime) {
// // //         await addTask(title, parsedTime.toISOString());
// // //         const humanTime = parsedTime.toLocaleTimeString([], {
// // //           hour: "2-digit",
// // //           minute: "2-digit",
// // //         });
// // //         toSpeak = `Got it! I’ll remind you to ${title} at ${humanTime}.`;
// // //       } else if (title && !parsedTime) {
// // //         toSpeak = `Okay, when should I remind you to ${title}?`;
// // //       } else {
// // //         toSpeak = aiResponse.replace(/\{[\s\S]*\}/g, ""); // Clean out any JSON if found
// // //       }

// // //       setVoiceCommand(toSpeak);
// // //     } catch (err) {
// // //       console.warn("⚠️ Parsing failed:", err);
// // //       toSpeak = aiResponse.replace(/\{[\s\S]*\}/g, "");
// // //       setVoiceCommand(toSpeak);
// // //     }

// // //     // 🗣️ Speak the final response
// // //     speak(toSpeak);
// // //   })();
// // // }, [transcript]);




// // //   // 🎙️ Voice input start/stop
// // //   const handleVoiceInput = () => {
// // //     if (isListening) stopListening()
// // //     else {
// // //       resetTranscript()
// // //       startListening()
// // //       setTimeout(() => stopListening(), 8000)
// // //     }
// // //   }

// // //   // 📅 Add task → API + state
// // //   const addTask = async (title: string, time = "No time set", priority: "high" | "medium" | "low" = "medium") => {
// // //     try {
// // //       const res = await fetch("/api/calendar", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ title, time, priority }),
// // //       })
// // //       const saved = await res.json()
// // //       setTasks((prev) => [...prev, saved])
// // //     } catch (err) {
// // //       console.error("Error saving task:", err)
// // //     }
// // //   }

// // //   // ✅ Handle recognized command
// // //   const handleVoiceCommand = async (command: any) => {
// // //     if (!command) return
// // //     let { task, time } = command.data

// // //     // If no time, ask interactively
// // //     if (!time) {
// // //       const response = prompt(`When should I set the reminder for "${task}"?`)
// // //       if (response) {
// // //         const parsed = chrono.parseDate(response)
// // //         if (parsed) time = parsed.toISOString()
// // //       }
// // //     }

// // //     if (time) {
// // //       await addTask(task, time)
// // //       alert(`✅ Reminder set for "${task}" at ${new Date(time).toLocaleString()}`)
// // //     } else {
// // //       alert("❌ Couldn't detect time. Try again.")
// // //     }
// // //   }

// // //   // 🖱️ Manual task add
// // //   const handleAddTask = () => {
// // //     if (newTaskTitle.trim()) {
// // //       const selectedTime = (window as any).selectedTime || "No time set"
// // //       addTask(newTaskTitle.trim(), selectedTime)
// // //       setNewTaskTitle("")
// // //     }
// // //   }

// // //   // ✅ Toggle & delete
// // //   const toggleTask = (id: string | number) =>
// // //     setTasks((prev) => prev.map((t) => (t._id === id || t.id === id ? { ...t, completed: !t.completed } : t)))
// // //   const deleteTask = (id: string | number) =>
// // //     setTasks((prev) => prev.filter((t) => t._id !== id && t.id !== id))

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
// // //       {/* Header */}
// // //       <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
// // //         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
// // //           <div className="flex items-center space-x-4">
// // //             <Link href="/">
// // //               <Button variant="ghost" size="icon">
// // //                 <ArrowLeft className="h-5 w-5" />
// // //               </Button>
// // //             </Link>
// // //             <div className="flex items-center space-x-2">
// // //               <Calendar className="h-6 w-6 text-blue-600" />
// // //               <h1 className="text-xl font-bold text-gray-800">Schedule & Tasks</h1>
// // //             </div>
// // //           </div>
// // //           <Badge variant="secondary" className="bg-blue-100 text-blue-700">
// // //             {isListening ? "Listening..." : "Voice Ready"}
// // //           </Badge>
// // //         </div>
// // //       </header>

// // //       <main className="container mx-auto px-4 py-8">
// // //         {error && (
// // //           <Alert className="mb-6 border-red-200 bg-red-50">
// // //             <AlertDescription>{error}</AlertDescription>
// // //           </Alert>
// // //         )}

// // //         {voiceCommand && (
// // //           <Alert className="mb-6 border-green-200 bg-green-50">
// // //             <AlertDescription className="text-green-800">{voiceCommand}</AlertDescription>
// // //           </Alert>
// // //         )}

// // //         {/* Voice Input */}
// // //         <Card className="mb-8 border-2 border-dashed border-blue-200">
// // //           <CardContent className="p-6">
// // //             <div className="flex items-center justify-between mb-4">
// // //               <div>
// // //                 <h3 className="text-lg font-semibold text-gray-800">Voice Commands</h3>
// // //                 <p className="text-gray-600 text-sm">
// // //                   Try saying “Schedule meeting tomorrow at 2 PM” or “Remind me to sleep at 10 PM”
// // //                 </p>
// // //               </div>
// // //               <Button
// // //                 onClick={handleVoiceInput}
// // //                 className={`${
// // //                   isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-blue-500 hover:bg-blue-600"
// // //                 }`}
// // //               >
// // //                 <Mic className="h-4 w-4 mr-2" />
// // //                 {isListening ? "Listening..." : "Speak"}
// // //               </Button>
// // //             </div>

// // //             {transcript && (
// // //               <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
// // //                 <p className="text-blue-800 text-sm">
// // //                   <strong>You said:</strong> “{transcript}”
// // //                 </p>
// // //               </div>
// // //             )}
// // //           </CardContent>
// // //         </Card>

// // //         {/* Layout grid */}
// // //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// // //           {/* Tasks list */}
// // //           <div className="lg:col-span-2">
// // //             <Card>
// // //               <CardHeader>
// // //                 <CardTitle className="flex items-center justify-between">
// // //                   <span>Today's Tasks ({tasks.filter((t) => !t.completed).length} remaining)</span>
// // //                   <Button size="sm" variant="outline" onClick={handleAddTask}>
// // //                     <Plus className="h-4 w-4 mr-2" /> Add Task
// // //                   </Button>
// // //                 </CardTitle>
// // //                 <CardDescription>
// // //                   {new Date().toLocaleDateString("en-US", {
// // //                     weekday: "long",
// // //                     year: "numeric",
// // //                     month: "long",
// // //                     day: "numeric",
// // //                   })}
// // //                 </CardDescription>
// // //               </CardHeader>
// // //               <CardContent>
// // //                 <div className="space-y-4">
// // //                   {tasks.map((task) => (
// // //                     <div
// // //                       key={task._id || task.id}
// // //                       className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
// // //                         task.completed
// // //                           ? "bg-green-50 border-green-200 opacity-75"
// // //                           : "bg-white border-gray-200 hover:shadow-sm"
// // //                       }`}
// // //                     >
// // //                       <Button
// // //                         variant="ghost"
// // //                         size="icon"
// // //                         className={`h-6 w-6 ${
// // //                           task.completed ? "text-green-600" : "text-gray-400 hover:text-green-600"
// // //                         }`}
// // //                         onClick={() => toggleTask(task._id || task.id!)}
// // //                       >
// // //                         <CheckCircle className="h-4 w-4" />
// // //                       </Button>

// // //                       <div className="flex-1">
// // //                         <div
// // //                           className={`font-medium ${
// // //                             task.completed ? "line-through text-gray-500" : "text-gray-800"
// // //                           }`}
// // //                         >
// // //                           {task.title}
// // //                         </div>
// // //                         <div className="flex items-center space-x-2 mt-1">
// // //                           <Clock className="h-3 w-3 text-gray-400" />
// // //                           <span className="text-sm text-gray-500">
// // //                             {new Date(task.time).toLocaleString() || "No time set"}
// // //                           </span>
// // //                           <Badge
// // //                             variant="secondary"
// // //                             className={`text-xs ${
// // //                               task.priority === "high"
// // //                                 ? "bg-red-100 text-red-700"
// // //                                 : task.priority === "medium"
// // //                                 ? "bg-yellow-100 text-yellow-700"
// // //                                 : "bg-gray-100 text-gray-700"
// // //                             }`}
// // //                           >
// // //                             {task.priority}
// // //                           </Badge>
// // //                         </div>
// // //                       </div>

// // //                       <Button
// // //                         variant="ghost"
// // //                         size="icon"
// // //                         className="h-6 w-6 text-gray-400 hover:text-red-600"
// // //                         onClick={() => deleteTask(task._id || task.id!)}
// // //                       >
// // //                         <Trash2 className="h-4 w-4" />
// // //                       </Button>
// // //                     </div>
// // //                   ))}

// // //                   {tasks.length === 0 && (
// // //                     <div className="text-center py-8 text-gray-500">
// // //                       <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
// // //                       <p>No tasks yet. Add one above or use voice commands!</p>
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               </CardContent>
// // //             </Card>
// // //           </div>

// // //           {/* Sidebar */}
// // //           <div className="space-y-6">
// // //             {/* Quick Add */}
// // //             <Card>
// // //               <CardHeader>
// // //                 <CardTitle className="text-lg">Quick Add</CardTitle>
// // //               </CardHeader>
// // //               <CardContent>
// // //                 <div className="space-y-3">
// // //                   <Input
// // //                     placeholder="What do you need to do?"
// // //                     value={newTaskTitle}
// // //                     onChange={(e) => setNewTaskTitle(e.target.value)}
// // //                     onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
// // //                   />
// // //                   <input
// // //                     type="datetime-local"
// // //                     className="w-full border rounded-md p-2 text-sm"
// // //                     onChange={(e) => ((window as any).selectedTime = e.target.value)}
// // //                   />
// // //                   <div className="grid grid-cols-2 gap-2">
// // //                     <Button variant="outline" size="sm" onClick={handleAddTask}>
// // //                       <Plus className="h-3 w-3 mr-1" /> Add
// // //                     </Button>
// // //                     <Button variant="outline" size="sm" onClick={handleVoiceInput}>
// // //                       <Mic className="h-3 w-3 mr-1" /> Voice
// // //                     </Button>
// // //                   </div>
// // //                 </div>
// // //               </CardContent>
// // //             </Card>
// // //           </div>
// // //         </div>
// // //       </main>
// // //     </div>
// // //   )
// // // }
// // "use client"

// // import { useState, useEffect, useRef } from "react"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Input } from "@/components/ui/input"
// // import { Badge } from "@/components/ui/badge"
// // import { Alert, AlertDescription } from "@/components/ui/alert"
// // import { Calendar, Clock, Mic, Plus, ArrowLeft, CheckCircle, Trash2 } from "lucide-react"
// // import Link from "next/link"
// // import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
// // import { useVoiceCommands } from "@/hooks/useVoiceCommands"
// // import * as chrono from "chrono-node"
// // import { speak } from "@/lib/speech"

// // interface Task {
// //   _id?: string
// //   id?: number
// //   title: string
// //   time: string
// //   completed: boolean
// //   priority: "high" | "medium" | "low"
// //   createdAt: Date
// // }

// // export default function CalendarPage() {
// //   const [tasks, setTasks] = useState<Task[]>([])
// //   const [newTaskTitle, setNewTaskTitle] = useState("")
// //   const [voiceCommand, setVoiceCommand] = useState("")
// //   const [pendingTask, setPendingTask] = useState<{ title: string; time: string } | null>(null)

// //   const { transcript, isListening, startListening, stopListening, resetTranscript, error } = useSpeechRecognition()
// //   const { processWithAI } = useVoiceCommands()
// //   const debounceRef = useRef<NodeJS.Timeout | null>(null)

// //   // 🧠 Load tasks from MongoDB
// //   useEffect(() => {
// //     fetch("/api/calendar")
// //       .then((res) => res.json())
// //       .then((data) => Array.isArray(data) && setTasks(data))
// //       .catch((err) => console.error("Failed to load tasks:", err))
// //   }, [])

// //   // 🎙️ Process transcript with debounce + confirmation
// //   useEffect(() => {
// //     if (!transcript) return

// //     // Cancel previous debounce if still running
// //     if (debounceRef.current) clearTimeout(debounceRef.current)

// //     debounceRef.current = setTimeout(async () => {
// //       const aiResponse = await processWithAI(transcript)
// //       console.log("🤖 Raw AI Response:", aiResponse)

// //       try {
// //         const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
// //         if (jsonMatch) {
// //           const parsed = JSON.parse(jsonMatch[0])
// //           const title = parsed.title || "task"
// //           const timeStr = parsed.time || ""
// //           const parsedTime = chrono.parseDate(timeStr)

// //           if (title && parsedTime) {
// //             const iso = parsedTime.toISOString()
// //             setPendingTask({ title, time: iso })
// //             const human = parsedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
// //             setVoiceCommand(`Confirm: ${title} at ${human}`)
// //             speak(`I heard "${title}" for ${human}. Should I save it?`)
// //           }
// //         }
// //       } catch (err) {
// //         console.warn("⚠️ Parsing error", err)
// //       }
// //     }, 1000)
// //   }, [transcript])
// //   // 🎹 Hold SPACEBAR to speak (Push-to-talk)
// // useEffect(() => {
// //   const handleKeyDown = (e: KeyboardEvent) => {
// //     if (e.code === "Space" && !isListening) {
// //       e.preventDefault()
// //       resetTranscript()
// //       startListening()
// //     }
// //   }

// //   const handleKeyUp = (e: KeyboardEvent) => {
// //     if (e.code === "Space" && isListening) {
// //       e.preventDefault()
// //       stopListening()
// //     }
// //   }

// //   window.addEventListener("keydown", handleKeyDown)
// //   window.addEventListener("keyup", handleKeyUp)

// //   return () => {
// //     window.removeEventListener("keydown", handleKeyDown)
// //     window.removeEventListener("keyup", handleKeyUp)
// //   }
// // }, [isListening, startListening, stopListening, resetTranscript])


// //   // 🎙️ Voice input start/stop
// //   const handleVoiceInput = () => {
// //     if (isListening) stopListening()
// //     else {
// //       resetTranscript()
// //       startListening()
// //       setTimeout(() => stopListening(), 8000)
// //     }
// //   }

// //   // 📅 Add task → API + state
// //   const addTask = async (title: string, time = "No time set", priority: "high" | "medium" | "low" = "medium") => {
// //     try {
// //       const res = await fetch("/api/calendar", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ title, time, priority }),
// //       })
// //       const saved = await res.json()
// //       setTasks((prev) => [...prev, saved])
// //     } catch (err) {
// //       console.error("Error saving task:", err)
// //     }
// //   }

// //   // ✅ Toggle & delete
// //   const toggleTask = (id: string | number) =>
// //     setTasks((prev) => prev.map((t) => (t._id === id || t.id === id ? { ...t, completed: !t.completed } : t)))
// //   const deleteTask = (id: string | number) =>
// //     setTasks((prev) => prev.filter((t) => t._id !== id && t.id !== id))

// //   // 🖱️ Manual task add
// //   const handleAddTask = () => {
// //     if (newTaskTitle.trim()) {
// //       const selectedTime = (window as any).selectedTime || "No time set"
// //       addTask(newTaskTitle.trim(), selectedTime)
// //       setNewTaskTitle("")
// //     }
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
// //       {/* Header */}
// //       <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
// //         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
// //           <div className="flex items-center space-x-4">
// //             <Link href="/">
// //               <Button variant="ghost" size="icon">
// //                 <ArrowLeft className="h-5 w-5" />
// //               </Button>
// //             </Link>
// //             <div className="flex items-center space-x-2">
// //               <Calendar className="h-6 w-6 text-blue-600" />
// //               <h1 className="text-xl font-bold text-gray-800">Schedule & Tasks</h1>
// //             </div>
// //           </div>
// //           <Badge variant="secondary" className="bg-blue-100 text-blue-700">
// //             {isListening ? "Listening..." : "Voice Ready"}
// //           </Badge>
// //         </div>
// //       </header>

// //       <main className="container mx-auto px-4 py-8">
// //         {error && (
// //           <Alert className="mb-6 border-red-200 bg-red-50">
// //             <AlertDescription>{error}</AlertDescription>
// //           </Alert>
// //         )}

// //         {voiceCommand && (
// //           <Alert className="mb-6 border-green-200 bg-green-50">
// //             <AlertDescription className="text-green-800">{voiceCommand}</AlertDescription>
// //           </Alert>
// //         )}

// //         {/* Voice Input */}
// //         <Card className="mb-8 border-2 border-dashed border-blue-200">
// //           <CardContent className="p-6">
// //             <div className="flex items-center justify-between mb-4">
// //               <div>
// //                 <h3 className="text-lg font-semibold text-gray-800">Voice Commands</h3>
// //                 <p className="text-gray-600 text-sm">
// //                   Try saying “Schedule meeting tomorrow at 2 PM” or “Remind me to sleep at 10 PM”
// //                 </p>
// //               </div>
// //               <Button
// //   onMouseDown={() => {
// //     resetTranscript()
// //     startListening()
// //   }}
// //   onMouseUp={stopListening}
// //   onTouchStart={() => {
// //     resetTranscript()
// //     startListening()
// //   }}
// //   onTouchEnd={stopListening}
// //   className={`${
// //     isListening
// //       ? "bg-red-500 hover:bg-red-600 animate-pulse"
// //       : "bg-blue-500 hover:bg-blue-600"
// //   }`}
// // >
// //   <Mic className="h-4 w-4 mr-2" />
// //   {isListening ? "Listening..." : "Hold to Speak"}
// // </Button>

// //             </div>

// //             {transcript && (
// //               <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
// //                 <p className="text-blue-800 text-sm">
// //                   <strong>You said:</strong> “{transcript}”
// //                 </p>
// //               </div>
// //             )}

// //             {/* Confirmation Box */}
// //             {pendingTask && (
// //               <div className="mt-4 flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-3">
// //                 <div>
// //                   <p className="text-sm text-gray-700">
// //                     <strong>Confirm task:</strong> {pendingTask.title} at{" "}
// //                     {new Date(pendingTask.time).toLocaleTimeString([], {
// //                       hour: "2-digit",
// //                       minute: "2-digit",
// //                     })}
// //                   </p>
// //                 </div>
// //                 <div className="flex space-x-2">
// //                   <Button
// //                     size="sm"
// //                     className="bg-green-500 hover:bg-green-600 text-white"
// //                     onClick={async () => {
// //                       await addTask(pendingTask.title, pendingTask.time)
// //                       speak(`Done! I’ve set your reminder for ${pendingTask.title}.`)
// //                       setVoiceCommand(`✅ Saved: ${pendingTask.title}`)
// //                       setPendingTask(null)
// //                       resetTranscript()
// //                     }}
// //                   >
// //                     ✅ Confirm
// //                   </Button>
// //                   <Button
// //                     size="sm"
// //                     variant="outline"
// //                     onClick={() => {
// //                       speak("Okay, I won’t save it.")
// //                       setVoiceCommand("❌ Cancelled")
// //                       setPendingTask(null)
// //                       resetTranscript()
// //                     }}
// //                   >
// //                     ❌ Cancel
// //                   </Button>
// //                 </div>
// //               </div>
// //             )}
// //           </CardContent>
// //         </Card>

// //         {/* Layout grid */}
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// //           {/* Tasks list */}
// //           <div className="lg:col-span-2">
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle className="flex items-center justify-between">
// //                   <span>Today's Tasks ({tasks.filter((t) => !t.completed).length} remaining)</span>
// //                   <Button size="sm" variant="outline" onClick={handleAddTask}>
// //                     <Plus className="h-4 w-4 mr-2" /> Add Task
// //                   </Button>
// //                 </CardTitle>
// //                 <CardDescription>
// //                   {new Date().toLocaleDateString("en-US", {
// //                     weekday: "long",
// //                     year: "numeric",
// //                     month: "long",
// //                     day: "numeric",
// //                   })}
// //                 </CardDescription>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-4">
// //                   {tasks.map((task) => (
// //                     <div
// //                       key={task._id || task.id}
// //                       className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
// //                         task.completed
// //                           ? "bg-green-50 border-green-200 opacity-75"
// //                           : "bg-white border-gray-200 hover:shadow-sm"
// //                       }`}
// //                     >
// //                       <Button
// //                         variant="ghost"
// //                         size="icon"
// //                         className={`h-6 w-6 ${
// //                           task.completed ? "text-green-600" : "text-gray-400 hover:text-green-600"
// //                         }`}
// //                         onClick={() => toggleTask(task._id || task.id!)}
// //                       >
// //                         <CheckCircle className="h-4 w-4" />
// //                       </Button>

// //                       <div className="flex-1">
// //                         <div
// //                           className={`font-medium ${
// //                             task.completed ? "line-through text-gray-500" : "text-gray-800"
// //                           }`}
// //                         >
// //                           {task.title}
// //                         </div>
// //                         <div className="flex items-center space-x-2 mt-1">
// //                           <Clock className="h-3 w-3 text-gray-400" />
// //                           <span className="text-sm text-gray-500">
// //                             {new Date(task.time).toLocaleString() || "No time set"}
// //                           </span>
// //                           <Badge
// //                             variant="secondary"
// //                             className={`text-xs ${
// //                               task.priority === "high"
// //                                 ? "bg-red-100 text-red-700"
// //                                 : task.priority === "medium"
// //                                 ? "bg-yellow-100 text-yellow-700"
// //                                 : "bg-gray-100 text-gray-700"
// //                             }`}
// //                           >
// //                             {task.priority}
// //                           </Badge>
// //                         </div>
// //                       </div>

// //                       <Button
// //                         variant="ghost"
// //                         size="icon"
// //                         className="h-6 w-6 text-gray-400 hover:text-red-600"
// //                         onClick={() => deleteTask(task._id || task.id!)}
// //                       >
// //                         <Trash2 className="h-4 w-4" />
// //                       </Button>
// //                     </div>
// //                   ))}

// //                   {tasks.length === 0 && (
// //                     <div className="text-center py-8 text-gray-500">
// //                       <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
// //                       <p>No tasks yet. Add one above or use voice commands!</p>
// //                     </div>
// //                   )}
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>

// //           {/* Sidebar */}
// //           <div className="space-y-6">
// //             {/* Quick Add */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle className="text-lg">Quick Add</CardTitle>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-3">
// //                   <Input
// //                     placeholder="What do you need to do?"
// //                     value={newTaskTitle}
// //                     onChange={(e) => setNewTaskTitle(e.target.value)}
// //                     onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
// //                   />
// //                   <input
// //                     type="datetime-local"
// //                     className="w-full border rounded-md p-2 text-sm"
// //                     onChange={(e) => ((window as any).selectedTime = e.target.value)}
// //                   />
// //                   <div className="grid grid-cols-2 gap-2">
// //                     <Button variant="outline" size="sm" onClick={handleAddTask}>
// //                       <Plus className="h-3 w-3 mr-1" /> Add
// //                     </Button>
// //                     <Button variant="outline" size="sm" onClick={handleVoiceInput}>
// //                       <Mic className="h-3 w-3 mr-1" /> Voice
// //                     </Button>
// //                   </div>
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

// import { useState, useEffect, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Calendar, Clock, Mic, Plus, ArrowLeft, CheckCircle, Trash2 } from "lucide-react"
// import Link from "next/link"
// import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
// import { useVoiceCommands } from "@/hooks/useVoiceCommands"
// import * as chrono from "chrono-node"
// import { speak } from "@/lib/speech"

// interface Task {
//   _id?: string
//   id?: number
//   title: string
//   time: string
//   completed: boolean
//   priority: "high" | "medium" | "low"
//   createdAt: Date
// }

// export default function CalendarPage() {
//   const [tasks, setTasks] = useState<Task[]>([])
//   const [newTaskTitle, setNewTaskTitle] = useState("")
//   const [voiceCommand, setVoiceCommand] = useState("")
//   const [pendingTask, setPendingTask] = useState<{ title: string; time: string } | null>(null)

//   const { transcript, isListening, startListening, stopListening, resetTranscript, error } = useSpeechRecognition()
//   const { processWithAI } = useVoiceCommands()
//   const debounceRef = useRef<NodeJS.Timeout | null>(null)

//   // 🧠 Load tasks from MongoDB
//   useEffect(() => {
//     fetch("/api/calendar")
//       .then((res) => res.json())
//       .then((data) => Array.isArray(data) && setTasks(data))
//       .catch((err) => console.error("Failed to load tasks:", err))
//   }, [])

//   // 🎙️ Process transcript + confirmation
//   useEffect(() => {
//     if (!transcript) return
//     if (debounceRef.current) clearTimeout(debounceRef.current)

//     debounceRef.current = setTimeout(async () => {
//       console.log("🎤 Transcript:", transcript)
//       const aiResponse = await processWithAI(transcript)
//       console.log("🤖 Raw AI Response:", aiResponse)

//       try {
//         const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
//         if (jsonMatch) {
//           const parsed = JSON.parse(jsonMatch[0])
//           const title = parsed.title || "task"
//           const timeStr = parsed.time || ""
//           const parsedTime = chrono.parseDate(timeStr)

//           if (title && parsedTime) {
//             const iso = parsedTime.toISOString()
//             setPendingTask({ title, time: iso })
//             const human = parsedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//             setVoiceCommand(`Confirm: ${title} at ${human}`)
//             speak(`I heard "${title}" for ${human}. Should I save it?`)
//           } else {
//             speak("Sorry, I didn’t catch the time. Please repeat.")
//           }
//         }
//       } catch (err) {
//         console.warn("⚠️ Parsing error", err)
//         speak("Sorry, I couldn’t understand that.")
//       }
//     }, 1200)
//   }, [transcript])

//   // 🎙️ Voice button
//   const handleVoiceButton = {
//     onMouseDown: () => {
//       resetTranscript()
//       startListening()
//     },
//     onMouseUp: stopListening,
//     onTouchStart: () => {
//       resetTranscript()
//       startListening()
//     },
//     onTouchEnd: stopListening,
//   }

//   // 📅 Add Task
//   const addTask = async (title: string, time = "No time set", priority: "high" | "medium" | "low" = "medium") => {
//     try {
//       const res = await fetch("/api/calendar", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ title, time, priority }),
//       })
//       const saved = await res.json()
//       setTasks((prev) => [...prev, saved])
//     } catch (err) {
//       console.error("Error saving task:", err)
//     }
//   }

//   // ✅ Toggle & delete
  
//   const toggleTask = (id: string | number) =>
//     setTasks((prev) => prev.map((t) => (t._id === id || t.id === id ? { ...t, completed: !t.completed } : t)))
//   const deleteTask = async (id: string | number) => {
//   try {
//     await fetch("/api/calendar", {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id }),
//     })
//     setTasks((prev) => prev.filter((t) => t._id !== id && t.id !== id))
//   } catch (err) {
//     console.error("❌ Failed to delete task:", err)
//   }
// }

//   const handleAddTask = () => {
//     if (newTaskTitle.trim()) {
//       const selectedTime = (window as any).selectedTime || "No time set"
//       addTask(newTaskTitle.trim(), selectedTime)
//       setNewTaskTitle("")
//     }
//   }

//   // 🎹 Spacebar push-to-talk
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.code === "Space" && !isListening) {
//         e.preventDefault()
//         e.stopPropagation()
//         resetTranscript()
//         startListening()
//       }
//     }

//     const handleKeyUp = (e: KeyboardEvent) => {
//       if (e.code === "Space" && isListening) {
//         e.preventDefault()
//         e.stopPropagation()
//         stopListening()
//       }
//     }

//     window.addEventListener("keydown", handleKeyDown, true)
//     window.addEventListener("keyup", handleKeyUp, true)
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown, true)
//       window.removeEventListener("keyup", handleKeyUp, true)
//     }
//   }, [isListening, startListening, stopListening, resetTranscript])

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
//       {/* Header */}
//       <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
//         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <Link href="/">
//               <Button variant="ghost" size="icon">
//                 <ArrowLeft className="h-5 w-5" />
//               </Button>
//             </Link>
//             <div className="flex items-center space-x-2">
//               <Calendar className="h-6 w-6 text-blue-600" />
//               <h1 className="text-xl font-bold text-gray-800">Schedule & Tasks</h1>
//             </div>
//           </div>
//           <Badge variant="secondary" className="bg-blue-100 text-blue-700">
//             {isListening ? "Listening..." : "Voice Ready"}
//           </Badge>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         {error && (
//           <Alert className="mb-6 border-red-200 bg-red-50">
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         {voiceCommand && (
//           <Alert className="mb-6 border-green-200 bg-green-50">
//             <AlertDescription className="text-green-800">{voiceCommand}</AlertDescription>
//           </Alert>
//         )}

//         {/* Voice Input */}
//         <Card className="mb-8 border-2 border-dashed border-blue-200">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800">Voice Commands</h3>
//                 <p className="text-gray-600 text-sm">
//                   Hold <b>Space</b> or Mic and say: “Remind me to sleep at 10 PM”
//                 </p>
//               </div>
//               <Button {...handleVoiceButton}
//                 className={`${
//                   isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-blue-500 hover:bg-blue-600"
//                 }`}
//               >
//                 <Mic className="h-4 w-4 mr-2" />
//                 {isListening ? "Listening..." : "Hold to Speak"}
//               </Button>
//             </div>

//             {transcript && (
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//                 <p className="text-blue-800 text-sm">
//                   <strong>You said:</strong> “{transcript}”
//                 </p>
//               </div>
//             )}

//             {pendingTask && (
//               <div className="mt-4 flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//                 <p className="text-sm text-gray-700">
//                   Confirm: {pendingTask.title} at{" "}
//                   {new Date(pendingTask.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                 </p>
//                 <div className="flex space-x-2">
//                   <Button
//                     size="sm"
//                     className="bg-green-500 hover:bg-green-600 text-white"
//                     onClick={async () => {
//                       await addTask(pendingTask.title, pendingTask.time)
//                       speak(`Done! I’ve set your reminder for ${pendingTask.title}.`)
//                       setVoiceCommand(`✅ Saved: ${pendingTask.title}`)
//                       setPendingTask(null)
//                       resetTranscript()
//                     }}
//                   >
//                     ✅ Confirm
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => {
//                       speak("Okay, I won’t save it.")
//                       setVoiceCommand("❌ Cancelled")
//                       setPendingTask(null)
//                       resetTranscript()
//                     }}
//                   >
//                     ❌ Cancel
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Tasks and Quick Add */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Task List */}
//           <div className="lg:col-span-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center justify-between">
//                   <span>Today's Tasks ({tasks.filter((t) => !t.completed).length} remaining)</span>
//                   <Button size="sm" variant="outline" onClick={handleAddTask}>
//                     <Plus className="h-4 w-4 mr-2" /> Add Task
//                   </Button>
//                 </CardTitle>
//                 <CardDescription>
//                   {new Date().toLocaleDateString("en-US", {
//                     weekday: "long",
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {tasks.map((task) => (
//                     <div
//                       key={task._id || task.id}
//                       className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
//                         task.completed
//                           ? "bg-green-50 border-green-200 opacity-75"
//                           : "bg-white border-gray-200 hover:shadow-sm"
//                       }`}
//                     >
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className={`h-6 w-6 ${
//                           task.completed ? "text-green-600" : "text-gray-400 hover:text-green-600"
//                         }`}
//                         onClick={() => toggleTask(task._id || task.id!)}
//                       >
//                         <CheckCircle className="h-4 w-4" />
//                       </Button>

//                       <div className="flex-1">
//                         <div
//                           className={`font-medium ${
//                             task.completed ? "line-through text-gray-500" : "text-gray-800"
//                           }`}
//                         >
//                           {task.title}
//                         </div>
//                         <div className="flex items-center space-x-2 mt-1">
//                           <Clock className="h-3 w-3 text-gray-400" />
//                           <span className="text-sm text-gray-500">
//                             {task.time ? new Date(task.time).toLocaleString() : "No time set"}
//                           </span>
//                           <Badge
//                             variant="secondary"
//                             className={`text-xs ${
//                               task.priority === "high"
//                                 ? "bg-red-100 text-red-700"
//                                 : task.priority === "medium"
//                                 ? "bg-yellow-100 text-yellow-700"
//                                 : "bg-gray-100 text-gray-700"
//                             }`}
//                           >
//                             {task.priority}
//                           </Badge>
//                         </div>
//                       </div>

//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-6 w-6 text-gray-400 hover:text-red-600"
//                         onClick={() => deleteTask(task._id || task.id!)}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   ))}

//                   {tasks.length === 0 && (
//                     <div className="text-center py-8 text-gray-500">
//                       <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                       <p>No tasks yet. Add one above or use voice commands!</p>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Quick Add Sidebar */}
//           <div className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Quick Add</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <Input
//                     placeholder="What do you need to do?"
//                     value={newTaskTitle}
//                     onChange={(e) => setNewTaskTitle(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
//                   />
//                   <input
//                     type="datetime-local"
//                     className="w-full border rounded-md p-2 text-sm"
//                     onChange={(e) => ((window as any).selectedTime = e.target.value)}
//                   />
//                   <div className="grid grid-cols-2 gap-2">
//                     <Button variant="outline" size="sm" onClick={handleAddTask}>
//                       <Plus className="h-3 w-3 mr-1" /> Add
//                     </Button>
//                     <Button variant="outline" size="sm" onClick={() => speak("Try saying: Add task at 5 PM")}>
//                       <Mic className="h-3 w-3 mr-1" /> Hint
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }
"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, Mic, Plus, ArrowLeft, CheckCircle, Trash2 } from "lucide-react"
import Link from "next/link"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
import { useVoiceCommands } from "@/hooks/useVoiceCommands"
import * as chrono from "chrono-node"
import { speak } from "@/lib/speech"

interface Task {
  _id?: string
  id?: number
  title: string
  time: string
  completed: boolean
  priority: "high" | "medium" | "low"
  createdAt: Date
}

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [voiceCommand, setVoiceCommand] = useState("")
  const [pendingTask, setPendingTask] = useState<{ title: string; time: string } | null>(null)

  const { transcript, isListening, startListening, stopListening, resetTranscript, error } = useSpeechRecognition()
  const { processWithAI } = useVoiceCommands()
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // 🧠 Load tasks
  useEffect(() => {
    fetch("/api/calendar")
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setTasks(data))
      .catch((err) => console.error("Failed to load tasks:", err))
  }, [])

  // 🎙️ Process transcript → AI → parse JSON → confirm
  useEffect(() => {
    if (!transcript) return
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      console.log("🎤 Transcript:", transcript)
      const aiResponse = await processWithAI(transcript)
      console.log("🤖 Raw AI Response:", aiResponse)

      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          const title = parsed.title || "task"
          const timeStr = parsed.time || ""
         const parsedTime = chrono.parseDate(timeStr, new Date(), { forwardDate: true })

if (title && parsedTime) {
  // ✅ Use parsed time directly (chrono already local → IST)
  const iso = parsedTime.toISOString()
  setPendingTask({ title, time: iso })

  const human = parsedTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  setVoiceCommand(`Confirm: ${title} at ${human}`)
  speak(`I heard "${title}" for ${human}. Should I save it?`)
} else {
  speak("Sorry, I didn’t catch the time. Please repeat.")
}



        }
      } catch (err) {
        console.warn("⚠️ Parsing error", err)
        speak("Sorry, I couldn’t understand that.")
      }
    }, 1200)
  }, [transcript])

  // 🎙️ Voice button hold behavior
  const handleVoiceButton = {
    onMouseDown: () => {
      resetTranscript()
      startListening()
    },
    onMouseUp: stopListening,
    onTouchStart: () => {
      resetTranscript()
      startListening()
    },
    onTouchEnd: stopListening,
  }

  // 📅 Add Task
  const addTask = async (title: string, time = "No time set", priority: "high" | "medium" | "low" = "medium") => {
    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, time, priority }),
      })
      const saved = await res.json()
      setTasks((prev) => [...prev, saved])
    } catch (err) {
      console.error("Error saving task:", err)
    }
  }
  // ✅ Toggle completion (persist to MongoDB)
const toggleTask = async (id: string | number) => {
  try {
    // Find the target task
    const task = tasks.find((t) => t._id === id || t.id === id);
    if (!task) return;

    const newCompleted = !task.completed;

    // 🔁 Update DB
    await fetch("/api/calendar", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed: newCompleted }),
    });

    // 🧠 Update local state (instant feedback)
    setTasks((prev) =>
      prev.map((t) =>
        t._id === id || t.id === id ? { ...t, completed: newCompleted } : t
      )
    );

    // 🎧 Optional feedback voice
    if (newCompleted) {
      speak(`Nice work! You completed ${task.title}.`);
    } else {
      speak(`Okay, ${task.title} marked as not done.`);
    }
  } catch (err) {
    console.error("❌ Failed to toggle task:", err);
  }
};


  const deleteTask = async (id: string | number) => {
    try {
      await fetch("/api/calendar", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      setTasks((prev) => prev.filter((t) => t._id !== id && t.id !== id))
    } catch (err) {
      console.error("❌ Failed to delete task:", err)
    }
  }

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const selectedTime = (window as any).selectedTime || "No time set"
      addTask(newTaskTitle.trim(), selectedTime)
      setNewTaskTitle("")
    }
  }
  // 🎙️ Process transcript + confirmation
useEffect(() => {
  if (!transcript) return
  if (debounceRef.current) clearTimeout(debounceRef.current)

  debounceRef.current = setTimeout(async () => {
    console.log("🎤 Transcript:", transcript)
    const aiResponse = await processWithAI(transcript)
    console.log("🤖 Raw AI Response:", aiResponse)

    try {
      // Match only JSON block
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        speak("Sorry, I couldn’t understand that. Please try again.")
        return
      }

      const parsed = JSON.parse(jsonMatch[0])
      const title = parsed.title?.trim() || "Task"
      let timeStr = parsed.time?.trim() || "today at 9 PM"

      console.log("🧠 Parsed JSON:", parsed)

      // Parse natural language time to local date
      const parsedTime = chrono.parseDate(timeStr, new Date(), { forwardDate: true })

      if (!parsedTime) {
        speak("Hmm, I couldn’t detect a clear time. Please repeat it.")
        return
      }

      // ✅ Use chrono local time directly (IST-safe)
      const iso = parsedTime.toISOString()
      setPendingTask({ title, time: iso })

      const human = parsedTime.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })

      setVoiceCommand(`Confirm: ${title} at ${human}`)
      speak(`I heard "${title}" for ${human}. Should I save it?`)
    } catch (err) {
      console.warn("⚠️ JSON parse or AI issue", err)
      speak("Sorry, I didn’t catch that clearly. Try again.")
    }
  }, 1200)
}, [transcript])


  // 🎹 Spacebar push-to-talk
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isListening) {
        e.preventDefault()
        e.stopPropagation()
        resetTranscript()
        startListening()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" && isListening) {
        e.preventDefault()
        e.stopPropagation()
        stopListening()
      }
    }

    window.addEventListener("keydown", handleKeyDown, true)
    window.addEventListener("keyup", handleKeyUp, true)
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true)
      window.removeEventListener("keyup", handleKeyUp, true)
    }
  }, [isListening, startListening, stopListening, resetTranscript])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">Schedule & Tasks</h1>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {isListening ? "Listening..." : "Voice Ready"}
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {voiceCommand && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{voiceCommand}</AlertDescription>
          </Alert>
        )}

        {/* Voice Input */}
        <Card className="mb-8 border-2 border-dashed border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Voice Commands</h3>
                <p className="text-gray-600 text-sm">
                  Hold <b>Space</b> or Mic and say: “Remind me to sleep at 10 PM”
                </p>
              </div>
              <Button {...handleVoiceButton}
                className={`${
                  isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                <Mic className="h-4 w-4 mr-2" />
                {isListening ? "Listening..." : "Hold to Speak"}
              </Button>
            </div>

            {transcript && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  <strong>You said:</strong> “{transcript}”
                </p>
              </div>
            )}

            {pendingTask && (
              <div className="mt-4 flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  Confirm: {pendingTask.title} at{" "}
                  {new Date(pendingTask.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={async () => {
                      await addTask(pendingTask.title, pendingTask.time)
                      speak(`Done! I’ve set your reminder for ${pendingTask.title}.`)
                      setVoiceCommand(`✅ Saved: ${pendingTask.title}`)
                      setPendingTask(null)
                      resetTranscript()
                    }}
                  >
                    ✅ Confirm
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      speak("Okay, I won’t save it.")
                      setVoiceCommand("❌ Cancelled")
                      setPendingTask(null)
                      resetTranscript()
                    }}
                  >
                    ❌ Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Task List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Today's Tasks ({tasks.filter((t) => !t.completed).length} remaining)</span>
                  <Button size="sm" variant="outline" onClick={handleAddTask}>
                    <Plus className="h-4 w-4 mr-2" /> Add Task
                  </Button>
                </CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task._id || task.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                        task.completed
                          ? "bg-green-50 border-green-200 opacity-75"
                          : "bg-white border-gray-200 hover:shadow-sm"
                      }`}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-6 w-6 ${
                          task.completed ? "text-green-600" : "text-gray-400 hover:text-green-600"
                        }`}
                        onClick={() => toggleTask(task._id || task.id!)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>

                      <div className="flex-1">
                        <div
                          className={`font-medium ${
                            task.completed ? "line-through text-gray-500" : "text-gray-800"
                          }`}
                        >
                          {task.title}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {task.time ? new Date(task.time).toLocaleString() : "No time set"}
                          </span>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              task.priority === "high"
                                ? "bg-red-100 text-red-700"
                                : task.priority === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-red-600"
                        onClick={() => deleteTask(task._id || task.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {tasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No tasks yet. Add one above or use voice commands!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Add</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Input
                    placeholder="What do you need to do?"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
                  />
                  <input
                    type="datetime-local"
                    className="w-full border rounded-md p-2 text-sm"
                    onChange={(e) => ((window as any).selectedTime = e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={handleAddTask}>
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => speak("Try saying: Add task at 5 PM")}>
                      <Mic className="h-3 w-3 mr-1" /> Hint
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
