// import nodemailer from "nodemailer";
// import { env } from "../env";

// export const mailTransporter = nodemailer.createTransport({
//   host: env.mail.host,
//   port: env.mail.port,
//   secure: env.mail.secure,
//   auth: {
//     user: env.mail.user,
//     pass: env.mail.password,
//   },
// });

// // Verify SMTP connection (Development only)
// mailTransporter.verify((error, success) => {
//   if (error) {
//     console.error("❌ Mail transporter failed:", error);
//   } else {
//     console.log("✅ Mail server is ready.");
//   }
// });

import { Resend } from "resend";

import { env } from "../env";

/* =====================================================
   RESEND CONFIG
===================================================== */

console.log(
  "RESEND → INITIALIZING",
  {
    fromEmail: env.resend.fromEmail,
  },
);

/* =====================================================
   RESEND CLIENT
===================================================== */

export const resend = new Resend(
  env.resend.apiKey,
);