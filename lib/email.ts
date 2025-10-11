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

  // Registration Request Templates
  registrationSubmitted: (name: string) => ({
    subject: "Registration Request Received - CI2P Research Lab",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
            .info-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Registration Request Received 📋</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Thank you for your interest in joining the CI2P Research Lab at the University of Jinan!</p>
              <p>We have successfully received your registration request and it is currently under review by our administrators.</p>
              <div class="info-box">
                <strong>What happens next?</strong>
                <ul>
                  <li>Our administrators will review your application</li>
                  <li>You will receive an email notification once a decision is made</li>
                  <li>If approved, you'll receive temporary login credentials</li>
                  <li>You'll be able to set your own password on first login</li>
                </ul>
              </div>
              <p><strong>Estimated review time:</strong> 2-3 business days</p>
              <p>If you have any questions about your application, please contact us at:</p>
              <p>📧 Email: sjniu@hotmail.com<br>📞 Phone: 0531-82767569</p>
            </div>
            <div class="footer">
              <p>© 2025 CI2P Research Lab - University of Jinan</p>
              <p>Key Laboratory of Intelligent Computing Technology</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  newRegistrationRequest: (name: string, email: string, role: string) => ({
    subject: `New Registration Request - ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
            .detail-box { background: #f9fafb; padding: 15px; margin: 20px 0; border-radius: 5px; border: 1px solid #e5e7eb; }
            .button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Registration Request 🔔</h1>
            </div>
            <div class="content">
              <h2>New Application Submitted</h2>
              <p>A new registration request has been submitted and requires your review.</p>
              <div class="detail-box">
                <strong>Applicant Details:</strong><br>
                <strong>Name:</strong> ${name}<br>
                <strong>Email:</strong> ${email}<br>
                <strong>Requested Role:</strong> ${role}<br>
              </div>
              <p>Please review this application in the admin dashboard:</p>
              <center>
                <a href="${
                  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
                }/admin/registration-requests" class="button">Review Application</a>
              </center>
            </div>
            <div class="footer">
              <p>© 2025 CI2P Research Lab - University of Jinan</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  registrationApproved: (
    name: string,
    tempPassword: string,
    loginUrl: string
  ) => ({
    subject: "Welcome to CI2P Lab - Your Account is Ready! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
            .credentials-box { background: #f0fdf4; border: 2px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to CI2P Lab! 🎉</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Congratulations! Your registration request has been <strong>approved</strong>.</p>
              <p>Your account has been created and you can now access the CI2P Lab platform.</p>
              <div class="credentials-box">
                <h3>🔐 Your Login Credentials:</h3>
                <p><strong>Temporary Password:</strong></p>
                <p style="font-size: 20px; font-family: monospace; background: white; padding: 15px; border-radius: 5px; text-align: center;">
                  ${tempPassword}
                </p>
              </div>
              <div class="warning">
                <strong>⚠️ Important Security Notice:</strong><br>
                For security reasons, you will be required to change this temporary password when you first log in. Please choose a strong, unique password.
              </div>
              <center>
                <a href="${loginUrl}" class="button">Login Now</a>
              </center>
              <h3>Getting Started:</h3>
              <ul>
                <li>Log in with your temporary password</li>
                <li>Create a new secure password</li>
                <li>Complete your profile information</li>
                <li>Explore the lab's resources and projects</li>
              </ul>
              <p>If you have any questions, please contact us at sjniu@hotmail.com</p>
            </div>
            <div class="footer">
              <p>© 2025 CI2P Research Lab - University of Jinan</p>
              <p>Key Laboratory of Intelligent Computing Technology</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  registrationRejected: (name: string, reason?: string) => ({
    subject: "Update on Your Registration Request - CI2P Lab",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #64748b 0%, #475569 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
            .reason-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Registration Request Update</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Thank you for your interest in joining the CI2P Research Lab.</p>
              <p>After careful review, we regret to inform you that we are unable to approve your registration request at this time.</p>
              ${
                reason
                  ? `
              <div class="reason-box">
                <strong>Reason:</strong><br>
                ${reason}
              </div>
              `
                  : ""
              }
              <p>We appreciate your interest in our lab and encourage you to stay connected with us. You are welcome to reapply in the future.</p>
              <p>If you have any questions or would like more information, please feel free to contact us:</p>
              <p>📧 Email: sjniu@hotmail.com<br>📞 Phone: 0531-82767569</p>
            </div>
            <div class="footer">
              <p>© 2025 CI2P Research Lab - University of Jinan</p>
              <p>Key Laboratory of Intelligent Computing Technology</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};
