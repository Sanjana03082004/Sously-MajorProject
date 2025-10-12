import clientPromise from "@/lib/mongo"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

// ✅ GET all tasks
export async function GET() {
  const client = await clientPromise
  const db = client.db("mindmate")

  const tasks = await db
    .collection("calendar")
    .find({})
    .sort({ createdAt: -1 })
    .toArray()

  return NextResponse.json(tasks)
}
// POST new task
export async function POST(req: Request) {
  const client = await clientPromise
  const db = client.db("mindmate")
  const body = await req.json()

  const newTask = {
    title: body.title,
    time: body.time ? new Date(body.time) : null,
    completed: false,
    emailed: false,
    createdAt: new Date(),
  }

  const result = await db.collection("calendar").insertOne(newTask)
  return NextResponse.json({ ...newTask, _id: result.insertedId })
}


export async function DELETE(req: Request) {
  try {
    const client = await clientPromise
    const db = client.db("mindmate")
    const { id } = await req.json()

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 })

    const result = await db.collection("calendar").deleteOne({ _id: new ObjectId(id) })
    if (result.deletedCount === 0)
      return NextResponse.json({ error: "Task not found" }, { status: 404 })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("❌ Delete error:", err)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
// ✅ PATCH – mark task as completed / update fields
export async function PATCH(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("mindmate");
    const { id, completed } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    // Force correct type for _id
    const _id = new ObjectId(id.toString());

    const result = await db.collection("calendar").updateOne(
      { _id },
      {
        $set: {
          completed: Boolean(completed),
          updatedAt: new Date(), // 👈 ensure it's always set
        },
      }
    );

    if (result.matchedCount === 0) {
      console.warn("⚠️ No task matched this ID:", id);
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Fetch the updated task to confirm it worked
    const updatedTask = await db.collection("calendar").findOne({ _id });

    return NextResponse.json({
      success: true,
      updatedTask,
    });
  } catch (err) {
    console.error("❌ Update error:", err);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

