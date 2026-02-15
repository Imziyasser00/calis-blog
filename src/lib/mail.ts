import nodemailer from "nodemailer";

const SITE_URL = "https://www.calishub.com";

/**
 * SMTP Transport
 * - 465 => secure true
 * - 587 => secure false
 */
export const mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

function withUtm(url: string) {
    const u = new URL(url);
    u.searchParams.set("utm_source", "welcome");
    u.searchParams.set("utm_medium", "email");
    u.searchParams.set("utm_campaign", "onboarding");
    return u.toString();
}

function esc(s: string) {
    return s
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

export async function sendWelcomeEmail(to: string) {
    const links = {
        maxRep: withUtm(`${SITE_URL}/tools/max-rep-estimator`),
        workoutGen: withUtm(`${SITE_URL}/tools/workout-generator`),
        pullDiag: withUtm(`${SITE_URL}/tools/pull-up-diagnostic`),
        beginnerGuide: withUtm(`${SITE_URL}/beginner-calisthenics`),
        library: withUtm(`${SITE_URL}/library`),
        pullupPassport: withUtm(`${SITE_URL}/library/pullup-passport`),
    };

    const year = new Date().getFullYear();

    const subject = "Welcome to CalisHub 🟣 Your clean start plan (2 minutes)";
    const preheader =
        "Measure your level → generate a plan → fix your bottleneck. Clean, simple, effective.";

    const text = [
        "Welcome to CalisHub 🟣",
        "",
        "Here’s your clean start plan (2 minutes):",
        `1) Measure your level: ${links.maxRep}`,
        `2) Generate your plan: ${links.workoutGen}`,
        `3) Fix your bottleneck: ${links.pullDiag}`,
        "",
        "If you’re starting from zero:",
        `Beginner Guide: ${links.beginnerGuide}`,
        "",
        "Want a simple roadmap PDF?",
        `Beginner Strength Passport: ${links.pullupPassport}`,
        "",
        "Quick rules:",
        "- Train 3x/week",
        "- Stop 1–2 reps before failure",
        "- Add a little each week",
        "",
        `Library: ${links.library}`,
        "",
        `© ${year} CalisHub`,
    ].join("\n");

    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${esc(subject)}</title>
    <style>
      @media (max-width: 640px) {
        .container { width: 100% !important; }
        .px { padding-left: 18px !important; padding-right: 18px !important; }
        .h1 { font-size: 22px !important; line-height: 28px !important; }
        .sub { font-size: 14px !important; line-height: 22px !important; }
        .btn { display:block !important; width:100% !important; }
        .col { display:block !important; width:100% !important; padding:0 !important; }
        .sp { height: 10px !important; }
      }
    </style>
  </head>

  <body style="margin:0;padding:0;background:#0b0b12;">
    <!-- Preheader -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${esc(preheader)}
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#0b0b12;">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <!-- Container -->
          <table role="presentation" class="container" width="600" cellspacing="0" cellpadding="0" border="0"
            style="width:600px;max-width:600px;background:#0f1020;border:1px solid rgba(168,85,247,0.22);border-radius:18px;overflow:hidden;">

            <!-- Top gradient bar -->
            <tr>
              <td style="background:linear-gradient(90deg,#a855f7,#d946ef);padding:1px;"></td>
            </tr>

            <!-- Header -->
            <tr>
              <td class="px" style="padding:26px 28px 12px 28px;">
                <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#ffffff;">
                  <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.70);">
                    CalisHub
                  </div>

                  <div class="h1" style="margin:10px 0 8px 0;font-size:28px;line-height:34px;font-weight:800;">
                    Welcome 🟣 Let’s make progress… cleanly.
                  </div>

                  <div class="sub" style="font-size:15px;line-height:24px;color:rgba(255,255,255,0.78);">
                    No chaos workouts. No random grinding. Just a simple system:
                    <b>measure</b> → <b>plan</b> → <b>progress</b>.
                  </div>
                </div>
              </td>
            </tr>

            <!-- Main CTA Card -->
            <tr>
              <td class="px" style="padding:12px 28px 18px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                  style="background:#111227;border:1px solid rgba(255,255,255,0.08);border-radius:14px;">
                  <tr>
                    <td style="padding:18px 18px 16px 18px;">
                      <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#ffffff;">

                        <div style="font-size:16px;line-height:24px;font-weight:900;margin:0 0 6px 0;">
                          Your 2-minute start plan
                        </div>
                        <div style="font-size:13px;line-height:20px;color:rgba(255,255,255,0.72);margin:0 0 14px 0;">
                          Do these in order. You’ll instantly know what to train next.
                        </div>

                        <!-- 3 steps (clean grid) -->
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td class="col" style="width:33.33%;padding:0 8px 0 0;margin: 0 0 5px 0;vertical-align:top;">
                              <div style="padding:12px;border:1px solid rgba(255,255,255,0.08);border-radius:12px;background:rgba(255,255,255,0.02);">
                                <div style="font-weight:900;font-size:13px;letter-spacing:0.02em;">1) Measure</div>
                                <div style="margin-top:6px;color:rgba(255,255,255,0.70);font-size:12.5px;line-height:18px;">
                                  Estimate your max strength from clean reps.
                                </div>
                                <div style="margin-top:10px;">
                                  <a href="${links.maxRep}" target="_blank"
                                    style="color:#d946ef;text-decoration:none;font-weight:900;font-size:13px;">
                                    Max Rep Estimator →
                                  </a>
                                </div>
                              </div>
                            </td>

                            <td class="sp" style="display:none;height:0;"></td>

                            <td class="col" style="width:33.33%;padding:0 8px;vertical-align:top;">
                              <div style="padding:12px;border:1px solid rgba(255,255,255,0.08);border-radius:12px;background:rgba(255,255,255,0.02);">
                                <div style="font-weight:900;font-size:13px;letter-spacing:0.02em;">2) Plan</div>
                                <div style="margin-top:6px;color:rgba(255,255,255,0.70);font-size:12.5px;line-height:18px;">
                                  Generate a routine that fits your level.
                                </div>
                                <div style="margin-top:10px;">
                                  <a href="${links.workoutGen}" target="_blank"
                                    style="color:#d946ef;text-decoration:none;font-weight:900;font-size:13px;">
                                    Workout Generator →
                                  </a>
                                </div>
                              </div>
                            </td>

                            <td class="sp" style="display:none;height:0;"></td>

                            <td class="col" style="width:33.33%;padding:0 0 0 8px;vertical-align:top;">
                              <div style="padding:12px;border:1px solid rgba(255,255,255,0.08);border-radius:12px;background:rgba(255,255,255,0.02);">
                                <div style="font-weight:900;font-size:13px;letter-spacing:0.02em;">3) Fix</div>
                                <div style="margin-top:6px;color:rgba(255,255,255,0.70);font-size:12.5px;line-height:18px;">
                                  Find what’s blocking your pull-ups.
                                </div>
                                <div style="margin-top:10px;">
                                  <a href="${links.pullDiag}" target="_blank"
                                    style="color:#d946ef;text-decoration:none;font-weight:900;font-size:13px;">
                                    Pull-Up Diagnostic →
                                  </a>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </table>

                        <!-- Primary CTA button -->
                        <div style="margin-top:16px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td bgcolor="#a855f7" style="border-radius:12px;">
                                <a class="btn" href="${links.maxRep}" target="_blank"
                                  style="display:inline-block;width:100%;text-align:center;padding:12px 16px;border-radius:12px;
                                    font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
                                    font-size:14px;font-weight:950;color:#0b0b12;text-decoration:none;">
                                  Start now: Max Rep Estimator →
                                </a>
                              </td>
                            </tr>
                          </table>

                          <div style="margin-top:10px;font-size:12px;line-height:18px;color:rgba(255,255,255,0.55);">
                            Quick link: <a href="${links.maxRep}" target="_blank" style="color:#d946ef;text-decoration:none;">${links.maxRep}</a>
                          </div>
                        </div>

                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- “If you're a beginner” + “Quick rules” -->
            <tr>
              <td class="px" style="padding:0 28px 18px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                  style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:14px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#ffffff;">
                        <div style="font-size:14px;font-weight:950;margin:0 0 6px 0;">
                          If you’re starting from zero
                        </div>
                        <div style="font-size:13px;line-height:20px;color:rgba(255,255,255,0.72);margin:0 0 12px 0;">
                          Use the Beginner Guide as your base, and grab the Passport for a simple roadmap you can follow.
                        </div>

                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="border-radius:12px;" bgcolor="rgba(217,70,239,0.14)">
                              <a class="btn" href="${links.beginnerGuide}" target="_blank"
                                style="display:inline-block;padding:10px 14px;border-radius:12px;
                                  font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
                                  font-size:13px;font-weight:950;color:#ffffff;text-decoration:none;border:1px solid rgba(217,70,239,0.32);">
                                Open Beginner Guide →
                              </a>
                            </td>
                            <td style="width:10px;"></td>
                            <td style="border-radius:12px;" bgcolor="rgba(168,85,247,0.14)">
                              <a class="btn" href="${links.pullupPassport}" target="_blank"
                                style="display:inline-block;padding:10px 14px;border-radius:12px;
                                  font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
                                  font-size:13px;font-weight:950;color:#ffffff;text-decoration:none;border:1px solid rgba(168,85,247,0.32);">
                                Get the Passport PDF →
                              </a>
                            </td>
                          </tr>
                        </table>

                        <div style="margin-top:14px;">
                          <div style="font-size:13px;font-weight:950;margin:0 0 6px 0;">3 rules that actually work</div>
                          <ul style="margin:0;padding:0 0 0 16px;color:rgba(255,255,255,0.72);font-size:13px;line-height:20px;">
                            <li><b>3x/week</b> beats 7x/week chaos.</li>
                            <li>Stop with <b>1–2 reps in reserve</b> (clean form).</li>
                            <li>Add <b>a little</b> each week: reps, tempo, or harder variation.</li>
                          </ul>
                        </div>

                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Secondary links -->
            <tr>
              <td class="px" style="padding:0 28px 22px 28px;">
                <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
                  <div style="font-size:13px;color:rgba(255,255,255,0.70);line-height:20px;">
                    Explore more: <a href="${links.library}" target="_blank" style="color:#d946ef;text-decoration:none;font-weight:900;">Library →</a>
                  </div>
                  <div style="margin-top:10px;font-size:12px;color:rgba(255,255,255,0.58);line-height:18px;">
                    Tip: if you reply with your goal (<b>first push-up</b> / <b>first pull-up</b> / <b>muscle-up</b> / <b>aesthetics</b>),
                    you can build a better onboarding sequence later.
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
                  © ${year} CalisHub
                </div>
              </td>
            </tr>

          </table>

          <div style="height:14px;"></div>

          <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
                      font-size:11px;line-height:16px;color:rgba(255,255,255,0.45);">
            Sent with 🟣 energy.
          </div>

        </td>
      </tr>
    </table>
  </body>
</html>`;

    await mailer.sendMail({
        from: process.env.MAIL_FROM, // e.g. 'CalisHub 🟣 <hello@calishub.com>'
        to,
        subject,
        text,
        html,
        replyTo: process.env.MAIL_REPLY_TO ?? process.env.MAIL_FROM,
        // Optional: add one-click unsubscribe if you have a URL.
        headers: process.env.MAIL_LIST_UNSUBSCRIBE_URL
            ? {
                "List-Unsubscribe": `<${process.env.MAIL_LIST_UNSUBSCRIBE_URL}>`,
                "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            }
            : undefined,
    });
}
