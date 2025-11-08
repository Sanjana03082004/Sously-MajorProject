import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import clientPromise from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await req.json();
    const client = await clientPromise;
    const db = client.db("mindmate");
    const user = await db.collection("users").findOne({ email: session.user.email });

    if (!user?.emergencyContacts?.length) {
      return NextResponse.json({ error: "No emergency contacts" }, { status: 400 });
    }

    // 💌 configure mail transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_USER,
pass: process.env.SMTP_PASS,

      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.emergencyContacts
  .filter((c: any) => c.email)   // ✅ only valid emails
  .map((c: any) => c.email),
      subject: "🚨 Emergency Alert from Soulsy",
      text: `This is an emergency alert. Message: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Emergency alert failed:", err);
    return NextResponse.json({ error: "Failed to send alert" }, { status: 500 });
  }
}
