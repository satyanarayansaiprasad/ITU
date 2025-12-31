# Resend Email Setup Guide - Complete Instructions

## ✅ Why Resend?

- ✅ **No SMTP connection issues** - Uses API instead of SMTP
- ✅ **Works perfectly on Render/Vercel** - No port blocking
- ✅ **Easy setup** - Just need API key
- ✅ **Reliable** - Built for modern applications
- ✅ **Free tier** - 3,000 emails/month free

## 🚀 Step-by-Step Setup

### Step 1: Sign Up for Resend

1. Go to: https://resend.com
2. Click **"Sign Up"** (use Google/GitHub for quick signup)
3. Verify your email address

### Step 2: Get Your API Key

1. After logging in, go to: https://resend.com/api-keys
2. Click **"Create API Key"**
3. Give it a name: **"ITU Backend"**
4. Select permissions: **"Sending access"**
5. Click **"Add"**
6. **COPY THE API KEY** (starts with `re_`)

### Step 3: Add Domain (Optional but Recommended)

1. Go to: https://resend.com/domains
2. Click **"Add Domain"**
3. Enter your domain (e.g., `taekwondounion.com`)
4. Follow DNS setup instructions
5. **OR** use Resend's default domain for testing

**For Quick Testing:** You can use Resend's default domain `onboarding@resend.dev` initially, but you'll need to verify your own domain for production.

### Step 4: Set Environment Variables in Render

Go to Render Dashboard → Your Backend Service → **Environment** tab

**Remove old Gmail variables:**
- Remove `EMAIL_USER`
- Remove `EMAIL_PASS`
- Remove `EMAIL_HOST`
- Remove `EMAIL_PORT`
- Remove `EMAIL_SERVICE`

**Add Resend variables:**
```
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=indiantaekwondounion@gmail.com
RESEND_FROM_NAME=Indian Taekwondo Union
```

**Important:**
- `RESEND_API_KEY` = Your Resend API key (starts with `re_`)
- `RESEND_FROM_EMAIL` = Your verified email address in Resend
- `RESEND_FROM_NAME` = Display name for emails (optional)

### Step 5: Verify Your Email in Resend

1. Go to: https://resend.com/emails
2. Click **"Verify Email"** or go to Settings
3. Add and verify: `indiantaekwondounion@gmail.com`
4. Check your email and click verification link

### Step 6: Save and Redeploy

1. Click **"Save Changes"** in Render
2. Render will auto-redeploy (or manually trigger)
3. Wait 2-3 minutes for deployment

### Step 7: Test Email

After deployment, test with:

```javascript
fetch('https://itu-r1qa.onrender.com/test-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'your-email@gmail.com' })
})
.then(r => r.json())
.then(console.log)
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Test email sent successfully",
  "details": {
    "to": "your-email@gmail.com",
    "messageId": "re_xxxxx"
  }
}
```

### Step 8: Test Approval Flow

1. Go to Admin Panel → Form Submissions
2. Click **"Approve & Send Email"** on a pending user
3. Check **"Email Status"** column:
   - ✅ **Email Sent** = Success!
   - ❌ **Email Failed** = See error message
4. User should receive email within seconds

## 📧 How It Works

### When Admin Approves User:

1. **Form updated** with password and status = "approved"
2. **Email sent via Resend API** (no SMTP, no connection issues!)
3. **Email includes:**
   - Welcome message
   - Email address
   - Password
   - Login instructions
4. **Status tracked** in database
5. **Admin sees status** in "Email Status" column

## 🔍 Troubleshooting

### "RESEND_API_KEY: ❌ NOT SET"
- Check environment variable is set in Render
- Make sure variable name is exactly `RESEND_API_KEY`
- Redeploy after setting

### "Unauthorized" or "Invalid API Key"
- Check API key is correct (starts with `re_`)
- Make sure no extra spaces
- Regenerate API key if needed

### "Domain not verified"
- Verify your email in Resend dashboard
- Or use Resend's default domain for testing
- For production, add and verify your own domain

### Email goes to spam
- Verify your domain in Resend
- Set up SPF/DKIM records (Resend provides instructions)
- Use a professional from address

## ✅ Verification Checklist

- [ ] Resend account created
- [ ] API key generated and copied
- [ ] Email verified in Resend dashboard
- [ ] `RESEND_API_KEY` set in Render
- [ ] `RESEND_FROM_EMAIL` set in Render
- [ ] Service redeployed
- [ ] Test email endpoint works
- [ ] Approval sends email successfully
- [ ] User receives email

## 🎯 Quick Start (Minimum Setup)

**Minimum required variables in Render:**
```
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=indiantaekwondounion@gmail.com
```

That's it! Resend will handle the rest.

## 📊 Resend Limits

- **Free tier:** 3,000 emails/month
- **Pro tier:** 50,000+ emails/month (paid)
- **API rate limit:** 10 requests/second (free tier)

For your use case (user approvals), free tier should be more than enough!

## 🚀 Next Steps

1. **Sign up** at https://resend.com
2. **Get API key**
3. **Set variables** in Render
4. **Redeploy**
5. **Test** and approve users!

Resend is much more reliable than Gmail SMTP for cloud platforms like Render!

