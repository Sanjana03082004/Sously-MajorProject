// "use client"
// import CuteAvatar from "@/components/ui/CuteAvatar";
// import CallScreen from "@/components/ui/CallScreen";


// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Phone, Mic, Calendar, Brain, Settings, BarChart3, Focus, MicOff, Volume2, Heart } from "lucide-react"
// import Link from "next/link"
// import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
// import { useTextToSpeech } from "@/hooks/useTextToSpeech"
// import { useVoiceCommands } from "@/hooks/useVoiceCommands"
// import { useMoodAnalysis } from "@/hooks/useMoodAnalysis"
// import { useConversationAI } from "@/hooks/useConversationAI"



// export default function HomePage() {
//   const [callActive, setCallActive] = useState(false)
//   const [aiResponse, setAiResponse] = useState("")
//   const [showPermissionAlert, setShowPermissionAlert] = useState(false)
//   const [conversationStarted, setConversationStarted] = useState(false)

//   const { transcript, isListening, isSupported, startListening, stopListening, resetTranscript, error } =
//     useSpeechRecognition()

//   const { speak, isSpeaking, stop: stopSpeaking } = useTextToSpeech()
//   const { processCommand } = useVoiceCommands()
//   const { currentMood, analyzeMood, loadMoodData } = useMoodAnalysis()
//   const { generateNaturalResponse, context } = useConversationAI()

//   useEffect(() => {
//     loadMoodData()
//   }, [loadMoodData])

//   useEffect(() => {
//     if (transcript && transcript.length > 5) {
//       // Analyze mood from speech
//       const mood = analyzeMood(transcript)

//       // Process voice commands first
//       const command = processCommand(transcript)
//       if (command) {
//         handleVoiceCommand(command)
//       } else {
//         // Generate natural AI response for conversation
//         const response = generateNaturalResponse(transcript, mood)
//         setAiResponse(response)
//         speak(response)
//       }
//     }
//   }, [transcript])

//  const handleVoiceCall = async () => {
//   if (!isSupported) {
//     setShowPermissionAlert(true);
//     return;
//   }

//   if (callActive) {
//     // END CALL: clean up anything from Home page
//     stopListening();
//     stopSpeaking();
//     setCallActive(false);
//     setConversationStarted(false);
//     resetTranscript();
//     setAiResponse("");
//   } else {
//     // START CALL: DO NOT startListening or speak here.
//     // Let <CallScreen /> take over mic + TTS to avoid double voice.
//     try {
//       // Make sure background is quiet before showing CallScreen
//       stopListening();
//       stopSpeaking();
//       resetTranscript();
//       setAiResponse("");

//       setConversationStarted(true);
//       setCallActive(true);
//       // No greeting here — CallScreen will greet / auto-start itself.
//     } catch (err) {
//       setShowPermissionAlert(true);
//       setCallActive(false);
//     }
//   }
// };

// useEffect(() => {
//   if (callActive) {
//     // Ensure background listeners are off while CallScreen is up
//     stopListening();
//     stopSpeaking();
//   }
// }, [callActive]);


//   const handleQuickVoice = () => {
//     if (isListening) {
//       stopListening()
//     } else {
//       startListening()
//       setTimeout(() => stopListening(), 8000) // Longer listening time for natural conversation
//     }
//   }

