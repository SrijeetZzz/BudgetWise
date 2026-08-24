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


import dns from "node:dns";

import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { env } from "../env";

/* =====================================================
   DNS CONFIG
===================================================== */

/*
 * Prefer IPv4 before IPv6.
 *
 * This helps avoid the previous:
 *
 * ENETUNREACH ... IPv6-address:587
 */
dns.setDefaultResultOrder(
  "ipv4first",
);

/* =====================================================
   MAIL CONFIG LOG
===================================================== */

console.log(
  "MAIL CONFIG → INITIALIZING",
  {
    host: env.mail.host,

    port: env.mail.port,

    secure: env.mail.secure,

    user: env.mail.user,

    from: env.mail.from.email,
  },
);

/* =====================================================
   SMTP OPTIONS
===================================================== */

const smtpOptions: SMTPTransport.Options = {
  host: env.mail.host,

  port: Number(
    env.mail.port,
  ),

  /*
   * Port 587 uses STARTTLS.
   *
   * Therefore secure must be false.
   */
  secure: false,

  requireTLS: true,

  auth: {
    user: env.mail.user,

    pass: env.mail.password,
  },

  connectionTimeout: 30000,

  greetingTimeout: 30000,

  socketTimeout: 30000,
};

/* =====================================================
   NODEMAILER TRANSPORTER
===================================================== */

export const mailTransporter =
  nodemailer.createTransport(
    smtpOptions,
  );

/* =====================================================
   VERIFY SMTP CONNECTION
===================================================== */

mailTransporter
  .verify()
  .then(() => {
    console.log(
      "=================================",
    );

    console.log(
      "✅ MAIL → SMTP SERVER READY",
    );

    console.log(
      "=================================",
    );
  })
  .catch((error) => {
    console.error(
      "=================================",
    );

    console.error(
      "❌ MAIL → SMTP VERIFICATION FAILED",
    );

    console.error(
      "MESSAGE:",
      error?.message,
    );

    console.error(
      "CODE:",
      error?.code,
    );

    console.error(
      "COMMAND:",
      error?.command,
    );

    console.error(
      "RESPONSE:",
      error?.response,
    );

    console.error(
      "FULL ERROR:",
      error,
    );

    console.error(
      "=================================",
    );
  });