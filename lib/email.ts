import { Resend } from "resend";

const FROM_EMAIL = process.env.EMAIL_FROM || "noreply@yourdomain.com";

// Lazy-load Resend client to avoid build-time initialization
function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY || "");
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const resend = getResendClient();
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(email: string, name: string) {
  const subject = "Welcome to AI SaaS Starter!";
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #330df2;
          }
          .header h1 {
            margin: 0;
            color: #330df2;
          }
          .content {
            padding: 30px 0;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #330df2;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px 0;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
          }
          .features {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .features ul {
            margin: 10px 0;
            padding-left: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Welcome to AI SaaS Starter!</h1>
        </div>

        <div class="content">
          <p>Hi ${name},</p>

          <p>Welcome aboard! We're excited to have you on AI SaaS Starter. You now have access to powerful AI models to boost your productivity.</p>

          <div class="features">
            <h3>What you can do:</h3>
            <ul>
              <li>Generate content with GPT-4, GPT-3.5, and Claude models</li>
              <li>Track your AI usage and generation history</li>
              <li>Upgrade to Pro for 1,000 requests per month</li>
              <li>Access advanced features and priority support</li>
            </ul>
          </div>

          <p>Your free plan includes <strong>10 AI requests per month</strong>. Ready to get started?</p>

          <center>
            <a href="${process.env.NEXTAUTH_URL}/ai-generator" class="button">Start Generating</a>
          </center>

          <p>Need help? Check out our <a href="${process.env.NEXTAUTH_URL}/docs">documentation</a> or reply to this email.</p>

          <p>Happy generating!<br>The AI SaaS Team</p>
        </div>

        <div class="footer">
          <p>You're receiving this email because you signed up for AI SaaS Starter.</p>
          <p>${process.env.NEXTAUTH_URL}</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
}

/**
 * Send usage limit warning email
 */
export async function sendUsageLimitWarning(
  email: string,
  name: string,
  usagePercent: number,
  currentUsage: number,
  limit: number
) {
  const subject = "You're approaching your AI usage limit";
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #f59e0b;
          }
          .content {
            padding: 30px 0;
          }
          .warning-box {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .usage-bar {
            background-color: #e5e7eb;
            height: 30px;
            border-radius: 15px;
            overflow: hidden;
            margin: 15px 0;
          }
          .usage-fill {
            background-color: #f59e0b;
            height: 100%;
            width: ${usagePercent}%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #330df2;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px 0;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>⚠️ Usage Alert</h1>
        </div>

        <div class="content">
          <p>Hi ${name},</p>

          <div class="warning-box">
            <strong>You've used ${usagePercent}% of your monthly AI requests.</strong>
          </div>

          <p>You've made <strong>${currentUsage} out of ${limit}</strong> AI requests this month.</p>

          <div class="usage-bar">
            <div class="usage-fill">${usagePercent}%</div>
          </div>

          <p>To continue using AI generation without interruption, consider upgrading to a higher plan:</p>

          <ul>
            <li><strong>Pro Plan</strong> - 1,000 requests/month for $29</li>
            <li><strong>Enterprise Plan</strong> - Unlimited requests</li>
          </ul>

          <center>
            <a href="${process.env.NEXTAUTH_URL}/billing" class="button">Upgrade Now</a>
          </center>

          <p>Your usage resets at the beginning of next month.</p>

          <p>Questions? We're here to help!</p>
        </div>

        <div class="footer">
          <p>AI SaaS Starter</p>
          <p>${process.env.NEXTAUTH_URL}</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
}

/**
 * Send payment success email
 */
export async function sendPaymentSuccessEmail(
  email: string,
  name: string,
  plan: string,
  amount: number
) {
  const subject = `Payment Received - ${plan} Plan`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #10b981;
          }
          .success-box {
            background-color: #d1fae5;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .invoice {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .invoice-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .invoice-total {
            font-weight: bold;
            font-size: 18px;
            padding-top: 10px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #330df2;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px 0;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✓ Payment Successful</h1>
        </div>

        <div class="content">
          <p>Hi ${name},</p>

          <div class="success-box">
            <strong>Thank you! Your payment has been processed successfully.</strong>
          </div>

          <div class="invoice">
            <h3>Payment Summary</h3>
            <div class="invoice-row">
              <span>Plan:</span>
              <span><strong>${plan}</strong></span>
            </div>
            <div class="invoice-row">
              <span>Billing Period:</span>
              <span>Monthly</span>
            </div>
            <div class="invoice-row invoice-total">
              <span>Total:</span>
              <span>$${(amount / 100).toFixed(2)}</span>
            </div>
          </div>

          <p>Your ${plan} plan is now active! You can now enjoy:</p>

          <ul>
            <li>Increased AI request limits</li>
            <li>Priority processing</li>
            <li>Advanced features</li>
            <li>Priority support</li>
          </ul>

          <center>
            <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">Go to Dashboard</a>
          </center>

          <p>You can manage your subscription anytime from your billing page.</p>

          <p>Thank you for upgrading!</p>
        </div>

        <div class="footer">
          <p>AI SaaS Starter</p>
          <p>Need help? Contact us at support@yourdomain.com</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
}

/**
 * Send payment failed email
 */
export async function sendPaymentFailedEmail(
  email: string,
  name: string,
  plan: string
) {
  const subject = "Payment Failed - Action Required";
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #ef4444;
          }
          .error-box {
            background-color: #fee2e2;
            border-left: 4px solid #ef4444;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #ef4444;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px 0;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>⚠️ Payment Failed</h1>
        </div>

        <div class="content">
          <p>Hi ${name},</p>

          <div class="error-box">
            <strong>We couldn't process your payment for the ${plan} plan.</strong>
          </div>

          <p>This could happen for several reasons:</p>

          <ul>
            <li>Insufficient funds</li>
            <li>Expired card</li>
            <li>Incorrect card information</li>
            <li>Bank declined the transaction</li>
          </ul>

          <p><strong>Action Required:</strong> Please update your payment method to continue your subscription.</p>

          <center>
            <a href="${process.env.NEXTAUTH_URL}/billing" class="button">Update Payment Method</a>
          </center>

          <p>If you need assistance, please don't hesitate to reach out to our support team.</p>
        </div>

        <div class="footer">
          <p>AI SaaS Starter</p>
          <p>support@yourdomain.com</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
}
