
"use client";
import LogoutButton from "@/components/LogoutButton";
import { useToast } from "@/components/ui/use-toast";

import CallScreen from "@/components/ui/CallScreen";
import { useDailyRedirect } from "@/hooks/useDailyRedirect"
import ProfileMenu from "@/components/ui/ProfileMenu";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, Mic, Calendar, Brain, Settings, BarChart3, Focus, MicOff, Volume2, Heart } from "lucide-react";
import Link from "next/link";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useVoiceCommands } from "@/hooks/useVoiceCommands";
import { useMoodAnalysis } from "@/hooks/useMoodAnalysis";
import { useConversationAI } from "@/hooks/useConversationAI";
interface DashboardStats {
  moodScore: number | null;
  focusHours: number | null;
  tasksCompleted: number;
}
export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats>({
    moodScore: null,
    focusHours: null,
    tasksCompleted: 0,
  });
  const { toast } = useToast();

  const [callActive, setCallActive] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [showPermissionAlert, setShowPermissionAlert] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
    // 🔁 Redirect user to daily check-in if not done today
  useDailyRedirect();

  const { transcript, isListening, isSupported, startListening, stopListening, resetTranscript, error } =
    useSpeechRecognition();

  const { speak, isSpeaking, stop: stopSpeaking } = useTextToSpeech();
  const { processWithAI } = useVoiceCommands();

  const { currentMood, analyzeMood, loadMoodData } = useMoodAnalysis();
  const { generateNaturalResponse, context } = useConversationAI();

  useEffect(() => {
  async function loadStats() {
    try {
      // ✅ Fetch mood data
      const moodRes = await fetch("/api/moods");
      const moods = await moodRes.json();

      const todayLocal = new Date();
      const todayStr = todayLocal.toDateString();

      const todayMoods = moods.filter(
        (m: any) => new Date(m.createdAt).toDateString() === todayStr
      );

      const avgMood =
        todayMoods.length > 0
          ? todayMoods.reduce((sum: number, m: any) => sum + (m.score || 7), 0) /
            todayMoods.length
          : null;

      // ✅ Fetch focus stats
      const focusRes = await fetch("/api/focus");
      const focusData = await focusRes.json();
      const focusHours = focusData?.totalFocusTime
        ? focusData.totalFocusTime / 3600
        : null;

      // ✅ Fetch calendar tasks
      const taskRes = await fetch("/api/calendar");
      const allTasks = await taskRes.json();

      console.log("🗓️ All Tasks:", allTasks);
      console.log("📅 Today:", todayStr);

      // ✅ Timezone-safe completion filter
      const todayCompleted = allTasks.filter((t: any) => {
        if (!t.completed) return false;

        const taskDate = t.updatedAt
          ? new Date(t.updatedAt)
          : t.time
          ? new Date(t.time)
          : new Date(t.createdAt);

        // Convert UTC → Local time (MongoDB stores UTC)
        const localDate = new Date(
          taskDate.getTime() - taskDate.getTimezoneOffset() * 60000
        );

        console.log(
          "✅ Checking:",
          t.title,
          "→ local:",
          localDate.toDateString()
        );

        return localDate.toDateString() === todayStr;
      });

      // ✅ Update dashboard stats
      setStats({
        moodScore: avgMood,
        focusHours,
        tasksCompleted: todayCompleted.length,
      });

      console.log(
        "🎯 Tasks completed today:",
        todayCompleted.map((t: any) => t.title)
      );
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    }
  }

  loadStats();
}, []);


      

  
  useEffect(() => {
    loadMoodData();
  }, [loadMoodData]);

  // IMPORTANT: do not process transcript when CallScreen overlay is active
  useEffect(() => {
  if (!transcript || transcript.length <= 5) return;
  if (callActive) return;

  // 🚨 Emergency voice phrase detection
  (async () => {
    const lowerText = transcript.toLowerCase();
    const emergencyPhrases = [
      "i want to die",
      "help me",
      "i am not okay",
      "i need help",
      "emergency",
      "please help",
      "i want to end my life",
    ];

    const isEmergency = emergencyPhrases.some((phrase) =>
      lowerText.includes(phrase)
    );

    if (isEmergency) {
      console.log("🚨 Emergency detected");
      try {
        const res = await fetch("/api/emergency-alert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: transcript }),
        });

        if (res.ok) {
          toast({
            title: "🚨 Emergency Alert Sent",
            description: "We’ve notified your emergency contacts.",
            className: "bg-red-50 border border-red-200 text-red-800",
          });
        } else {
          toast({
            title: "⚠️ Emergency Alert Failed",
            description: "We couldn’t reach your contacts. Try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "❌ Network Error",
          description: "Couldn’t send alert. Please check your internet.",
          variant: "destructive",
        });
      }
    }
  })();

  // 🧠 Normal AI + mood processing below
  // 🧠 Normal AI + mood processing below
(async () => {
  const mood = analyzeMood(transcript);
  const command = await processWithAI(transcript);

  if (command) {
    handleVoiceCommand(command);
  } else {
    const response = generateNaturalResponse(transcript, mood);
    setAiResponse(response);
    speak(response);
  }
})();

}, [transcript, callActive]);




  const handleVoiceCall = async () => {
    if (!isSupported) {
      setShowPermissionAlert(true);
      return;
    }

    if (callActive) {
      // END CALL: clean up anything from Home page
      stopListening();
      stopSpeaking();
      setCallActive(false);
      setConversationStarted(false);
      resetTranscript();
      setAiResponse("");
    } else {
      // START CALL: Let <CallScreen /> own mic + TTS to avoid double voice
      try {
        stopListening();
        stopSpeaking();
        resetTranscript();
        setAiResponse("");

        setConversationStarted(true);
        setCallActive(true);
      } catch (err) {
        setShowPermissionAlert(true);
        setCallActive(false);
      }
    }
  };

  // Ensure background listeners are off while CallScreen is up
  useEffect(() => {
    if (callActive) {
      stopListening();
      stopSpeaking();
    }
  }, [callActive]);

  // Optional: lock page scroll when overlay is open
  useEffect(() => {
    if (!callActive) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [callActive]);

  const handleQuickVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      setTimeout(() => stopListening(), 8000);
    }
  };

  const handleVoiceCommand = (command: any) => {
    const responses = {
      schedule: [
        `I'll help you set that ${command.data.type} for ${command.data.time}. You know, staying organized really helps with peace of mind, doesn't it?`,
        `Of course! Let me get that ${command.data.type} scheduled for ${command.data.time}. I love that you're being proactive about planning ahead.`,
        `Perfect! I'm adding that ${command.data.type} for ${command.data.time} right now. It feels good to get these things organized, right?`,
      ],
      meeting: [
        `Got it! I'm scheduling your meeting with ${command.data.person} for ${command.data.time}. Meetings can be exciting or nerve-wracking - how are you feeling about this one?`,
        `Meeting with ${command.data.person} at ${command.data.time} - I'll make sure that's in your calendar. What's this meeting about?`,
        `Perfect! I've got you down for a meeting with ${command.data.person} at ${command.data.time}. I hope it goes really well for you!`,
      ],
      task: [
        `Done! I've added "${command.data.task}" to your task list. You know, I really admire how you stay on top of things. How does it feel to get that organized?`,
        `Perfect! "${command.data.task}" is now on your list. There's something satisfying about getting tasks written down, isn't there?`,
        `I've got "${command.data.task}" added for you. You're really good at staying organized - that's such a valuable skill.`,
      ],
      mood_check: [
        `Based on our conversation and how you're speaking, I'd say your mood seems to be around ${currentMood?.score || 7.0} out of 10. You're coming across as ${currentMood?.energy || "balanced"} energy today. How does that feel accurate to you?`,
        `From what I can sense in your voice and words, you seem to be feeling about ${currentMood?.score || 7.0} out of 10 mood-wise, with ${currentMood?.energy || "moderate"} energy. Does that match how you're feeling inside?`,
        `You know, listening to you right now, I'm picking up on a mood score of around ${currentMood?.score || 7.0} out of 10. Your energy feels ${currentMood?.energy || "steady"} to me. What do you think - does that sound right?`,
      ],
      focus_start: [
        `Yes! Let's get you into focus mode. I think it's amazing when people prioritize their productivity and mental clarity. Ready to dive deep into some focused work?`,
        `Starting focus mode now. I love that you're taking charge of your concentration. What are you planning to work on?`,
        `Perfect timing! Let's get your focus session started. There's something really powerful about intentional focus time, don't you think?`,
      ],
    };

    const responseArray = responses[command.type as keyof typeof responses] || [`I'll help you with that right away!`];
    const response = responseArray[Math.floor(Math.random() * responseArray.length)];

    setAiResponse(response);
    speak(response);
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-20 to-emerald-200">


      {/* Header */}
      <header className="bg-gradient-to-r from-pink-50 via-rose-50 to-emerald-50 backdrop-blur-sm shadow-md sticky top-0 z-50 border-b border-pink-200">

  <div className="container mx-auto px-4 py-4 flex items-center justify-between">
    {/* Left section */}
    <div className="flex items-center space-x-2">
      <Image
  src="/soulsylogo8.png"
  alt="Soulsy Logo"
  width={50}
  height={50}
  className="rounded-full"
/>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-800 to-rose-500 bg-clip-text text-transparent">
  Soulsy
</h1>

      {context.userName && (
        <Badge variant="outline" className="ml-2 text-emerald-800">
          Hi {context.userName}! 👋
        </Badge>
      )}
    </div>

    {/* Right section */}
    <div className="flex items-center space-x-4">
      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
        {isListening ? "I'm listening..." : callActive ? "Connected" : "Ready to chat"}
      </Badge>
      <div className="flex items-center gap-2">     {/* ✅ Show username beside profile icon */}
      <span className="text-gray-800 font-medium">
  {context.userName || "You"}
</span>

<ProfileMenu />
</div>

     
    </div>
  </div>
</header>


      {/* Permission Alert */}
      {showPermissionAlert && (
        <div className="container mx-auto px-4 pt-4">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertDescription>
              I'd love to chat with you! Please allow microphone access so we can have a real conversation. Check your
              browser settings and reload the page.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="container mx-auto px-4 pt-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription>Oops! {error} - Let's try again in a moment.</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {context.userName ? `Hey ${context.userName}! How are you feeling today?` : "Hello! How are you feeling today?"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            I'm your AI friend who's here 24/7 to listen, support, and have real conversations with you. Think of me as
            that friend who always has time to chat and genuinely cares about how you're doing.
          </p>
        </div>

        {/* Conversation Display */}
        {(transcript || aiResponse) && (
          <Card className="mb-8 border-2 border-emerald-200 shadow-lg">
            <CardContent className="p-6">
              {transcript && (
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2 flex items-center">
                    <Heart className="h-4 w-4 mr-1 text-blue-500" />
                    You said:
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-blue-800 border-l-4 border-blue-400">"{transcript}"</div>
                </div>
              )}
              {aiResponse && (
                <div>
                  <div className="text-sm text-gray-600 mb-2 flex items-center">
                    <Brain className="h-4 w-4 mr-1 text-emerald-600" />
                    Soulsy responds:
                    {isSpeaking && <Volume2 className="h-4 w-4 ml-2 animate-pulse text-emerald-600" />}
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg text-emerald-800 border-l-4 border-emerald-400">
                    "{aiResponse}"
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Main Call Button */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <Button
              onClick={handleVoiceCall}
              disabled={!isSupported}
              className={`w-40 h-40 rounded-full text-white font-semibold text-lg transition-all duration-300 ${
                callActive ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-2xl" : "bg-emerald-500 hover:bg-emerald-600 shadow-lg hover:shadow-2xl"
              } ${!isSupported ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex flex-col items-center">
                <Phone className={`h-12 w-12 mb-2 ${callActive ? "animate-bounce" : ""}`} />
                <span className="text-sm">{callActive ? "End Chat" : "Start Chat"}</span>
              </div>
            </Button>
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
              {callActive && (
                <div className="bg-white px-4 py-2 rounded-full shadow-lg">
                  <p className="text-sm text-gray-700 animate-pulse flex items-center">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping" aria-hidden="true" />
                    We&apos;re chatting live!
                  </p>
                </div>
              )}
              {!isSupported && <p className="text-xs text-red-600">Voice chat not supported in this browser</p>}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

  {/* Schedule */}
  <Link href="/calendar">
    <Card className="hover:shadow-md transition-all cursor-pointer h-full bg-blue-50/60 border border-blue-100 hover:border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg text-blue-600">
          <Calendar className="h-5 w-5 text-blue-500" />
          <span>Schedule</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-blue-600/80">
          Plan your day with calm and clarity
        </CardDescription>
      </CardContent>
    </Card>
  </Link>

  {/* Insights */}
  <Link href="/insights">
    <Card className="hover:shadow-md transition-all cursor-pointer h-full bg-pink-50/60 border border-pink-100 hover:border-pink-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg text-pink-600">
          <BarChart3 className="h-5 w-5 text-pink-500" />
          <span>Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-pink-600/80">
          Reflect on your emotions and patterns
        </CardDescription>
      </CardContent>
    </Card>
  </Link>

  {/* Focus */}
  <Link href="/focus">
    <Card className="hover:shadow-md transition-all cursor-pointer h-full bg-orange-50/60 border border-orange-100 hover:border-orange-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg text-orange-600">
          <Focus className="h-5 w-5 text-orange-500" />
          <span>Focus Mode</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-orange-600/80">
          Enter your calm, distraction-free zone
        </CardDescription>
      </CardContent>
    </Card>
  </Link>
</div>
      {/* Dynamic Dashboard Summary */}
      <Card className="mb-8 border-emerald-100 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-emerald-600" />
            <span>
              {stats.moodScore
                ? stats.moodScore >= 8
                  ? "You're Radiating Positivity ✨"
                  : stats.moodScore >= 6
                  ? "You're Doing Pretty Well 🌿"
                  : stats.moodScore >= 4
                  ? "A Bit Low Today 💭"
                  : "Tough Day — Be Kind to Yourself 💗"
                : "How You're Doing Today"}
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mood */}
            <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                {stats.moodScore ? stats.moodScore.toFixed(1) : "—"}
              </div>
              <div className="text-sm text-gray-600">Average Mood</div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.moodScore
                  ? stats.moodScore >= 7
                    ? "Positive and balanced energy"
                    : stats.moodScore >= 5
                    ? "Slightly stressed, but managing"
                    : "You might need some rest today"
                  : "No mood entries yet"}
              </div>
            </div>

            {/* Tasks */}
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {stats.tasksCompleted}
              </div>
              <div className="text-sm text-gray-600">Tasks Completed Today</div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.tasksCompleted > 0
                  ? "Great job staying productive!"
                  : "Let’s plan something achievable today"}
              </div>
            </div>

            {/* Focus */}
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {stats.focusHours ? stats.focusHours.toFixed(1) + "h" : "—"}
              </div>
              <div className="text-sm text-gray-600">Focus Time</div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.focusHours && stats.focusHours > 2
                  ? "Strong focus today!"
                  : stats.focusHours
                  ? "You’ve done some focused work"
                  : "No focus sessions yet"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 👇 CLOSE THE <main> TAG HERE */}
      </main>

      {callActive && (
        <div
          className="fixed inset-0 z-[900] bg-blue-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="pt-16 h-full flex items-center justify-center">
            <CallScreen
              contactName="Soulsy"
              voiceLang="en-US"
              autoStart
              hideCallButton
              showTopBar
              onClose={() => setCallActive(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
