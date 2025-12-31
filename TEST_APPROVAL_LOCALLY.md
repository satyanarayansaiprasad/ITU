# 🧪 Test Approval Flow Locally

## ✅ Prerequisites

1. **Backend running** on `http://localhost:3001` (or port configured in `.env`)
2. **Frontend running** on `http://localhost:5173` (or your Vite port)
3. **Environment variables set** in `backend/.env`:
   ```
   RESEND_API_KEY=re_your_api_key_here
   RESEND_FROM_EMAIL=satyanarayansaiprasadofficial@gmail.com
   RESEND_FROM_NAME=Indian Taekwondo Union
   ```

## 🚀 Step-by-Step Testing

### Step 1: Start Backend Server

```bash
cd backend
npm start
# or
npm run dev
```

Check that you see:
```
📧 ========== EMAIL CONFIGURATION STATUS (RESEND) ==========
  RESEND_API_KEY: ***configured***
  RESEND_FROM_EMAIL: satyanarayansaiprasadofficial@gmail.com
  Resend Client: ✅ Initialized
```

### Step 2: Start Frontend Server

```bash
cd frontend
npm run dev
```

Frontend should open at `http://localhost:5173`

### Step 3: Login to Admin Dashboard

1. Go to: `http://localhost:5173/admin/login`
2. Login with admin credentials
3. Navigate to **"Form Submissions"** page

### Step 4: Test Approval

1. Find a **pending** form submission
2. Click **"Approve & Send Email"** button
3. Watch for:
   - ✅ Success toast: `"✅ Form approved and email sent successfully to [email]"`
   - ✅ Email Status column shows: `"✅ Email Sent"` with timestamp
   - ✅ Status changes to: `"Approved"`

### Step 5: Check Backend Logs

In your backend terminal, you should see:
```
🔥🔥🔥 APPROVE FORM FUNCTION CALLED 🔥🔥🔥
📧 Preparing to send approval email to: [email]
🚀🚀🚀 SEND EMAIL FUNCTION CALLED (RESEND) 🚀🚀🚀
========== ✅ EMAIL SENT SUCCESSFULLY ==========
Message ID: re_xxxxx
```

### Step 6: Check Email

1. Check the recipient's email inbox
2. Check **spam folder** if not in inbox
3. Email should contain:
   - Welcome message
   - Email address
   - Password
   - Login instructions

## 🐛 Troubleshooting

### Issue: "Email not sent" in frontend

**Check backend logs for:**
- `RESEND_API_KEY: ❌ NOT SET` → Set API key in `.env`
- `The gmail.com domain is not verified` → Already fixed! Uses Resend default domain
- `Unauthorized` → Check API key is correct

### Issue: Backend not responding

**Check:**
1. Backend is running: `lsof -ti:3001` (or your port)
2. CORS is configured correctly
3. API endpoint is correct: `/api/admin/approveForm`

### Issue: Frontend can't connect

**Check:**
1. `API_BASE_URL` in frontend config
2. Backend CORS allows `http://localhost:5173`
3. Network tab in browser for errors

## ✅ Expected Results

### Frontend Response:
```json
{
  "success": true,
  "message": "Form approved and email sent successfully",
  "emailSent": true,
  "emailSentAt": "2024-12-31T...",
  "form": { ... }
}
```

### Backend Logs:
```
✅ Email sent and tracked for form: [name]
Message ID: re_xxxxx
```

### Email Received:
- From: `Indian Taekwondo Union <onboarding@resend.dev>`
- Subject: `🎉 Welcome to Indian Taekwondo Union - Your Affiliation Request Has Been Approved!`
- Contains: Email, Password, Login instructions

## 🎯 Quick Test Script

Run this to test the approval flow programmatically:

```bash
cd backend
node test-approval-flow.js
```

This will:
1. Fetch pending forms
2. Approve the first pending form
3. Show email sending status

## ✅ Success Checklist

- [ ] Backend running and shows Resend configured
- [ ] Frontend running and can access admin dashboard
- [ ] Can see pending forms in Form Submissions page
- [ ] Clicking "Approve & Send Email" shows success toast
- [ ] Email Status column shows "✅ Email Sent"
- [ ] Backend logs show email sent successfully
- [ ] Recipient receives email with credentials

## 📧 Email Configuration

**Current Setup:**
- Uses Resend default domain: `onboarding@resend.dev`
- No domain verification needed
- Works immediately after setting API key

**To use your own domain:**
1. Verify domain at: https://resend.com/domains
2. Update `RESEND_FROM_EMAIL` in `.env`
3. Restart backend

---

**Everything should work now!** The Gmail domain issue has been fixed.

