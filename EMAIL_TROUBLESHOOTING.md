# Email Troubleshooting Guide

## Step 1: Check Server Logs

After deploying, check your Render logs. You should see:

```
📧 Email Configuration Status:
  EMAIL_USER: ***configured*** or ❌ NOT SET
  EMAIL_PASS: ***configured*** or ❌ NOT SET
  EMAIL_SERVICE: gmail (default)
  Transporter Status: ✅ Created or ❌ Failed to create
```

**If you see "❌ NOT SET"**: Environment variables are not configured in Render.

## Step 2: Test Email Endpoint

I've created a test endpoint. Use it to test email:

**Method:** POST  
**URL:** `https://itu-r1qa.onrender.com/api/admin/test-email`  
**Headers:** `Content-Type: application/json`  
**Body:**
```json
{
  "email": "your-test-email@gmail.com"
}
```

**Using curl:**
```bash
curl -X POST https://itu-r1qa.onrender.com/api/admin/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test-email@gmail.com"}'
```

**Using Postman/Thunder Client:**
- Method: POST
- URL: `https://itu-r1qa.onrender.com/api/admin/test-email`
- Body (JSON): `{"email": "your-test-email@gmail.com"}`

## Step 3: Verify Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Make sure you have an app password for "ITUweb" or create a new one
3. **IMPORTANT**: Copy the 16-character password WITHOUT spaces
   - If it shows: `abcd efgh ijkl mnop`
   - Use in Render: `abcdefghijklmnop` (no spaces)

## Step 4: Check Render Environment Variables

In Render Dashboard → Your Service → Environment:

```
EMAIL_USER=indiantaekwondounion@gmail.com
EMAIL_PASS=your-16-char-app-password-no-spaces
EMAIL_SERVICE=gmail
```

**Common Mistakes:**
- ❌ Extra spaces in password
- ❌ Using regular Gmail password instead of app password
- ❌ Missing quotes around values (not needed in Render)
- ❌ Wrong email address

## Step 5: Check Email Status in Admin Panel

After approving a user:
1. Go to Admin Panel → Form Submissions or Player Management
2. Look at the "Email Status" column
3. You'll see:
   - ✅ Email Sent (with timestamp) - Email was sent successfully
   - ❌ Email Failed (with error) - Email failed, check error message
   - ⏳ Not Sent Yet - Email not attempted yet

## Step 6: Check Email Spam Folder

Sometimes emails go to spam! Check:
- Spam/Junk folder
- Promotions tab (Gmail)
- All Mail folder

## Step 7: Common Error Messages

### "Invalid login" or "Authentication failed"
- **Solution**: App password is incorrect or expired
- **Fix**: Generate a new app password in Google Account

### "Connection timeout"
- **Solution**: Network/firewall issue
- **Fix**: Check Render logs, may need to allow SMTP ports

### "EMAIL_USER: ❌ NOT SET"
- **Solution**: Environment variable not set in Render
- **Fix**: Add EMAIL_USER in Render Environment tab

### "EMAIL_PASS: ❌ NOT SET"
- **Solution**: Environment variable not set in Render
- **Fix**: Add EMAIL_PASS in Render Environment tab

### "Less secure app access"
- **Solution**: You're using regular password instead of app password
- **Fix**: Generate an app password (not regular password)

## Step 8: Verify Email is Actually Being Sent

Check Render logs when approving a user. You should see:

```
🔥🔥🔥 APPROVE PLAYERS FUNCTION CALLED 🔥🔥🔥
🚀🚀🚀 SEND EMAIL FUNCTION CALLED 🚀🚀🚀
========== EMAIL SENDING ATTEMPT ==========
To: user@example.com
Subject: Welcome to Indian Taekwondo Union...
```

If you see "EMAIL SENT SUCCESSFULLY" but user doesn't receive:
- Check spam folder
- Check email address is correct
- Email might be delayed (check after 5-10 minutes)

## Step 9: Manual Email Test

If test endpoint works but approval emails don't:
1. Check if approval function is being called (look for 🔥🔥🔥 logs)
2. Check if sendEmail function is being called (look for 🚀🚀🚀 logs)
3. Check error messages in logs

## Still Not Working?

1. **Copy the exact error message** from Render logs
2. **Check the "Email Status" column** in admin panel - what does it say?
3. **Test the test endpoint** - does it work?
4. **Share the logs** with me so I can help debug

## Quick Checklist

- [ ] 2-Step Verification enabled on Gmail
- [ ] App password generated (16 characters)
- [ ] EMAIL_USER set in Render (your Gmail address)
- [ ] EMAIL_PASS set in Render (app password, no spaces)
- [ ] EMAIL_SERVICE set to "gmail" in Render
- [ ] Service redeployed after setting variables
- [ ] Checked spam folder
- [ ] Tested with test endpoint
- [ ] Checked Render logs for errors

