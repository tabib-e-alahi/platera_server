
import envConfig from "../config";

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
    <a href="${envConfig.frontend_local_host}/dashboard/provider">
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
    <a href="${envConfig.frontend_local_host}/dashboard/provider">
      Update your profile
    </a>
    <p>— The FoodHub Team</p>
  `,
}),

adminProviderApprovalRequest: (
  providerName: string,
  businessName: string,
  category: string
) => ({
  subject: "New provider approval request",
  html: `
    <h2>Provider Approval Request</h2>
    <p><strong>Provider:</strong> ${providerName}</p>
    <p><strong>Business:</strong> ${businessName}</p>
    <p><strong>Category:</strong> ${category}</p>
    <a href="${envConfig.frontend_local_host}/dashboard/admin/providers">
      Review in admin panel
    </a>
  `,
}),
};