import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { MongoClient } from "mongodb"

export async function GET() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error("❌ MONGODB_URI missing from environment")
    return NextResponse.json({ error: "Missing MONGODB_URI" }, { status: 500 })
  }

  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db("mindmate")
    const tasks = db.collection("calendar")

    const now = new Date()
    console.log("🕒 Current server time:", now.toISOString())

    const dueTasks = await tasks.find({
      emailed: false,
      time: { $lte: now },
    }).toArray()

    if (dueTasks.length === 0) {
      console.log("ℹ️ No reminders due.")
      return NextResponse.json({ message: "No reminders due." })
    }
    const port = Number(process.env.SMTP_PORT) || 465

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port,
  secure: port === 465, // true for SSL, false for TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // ignore self-signed cert issues
  },
})

   

    for (const task of dueTasks) {
      try {
        await transporter.sendMail({
          from: process.env.FROM_EMAIL || process.env.SMTP_USER,
          to: "sanjanamadpalwar@gmail.com",
          subject: `⏰ Reminder: ${task.title}`,
          text: `Hey Sanjana, it's time for: ${task.title}`,
        })

        await tasks.updateOne({ _id: task._id }, { $set: { emailed: true } })
        console.log(`✅ Reminder sent: ${task.title}`)
      } catch (mailErr) {
        console.error(`❌ Failed to send email for ${task.title}:`, mailErr)
      }
    }

    return NextResponse.json({
      message: `${dueTasks.length} reminder(s) processed.`,
    })
  } catch (err) {
    console.error("❌ General error in sendReminders:", err)
    return NextResponse.json({ error: "Failed to send reminders" }, { status: 500 })
  } finally {
    await client.close()
  }
}
