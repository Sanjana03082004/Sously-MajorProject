"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Settings, Mic, Shield, Bell, Palette } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [voiceMonitoring, setVoiceMonitoring] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [backgroundListening, setBackgroundListening] = useState(false)
  const [dataSharing, setDataSharing] = useState(false)
  const [voiceSensitivity, setVoiceSensitivity] = useState([75])
  const [reminderFrequency, setReminderFrequency] = useState([3])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-gray-600" />
              <h1 className="text-xl font-bold text-gray-800">Settings</h1>
            </div>
          </div>
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            MindMate v1.0
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Voice & AI Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mic className="h-5 w-5 text-blue-600" />
                <span>Voice & AI Settings</span>
              </CardTitle>
              <CardDescription>Configure how MindMate listens and responds to you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">24/7 Voice Monitoring</div>
                  <div className="text-sm text-gray-500">
                    Continuously analyze your voice for mood and stress patterns
                  </div>
                </div>
                <Switch checked={voiceMonitoring} onCheckedChange={setVoiceMonitoring} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Background Listening</div>
                  <div className="text-sm text-gray-500">Listen for voice commands even when app is closed</div>
                </div>
                <Switch checked={backgroundListening} onCheckedChange={setBackgroundListening} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Voice Sensitivity</div>
                  <span className="text-sm text-gray-500">{voiceSensitivity[0]}%</span>
                </div>
                <Slider
                  value={voiceSensitivity}
                  onValueChange={setVoiceSensitivity}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <strong>Privacy Note:</strong> All voice data is processed locally on your device. No audio is sent
                    to external servers unless you explicitly enable cloud features.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Privacy & Data</span>
              </CardTitle>
              <CardDescription>Control how your data is used and stored</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Anonymous Data Sharing</div>
                  <div className="text-sm text-gray-500">
                    Help improve MindMate by sharing anonymized usage patterns
                  </div>
                </div>
                <Switch checked={dataSharing} onCheckedChange={setDataSharing} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start bg-transparent">
                  📊 Export My Data
                </Button>
                <Button variant="outline" className="justify-start bg-transparent">
                  🗑️ Delete All Data
                </Button>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div>• Voice recordings are stored locally for 7 days</div>
                <div>• Mood data is kept for analysis and trends</div>
                <div>• You can delete all data at any time</div>
                <div>• No personal information is shared with third parties</div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-yellow-600" />
                <span>Notifications & Reminders</span>
              </CardTitle>
              <CardDescription>Customize when and how MindMate reaches out to you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Push Notifications</div>
                  <div className="text-sm text-gray-500">Receive wellness reminders and mood check-ins</div>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Daily Check-ins</div>
                  <span className="text-sm text-gray-500">{reminderFrequency[0]} times/day</span>
                </div>
                <Slider
                  value={reminderFrequency}
                  onValueChange={setReminderFrequency}
                  max={8}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="font-medium">Notification Types</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="mood-reminders" defaultChecked />
                    <label htmlFor="mood-reminders" className="text-sm">
                      Mood check-ins
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="break-reminders" defaultChecked />
                    <label htmlFor="break-reminders" className="text-sm">
                      Break reminders
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="focus-sessions" defaultChecked />
                    <label htmlFor="focus-sessions" className="text-sm">
                      Focus session alerts
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="insights" defaultChecked />
                    <label htmlFor="insights" className="text-sm">
                      Weekly insights
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-purple-600" />
                <span>Appearance & Accessibility</span>
              </CardTitle>
              <CardDescription>Customize the look and feel of MindMate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="font-medium">Theme</div>
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="justify-start bg-transparent">
                    ☀️ Light
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    🌙 Dark
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    🔄 Auto
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="font-medium">Color Scheme</div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="w-12 h-12 bg-emerald-500 rounded-lg cursor-pointer border-2 border-emerald-600"></div>
                  <div className="w-12 h-12 bg-blue-500 rounded-lg cursor-pointer"></div>
                  <div className="w-12 h-12 bg-purple-500 rounded-lg cursor-pointer"></div>
                  <div className="w-12 h-12 bg-orange-500 rounded-lg cursor-pointer"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Large Text</div>
                  <div className="text-sm text-gray-500">Increase text size for better readability</div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About MindMate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Version:</strong> 1.0.0
                </div>
                <div>
                  <strong>Last Updated:</strong> Today
                </div>
                <div>
                  <strong>AI Model:</strong> MindMate-GPT v2.1
                </div>
                <div>
                  <strong>Privacy Policy:</strong>{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    View
                  </a>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" size="sm">
                  📧 Contact Support
                </Button>
                <Button variant="outline" size="sm">
                  ⭐ Rate App
                </Button>
                <Button variant="outline" size="sm">
                  📖 User Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
