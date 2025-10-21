// import { NextResponse } from "next/server"
// import clientPromise from "@/lib/mongo"

// // ✅ GET → fetch all mood entries (or summarized stats if ?summary=true)
// export async function GET(req: Request) {
//   try {
//     const client = await clientPromise
//     const db = client.db("mindmate")
//     const url = new URL(req.url)
//     const summary = url.searchParams.get("summary")

//     if (summary) {
//       // Aggregate top negative reasons and mood counts
//       const agg = await db.collection("moods").aggregate([
//         {
//           $group: {
//             _id: "$reason",
//             count: { $sum: 1 },
//             moodList: { $addToSet: "$mood" },
//           },
//         },
//         { $sort: { count: -1 } },
//         { $limit: 10 },
//       ]).toArray()

//       const moodStats = await db.collection("moods").aggregate([
//         { $group: { _id: "$mood", count: { $sum: 1 } } },
//       ]).toArray()

//       return NextResponse.json({ topReasons: agg, moodStats })
//     }

//     // otherwise return full entries
//     const entries = await db.collection("moods")
//       .find({})
//       .sort({ date: -1 })
//       .toArray()

//     return NextResponse.json(entries)
//   } catch (err) {
//     console.error("❌ GET /api/moods failed:", err)
//     return NextResponse.json({ error: "Failed to fetch moods" }, { status: 500 })
//   }
// }

// // ✅ POST → save new mood or journal entry
// export async function POST(req: Request) {
//   try {
//     const body = await req.json()
//     const client = await clientPromise
//     const db = client.db("mindmate")

//     const doc = {
//       userId: body.userId || "default",
//       date: body.date ? new Date(body.date) : new Date(),
//       mood: body.mood || "neutral",
//       reason: body.reason || "",
//       journalText: body.journal || "",
//       summary: body.summary || "",
//       source: body.source || "checkin",
//       createdAt: new Date(),
//     }

//     const res = await db.collection("moods").insertOne(doc)
//     return NextResponse.json({ ...doc, _id: res.insertedId })
//   } catch (err) {
//     console.error("❌ POST /api/moods failed:", err)
//     return NextResponse.json({ error: "Failed to save mood entry" }, { status: 500 })
//   }
// }

import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongo"
import CryptoJS from "crypto-js"

const SECRET_KEY = process.env.ENCRYPTION_KEY || "fallback-key"

// 🔐 Encrypt helper
function encrypt(text: string) {
  if (!text) return ""
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString()
}

// 🔓 Decrypt helper
function decrypt(cipherText: string) {
  if (!cipherText) return ""
  try {
    // Only decrypt if it looks like encrypted data
    if (!cipherText.startsWith("U2FsdGVk")) {
      return cipherText
    }
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (err) {
    console.error("❌ Decryption error:", err)
    return cipherText // fallback: return original text
  }
}


// ✅ GET → fetch all mood entries
export async function GET(req: Request) {
  try {
    const client = await clientPromise
    const db = client.db("mindmate")
    const url = new URL(req.url)
    const summary = url.searchParams.get("summary")

    if (summary) {
      const agg = await db.collection("moods").aggregate([
        {
          $group: {
            _id: "$reason",
            count: { $sum: 1 },
            moodList: { $addToSet: "$mood" },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]).toArray()

      const moodStats = await db.collection("moods").aggregate([
        { $group: { _id: "$mood", count: { $sum: 1 } } },
      ]).toArray()

      // Decrypt top reasons (optional)
      const decryptedAgg = agg.map(item => ({
        ...item,
        _id: decrypt(item._id),
      }))

      return NextResponse.json({ topReasons: decryptedAgg, moodStats })
    }

    const entries = await db.collection("moods")
      .find({})
      .sort({ date: -1 })
      .toArray()

    // 🔓 Decrypt fields before sending to frontend
    const decryptedEntries = entries.map(entry => ({
      ...entry,
      reason: decrypt(entry.reason),
      journalText: decrypt(entry.journalText),
    }))

    return NextResponse.json(decryptedEntries)
  } catch (err) {
    console.error("❌ GET /api/moods failed:", err)
    return NextResponse.json({ error: "Failed to fetch moods" }, { status: 500 })
  }
}

// ✅ POST → save new mood or journal entry
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const client = await clientPromise
    const db = client.db("mindmate")

    const doc = {
      userId: body.userId || "default",
      date: body.date ? new Date(body.date) : new Date(),
      mood: body.mood || "neutral",
      // 🔐 Encrypt sensitive fields before storing
      reason: encrypt(body.reason || ""),
      journalText: encrypt(body.journal || ""),
      summary: body.summary || "",
      source: body.source || "checkin",
      createdAt: new Date(),
    }

    const res = await db.collection("moods").insertOne(doc)

    // Return decrypted version to frontend
    return NextResponse.json({
      ...doc,
      _id: res.insertedId,
      reason: decrypt(doc.reason),
      journalText: decrypt(doc.journalText),
    })
  } catch (err) {
    console.error("❌ POST /api/moods failed:", err)
    return NextResponse.json({ error: "Failed to save mood entry" }, { status: 500 })
  }
}