# 📧 Gmail SMTP Setup Guide

## ✅ Switched Back to Gmail SMTP

The email system has been switched from Resend back to Gmail SMTP. This allows you to use your Gmail address directly.

## 🚀 Setup Steps

### Step 1: Get Gmail App Password

1. Go to: **https://myaccount.google.com/apppasswords**
2. Make sure **2-Step Verification** is enabled on your Google account
3. Click **"Select app"** → Choose **"Mail"**
4. Click **"Select device"** → Choose **"Other (Custom name)"**
5. Enter name: **"ITU Backend"**
6. Click **"Generate"**
7. **COPY THE 16-CHARACTER PASSWORD** (it looks like: `abcd efgh ijkl mnop`)
   - Remove all spaces when using it: `abcdefghijklmnop`

### Step 2: Set Environment Variables in Render

Go to **Render Dashboard → Your Backend Service → Environment** tab

**Remove Resend variables:**
- Remove `RESEND_API_KEY`
- Remove `RESEND_FROM_EMAIL`
- Remove `RESEND_FROM_NAME`

**Add Gmail variables:**
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password-no-spaces
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Indian Taekwondo Union
```

**Example:**
```
EMAIL_USER=satyanarayansaiprasadofficial@gmail.com
EMAIL_PASS=abcdefghijklmnop
EMAIL_FROM=satyanarayansaiprasadofficial@gmail.com
EMAIL_FROM_NAME=Indian Taekwondo Union
```

### Step 3: Save and Redeploy

1. Click **"Save Changes"** in Render
2. Render will auto-redeploy (or manually trigger)
3. Wait 2-3 minutes for deployment

### Step 4: Test Email

After deployment, test with:

```bash
curl -X POST https://itu-r1qa.onrender.com/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"tkdsaiprasad@gmail.com"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Test email sent successfully",
  "details": {
    "messageId": "...",
    "to": "tkdsaiprasad@gmail.com"
  }
}
```

## ✅ Advantages of Gmail SMTP

- ✅ Use your Gmail address directly
- ✅ No domain verification needed
- ✅ Can send to any recipient
- ✅ Free (Gmail free tier)
- ✅ Reliable delivery

## ⚠️ Important Notes

1. **App Password Required:** You MUST use an App Password, not your regular Gmail password
2. **2-Step Verification:** Must be enabled on your Google account
3. **Daily Limits:** Gmail has sending limits (500 emails/day for free accounts)
4. **Security:** Keep your App Password secure and don't share it

## 🔍 Troubleshooting

### "Invalid login" or "Authentication failed"
- ✅ Check App Password is correct (no spaces)
- ✅ Verify 2-Step Verification is enabled
- ✅ Make sure you're using App Password, not regular password

### "Connection timeout"
- ✅ Check internet connectivity
- ✅ Gmail SMTP ports: 587 (STARTTLS) or 465 (SSL)
- ✅ Firewall might be blocking SMTP

### "Daily sending limit exceeded"
- ✅ Gmail free tier: 500 emails/day
- ✅ Wait 24 hours or upgrade to Google Workspace

## 📋 Quick Checklist

- [ ] 2-Step Verification enabled on Google account
- [ ] App Password generated
- [ ] `EMAIL_USER` set in Render (your Gmail)
- [ ] `EMAIL_PASS` set in Render (16-char App Password, no spaces)
- [ ] `EMAIL_FROM` set in Render (your Gmail)
- [ ] Service redeployed
- [ ] Test email works

## 🎯 After Setup

Once configured, emails will:
- ✅ Send automatically when admin approves users
- ✅ Use your Gmail address as sender
- ✅ Work with any recipient email address
- ✅ Show proper "From" name: "Indian Taekwondo Union"

---

**That's it! Gmail SMTP is now configured and ready to use.** 🎉

