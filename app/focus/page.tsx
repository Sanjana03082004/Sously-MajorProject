// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { ArrowLeft, Play, Pause, RotateCcw, Focus, Volume2, VolumeX, Brain } from "lucide-react"
// import Link from "next/link"
// import { useMoodAnalysis } from "@/hooks/useMoodAnalysis"

// export default function FocusPage() {
//   const [isActive, setIsActive] = useState(false)
//   const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
//   const [mode, setMode] = useState<"focus" | "break">("focus")
//   const [soundEnabled, setSoundEnabled] = useState(true)
//   const [currentSound, setCurrentSound] = useState("ocean")
//   const [sessionsCompleted, setSessionsCompleted] = useState(0)
//   const [totalFocusTime, setTotalFocusTime] = useState(0)

//   const { currentMood } = useMoodAnalysis()

//   const focusTime = 25 * 60
//   const breakTime = 5 * 60

//   // Adaptive timing based on stress level
//   const getAdaptiveTiming = () => {
//     const stressLevel =
//       currentMood?.energy === "low"
//         ? "high"
//         : currentMood?.score && currentMood.score < 6
//           ? "high"
//           : currentMood?.energy === "high"
//             ? "low"
//             : "medium"

//     switch (stressLevel) {
//       case "high":
//         return { focus: 15 * 60, break: 10 * 60 }
//       case "medium":
//         return { focus: 20 * 60, break: 7 * 60 }
//       default:
//         return { focus: 25 * 60, break: 5 * 60 }
//     }
//   }

//   useEffect(() => {
//     // Load saved data
//     const saved = localStorage.getItem("mindmate_focus_data")
//     if (saved) {
//       const data = JSON.parse(saved)
//       setSessionsCompleted(data.sessionsCompleted || 0)
//       setTotalFocusTime(data.totalFocusTime || 0)
//     }
//   }, [])

//   useEffect(() => {
//     let interval: NodeJS.Timeout | null = null

//     if (isActive && timeLeft > 0) {
//       interval = setInterval(() => {
//         setTimeLeft((prev) => {
//           const newTime = prev - 1

//           // Update total focus time if in focus mode
//           if (mode === "focus") {
//             setTotalFocusTime((prevTotal) => {
//               const newTotal = prevTotal + 1
//               localStorage.setItem(
//                 "mindmate_focus_data",
//                 JSON.stringify({
//                   sessionsCompleted,
//                   totalFocusTime: newTotal,
//                 }),
//               )
//               return newTotal
//             })
//           }

//           return newTime
//         })
//       }, 1000)
//     } else if (timeLeft === 0) {
//       // Switch modes when timer ends
//       if (mode === "focus") {
//         setMode("break")
//         setSessionsCompleted((prev) => {
//           const newCount = prev + 1
//           localStorage.setItem(
//             "mindmate_focus_data",
//             JSON.stringify({
//               sessionsCompleted: newCount,
//               totalFocusTime,
//             }),
//           )
//           return newCount
//         })
//         const adaptiveTiming = getAdaptiveTiming()
//         setTimeLeft(adaptiveTiming.break)

//         // Play completion sound
//         if (soundEnabled) {
//           playNotificationSound()
//         }
//       } else {
//         setMode("focus")
//         const adaptiveTiming = getAdaptiveTiming()
//         setTimeLeft(adaptiveTiming.focus)
//       }
//       setIsActive(false)
//     }

//     return () => {
//       if (interval) clearInterval(interval)
//     }
//   }, [isActive, timeLeft, mode, soundEnabled, sessionsCompleted, totalFocusTime])

//   const playNotificationSound = () => {
//     // Create a simple beep sound
//     const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
//     const oscillator = audioContext.createOscillator()
//     const gainNode = audioContext.createGain()

//     oscillator.connect(gainNode)
//     gainNode.connect(audioContext.destination)

//     oscillator.frequency.value = 800
//     oscillator.type = "sine"

//     gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
//     gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

//     oscillator.start(audioContext.currentTime)
//     oscillator.stop(audioContext.currentTime + 0.5)
//   }

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60)
//     const secs = seconds % 60
//     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
//   }

//   const getProgress = () => {
//     const adaptiveTiming = getAdaptiveTiming()
//     const totalTime = mode === "focus" ? adaptiveTiming.focus : adaptiveTiming.break
//     return ((totalTime - timeLeft) / totalTime) * 100
//   }

//   const handleStart = () => {
//     setIsActive(!isActive)
//   }

//   const handleReset = () => {
//     setIsActive(false)
//     const adaptiveTiming = getAdaptiveTiming()
//     setTimeLeft(mode === "focus" ? adaptiveTiming.focus : adaptiveTiming.break)
//   }

