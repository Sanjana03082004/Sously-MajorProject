import clientPromise from "@/lib/mongo"
import { sendEscalationEmail } from "@/lib/mailer"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET() {
  const client = await clientPromise
  const db = client.db("mindmate")

  const now = new Date()
  const fiveMinutesAhead = new Date(now.getTime() + 5 * 60 * 1000)
  const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000)

  // Find uncompleted & unsent tasks within ±5min window
  const tasks = await db
    .collection("calendar")
    .find({
      completed: false,
      emailed: { $ne: true },
      time: { $lte: fiveMinutesAhead, $gte: twoMinutesAgo },
    })
    .toArray()

  for (const task of tasks) {
    try {
      await sendEscalationEmail({
        to: task.email || process.env.SMTP_USER, // fallback email
        subject: `MindMate Reminder: ${task.title}`,
        text: `Hey! It's time to complete your task: "${task.title}" scheduled for ${new Date(
          task.time
        ).toLocaleString()}.`,
      })

      await db
        .collection("calendar")
        .updateOne({ _id: new ObjectId(task._id) }, { $set: { emailed: true } })

      console.log(`✅ Reminder sent for: ${task.title}`)
    } catch (err) {
      console.error(`❌ Error sending reminder for ${task.title}:`, err)
    }
  }

  return NextResponse.json({ sent: tasks.length })
}
