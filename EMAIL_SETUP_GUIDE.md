# Email Setup Guide - Step by Step

## Step 1: Generate Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** (left sidebar)
3. Under "Signing in to Google", enable **2-Step Verification** (if not already enabled)
4. After enabling 2-Step Verification, go back to Security
5. Scroll down and click on **App passwords**
6. Select **Mail** as the app
7. Select **Other (Custom name)** as the device
8. Enter name: **ITU Backend** or **ITUweb**
9. Click **Generate**
10. **COPY THE 16-CHARACTER PASSWORD** (it will look like: `abcd efgh ijkl mnop`)
11. **IMPORTANT**: Remove all spaces from the password (it should be 16 characters without spaces)

## Step 2: Set Environment Variables in Render

1. Go to your Render Dashboard: https://dashboard.render.com/
2. Select your backend service
3. Go to **Environment** tab
4. Add these environment variables:

```
EMAIL_USER=indiantaekwondounion@gmail.com
EMAIL_PASS=your-16-character-app-password-without-spaces
EMAIL_SERVICE=gmail
```

**Example:**
- If your app password is: `abcd efgh ijkl mnop`
- Use in EMAIL_PASS: `abcdefghijklmnop` (no spaces)

## Step 3: Verify Configuration

After setting environment variables:
1. **Redeploy** your service on Render (or wait for auto-deploy)
2. Check the logs when the server starts
3. You should see:
   ```
   📧 Email Configuration Status:
     EMAIL_USER: ***configured***
     EMAIL_PASS: ***configured***
     EMAIL_SERVICE: gmail (default)
     Transporter Status: ✅ Created
   ```

## Step 4: Test Email Sending

1. Approve a user from admin panel
2. Check Render logs immediately
3. You should see logs like:
   ```
   🔥🔥🔥 APPROVE PLAYERS FUNCTION CALLED 🔥🔥🔥
   🚀🚀🚀 SEND EMAIL FUNCTION CALLED 🚀🚀🚀
   ========== EMAIL SENDING ATTEMPT ==========
   ```

## Troubleshooting

### If you see "EMAIL_USER: ❌ NOT SET" or "EMAIL_PASS: ❌ NOT SET"
- Check that environment variables are set correctly in Render
- Make sure there are no extra spaces
- Redeploy the service

### If you see "Transporter Not Configured"
- Verify EMAIL_USER and EMAIL_PASS are set
- Check that the app password is correct (16 characters, no spaces)
- Make sure 2-Step Verification is enabled on Gmail

### If you see connection errors
- Check that the app password is correct
- Verify EMAIL_SERVICE is set to "gmail"
- Make sure your Gmail account allows "Less secure app access" (though app passwords should work)

### Common Errors:
- **"Invalid login"**: Wrong app password or email
- **"Connection timeout"**: Network/firewall issue
- **"Authentication failed"**: App password incorrect or expired

## Alternative: Remove Email Feature

If you want to remove email completely and handle credentials differently:

1. We can modify the code to skip email sending
2. Show credentials on screen after approval
3. Or store credentials in database for admin to view later

Let me know which approach you prefer!