//   const stressLevel =
//     currentMood?.energy === "low"
//       ? "high"
//       : currentMood?.score && currentMood.score < 6
//         ? "high"
//         : currentMood?.energy === "high"
//           ? "low"
//           : "medium"

//   const adaptiveRecommendations = {
//     low: {
//       duration: "25 min focus",
//       break: "5 min break",
//       music: "Ambient sounds",
//       color: "text-green-600",
//       bg: "bg-green-50",
//     },
//     medium: {
//       duration: "20 min focus",
//       break: "7 min break",
//       music: "Nature sounds",
//       color: "text-yellow-600",
//       bg: "bg-yellow-50",
//     },
//     high: {
//       duration: "15 min focus",
//       break: "10 min break",
//       music: "Calming music",
//       color: "text-red-600",
//       bg: "bg-red-50",
//     },
//   }

//   const currentRec = adaptiveRecommendations[stressLevel as keyof typeof adaptiveRecommendations]

//   const sounds = [
//     { id: "ocean", name: "🌊 Ocean Waves", url: "/sounds/ocean.mp3" },
//     { id: "rain", name: "🌧️ Rain Sounds", url: "/sounds/rain.mp3" },
//     { id: "fire", name: "🔥 Crackling Fire", url: "/sounds/fire.mp3" },
//     { id: "lofi", name: "🎵 Lo-fi Music", url: "/sounds/lofi.mp3" },
//   ]

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
//       {/* Header */}
//       <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
//         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <Link href="/">
//               <Button variant="ghost" size="icon">
//                 <ArrowLeft className="h-5 w-5" />
//               </Button>
//             </Link>
//             <div className="flex items-center space-x-2">
//               <Focus className="h-6 w-6 text-orange-600" />
//               <h1 className="text-xl font-bold text-gray-800">Focus Mode</h1>
//             </div>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Badge variant="secondary" className={`${currentRec.color} ${currentRec.bg}`}>
//               Stress: {stressLevel}
//             </Badge>
//             <Badge variant="secondary" className="bg-orange-100 text-orange-700">
//               {mode === "focus" ? "Focus Time" : "Break Time"}
//             </Badge>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         {/* Adaptive Alert */}
//         <Alert className={`mb-6 border-2 ${currentRec.bg} border-opacity-50`}>
//           <Brain className={`h-4 w-4 ${currentRec.color}`} />
//           <AlertDescription className={currentRec.color}>
//             <strong>AI Recommendation:</strong> Based on your current mood and energy level, I suggest{" "}
//             {currentRec.duration} sessions with {currentRec.break} breaks.
//           </AlertDescription>
//         </Alert>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Timer Section */}
//           <div className="lg:col-span-2">
//             <Card className="text-center">
//               <CardHeader>
//                 <CardTitle className="text-2xl">{mode === "focus" ? "🎯 Focus Session" : "☕ Break Time"}</CardTitle>
//                 <CardDescription>
//                   {mode === "focus" ? "Stay focused and productive" : "Take a well-deserved break"}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-8">
//                 {/* Timer Display */}
//                 <div className="relative">
//                   <div className="text-8xl font-mono font-bold text-gray-800 mb-4">{formatTime(timeLeft)}</div>
//                   <Progress value={getProgress()} className="h-3 mb-6" />
//                 </div>

//                 {/* Controls */}
//                 <div className="flex justify-center space-x-4">
//                   <Button
//                     onClick={handleStart}
//                     size="lg"
//                     className={`${
//                       isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
//                     } text-white px-8`}
//                   >
//                     {isActive ? (
//                       <>
//                         <Pause className="h-5 w-5 mr-2" />
//                         Pause
//                       </>
//                     ) : (
//                       <>
//                         <Play className="h-5 w-5 mr-2" />
//                         Start
//                       </>
//                     )}
//                   </Button>

//                   <Button onClick={handleReset} variant="outline" size="lg" className="px-8 bg-transparent">
//                     <RotateCcw className="h-5 w-5 mr-2" />
//                     Reset
//                   </Button>
//                 </div>

