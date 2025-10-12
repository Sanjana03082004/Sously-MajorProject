"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function useDailyRedirect() {
  const router = useRouter()

  useEffect(() => {
    async function checkDailyStatus() {
      try {
        const res = await fetch("/api/moods")
        const data = await res.json()
        const today = new Date().toDateString()
        const hasCheckedIn = data.some(
          (m: any) => new Date(m.createdAt).toDateString() === today
        )

        // if not checked in, redirect to insights page
        if (!hasCheckedIn) {
          router.push("/insights")
        }
      } catch (err) {
        console.error("⚠️ Daily redirect check failed:", err)
      }
    }

    checkDailyStatus()
  }, [router])
}
