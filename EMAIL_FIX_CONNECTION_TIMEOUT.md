# Fix Email Connection Timeout Issue

## Problem
Getting "Connection timeout" error when trying to send emails from Render.

## Solution 1: Use Port 465 (SSL) Instead of 587 (STARTTLS)

Render sometimes blocks port 587. Try using port 465 with SSL:

**In Render Environment Variables, add:**
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SERVICE=gmail
```

This will use SSL instead of STARTTLS, which might work better on Render.

## Solution 2: Verify App Password Format

Make sure your app password:
1. Is exactly 16 characters (no spaces)
2. Was generated AFTER enabling 2-Step Verification
3. Is for "Mail" app type
4. Hasn't been revoked

**To regenerate:**
1. Go to: https://myaccount.google.com/apppasswords
2. Delete old "ITUweb" password
3. Create new one
4. Copy the 16-character password (remove spaces)
5. Update in Render

## Solution 3: Check Gmail Account Settings

1. Make sure "Less secure app access" is NOT the issue (we're using app passwords, so this shouldn't matter)
2. Check if Gmail account is locked or restricted
3. Try logging into Gmail account to ensure it's active

## Solution 4: Alternative Email Service

If Gmail continues to timeout on Render, consider:

### Option A: Use SendGrid (Recommended for Production)
1. Sign up at https://sendgrid.com
2. Get API key
3. Update environment variables:
```
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_SERVICE=
```

### Option B: Use Mailgun
1. Sign up at https://mailgun.com
2. Get SMTP credentials
3. Update environment variables accordingly

## Solution 5: Check Render Network/Firewall

Render might be blocking SMTP connections. Check:
1. Render logs for network errors
2. Try deploying to a different region
3. Contact Render support if SMTP ports are blocked

## Quick Test After Changes

After updating environment variables and redeploying:

```javascript
fetch('https://itu-r1qa.onrender.com/test-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'your-email@gmail.com' })
})
.then(r => r.json())
.then(console.log)
```

## What to Try First

1. **Add EMAIL_HOST and EMAIL_PORT** in Render:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=465
   ```
   (Keep EMAIL_USER and EMAIL_PASS as they are)

2. **Redeploy** the service

3. **Test again** with the test endpoint

4. **Check logs** for any new error messages

## If Still Not Working

Share:
1. The exact error message from test endpoint
2. Render logs when trying to send email
3. Whether you've tried port 465
4. If you're open to using SendGrid or another service