//   const handleVoiceCommand = (command: any) => {
//     const responses = {
//       schedule: [
//         `I'll help you set that ${command.data.type} for ${command.data.time}. You know, staying organized really helps with peace of mind, doesn't it?`,
//         `Of course! Let me get that ${command.data.type} scheduled for ${command.data.time}. I love that you're being proactive about planning ahead.`,
//         `Perfect! I'm adding that ${command.data.type} for ${command.data.time} right now. It feels good to get these things organized, right?`,
//       ],
//       meeting: [
//         `Got it! I'm scheduling your meeting with ${command.data.person} for ${command.data.time}. Meetings can be exciting or nerve-wracking - how are you feeling about this one?`,
//         `Meeting with ${command.data.person} at ${command.data.time} - I'll make sure that's in your calendar. What's this meeting about?`,
//         `Perfect! I've got you down for a meeting with ${command.data.person} at ${command.data.time}. I hope it goes really well for you!`,
//       ],
//       task: [
//         `Done! I've added "${command.data.task}" to your task list. You know, I really admire how you stay on top of things. How does it feel to get that organized?`,
//         `Perfect! "${command.data.task}" is now on your list. There's something satisfying about getting tasks written down, isn't there?`,
//         `I've got "${command.data.task}" added for you. You're really good at staying organized - that's such a valuable skill.`,
//       ],
//       mood_check: [
//         `Based on our conversation and how you're speaking, I'd say your mood seems to be around ${currentMood?.score || 7.0} out of 10. You're coming across as ${currentMood?.energy || "balanced"} energy today. How does that feel accurate to you?`,
//         `From what I can sense in your voice and words, you seem to be feeling about ${currentMood?.score || 7.0} out of 10 mood-wise, with ${currentMood?.energy || "moderate"} energy. Does that match how you're feeling inside?`,
//         `You know, listening to you right now, I'm picking up on a mood score of around ${currentMood?.score || 7.0} out of 10. Your energy feels ${currentMood?.energy || "steady"} to me. What do you think - does that sound right?`,
//       ],
//       focus_start: [
//         `Yes! Let's get you into focus mode. I think it's amazing when people prioritize their productivity and mental clarity. Ready to dive deep into some focused work?`,
//         `Starting focus mode now. I love that you're taking charge of your concentration. What are you planning to work on?`,
//         `Perfect timing! Let's get your focus session started. There's something really powerful about intentional focus time, don't you think?`,
//       ],
//     }

//     const responseArray = responses[command.type as keyof typeof responses] || [`I'll help you with that right away!`]
//     const response = responseArray[Math.floor(Math.random() * responseArray.length)]

//     setAiResponse(response)
//     speak(response)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
//       {/* Header */}
//       <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
//         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <Brain className="h-8 w-8 text-emerald-600" />
//             <h1 className="text-2xl font-bold text-gray-800">MindMate</h1>
//             {context.userName && (
//               <Badge variant="outline" className="ml-2">
//                 Hi {context.userName}! 👋
//               </Badge>
//             )}
//           </div>
//           <div className="flex items-center space-x-4">
//             <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
//               {isListening ? "I'm listening..." : callActive ? "Connected" : "Ready to chat"}
//             </Badge>
//             <Link href="/settings">
//               <Button variant="ghost" size="icon">
//                 <Settings className="h-5 w-5" />
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Permission Alert */}
//       {showPermissionAlert && (
//         <div className="container mx-auto px-4 pt-4">
//           <Alert className="border-orange-200 bg-orange-50">
//             <AlertDescription>
//               I'd love to chat with you! Please allow microphone access so we can have a real conversation. Check your
//               browser settings and reload the page.
//             </AlertDescription>
//           </Alert>
//         </div>
//       )}

//       {/* Error Alert */}
//       {error && (
//         <div className="container mx-auto px-4 pt-4">
//           <Alert className="border-red-200 bg-red-50">
//             <AlertDescription>Oops! {error} - Let's try again in a moment.</AlertDescription>
//           </Alert>
//         </div>
//       )}

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8">
//         {/* Welcome Section */}
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-gray-800 mb-2">
//             {context.userName
//               ? `Hey ${context.userName}! How are you feeling today?`
//               : "Hello! How are you feeling today?"}
//           </h2>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             I'm your AI friend who's here 24/7 to listen, support, and have real conversations with you. Think of me as
//             that friend who always has time to chat and genuinely cares about how you're doing.
//           </p>
//         </div>

