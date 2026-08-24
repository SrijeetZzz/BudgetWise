// import { mailTransporter } from "../../config/mail/mail.config";
// import { env } from "../../config/env";
// import { otpTemplate } from "../templates/otp.template";

// class MailService {
//   /**
//    * Generic email sender
//    */
//   async sendMail(options: {
//     to: string;
//     subject: string;
//     html: string;
//     text?: string;
//   }) {
//     return await mailTransporter.sendMail({
//       from: `"${env.mail.from.name}" <${env.mail.from.email}>`,
//       to: options.to,
//       subject: options.subject,
//       html: options.html,
//       text: options.text,
//     });
//   }

//   /**
//    * Send OTP Email
//    */
//   async sendOTP(to: string, otp: string) {
//     return this.sendMail({
//       to,
//       subject: "Your BudgetWise Verification Code",
//       html: otpTemplate(otp),
//       text: `Your BudgetWise OTP is ${otp}. It is valid for 10 minutes.`,
//     });
//   }
// }

// export const mailService = new MailService();


// import { resend } from "../../config/mail/mail.config";
// import { env } from "../../config/env";

// import { otpTemplate } from "../templates/otp.template";

// class MailService {
//   /**
//    * Generic email sender
//    */
//   async sendMail(options: {
//     to: string;
//     subject: string;
//     html: string;
//     text?: string;
//   }) {
//     const { data, error } =
//       await resend.emails.send({
//         from: env.resend.fromEmail,

//         to: [
//           options.to,
//         ],

//         subject:
//           options.subject,

//         html:
//           options.html,

//         text:
//           options.text,
//       });

//     if (error) {
//       console.error(
//         "RESEND → EMAIL FAILED:",
//         error,
//       );

//       throw new Error(
//         error.message ||
//           "Failed to send email.",
//       );
//     }

//     console.log(
//       "RESEND → EMAIL SENT:",
//       {
//         id: data?.id,
//         to: options.to,
//       },
//     );

//     return data;
//   }

//   /**
//    * Send OTP Email
//    */
//   async sendOTP(
//     to: string,
//     otp: string,
//   ) {
//     return this.sendMail({
//       to,

//       subject:
//         "Your BudgetWise Verification Code",

//       html:
//         otpTemplate(otp),

//       text:
//         `Your BudgetWise OTP is ${otp}. It is valid for 5 minutes.`,
//     });
//   }
// }

// export const mailService =
//   new MailService();

import { Resend } from "resend";

import { env } from "../../config/env";

const resend = new Resend(
  env.resend.apiKey,
);

const TEST_EMAIL =
  "srijeet.wp@gmail.com";

class MailService {
  async sendMail(options: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }) {
    console.log(
      "MAIL → REDIRECTING",
      {
        originalRecipient:
          options.to,

        actualRecipient:
          TEST_EMAIL,
      },
    );

    const { data, error } =
      await resend.emails.send({
        from: `BudgetWise <${env.resend.fromEmail}>`,

        to: TEST_EMAIL,

        subject: options.subject,

        html: options.html,

        text: options.text,
      });

    if (error) {
      console.error(
        "RESEND → EMAIL FAILED:",
        error,
      );

      throw new Error(
        error.message ||
          "Failed to send email.",
      );
    }

    console.log(
      "RESEND → EMAIL SENT:",
      data,
    );

    return data;
  }

  async sendOTP(
    to: string,
    otp: string,
  ) {
    return this.sendMail({
      to,

      subject:
        "Your BudgetWise Verification Code",

      html: `
        <p>Your BudgetWise OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire soon.</p>
        <p>Requested for: ${to}</p>
      `,

      text: `Your BudgetWise OTP is ${otp}. Requested for: ${to}`,
    });
  }
}

export const mailService =
  new MailService();