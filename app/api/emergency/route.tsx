import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { encrypt, decrypt } from "@/lib/crypto"; // 👈 you’ll create this
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.ENCRYPTION_KEY || "your-strong-secret-key";

function decrypt(cipherText: string) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error("❌ Decryption error:", err);
    return "";
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json([], { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("mindmate");

    const user = await db.collection("users").findOne({ email: session.user.email });

    if (!user?.emergencyContacts) {
      return NextResponse.json([]);
    }

    const decryptedContacts = user.emergencyContacts.map((c: any) => ({
      _id: c._id,
      name: decrypt(c.name),
      phone: decrypt(c.phone),
      relation: decrypt(c.relation),
    }));

    return NextResponse.json(decryptedContacts);
  } catch (err) {
    console.error("❌ GET /api/emergency failed:", err);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}



// 🛡️ POST → Encrypt and save new emergency contact
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;
    const { name, phone, relation } = await req.json();

    const newContact = {
      _id: crypto.randomUUID(),
      name: encrypt(name),
      phone: encrypt(phone),
      relation: encrypt(relation),
    };

    const client = await clientPromise;
    const db = client.db("mindmate");
    const users = db.collection("users");

    // STEP 1: Ensure emergencyContacts array exists
    await users.updateOne(
      { email, emergencyContacts: { $exists: false } },
      { $set: { emergencyContacts: [] } }
    );

    // STEP 2: Push the new contact
    await users.updateOne(
      { email },
      { $push: { emergencyContacts: newContact }  as any}
    );

    return NextResponse.json({ ...newContact, name, phone, relation });
  } catch (err) {
    console.error("❌ POST /api/emergency failed:", err);
    return NextResponse.json({ error: "Failed to save contact" }, { status: 500 });
  }
}
