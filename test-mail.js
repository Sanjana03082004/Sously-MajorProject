import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "sanjanamadpalwar@gmail.com",
    pass: "tiuodseshbczazzx", // 👈 paste app password here
  },
})

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email config failed:", error)
  } else {
    console.log("✅ Email config is working!")
  }
})
