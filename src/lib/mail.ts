import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
export async function sendWelcomeEmail(to: string) {
    const ctaUrl = "https://calishub.com/tools/max-rep-estimator";

    await mailer.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject: "Welcome to CalisHub 🟣",
        text: [
            "Welcome to CalisHub!",
            "You're officially in.",
            "",
            "Start here (Max Rep Estimator):",
            ctaUrl,
            "",
            "Let’s build strength the smart way 💪",
        ].join("\n"),
        html: `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Welcome to CalisHub</title>
    <style>
      /* Some clients support this; layout still works without it */
      @media (max-width: 640px) {
        .container { width: 100% !important; }
        .px { padding-left: 18px !important; padding-right: 18px !important; }
        .h1 { font-size: 24px !important; line-height: 30px !important; }
        .sub { font-size: 14px !important; line-height: 22px !important; }
        .btn { display: block !important; width: 100% !important; }
      }
    </style>
  </head>

  <body style="margin:0;padding:0;background:#0b0b12;">
    <!-- Preheader (hidden preview text) -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      Your CalisHub access is live. Start with the Max Rep Estimator 💪
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#0b0b12;">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <!-- Container -->
          <table role="presentation" class="container" width="600" cellspacing="0" cellpadding="0" border="0"
            style="width:600px;max-width:600px;background:#0f1020;border:1px solid rgba(168,85,247,0.20);border-radius:18px;overflow:hidden;">
            
            <!-- Top gradient bar -->
            <tr>
              <td style="background:linear-gradient(90deg,#a855f7,#d946ef);padding:1px;"></td>
            </tr>

            <!-- Header -->
            <tr>
              <td class="px" style="padding:26px 28px 12px 28px;">
                <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#ffffff;">
                  <div style="font-size:13px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.70);">
                    CalisHub
                  </div>

                  <div class="h1" style="margin:10px 0 8px 0;font-size:28px;line-height:34px;font-weight:750;">
                    Welcome to CalisHub 🟣
                  </div>

                  <div class="sub" style="font-size:15px;line-height:24px;color:rgba(255,255,255,0.78);">
                    You’re officially in. Let’s build strength the smart way.
                  </div>
                </div>
              </td>
            </tr>

            <!-- Content card -->
            <tr>
              <td class="px" style="padding:12px 28px 22px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                  style="background:#111227;border:1px solid rgba(255,255,255,0.08);border-radius:14px;">
                  <tr>
                    <td style="padding:18px 18px 16px 18px;">
                      <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#ffffff;">
                        <div style="font-size:16px;line-height:24px;font-weight:700;margin:0 0 6px 0;">
                          Start here
                        </div>

                        <div style="font-size:14px;line-height:22px;color:rgba(255,255,255,0.75);margin:0 0 14px 0;">
                          Get your estimated max strength and a progression direction in under a minute.
                        </div>

                        <!-- Button -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="border-radius:12px;" bgcolor="#a855f7">
                              <a class="btn" href="${ctaUrl}" target="_blank"
                                style="display:inline-block;padding:12px 16px;border-radius:12px;
                                       font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
                                       font-size:14px;font-weight:700;color:#0b0b12;text-decoration:none;">
                                Try the Max Rep Estimator →
                              </a>
                            </td>
                          </tr>
                        </table>

                        <div style="margin-top:12px;font-size:12px;line-height:18px;color:rgba(255,255,255,0.55);">
                          Or copy/paste: <a href="${ctaUrl}" target="_blank" style="color:#d946ef;text-decoration:none;">${ctaUrl}</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Small tips -->
                <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
                            margin-top:16px;color:rgba(255,255,255,0.72);font-size:13px;line-height:20px;">
                  <div style="margin:0 0 8px 0;font-weight:700;color:rgba(255,255,255,0.86);">Quick tip 💡</div>
                  <div style="margin:0;">
                    After you get your result, focus on <b>quality reps</b> and progressive overload. Consistency beats chaos.
                  </div>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td class="px" style="padding:18px 28px 24px 28px;border-top:1px solid rgba(255,255,255,0.08);">
                <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
                            font-size:12px;line-height:18px;color:rgba(255,255,255,0.55);">
                  You received this because you subscribed on CalisHub.
                  <br />
                  If this wasn’t you, you can ignore this email.
                  <br /><br />
                  <span style="color:rgba(255,255,255,0.40);">© ${new Date().getFullYear()} CalisHub</span>
                </div>
              </td>
            </tr>

          </table>

          <!-- tiny spacing -->
          <div style="height:14px;"></div>

          <!-- optional “view in browser” area (kept minimal) -->
          <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
                      font-size:11px;line-height:16px;color:rgba(255,255,255,0.45);">
            Sent with 🟣 energy.
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>
    `,
    });
}
