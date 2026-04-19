// src/utils/emailTemplates.util.ts

import envConfig from "../config";
import { sendEmail } from "./email.utils";

type TAdminProviderApprovalRequestEmailData = {
  providerName: string;
  providerEmail: string;
  providerPhone?: string | null;
  businessName: string;
  businessCategory: string;
  businessEmail: string;
  city: string;
  street: string;
  houseNumber: string;
  apartment?: string | null;
  postalCode: string;
  binNumber?: string | null;
};


export const emailTemplates = {
  providerRegistered: (name: string) => ({
    subject: "Welcome to Platera — Please verify your email",
    html: `
      <h2>Hi ${name},</h2>
      <p>Thank you for creating a Platera provider account.</p>
      <p>Please verify your email address to continue.
         After verification, log in and complete your 
         provider profile to request approval.</p>
      <p>— The Platera Team</p>
    `,
  }),

  providerProfileApproved: (name: string) => ({
    subject: "Your Platera provider profile is approved!",
    html: `
      <h2>Congratulations ${name}!</h2>
      <p>Your provider profile has been approved by our team.</p>
      <p>You can now log in and start listing your meals.</p>
      <a href="${envConfig.frontend_local_host}/provider-dashboard/profile">
        Go to your dashboard
      </a>
      <p>— The Platera Team</p>
    `,
  }),

  providerProfileRejected: (name: string, reason: string) => ({
    subject: "Update on your Platera provider profile",
    html: `
      <h2>Hi ${name},</h2>
      <p>Unfortunately we could not approve your provider 
         profile at this time.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>You can log in, update your profile based on the 
         feedback above, and resubmit for approval.</p>
      <a href="${envConfig.frontend_local_host}/provider-dashboard/profile">
        Update your profile
      </a>
      <p>— The Platera Team</p>
    `,
  }),

  adminProviderApprovalRequest: (data: TAdminProviderApprovalRequestEmailData) => ({
    subject: "New provider approval request",
    html: `
      <h2>Provider Approval Request</h2>

      <p><strong>Provider Name:</strong> ${data.providerName}</p>
      <p><strong>Provider Email:</strong> ${data.providerEmail}</p>
      <p><strong>Provider Phone:</strong> ${data.providerPhone ?? "N/A"}</p>

      <hr />

      <p><strong>Business Name:</strong> ${data.businessName}</p>
      <p><strong>Business Type:</strong> ${data.businessCategory}</p>
      <p><strong>Business Email:</strong> ${data.businessEmail}</p>
      <p><strong>BIN:</strong> ${data.binNumber ?? "N/A"}</p>

      <hr />

      <p><strong>District:</strong> ${data.city}</p>
      <p><strong>Street:</strong> ${data.street}</p>
      <p><strong>House Number:</strong> ${data.houseNumber}</p>
      <p><strong>Apartment:</strong> ${data.apartment ?? "N/A"}</p>
      <p><strong>Postal Code:</strong> ${data.postalCode}</p>

      <br />

      <a href="${envConfig.frontend_local_host}/admin-dashboard/provider-request">
        Review in admin panel
      </a>
    `,
  }),

  emailVerificationOTP: (name: string, otp: string) => ({
    subject: "Verify your Platera account",
    html: `
      <div style="font-family: Arial, sans-serif; color:#111;">
        <h2>Hi ${name},</h2>
        <p>Welcome to <strong>Platera</strong> 🍽️</p>
        <p>Use the code below to verify your email:</p>

        <div style="
          margin: 24px 0;
          padding: 16px;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 6px;
          text-align:center;
          background:#FFF7EA;
          color:#D99017;
          border-radius:12px;
        ">
          ${otp}
        </div>

        <p>This code will expire in 2 minutes.</p>
        <p>If you didn’t request this, ignore this email.</p>

        <p>— Platera Team</p>
      </div>
    `,
  }),
};

// ─── Convenience senders ──────────────────────────────────────────────────────
// These combine template + sendEmail into a single call
// Usage: await sendProviderApprovedEmail("John", "john@email.com")

export const sendProviderRegisteredEmail = async (
  name: string,
  email: string
): Promise<void> => {
  const template = emailTemplates.providerRegistered(name);
  await sendEmail({ to: email, ...template });
};

export const sendProviderApprovedEmail = async (
  name: string,
  email: string
): Promise<void> => {
  const template = emailTemplates.providerProfileApproved(name);
  await sendEmail({ to: email, ...template });
};

export const sendProviderRejectedEmail = async (
  name: string,
  email: string,
  reason: string
): Promise<void> => {
  const template = emailTemplates.providerProfileRejected(name, reason);
  await sendEmail({ to: email, ...template });
};

export const sendAdminApprovalRequestEmail = async (
  adminEmail: string,
  data: TAdminProviderApprovalRequestEmailData
): Promise<void> => {
  const template = emailTemplates.adminProviderApprovalRequest(data);
  await sendEmail({ to: adminEmail, ...template });
};

export const sendEmailVerificationOTP = async (
  name: string,
  email: string,
  otp: string,
): Promise<void> => {
  const template = emailTemplates.emailVerificationOTP(name, otp);
  await sendEmail({ to: email, ...template });
};