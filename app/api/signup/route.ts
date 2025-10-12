import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import bcrypt from "bcryptjs";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(1, "Required").max(80),
  phone: z.string().min(7, "Too short").max(20),
  relation: z.string().max(40).optional().or(z.literal("")),
});

const BodySchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  age: z.coerce.number().int().min(10).max(120),
  gender: z.enum(["female", "male", "nonbinary", "prefer_not_to_say"]),
  contacts: z.array(ContactSchema).max(3),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = BodySchema.parse(json);

    const client = await clientPromise;
    const db = client.db(); // database from your MONGODB_URI (e.g., mindmate)
    const users = db.collection("users");

    const email = data.email.toLowerCase();
    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json({ ok: false, error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const doc = {
      name: data.name,
      email,
      passwordHash,
      age: data.age,
      gender: data.gender,
      emergencyContacts: data.contacts
        .filter((c) => c.name && c.phone)
        .slice(0, 3),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await users.insertOne(doc);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.issues) {
      return NextResponse.json({ ok: false, error: "Invalid input", details: err.issues }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
