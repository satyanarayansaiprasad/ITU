# ✅ Resend Email Setup - Quick Start

## 🚀 Setup Steps (5 minutes)

### 1. Get Resend API Key
- Go to: https://resend.com/api-keys
- Click **"Create API Key"**
- Name: `ITU Backend`
- Copy the key (starts with `re_`)

### 2. Set Environment Variables in Render

Go to: **Render Dashboard → Your Service → Environment**

**Remove old Gmail variables:**
- Delete `EMAIL_USER`
- Delete `EMAIL_PASS`
- Delete `EMAIL_HOST`
- Delete `EMAIL_PORT`
- Delete `EMAIL_SERVICE`

**Add these:**
```
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=indiantaekwondounion@gmail.com
RESEND_FROM_NAME=Indian Taekwondo Union
```

### 3. Verify Email in Resend
- Go to: https://resend.com/emails
- Verify: `indiantaekwondounion@gmail.com`

### 4. Save & Redeploy
- Click **"Save Changes"** in Render
- Wait 2-3 minutes for deployment

### 5. Test
```javascript
fetch('https://itu-r1qa.onrender.com/test-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'your-email@gmail.com' })
})
.then(r => r.json())
.then(console.log)
```

## ✅ Done!

After setup:
- ✅ Emails sent automatically when admin approves users
- ✅ No SMTP connection issues
- ✅ Works perfectly on Render
- ✅ Email status tracked in admin panel

## 📧 What Users Receive

When admin approves:
- Welcome email with ID and password
- Login instructions
- Security reminders

---

**That's it! Resend is much more reliable than Gmail SMTP for cloud platforms.**

