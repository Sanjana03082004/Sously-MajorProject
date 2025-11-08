// import cron from "node-cron"
// import nodemailer from "nodemailer"
// import { MongoClient } from "mongodb"

// const client = new MongoClient(process.env.MONGODB_URI!)
// await client.connect()
// const db = client.db("mindmate")
// const tasks = db.collection("calendar")

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT),
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// })

// cron.schedule("* * * * *", async () => {
//   const now = new Date()
//   const due = await tasks.find({ emailed: false, time: { $lte: now.toISOString() } }).toArray()

//   for (const task of due) {
//     await transporter.sendMail({
//       from: process.env.FROM_EMAIL,
//       to: "sanjanamadpalwar@gmail.com",
//       subject: `⏰ Reminder: ${task.title}`,
//       text: `Hey Sanjana, it's time for: ${task.title}`,
//     })
//     await tasks.updateOne({ _id: task._id }, { $set: { emailed: true } })
//     console.log("✅ Email sent:", task.title)
//   }
// })
import cron from "node-cron";
import nodemailer from "nodemailer";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = "mindmate";

let client: MongoClient | null = null;

// ✅ Version-safe connection (works for MongoDB Node v6+)
async function getTasksCollection() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  const db = client.db(dbName);
  return db.collection("calendar");
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 🕒 Run every minute
cron.schedule("* * * * *", async () => {
  try {
    const tasks = await getTasksCollection();
    const now = new Date();

    const due = await tasks
      .find({ emailed: false, time: { $lte: now.toISOString() } })
      .toArray();

    for (const task of due) {
      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: "sanjanamadpalwar@gmail.com",
        subject: `⏰ Reminder: ${task.title}`,
        text: `Hey Sanjana, it's time for: ${task.title}`,
      });

      await tasks.updateOne({ _id: task._id }, { $set: { emailed: true } });
      console.log("✅ Email sent:", task.title);
    }
  } catch (err) {
    console.error("❌ Scheduler error:", err);
  }
});
