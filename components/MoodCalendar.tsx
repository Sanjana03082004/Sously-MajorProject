"use client"

import { useMemo } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { Card } from "@/components/ui/card"

interface MoodEntry {
  _id?: string
  mood: string
  reason?: string
  createdAt: string
}

const moodEmojis: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  angry: "😡",
  anxious: "😰",
  tired: "🥱",
  hurt: "💔",
  peaceful: "😌",
  grateful: "🙏",
  confused: "😕",
  journal: "📝",
}

export function MoodCalendar({ moods }: { moods: MoodEntry[] }) {
  const moodMap = useMemo(() => {
    const map: Record<string, MoodEntry> = {}
    moods.forEach((m) => {
      const day = new Date(m.createdAt).toDateString()
      map[day] = m
    })
    return map
  }, [moods])

  return (
    <Card className="border border-pink-200 bg-white/80 p-4 rounded-2xl shadow-sm">
      <h2 className="text-lg font-semibold text-pink-600 mb-3 text-center">
        🌸 Mood Calendar
      </h2>
      <Calendar
        tileContent={({ date }) => {
          const entry = moodMap[date.toDateString()]
          if (entry) {
            const emoji = moodEmojis[entry.mood] || "🌈"
            return <div className="text-xl text-center">{emoji}</div>
          }
          return null
        }}
        className="rounded-lg border-0 mx-auto"
      />
      <p className="text-center text-sm text-gray-500 mt-2">
        Tap any date to reflect 🌿
      </p>
    </Card>
  )
}
