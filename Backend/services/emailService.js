import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendLoginNotification = async (userEmail, userName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: '🔐 Login Confirmation - Lost & Found System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1>Lost & Found System</h1>
            <p>Login Confirmation</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
            <p>Hi <strong>${userName}</strong>,</p>
            
            <p>✅ You have successfully logged into your Lost & Found System account.</p>
            
            <div style="background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0;">
              <p><strong>Login Details:</strong></p>
              <p>📧 Email: ${userEmail}</p>
              <p>🕐 Time: ${new Date().toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'Asia/Kathmandu'
              })}</p>
              <p>📍 IP: ${process.env.IP_ADDRESS || 'Nepal'}</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              If this wasn't you, please <strong><a href="mailto:support@lostfound.com" style="color: #667eea; text-decoration: none;">contact support</a></strong> immediately.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            
            <p style="text-align: center; color: #999; font-size: 12px;">
              © 2026 Lost & Found Management System. All rights reserved.<br>
              This is an automated email, please don't reply.
            </p>
          </div>
        </div>
      `
    };

    // Also send to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to admin email
      subject: `🔔 User Login Alert - ${userName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f39c12; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h2>User Login Alert</h2>
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
            <p><strong>User:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit',
              timeZone: 'Asia/Kathmandu'
            })}</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(adminMailOptions);
    
    console.log(`✅ Login notification sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return false;
  }
};

export const sendReportNotification = async (userEmail, itemTitle, itemType) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `📋 Your ${itemType} Item Report - Lost & Found System`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1>Lost & Found System</h1>
            <p>Report Submitted Successfully</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
            <p>Hi,</p>
            
            <p>✅ Your ${itemType === 'Lost' ? '🔴 Lost' : '🟢 Found'} item report has been submitted successfully!</p>
            
            <div style="background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0;">
              <p><strong>Item Details:</strong></p>
              <p>📦 Item: ${itemTitle}</p>
              <p>📌 Type: ${itemType}</p>
              <p>🕐 Time: ${new Date().toLocaleString()}</p>
            </div>
            
            <p>Your item is now visible to the community. Other users can search and help you find it!</p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            
            <p style="text-align: center; color: #999; font-size: 12px;">
              © 2026 Lost & Found Management System. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Report notification sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return false;
  }
};

export const sendPasswordResetEmail = async (userEmail, userName, resetUrl) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Reset Your Password - Lost & Found System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2f855a; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1>Lost & Found System</h1>
            <p>Password Reset Request</p>
          </div>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
            <p>Hi <strong>${userName}</strong>,</p>
            <p>We received a request to reset your password.</p>
            <p style="margin: 24px 0; text-align: center;">
              <a href="${resetUrl}" style="display: inline-block; background: #2f855a; color: #fff; padding: 12px 18px; border-radius: 6px; text-decoration: none; font-weight: 600;">
                Reset Password
              </a>
            </p>
            <p>This link expires in <strong>15 minutes</strong>.</p>
            <p>If you did not request this, you can ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="text-align: center; color: #999; font-size: 12px;">
              © 2026 Lost & Found Management System. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    return false;
  }
};

export const sendRegistrationOtpEmail = async (userEmail, userName, otpCode) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Verify Your Email - Lost & Found System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1>Lost & Found System</h1>
            <p>Email Verification OTP</p>
          </div>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
            <p>Hi <strong>${userName}</strong>,</p>
            <p>Use the OTP below to complete your registration.</p>
            <div style="margin: 24px 0; text-align: center;">
              <span style="display: inline-block; background: #e0e7ff; color: #1e3a8a; font-size: 28px; font-weight: 700; letter-spacing: 8px; padding: 14px 20px; border-radius: 10px;">
                ${otpCode}
              </span>
            </div>
            <p>This OTP expires in <strong>10 minutes</strong>.</p>
            <p>If you did not request this registration, you can ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="text-align: center; color: #999; font-size: 12px;">
              © 2026 Lost & Found Management System. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Registration OTP sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending registration OTP email:', error.message);
    return false;
  }
};

export const sendContactMessage = async (name, email, subject, message) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `📨 Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1f2937; color: white; padding: 16px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">New Contact Message</h2>
          </div>
          <div style="background: #f9fafb; padding: 16px; border-radius: 0 0 8px 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="white-space: pre-wrap; background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px;">${message}</div>
          </div>
        </div>
      `
    };

    const userConfirmationOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'We received your message - Lost & Found',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2f855a; color: white; padding: 16px; border-radius: 8px 8px 0 0; text-align: center;">
            <h2 style="margin: 0;">Thanks for contacting us</h2>
          </div>
          <div style="background: #f9fafb; padding: 16px; border-radius: 0 0 8px 8px;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>We received your message and our support team will respond soon.</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userConfirmationOptions);

    console.log(`✅ Contact message sent from ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending contact message:', error.message);
    return false;
  }
};
