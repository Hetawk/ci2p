import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// SMTP2GO Configuration
const transporter = nodemailer.createTransport({
  host: "mail.smtp2go.com",
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP2GO_API_KEY,
    pass: process.env.SMTP2GO_API_KEY,
  },
});

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      text: text || stripHtml(html),
      html,
    });

    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: (error as Error).message };
  }
}

// Helper to strip HTML tags for plain text version
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

// Email Templates
export const emailTemplates = {
  verifyEmail: (name: string, verificationUrl: string) => ({
    subject: "Verify Your Email - Her Promise Fulfilled",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Her Promise Fulfilled! 💝</h1>
            </div>
            <div class="content">
              <h2>Hi ${name}!</h2>
              <p>Thank you for creating an account with Her Promise Fulfilled. We're excited to have you join our community!</p>
              <p>Please verify your email address by clicking the button below:</p>
              <center>
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </center>
              <p>Or copy and paste this link into your browser:</p>
              <p style="background: #f3f4f6; padding: 15px; border-radius: 5px; word-break: break-all;">
                ${verificationUrl}
              </p>
              <p><strong>This link will expire in 24 hours.</strong></p>
              <p>If you didn't create an account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2025 Her Promise Fulfilled. All rights reserved.</p>
              <p>Empowering communities through education and support.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  resetPassword: (name: string, resetUrl: string) => ({
    subject: "Reset Your Password - Her Promise Fulfilled",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request 🔐</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>We received a request to reset your password for your Her Promise Fulfilled account.</p>
              <p>Click the button below to reset your password:</p>
              <center>
                <a href="${resetUrl}" class="button">Reset Password</a>
              </center>
              <p>Or copy and paste this link into your browser:</p>
              <p style="background: #f3f4f6; padding: 15px; border-radius: 5px; word-break: break-all;">
                ${resetUrl}
              </p>
              <div class="warning">
                <strong>⚠️ Security Notice:</strong><br>
                This link will expire in 1 hour. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
              </div>
              <p>For security reasons, we recommend using a strong, unique password.</p>
            </div>
            <div class="footer">
              <p>© 2025 Her Promise Fulfilled. All rights reserved.</p>
              <p>If you need help, contact us at support@herpromisefulfilled.org</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  welcomeEmail: (name: string) => ({
    subject: "Welcome to Her Promise Fulfilled! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to the Family! 💝</h1>
            </div>
            <div class="content">
              <h2>Hi ${name}!</h2>
              <p>Your email has been verified successfully. Welcome to Her Promise Fulfilled!</p>
              <p>We're thrilled to have you as part of our community dedicated to empowering and transforming lives.</p>
              <h3>What's Next?</h3>
              <ul>
                <li>📚 Explore our programs and initiatives</li>
                <li>💝 Learn about our impact in communities</li>
                <li>🤝 Discover volunteer opportunities</li>
                <li>💰 Support our mission through donations</li>
              </ul>
              <p>If you have any questions, feel free to reach out to us!</p>
            </div>
            <div class="footer">
              <p>© 2025 Her Promise Fulfilled. All rights reserved.</p>
              <p>Empowering communities through education and support.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};
