# 🔧 Email Not Sending - Troubleshooting Guide

## ✅ Quick Checks

### 1. Check Render Logs

Go to **Render Dashboard → Your Service → Logs**

Look for these messages:

**✅ If you see:**
```
📧 ========== EMAIL CONFIGURATION STATUS (RESEND) ==========
  RESEND_API_KEY: ***configured***
  RESEND_FROM_EMAIL: satyanarayansaiprasadofficial@gmail.com
  Resend Client: ✅ Initialized
```
→ **Configuration is correct!**

**❌ If you see:**
```
RESEND_API_KEY: ❌ NOT SET
Resend Client: ❌ Failed
```
→ **API key not set!** Go to Step 2.

**❌ If you see:**
```
❌ RESEND_API_KEY is not set in environment variables
```
→ **Set the API key in Render!**

### 2. Check Environment Variables in Render

1. Go to **Render Dashboard → Your Service → Environment**
2. Verify these are set:
   ```
   RESEND_API_KEY=re_your_api_key_here
   RESEND_FROM_EMAIL=satyanarayansaiprasadofficial@gmail.com
   RESEND_FROM_NAME=Indian Taekwondo Union
   ```
3. **IMPORTANT:** After adding/changing variables, click **"Save Changes"**
4. Wait 2-3 minutes for redeployment

### 3. Check Resend Dashboard

1. Go to: https://resend.com/emails
2. Check if `satyanarayansaiprasadofficial@gmail.com` is **verified**
3. If not verified:
   - Click "Verify Email"
   - Check your Gmail inbox
   - Click verification link

### 4. Check Email Logs When Approving

When you approve a user, check Render logs for:

**✅ Success:**
```
🚀🚀🚀 SEND EMAIL FUNCTION CALLED (RESEND) 🚀🚀🚀
========== EMAIL SENDING ATTEMPT ==========
To: user@example.com
Sending email via Resend API...
========== ✅ EMAIL SENT SUCCESSFULLY ==========
Message ID: re_xxxxx
```

**❌ Failure:**
```
========== ❌ EMAIL ERROR DETAILS ==========
ERROR MESSAGE: [error message here]
RESEND_API_KEY: ❌ NOT SET
```

### 5. Common Error Messages

| Error | Solution |
|-------|----------|
| `RESEND_API_KEY: ❌ NOT SET` | Set `RESEND_API_KEY` in Render environment |
| `Unauthorized` | Check API key is correct (starts with `re_`) |
| `Email not verified` | Verify email in Resend dashboard |
| `Invalid from address` | Verify `satyanarayansaiprasadofficial@gmail.com` in Resend |
| `Connection timeout` | Not applicable with Resend (uses API, not SMTP) |

### 6. Test Email Endpoint

Test if email works at all:

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
  "message": "Test email sent successfully"
}
```

**If this fails:** Email configuration issue
**If this works:** Approval flow issue

### 7. Check User's Email

- ✅ Check **inbox**
- ✅ Check **spam/junk folder**
- ✅ Check **promotions tab** (Gmail)
- ✅ Wait 1-2 minutes (emails can be delayed)

### 8. Check Admin Panel Response

After approving, check the response in browser console:

```javascript
// Should show:
{
  success: true,
  emailSent: true,  // ← Should be true
  emailSentAt: "2024-...",
  message: "Form approved and email sent successfully"
}
```

If `emailSent: false`, check `emailError` field for details.

## 🔍 Step-by-Step Debugging

### Step 1: Verify Environment Variables

1. Render Dashboard → Service → Environment
2. Check all 3 variables are set
3. Save and redeploy

### Step 2: Check Resend API Key

1. Go to: https://resend.com/api-keys
2. Verify your API key exists
3. Copy it again if needed
4. Update in Render

### Step 3: Verify Email in Resend

1. Go to: https://resend.com/emails
2. Verify: `satyanarayansaiprasadofficial@gmail.com`
3. Status should be "Verified"

### Step 4: Test Email Endpoint

Use the test endpoint to verify email works:
```bash
curl -X POST https://itu-r1qa.onrender.com/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@gmail.com"}'
```

### Step 5: Check Render Logs

1. Approve a user
2. Immediately check Render logs
3. Look for email sending logs
4. Check for any error messages

### Step 6: Check Database

The form should have:
- `emailSent: true/false`
- `emailSentAt: timestamp`
- `emailError: error message (if failed)`

## 🎯 Most Common Issues

1. **RESEND_API_KEY not set** → Set in Render environment
2. **Email not verified** → Verify in Resend dashboard
3. **Email in spam** → Check spam folder
4. **Wrong API key** → Regenerate and update in Render
5. **Service not redeployed** → Save environment variables to trigger redeploy

## ✅ Quick Fix Checklist

- [ ] `RESEND_API_KEY` set in Render
- [ ] `RESEND_FROM_EMAIL` set in Render
- [ ] `RESEND_FROM_NAME` set in Render
- [ ] Service redeployed after setting variables
- [ ] Email verified in Resend dashboard
- [ ] Test email endpoint works
- [ ] Checked spam folder
- [ ] Checked Render logs for errors

## 📞 Still Not Working?

1. **Check Render logs** - Look for error messages
2. **Test email endpoint** - Verify basic email works
3. **Check Resend dashboard** - Verify API key and email
4. **Check browser console** - Look for API errors
5. **Check email status** - Look at `emailSent` and `emailError` in response

Share the error message from Render logs for further help!