//         {/* Conversation Display */}
//         {(transcript || aiResponse) && (
//           <Card className="mb-8 border-2 border-emerald-200 shadow-lg">
//             <CardContent className="p-6">
//               {transcript && (
//                 <div className="mb-4">
//                   <div className="text-sm text-gray-600 mb-2 flex items-center">
//                     <Heart className="h-4 w-4 mr-1 text-blue-500" />
//                     You said:
//                   </div>
//                   <div className="bg-blue-50 p-4 rounded-lg text-blue-800 border-l-4 border-blue-400">
//                     "{transcript}"
//                   </div>
//                 </div>
//               )}
//               {aiResponse && (
//                 <div>
//                   <div className="text-sm text-gray-600 mb-2 flex items-center">
//                     <Brain className="h-4 w-4 mr-1 text-emerald-600" />
//                     MindMate responds:
//                     {isSpeaking && <Volume2 className="h-4 w-4 ml-2 animate-pulse text-emerald-600" />}
//                   </div>
//                   <div className="bg-emerald-50 p-4 rounded-lg text-emerald-800 border-l-4 border-emerald-400">
//                     "{aiResponse}"
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         )}

//         {/* Main Call Button */}
//         <div className="flex justify-center mb-12">
//           <div className="relative">
//             <Button
//               onClick={handleVoiceCall}
//               disabled={!isSupported}
//               className={`w-40 h-40 rounded-full text-white font-semibold text-lg transition-all duration-300 ${
//                 callActive
//                   ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-2xl"
//                   : "bg-emerald-500 hover:bg-emerald-600 shadow-lg hover:shadow-2xl"
//               } ${!isSupported ? "opacity-50 cursor-not-allowed" : ""}`}
//             >
//               <div className="flex flex-col items-center">
//                 <Phone className={`h-12 w-12 mb-2 ${callActive ? "animate-bounce" : ""}`} />
//                 <span className="text-sm">{callActive ? "End Chat" : "Start Chat"}</span>
//               </div>
//             </Button>
//             <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
//               {callActive && (
//                <div className="bg-white px-4 py-2 rounded-full shadow-lg">
//   <p className="text-sm text-gray-700 animate-pulse flex items-center">
//     <span
//       className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping"
//       aria-hidden="true"
//     />
//     We&apos;re chatting live!
//   </p>
// </div>

//               )}
//               {!isSupported && <p className="text-xs text-red-600">Voice chat not supported in this browser</p>}
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleQuickVoice}>
//             <CardHeader className="pb-3">
//               <CardTitle className="flex items-center space-x-2 text-lg">
//                 {isListening ? (
//                   <Mic className="h-5 w-5 text-red-500 animate-pulse" />
//                 ) : (
//                   <MicOff className="h-5 w-5 text-emerald-600" />
//                 )}
//                 <span>Quick Chat</span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <CardDescription>
//                 {isListening ? "I'm listening to you..." : "Tap to say something quick"}
//               </CardDescription>
//             </CardContent>
//           </Card>

//           <Link href="/calendar">
//             <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
//               <CardHeader className="pb-3">
//                 <CardTitle className="flex items-center space-x-2 text-lg">
//                   <Calendar className="h-5 w-5 text-blue-600" />
//                   <span>Schedule</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <CardDescription>Let's organize your day together</CardDescription>
//               </CardContent>
//             </Card>
//           </Link>

//           <Link href="/insights">
//             <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
//               <CardHeader className="pb-3">
//                 <CardTitle className="flex items-center space-x-2 text-lg">
//                   <BarChart3 className="h-5 w-5 text-purple-600" />
//                   <span>Insights</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <CardDescription>Understanding your emotional patterns</CardDescription>
//               </CardContent>
//             </Card>
//           </Link>

//           <Link href="/focus">
//             <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
//               <CardHeader className="pb-3">
//                 <CardTitle className="flex items-center space-x-2 text-lg">
//                   <Focus className="h-5 w-5 text-orange-600" />
//                   <span>Focus Mode</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <CardDescription>Let's boost your productivity together</CardDescription>
//               </CardContent>
//             </Card>
//           </Link>
//         </div>