//                 {/* Current Activity */}
//                 {isActive && (
//                   <div className={`${currentRec.bg} border-2 border-opacity-50 rounded-lg p-4`}>
//                     <p className={`${currentRec.color} font-medium`}>
//                       {mode === "focus" ? "🔥 You're in the zone! Keep going!" : "🌱 Relax and recharge your mind"}
//                     </p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Adaptive Suggestions */}
//             <Card className="mt-6">
//               <CardHeader>
//                 <CardTitle className="flex items-center space-x-2">
//                   <span>AI Adaptive Suggestions</span>
//                   <Badge className={currentRec.color}>Based on current stress level</Badge>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div className="text-center p-4 bg-gray-50 rounded-lg">
//                     <div className="font-semibold text-gray-800 mb-1">{currentRec.duration}</div>
//                     <div className="text-sm text-gray-600">Recommended Focus</div>
//                   </div>
//                   <div className="text-center p-4 bg-gray-50 rounded-lg">
//                     <div className="font-semibold text-gray-800 mb-1">{currentRec.break}</div>
//                     <div className="text-sm text-gray-600">Break Duration</div>
//                   </div>
//                   <div className="text-center p-4 bg-gray-50 rounded-lg">
//                     <div className="font-semibold text-gray-800 mb-1">{currentRec.music}</div>
//                     <div className="text-sm text-gray-600">Background Audio</div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Sound Controls */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Audio Settings</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-gray-600">Background Sounds</span>
//                     <Button variant="ghost" size="icon" onClick={() => setSoundEnabled(!soundEnabled)}>
//                       {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
//                     </Button>
//                   </div>

//                   <div className="space-y-2">
//                     {sounds.map((sound) => (
//                       <Button
//                         key={sound.id}
//                         variant={currentSound === sound.id ? "default" : "outline"}
//                         size="sm"
//                         className="w-full justify-start bg-transparent"
//                         onClick={() => setCurrentSound(sound.id)}
//                       >
//                         {sound.name}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Session Stats */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Today's Progress</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-gray-600">Focus Sessions</span>
//                     <span className="font-medium">{sessionsCompleted}/6</span>
//                   </div>
//                   <Progress value={(sessionsCompleted / 6) * 100} className="h-2" />

//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-gray-600">Total Focus Time</span>
//                     <span className="font-medium">
//                       {Math.floor(totalFocusTime / 3600)}h {Math.floor((totalFocusTime % 3600) / 60)}m
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-gray-600">Productivity Score</span>
//                     <Badge className="bg-green-100 text-green-700">
//                       {Math.min(100, Math.max(60, sessionsCompleted * 15 + 25))}%
//                     </Badge>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Quick Actions */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Quick Actions</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="w-full justify-start bg-transparent"
//                     onClick={() => {
//                       setMode("focus")
//                       setTimeLeft(15 * 60)
//                       setIsActive(false)
//                     }}
//                   >
//                     ⚡ Quick 15min Focus
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="w-full justify-start bg-transparent"
//                     onClick={() => {
//                       setMode("break")
//                       setTimeLeft(5 * 60)
//                       setIsActive(false)
//                     }}
//                   >
//                     ☕ 5min Break
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="w-full justify-start bg-transparent"
//                     onClick={() => {
//                       setMode("focus")
//                       setTimeLeft(50 * 60)
//                       setIsActive(false)
//                     }}
//                   >
//                     🎯 Deep Work (50min)
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Play, Pause, RotateCcw, Focus, Volume2, VolumeX, Brain, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMoodAnalysis } from "@/hooks/useMoodAnalysis";
import { speak } from "@/lib/speech";

