export const otpTemplate = (otp: string): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>BudgetWise OTP</title>
      </head>

      <body
        style="
          margin:0;
          padding:0;
          background:#f3f4f6;
          font-family:Arial, Helvetica, sans-serif;
        "
      >
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="padding:40px 0;"
        >
          <tr>
            <td align="center">

              <table
                width="600"
                cellpadding="0"
                cellspacing="0"
                style="
                  background:#ffffff;
                  border-radius:12px;
                  overflow:hidden;
                  border:1px solid #e5e7eb;
                "
              >

                <tr>
                  <td
                    align="center"
                    style="
                      background:#2563eb;
                      color:#ffffff;
                      padding:24px;
                      font-size:28px;
                      font-weight:bold;
                    "
                  >
                    BudgetWise
                  </td>
                </tr>

                <tr>
                  <td style="padding:40px;">

                    <h2 style="margin-top:0;color:#111827;">
                      Verify your email
                    </h2>

                    <p style="font-size:16px;color:#374151;">
                      Use the following One-Time Password (OTP) to continue.
                    </p>

                    <div
                      style="
                        margin:32px 0;
                        text-align:center;
                        font-size:36px;
                        font-weight:bold;
                        letter-spacing:10px;
                        color:#2563eb;
                      "
                    >
                      ${otp}
                    </div>

                    <p style="font-size:15px;color:#374151;">
                      This OTP is valid for
                      <strong>10 minutes</strong>.
                    </p>

                    <p style="font-size:15px;color:#374151;">
                      If you didn't request this code, you can safely ignore this email.
                    </p>

                  </td>
                </tr>

                <tr>
                  <td
                    align="center"
                    style="
                      padding:20px;
                      background:#f9fafb;
                      font-size:13px;
                      color:#6b7280;
                    "
                  >
                    © ${new Date().getFullYear()} BudgetWise. All Rights Reserved.
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};