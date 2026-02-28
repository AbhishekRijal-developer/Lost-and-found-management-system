# 📧 Gmail Email Notifications Setup Guide

## Overview
Your Lost & Found system now sends email notifications to users when they:
- ✅ Successfully log in
- ✅ Report a lost item
- ✅ Report a found item

All emails are sent to: **abhishekrijal980@gmail.com**

---

## ⚙️ Setup Instructions

### Step 1: Generate Gmail App Password

Since Gmail blocks less secure apps, you need to create an **App Password**.

1. **Enable 2-Factor Authentication** (if not already enabled):
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow the prompts to enable it

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select **Mail** as the app
   - Select **Windows Computer** as the device
   - Click "Generate"
   - **Copy the 16-character password that appears**

### Step 2: Update Your .env File

Edit `Backend/.env` and replace:

```env
EMAIL_PASSWORD=your_app_password_here
```

With:

```env
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

**Important**: Use the exact password from Gmail (including spaces).

### Step 3: Install Dependencies

Run this in the Backend folder:

```bash
cd Backend
npm install
```

This will install `nodemailer` package.

### Step 4: Test Email Notification

1. Start the backend: `npm start`
2. Register a new account or login
3. You should receive an email within seconds!

---

## 📧 What Users See

### Login Email Example
```
Subject: 🔐 Login Confirmation - Lost & Found System

Hi John Doe,

✅ You have successfully logged into your Lost & Found System account.

Login Details:
📧 Email: john@iic.edu.np
🕐 Time: February 24, 2026 10:30:45 AM
📍 IP: Nepal
```

### Report Email Example
```
Subject: 📋 Your Lost Item Report - Lost & Found System

Hi,

✅ Your 🔴 Lost item report has been submitted successfully!

Item Details:
📦 Item: Blue Wallet
📌 Type: Lost
🕐 Time: February 24, 2026 10:30:45 AM

Your item is now visible to the community. Other users can search and help you find it!
```

---

## 🔐 Security Features

✅ **Only sends to registered college emails** (@iic.edu.np)
✅ **Admin receives alerts** of all logins
✅ **Automatic notifications** (no manual sending)
✅ **Sensitive data not logged**
✅ **App-specific password** (not your main password)

---

## 🆘 Troubleshooting

### Problem: "Invalid login credentials"
**Solution**: Your App Password is incorrect or Gmail settings need updating
- Verify you copied the 16-character password correctly
- Try regenerating a new App Password
- Make sure 2FA is enabled

### Problem: Email not received
**Solutions**:
1. Check spam/promotions folder
2. Wait 1-2 minutes
3. Check backend console for errors: `npm start`
4. Verify EMAIL_USER is correct in .env

### Problem: "gmail: User credentials not accepted"
**Solution**: Your regular Gmail password doesn't work with nodemailer
- You MUST use an App Password, not your regular password
- Generate one at: https://myaccount.google.com/apppasswords

### Problem: "2-Step Verification is not turned on"
**Solution**: Enable 2FA first
- Go to: https://myaccount.google.com/security
- Enable "2-Step Verification"
- Then generate App Password

---

## 📝 Configuration

**File**: `Backend/.env`

```env
# Email Configuration (Gmail)
EMAIL_USER=abhishekrijal980@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
ADMIN_EMAIL=abhishekrijal980@gmail.com
```

**File**: `Backend/services/emailService.js`
- Handles all email sending
- Can customize email templates here
- Sends to user and admin

**File**: `Backend/controllers/authController.js`
- Calls email service on login
- Sends notification after successful authentication

**File**: `Backend/controllers/itemController.js`
- Calls email service when item is reported
- Notifies user with item details

---

## 🎨 Customizing Email Templates

Edit `Backend/services/emailService.js` to change:
- Email subject line
- Email template HTML
- Admin email alerts
- Email sending conditions

---

## 📊 Email Statistics

Currently configured to send emails for:
- ✅ User login (to user + admin)
- ✅ Item report created (to user + admin)

**Future additions could include**:
- Item matched with another item
- User profile updated
- Admin dashboard alerts
- Daily/weekly summaries

---

## 🔄 How It Works

```
User Login
    ↓
Backend validates credentials
    ↓
Backend generates JWT token
    ↓
Backend calls emailService.sendLoginNotification()
    ↓
Email service connects to Gmail SMTP
    ↓
Sends email to user's inbox
    ↓
Also alerts admin to the login
```

---

## ⚡ Performance Notes

- Emails are sent **asynchronously** (doesn't slow down login)
- Uses **setTimeout** to avoid blocking responses
- Email failures don't affect user operations
- All errors logged to console for debugging

---

## 🎓 Gmail App Password

**What is it?**
- A 16-character password for apps
- More secure than your main password
- Can only be used for email
- Can be revoked anytime

**Where to find?**
- https://myaccount.google.com/apppasswords
- (Only shows if 2FA is enabled)

**Can I use my regular password?**
- ❌ NO - Gmail blocks it
- ✅ YES - Use App Password instead

---

## 📞 Support

If emails aren't working:

1. **Check Backend Console**:
   ```
   npm start
   # Look for: ✅ Login notification sent
   # Or: ❌ Error sending email
   ```

2. **Verify Gmail Settings**:
   - https://myaccount.google.com/security
   - Check 2FA is enabled
   - Check App Password exists

3. **Test Connection**:
   ```bash
   # If you want to manually test Gmail SMTP
   npm test
   ```

4. **Check Spam Folder**:
   - Email might arrive with [EXTERNAL] tag
   - Add to contacts to whitelist

---

## ✅ Verification Checklist

Before considering setup complete:

- [ ] 2-Factor Authentication enabled on Gmail
- [ ] App Password generated in Gmail
- [ ] Backend/.env updated with App Password
- [ ] `npm install` run in Backend folder
- [ ] Backend started successfully
- [ ] Test user registered
- [ ] Login email received
- [ ] Email appears in inbox (not spam)
- [ ] Admin was also notified

---

## 🎉 All Set!

Your Lost & Found system now has:

✅ Automatic login notifications
✅ Item report confirmations
✅ Admin alerts
✅ Professional email templates
✅ Secure Gmail integration

**Users will get email notifications instantly!** 📧

---

## 📄 Files Modified

- **Backend/package.json** - Added `nodemailer`
- **Backend/.env** - Added email configuration
- **Backend/services/emailService.js** - Created (NEW)
- **Backend/controllers/authController.js** - Added email on login
- **Backend/controllers/itemController.js** - Added email on report

---

**Email notifications are now live! 🚀**
