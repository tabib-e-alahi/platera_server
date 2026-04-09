// src/utils/email.util.ts

import nodemailer from "nodemailer";
import envConfig from "../config";

const transporter = nodemailer.createTransport({
  host: envConfig.SMTP_HOST,
  port: envConfig.SMTP_PORT,
  secure: envConfig.SMTP_PORT === 465, // true for 465, false for 587
  auth: {
    user: envConfig.SMTP_USER,
    pass: envConfig.SMTP_PASS,
  },
});


transporter.verify((error) => {
  if (error) {
    console.warn("[Email] SMTP connection failed:", error.message);
  } else {
    console.log("[Email] SMTP connected via Gmail.");
  }
});

interface ISendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (
  options: ISendEmailOptions
): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"Platera" <${envConfig.SMTP_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    console.log(
      `[Email] Sent to ${options.to} — "${options.subject}"`
    );
  } catch (error) {
    console.error(
      `[Email] Failed to send to ${options.to}:`,
      error
    );
  }
};