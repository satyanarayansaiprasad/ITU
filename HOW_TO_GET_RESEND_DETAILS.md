# 📧 How to Get Resend API Key and Setup Details

## Step-by-Step Guide

### Step 1: Sign Up for Resend Account

1. Go to: **https://resend.com**
2. Click **"Sign Up"** button (top right)
3. You can sign up with:
   - **Google account** (fastest)
   - **GitHub account**
   - **Email address** (then verify your email)
4. Complete the signup process

---

### Step 2: Get Your API Key (RESEND_API_KEY)

1. After logging in, go to: **https://resend.com/api-keys**
   - Or click **"API Keys"** from the dashboard menu
2. Click the **"Create API Key"** button
3. Fill in the form:
   - **Name:** `ITU Backend` (or any name you prefer)
   - **Permission:** Select **"Sending access"**
4. Click **"Add"** or **"Create"**
5. **IMPORTANT:** Copy the API key immediately!
   - It starts with `re_` followed by random characters
   - Example: `re_SgmVYWuB_LBh4md2MkmXvgfNoDJVoC5L7`
   - ⚠️ **You can only see it once!** If you close the page, you'll need to create a new one.

**Your RESEND_API_KEY will look like:**
```
re_SgmVYWuB_LBh4md2MkmXvgfNoDJVoC5L7
```

---

### Step 3: Verify Your Email Address

1. Go to: **https://resend.com/emails**
   - Or click **"Emails"** from the dashboard menu
2. Look for **"Verify Email"** or **"Add Email"** button
3. Enter: `satyanarayansaiprasadofficial@gmail.com`
4. Click **"Send Verification Email"**
5. Check your Gmail inbox (and spam folder) for verification email
6. Click the verification link in the email
7. ✅ Email is now verified!

**Note:** You can only send emails FROM verified email addresses.

---

### Step 4: Get Your Details Summary

After completing the above steps, you'll have:

```
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM_EMAIL=satyanarayansaiprasadofficial@gmail.com
RESEND_FROM_NAME=Indian Taekwondo Union
```

---

### Step 5: Set These in Render

1. Go to **Render Dashboard**: https://dashboard.render.com
2. Click on your **backend service** (e.g., "itu-backend")
3. Go to **"Environment"** tab (left sidebar)
4. Scroll down to **"Environment Variables"** section
5. Click **"Add Environment Variable"** for each:

   **Variable 1:**
   - **Key:** `RESEND_API_KEY`
   - **Value:** `re_your_actual_api_key_here` (paste your API key)

   **Variable 2:**
   - **Key:** `RESEND_FROM_EMAIL`
   - **Value:** `satyanarayansaiprasadofficial@gmail.com`

   **Variable 3:**
   - **Key:** `RESEND_FROM_NAME`
   - **Value:** `Indian Taekwondo Union`

6. Click **"Save Changes"** (Render will auto-redeploy)
7. Wait 2-3 minutes for deployment to complete

---

## ✅ Quick Checklist

- [ ] Signed up for Resend account
- [ ] Created API key and copied it (starts with `re_`)
- [ ] Verified email: `satyanarayansaiprasadofficial@gmail.com`
- [ ] Added `RESEND_API_KEY` in Render
- [ ] Added `RESEND_FROM_EMAIL` in Render
- [ ] Added `RESEND_FROM_NAME` in Render
- [ ] Service redeployed successfully

---

## 🔍 Where to Find Each Detail

| Detail | Where to Find |
|--------|---------------|
| **RESEND_API_KEY** | https://resend.com/api-keys → Create API Key |
| **RESEND_FROM_EMAIL** | Your email: `satyanarayansaiprasadofficial@gmail.com` |
| **RESEND_FROM_NAME** | Any name you want: `Indian Taekwondo Union` |

---

## 🆓 Resend Free Tier

- **3,000 emails per month** - FREE
- **10 requests per second** rate limit
- Perfect for your use case!

---

## 🐛 Troubleshooting

### "API Key Invalid"
- Make sure you copied the entire key (starts with `re_`)
- No extra spaces before/after
- Create a new API key if needed

### "Email not verified"
- Go to https://resend.com/emails
- Check if `satyanarayansaiprasadofficial@gmail.com` shows as "Verified"
- If not, click "Verify" and check your email

### "Unauthorized"
- Check API key is correct in Render
- Make sure you selected "Sending access" permission
- Regenerate API key if needed

---

## 📞 Need Help?

- Resend Docs: https://resend.com/docs
- Resend Support: support@resend.com

---

**That's it! Once you set these in Render, emails will work automatically!** 🎉

