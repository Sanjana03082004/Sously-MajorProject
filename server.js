import { startCronJobs } from "./lib/cron.js"
import { spawn } from "child_process"

console.log("🚀 Starting Next.js + Cron background process...")

// Start Next.js dev server
const nextDev = spawn("npx", ["next", "dev", "-H", "0.0.0.0", "-p", "3000"], {
  stdio: "inherit",
  shell: true,
})

// Start background cron
startCronJobs()
