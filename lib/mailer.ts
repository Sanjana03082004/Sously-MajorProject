import nodemailer from "nodemailer"

const SMTP_HOST = process.env.SMTP_HOST!
const SMTP_PORT = Number(process.env.SMTP_PORT || 587)
const SMTP_USER = process.env.SMTP_USER!
const SMTP_PASS = process.env.SMTP_PASS!
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER

export async function sendEscalationEmail(opts: { to: string; subject: string; text: string }) {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  return transporter.sendMail({
    from: FROM_EMAIL,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
  })
}
