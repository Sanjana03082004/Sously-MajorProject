import fetch from "node-fetch"

export function startCronJobs() {
  console.log("⏰ Background email scheduler started!")

  // Check every 60 seconds
  setInterval(async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cron/sendReminders")
      const data = await res.json()
      if (data.message) {
        console.log("📨", new Date().toLocaleTimeString(), "-", data.message)
      }
    } catch (err) {
      console.error("❌ Cron job error:", err.message)
    }
  }, 60 * 1000)
}
