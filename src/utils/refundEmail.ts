// src/utils/refundEmail.ts  — NEW FILE
// Builds the refund confirmation email that gets sent when a customer cancels.

export function buildRefundEmail({
  customerName,
  orderNumber,
  amount,
  paymentMethod,
  refundRefId,
}: {
  customerName:  string;
  orderNumber:   string;
  amount:        number;
  paymentMethod: string;
  refundRefId:   string | null;
}) {
  const isOnline = paymentMethod === "ONLINE";
  const subject  = isOnline
    ? `Refund initiated — Order #${orderNumber}`
    : `Order cancelled — Order #${orderNumber}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1C0A06,#3B0F15);padding:28px 32px;text-align:center;">
              <p style="margin:0;font-size:26px;font-weight:800;color:#D4881E;font-family:Georgia,serif;letter-spacing:-0.5px;">Platera</p>
              <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.5px;">Food Delivery Platform</p>
              <p style="margin:8px 0 0;font-size:11px;font-weight:700;color:#D4881E;background:rgba(212,136,30,0.12);border:1px solid rgba(212,136,30,0.3);border-radius:20px;padding:3px 12px;display:inline-block;text-transform:uppercase;letter-spacing:1px;">
                ⚠ Sandbox / Test Mode
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">

              <h2 style="margin:0 0 12px;font-size:22px;color:#0F172A;font-family:Georgia,serif;">
                ${isOnline ? "Refund Initiated ✓" : "Order Cancelled"}
              </h2>

              <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.7;">
                Hi <strong>${customerName}</strong>,<br/>
                ${isOnline
                  ? `Your order has been cancelled and a refund has been initiated.`
                  : `Your order has been cancelled. Since it was a Cash on Delivery order, no payment was taken.`
                }
              </p>

              <!-- Summary box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:${isOnline ? "#F0FDF4" : "#F8FAFC"};border:1px solid ${isOnline ? "#BBF7D0" : "#E2E8F0"};border-radius:12px;margin-bottom:24px;">
                <tr><td style="padding:20px 24px;">

                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:13px;color:#64748B;padding:5px 0;">Order number</td>
                      <td style="font-size:13px;font-weight:700;color:#0F172A;text-align:right;">#${orderNumber}</td>
                    </tr>
                    ${isOnline ? `
                    <tr>
                      <td style="font-size:13px;color:#64748B;padding:5px 0;">Refund amount</td>
                      <td style="font-size:20px;font-weight:800;color:#16A34A;text-align:right;font-family:Georgia,serif;">৳${amount.toFixed(2)}</td>
                    </tr>` : ""}
                    <tr>
                      <td style="font-size:13px;color:#64748B;padding:5px 0;">Payment method</td>
                      <td style="font-size:13px;color:#0F172A;text-align:right;">${isOnline ? "Online (SSLCommerz)" : "Cash on Delivery"}</td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#64748B;padding:5px 0;">Status</td>
                      <td style="text-align:right;">
                        <span style="background:${isOnline ? "#DCFCE7" : "#F1F5F9"};color:${isOnline ? "#15803D" : "#475569"};font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;">
                          ${isOnline ? "Refunded" : "Cancelled"}
                        </span>
                      </td>
                    </tr>
                    ${refundRefId ? `
                    <tr>
                      <td style="font-size:13px;color:#64748B;padding:5px 0;">Reference ID</td>
                      <td style="font-size:11px;font-family:monospace;color:#374151;text-align:right;word-break:break-all;">${refundRefId}</td>
                    </tr>` : ""}
                  </table>

                </td></tr>
              </table>

              ${isOnline ? `
              <!-- Sandbox notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:10px;margin-bottom:20px;">
                <tr><td style="padding:14px 18px;">
                  <p style="margin:0;font-size:13px;font-weight:700;color:#9A3412;">⚠ Sandbox Mode — Test Refund</p>
                  <p style="margin:4px 0 0;font-size:12px;color:#C2410C;line-height:1.5;">
                    This is a <strong>simulated refund</strong> — no real money has moved. In production, the refund would be processed via SSLCommerz and reach your account within 3–7 business days.
                  </p>
                </td></tr>
              </table>` : ""}

              <p style="font-size:13px;color:#94A3B8;margin:0 0 4px;">
                Questions? Reply to this email or contact
                <a href="mailto:support@platera.com.bd" style="color:#D4881E;">support@platera.com.bd</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F8FAFC;padding:16px 32px;border-top:1px solid #E2E8F0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94A3B8;">© ${new Date().getFullYear()} Platera · All rights reserved</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}