export default function FocusPage() {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentSound, setCurrentSound] = useState("lofi");
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [quote, setQuote] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { currentMood } = useMoodAnalysis();

  // 🎵 background sounds
  const sounds = {
    ocean: "/sounds/ocean.mp3",
    rain: "/sounds/rain.mp3",
    fire: "/sounds/fire.mp3",
    lofi: "/sounds/lofi.mp3",
  };

  const getStressLevel = () => {
    if (currentMood?.energy === "low" || (currentMood?.score && currentMood.score < 6)) return "high";
    if (currentMood?.energy === "high") return "low";
    return "medium";
  };

  const stressLevel = getStressLevel();

  // 🧠 adaptive timings based on mood
  const getAdaptiveTiming = () => {
    switch (stressLevel) {
      case "high":
        return { focus: 15 * 60, break: 10 * 60 };
      case "medium":
        return { focus: 20 * 60, break: 7 * 60 };
      default:
        return { focus: 25 * 60, break: 5 * 60 };
    }
  };

  // 🎧 manage sound
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (isActive && mode === "focus" && soundEnabled) {
      const audio = new Audio(sounds[currentSound]);
      audio.loop = true;
      audio.volume = 0.4;
      audio.play().catch(() => {});
      audioRef.current = audio;
    }
    return () => audioRef.current?.pause();
  }, [isActive, mode, currentSound, soundEnabled]);

  // 💾 load saved data
  useEffect(() => {
    const saved = localStorage.getItem("mindmate_focus_data");
    if (saved) {
      const data = JSON.parse(saved);
      setSessionsCompleted(data.sessionsCompleted || 0);
      setTotalFocusTime(data.totalFocusTime || 0);
    }
  }, []);

  // 🧘 quotes
  const quotes = [
    "Deep breaths. Focus starts with calm.",
    "Your attention is your superpower.",
    "Every small session counts toward mastery.",
    "Distraction fades when purpose is clear.",
    "The best work happens in the quiet moments.",
  ];

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [mode]);

  // ⏱️ timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (mode === "focus") {
            setTotalFocusTime((prevTotal) => {
              const newTotal = prevTotal + 1;
              localStorage.setItem(
                "mindmate_focus_data",
                JSON.stringify({
                  sessionsCompleted,
                  totalFocusTime: newTotal,
                })
              );
              return newTotal;
            });
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      if (mode === "focus") {
        setMode("break");
        setSessionsCompleted((prev) => {
          const newCount = prev + 1;
          localStorage.setItem(
            "mindmate_focus_data",
            JSON.stringify({
              sessionsCompleted: newCount,
              totalFocusTime,
            })
          );
          return newCount;
        });
        const adaptiveTiming = getAdaptiveTiming();
        setTimeLeft(adaptiveTiming.break);
        speak("Focus complete! Time to take a break.");
      } else {
        setMode("focus");
        const adaptiveTiming = getAdaptiveTiming();
        setTimeLeft(adaptiveTiming.focus);
        speak("Break over. Let's get back in the zone!");
      }
      setIsActive(false);
    }

    return () => interval && clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const getProgress = () => {
    const adaptiveTiming = getAdaptiveTiming();
    const total = mode === "focus" ? adaptiveTiming.focus : adaptiveTiming.break;
    return ((total - timeLeft) / total) * 100;
  };

  const handleReset = () => {
    const adaptiveTiming = getAdaptiveTiming();
    setIsActive(false);
    setTimeLeft(mode === "focus" ? adaptiveTiming.focus : adaptiveTiming.break);
  };

  const adaptiveColors = {
    low: "from-green-100 to-emerald-200",
    medium: "from-yellow-100 to-amber-200",
    high: "from-rose-100 to-red-200",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 transition-all">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Focus className="h-6 w-6 text-orange-600" />
              <h1 className="text-xl font-bold text-gray-800">Focus Mode</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              {mode === "focus" ? "Focus" : "Break"}
            </Badge>
            <Badge variant="secondary">{stressLevel.toUpperCase()} Stress</Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Alert className="border-orange-200 bg-orange-50 shadow-sm">
          <AlertDescription>
            <Brain className="inline-block h-4 w-4 mr-2 text-orange-600" />
            <strong>Soulsy Tip:</strong> {quote}
          </AlertDescription>
        </Alert>

        <Card className="text-center shadow-xl border-orange-100 bg-white/80">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              {mode === "focus" ? "🎯 Deep Focus" : "☕ Relax & Recharge"}
            </CardTitle>
            <CardDescription>
              {mode === "focus" ? "Stay in the flow — you’re doing great!" : "Take it slow and breathe."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-8xl font-mono font-bold text-gray-800">{formatTime(timeLeft)}</div>
            <Progress value={getProgress()} className="h-3" />

            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => setIsActive(!isActive)}
                size="lg"
                className={`${isActive ? "bg-red-500" : "bg-green-500"} text-white hover:opacity-90 px-8`}
              >
                {isActive ? (
                  <>
                    <Pause className="h-5 w-5 mr-2" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" /> Start
                  </>
                )}
              </Button>
              <Button onClick={handleReset} variant="outline" size="lg">
                <RotateCcw className="h-5 w-5 mr-2" /> Reset
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => setSoundEnabled(!soundEnabled)}>
                {soundEnabled ? <Volume2 /> : <VolumeX />}
              </Button>
              <select
                className="border rounded-md p-1 text-sm text-gray-600"
                value={currentSound}
                onChange={(e) => setCurrentSound(e.target.value)}
              >
                {Object.keys(sounds).map((k) => (
                  <option key={k} value={k}>
                    {k.charAt(0).toUpperCase() + k.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-orange-100">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-500" />
              Productivity Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-orange-600">{sessionsCompleted}</p>
              <p className="text-gray-600 text-sm">Sessions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">
                {Math.floor(totalFocusTime / 60)}m
              </p>
              <p className="text-gray-600 text-sm">Total Focus</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-600">
                {Math.min(100, sessionsCompleted * 20 + 40)}%
              </p>
              <p className="text-gray-600 text-sm">Productivity Score</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
