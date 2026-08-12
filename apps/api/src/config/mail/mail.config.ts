import nodemailer from "nodemailer";
import { env } from "../env";

export const mailTransporter = nodemailer.createTransport({
  host: env.mail.host,
  port: env.mail.port,
  secure: env.mail.secure,
  auth: {
    user: env.mail.user,
    pass: env.mail.password,
  },
});

// Verify SMTP connection (Development only)
mailTransporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail transporter failed:", error);
  } else {
    console.log("✅ Mail server is ready.");
  }
});