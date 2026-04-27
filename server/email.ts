import nodemailer from "nodemailer";
import { ENV } from "./_core/env";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: ENV.smtpHost,
      port: ENV.smtpPort,
      secure: ENV.smtpPort === 465, // true for 465 (SSL), false for 587 (TLS)
      auth: {
        user: ENV.smtpUser,
        pass: ENV.smtpPass,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certs
      },
    });
  }
  return transporter;
}

export interface ContactEmailData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  messageType: string;
  message: string;
}

const messageTypeLabels: Record<string, string> = {
  inquiry: "استفسار",
  quote: "طلب عرض سعر",
  complaint: "شكوى",
  suggestion: "اقتراح",
};

export async function sendContactNotification(data: ContactEmailData): Promise<boolean> {
  if (!ENV.smtpHost || !ENV.smtpUser || !ENV.smtpPass || !ENV.smtpTo) {
    console.warn("[Email] SMTP not configured, skipping email notification");
    return false;
  }

  try {
    const typeLabel = messageTypeLabels[data.messageType] || data.messageType;

    const htmlBody = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; direction: rtl; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: #0A1F3D; color: #fff; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 20px; }
    .header p { margin: 4px 0 0; color: #C8A23A; font-size: 14px; }
    .body { padding: 24px; }
    .field { margin-bottom: 16px; border-bottom: 1px solid #eee; padding-bottom: 16px; }
    .field:last-child { border-bottom: none; }
    .label { font-size: 12px; color: #888; margin-bottom: 4px; }
    .value { font-size: 15px; color: #222; font-weight: 500; }
    .message-box { background: #f9f9f9; border-right: 4px solid #C8A23A; padding: 12px 16px; border-radius: 4px; }
    .footer { background: #f5f5f5; padding: 16px; text-align: center; font-size: 12px; color: #888; }
    .badge { display: inline-block; background: #C8A23A; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 رسالة جديدة من نموذج التواصل</h1>
      <p>شركة مأرب للتأمين</p>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">نوع الرسالة</div>
        <div class="value"><span class="badge">${typeLabel}</span></div>
      </div>
      <div class="field">
        <div class="label">الاسم</div>
        <div class="value">${data.name}</div>
      </div>
      <div class="field">
        <div class="label">البريد الإلكتروني</div>
        <div class="value">${data.email}</div>
      </div>
      <div class="field">
        <div class="label">رقم الهاتف</div>
        <div class="value">${data.phone}</div>
      </div>
      <div class="field">
        <div class="label">الموضوع</div>
        <div class="value">${data.subject}</div>
      </div>
      <div class="field">
        <div class="label">الرسالة</div>
        <div class="message-box">${data.message.replace(/\n/g, "<br>")}</div>
      </div>
    </div>
    <div class="footer">
      تم الإرسال من موقع شركة مأرب للتأمين — ${new Date().toLocaleString("ar-YE")}
    </div>
  </div>
</body>
</html>`;

    await getTransporter().sendMail({
      from: `"موقع مأرب للتأمين" <${ENV.smtpUser}>`,
      to: ENV.smtpTo,
      subject: `📩 رسالة جديدة: ${data.subject} — ${typeLabel}`,
      html: htmlBody,
      replyTo: data.email,
    });

    console.log(`[Email] Contact notification sent to ${ENV.smtpTo}`);
    return true;
  } catch (err) {
    console.error("[Email] Failed to send contact notification:", err);
    return false;
  }
}
