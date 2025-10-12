"use client"

import { useState, useCallback } from "react"

interface MoodData {
  score: number
  energy: "low" | "medium" | "high"
  emotions: string[]
  timestamp: Date
}

export function useMoodAnalysis() {
  const [currentMood, setCurrentMood] = useState<MoodData | null>(null)
  const [moodHistory, setMoodHistory] = useState<MoodData[]>([])

  const analyzeMood = useCallback((transcript: string, _audioData?: Blob) => {
    const positiveWords = ["good", "great", "happy", "excited", "wonderful", "amazing", "fantastic"]
    const negativeWords = ["bad", "sad", "tired", "stressed", "worried", "anxious", "frustrated"]
    const energyWords = ["energetic", "pumped", "motivated", "active", "dynamic"]
    const lowEnergyWords = ["tired", "exhausted", "drained", "sleepy", "lethargic"]

    const words = transcript.toLowerCase().split(" ")

    let score = 5
    let energy: "low" | "medium" | "high" = "medium"
    const emotions: string[] = []

    positiveWords.forEach((w) => words.includes(w) && ((score += 1.5), emotions.push("positive")))
    negativeWords.forEach((w) => words.includes(w) && ((score -= 1.5), emotions.push("negative")))

    if (energyWords.some((w) => words.includes(w))) {
      energy = "high"
      score += 0.5
    } else if (lowEnergyWords.some((w) => words.includes(w))) {
      energy = "low"
      score -= 0.5
    }

    score = Math.max(1, Math.min(10, score))
    const moodData: MoodData = {
      score: Math.round(score * 10) / 10,
      energy,
      emotions: [...new Set(emotions)],
      timestamp: new Date(),
    }

    setCurrentMood(moodData)
    setMoodHistory((prev) => {
      const updated = [...prev.slice(-6), moodData]
      localStorage.setItem("mindmate_mood_history", JSON.stringify(updated))
      return updated
    })

    localStorage.setItem("mindmate_mood_current", JSON.stringify(moodData))
    return moodData
  }, [])

  const loadMoodData = useCallback(() => {
    try {
      const current = localStorage.getItem("mindmate_mood_current")
      const history = localStorage.getItem("mindmate_mood_history")

      if (current) {
        setCurrentMood(JSON.parse(current))
      }
      if (history) {
        setMoodHistory(JSON.parse(history))
      }
    } catch (error) {
      console.error("Failed to load mood data:", error)
    }
  }, [])

  return {
    currentMood,
    moodHistory,
    analyzeMood,
    loadMoodData,
  }
}
