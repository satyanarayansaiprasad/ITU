# 🔍 Check Render Logs for Email Issues

## Steps to Debug Email on Render

### 1. Check Render Logs

Go to: **Render Dashboard → Your Service → Logs**

Look for these messages when you approve a form:

**✅ Good Signs:**
```
📧 ========== EMAIL CONFIGURATION STATUS (RESEND) ==========
  RESEND_API_KEY: ***configured***
  Resend Client: ✅ Initialized

🔥🔥🔥 APPROVE FORM FUNCTION CALLED 🔥🔥🔥
📧 Preparing to send approval email to: [email]
🚀🚀🚀 SEND EMAIL FUNCTION CALLED (RESEND) 🚀🚀🚀
Sending email via Resend API...
From: Indian Taekwondo Union <onboarding@resend.dev>
========== ✅ EMAIL SENT SUCCESSFULLY ==========
```

**❌ Bad Signs:**
```
RESEND_API_KEY: ❌ NOT SET
Resend Client: ❌ Failed
Invalid `from` field
The gmail.com domain is not verified
```

### 2. Test Email Endpoint

Run this command:
```bash
curl -X POST https://itu-r1qa.onrender.com/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"satyanarayansaiprasadofficial@gmail.com"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Test email sent successfully",
  "details": {
    "messageId": "re_xxxxx"
  }
}
```

**If Error:**
- Check the error message
- Share it so we can fix it

### 3. Check Environment Variables

In Render Dashboard → Environment, verify:
- `RESEND_API_KEY` is set (starts with `re_`)
- `RESEND_FROM_EMAIL` is set (or will use default)
- `RESEND_FROM_NAME` is set (or will use default)

### 4. Common Issues

| Error | Solution |
|-------|----------|
| `RESEND_API_KEY: ❌ NOT SET` | Set API key in Render environment |
| `Invalid from field` | Already fixed in latest code - redeploy |
| `The gmail.com domain is not verified` | Already fixed - uses Resend default domain |
| `Unauthorized` | Check API key is correct |

### 5. After Fixing

1. **Push code to GitHub**
2. **Render auto-deploys** (or manually trigger)
3. **Wait 2-3 minutes** for deployment
4. **Test again** with curl command above

---

**Share the Render logs or error message you see!**

