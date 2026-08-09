import nodemailer from 'nodemailer'

export class EmailNotConfiguredError extends Error {
  constructor() {
    super('Email is not configured. Set EMAIL_USER and EMAIL_PASS in your .env file (Gmail + App Password).')
    this.name = 'EmailNotConfiguredError'
  }
}

type SendOtpOptions = {
  /** Recipient — the email the user entered at signup */
  to: string
  otp: string
  subject?: string
}

/**
 * Sends an OTP to `to` (the account email).
 * EMAIL_USER / EMAIL_PASS are the SMTP sender account, not the recipient.
 */
export async function sendOtpEmail({ to, otp, subject = 'Your GBConnect verification code' }: SendOtpOptions) {
  const emailUser = process.env.EMAIL_USER?.trim()
  // Gmail app passwords are often copied with spaces — strip them
  const emailPass = process.env.EMAIL_PASS?.trim().replace(/\s+/g, '')
  const emailHost = process.env.EMAIL_HOST?.trim() || 'smtp.gmail.com'
  const emailPort = Number(process.env.EMAIL_PORT || 465)

  if (!emailUser || !emailPass) {
    console.error(`[Email] Cannot send OTP to ${to}: EMAIL_USER/EMAIL_PASS missing in .env`)
    throw new EmailNotConfiguredError()
  }

  const transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailPort === 465,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  })

  await transporter.sendMail({
    from: `GBConnect <${emailUser}>`,
    to,
    subject,
    text: `Your GBConnect verification code is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1a5c3a;">GBConnect</h2>
        <p>Use this code to verify your account for <strong>${to}</strong>:</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #1a5c3a;">${otp}</p>
        <p style="color: #666;">This code is valid for 10 minutes. If you did not sign up, you can ignore this email.</p>
      </div>
    `,
  })

  console.log(`[Email] OTP sent to signup email: ${to}`)
}
