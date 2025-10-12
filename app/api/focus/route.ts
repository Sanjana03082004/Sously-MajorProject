import clientPromise from "@/lib/mongo"
import { NextResponse } from "next/server"

export async function GET() {
  const client = await clientPromise
  const db = client.db("mindmate")

  // Example: calculate total focus time (in seconds)
  const sessions = await db.collection("focusSessions").find({}).toArray()
  const totalFocusTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0)

  return NextResponse.json({ totalFocusTime })
}