//         {/* Today's Summary */}
//         <Card className="mb-8">
//           <CardHeader>
//             <CardTitle className="flex items-center space-x-2">
//               <Brain className="h-5 w-5 text-emerald-600" />
//               <span>How You're Doing Today</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="text-center p-4 bg-emerald-50 rounded-lg">
//                 <div className="text-2xl font-bold text-emerald-600 mb-1">{currentMood?.score || 7.2}</div>
//                 <div className="text-sm text-gray-600">Your Mood Score</div>
//                 <div className="text-xs text-gray-500 mt-1">
//                   {currentMood?.score && currentMood.score > 7
//                     ? "You're doing great!"
//                     : currentMood?.score && currentMood.score < 5
//                       ? "I'm here for you"
//                       : "You're doing well"}
//                 </div>
//               </div>
//               <div className="text-center p-4 bg-blue-50 rounded-lg">
//                 <div className="text-2xl font-bold text-blue-600 mb-1">4</div>
//                 <div className="text-sm text-gray-600">Tasks Completed</div>
//                 <div className="text-xs text-gray-500 mt-1">Keep up the momentum!</div>
//               </div>
//               <div className="text-center p-4 bg-purple-50 rounded-lg">
//                 <div className="text-2xl font-bold text-purple-600 mb-1">
//                   {currentMood?.energy === "high" ? "3.2h" : currentMood?.energy === "low" ? "1.8h" : "2.5h"}
//                 </div>
//                 <div className="text-sm text-gray-600">Focus Time</div>
//                 <div className="text-xs text-gray-500 mt-1">
//                   {currentMood?.energy === "high"
//                     ? "High energy day!"
//                     : currentMood?.energy === "low"
//                       ? "Take it easy today"
//                       : "Steady progress"}
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Conversation Starters */}
//         <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50">
//           <CardHeader>
//             <CardTitle className="text-lg">Things you can talk to me about:</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                 <span>"I'm feeling stressed about work today"</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                 <span>"I had the best day ever!"</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
//                 <span>"I'm worried about my relationship"</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
//                 <span>"I can't sleep and I'm exhausted"</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//                 <span>"My family is driving me crazy"</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
//                 <span>"I need help making a decision"</span>
//               </div>
//             </div>
//             <div className="mt-4 text-xs text-gray-600 italic">
//               Or just say "Hi" and let's have a natural conversation about whatever's on your mind!
//             </div>
//           </CardContent>
//         </Card>

//         {/* Motivational Message */}
//         <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
//           <CardContent className="p-6 text-center">
//             <h3 className="text-xl font-semibold mb-2">
//               {currentMood?.score && currentMood.score > 7
//                 ? `${context.userName ? context.userName + ", you're" : "You're"} absolutely glowing today! 🌟`
//                 : currentMood?.score && currentMood.score < 5
//                   ? `Hey ${context.userName || "friend"}, I'm here for you through the tough times. 💙`
//                   : `${context.userName ? context.userName + ", you're" : "You're"} doing great today! 🌟`}
//             </h3>
//             <p className="opacity-90">
//               Remember, I'm not just an AI - I'm your friend who genuinely cares about your wellbeing. Let's chat
//               whenever you need someone to listen.
//             </p>
//           </CardContent>
//         </Card>
//       </main>

// {/* Full-screen overlay that shows CallScreen */}
// {callActive && (
//   <div className="fixed inset-0 z-[900] bg-blue-50">   {/* light blue full bg */}
    

//     {/* Main CallScreen content fills full screen */}
//     <div className="pt-16 h-full flex items-center justify-center">
//       <CallScreen
//   contactName="MindMate"
//   voiceLang="en-US"
//   autoStart        // start immediately
//   hideCallButton   // no big round button
//   showTopBar       // keeps a small back/end at top
//   onClose={() => setCallActive(false)} // or router.back()
// />

//     </div>
//   </div>
// )}


// </div>

//   )
// }
// app/page.tsx  (SERVER component — do NOT add "use client")
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import HomeClient from "./HomeClient";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return <HomeClient />;
}
