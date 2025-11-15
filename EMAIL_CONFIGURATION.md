# Email Configuration Guide

This guide explains how to configure email settings for the Indian Taekwondo Union application.

## Environment Variables Required

Add these variables to your `.env` file in the `backend` directory:

### For Gmail (Recommended for Development)

```env
# Email Service (gmail, outlook, yahoo, etc.)
EMAIL_SERVICE=gmail

# Your Gmail address
EMAIL_USER=your-email@gmail.com

# Gmail App Password (NOT your regular password)
# See instructions below to generate App Password
EMAIL_PASS=your-app-password

# Optional: Custom "From" name/email
EMAIL_FROM=your-email@gmail.com
```

### For Custom SMTP Server (Production/Other Providers)

```env
# SMTP Host
EMAIL_HOST=smtp.your-provider.com

# SMTP Port (usually 587 for TLS, 465 for SSL)
EMAIL_PORT=587

# Your email address
EMAIL_USER=your-email@yourdomain.com

# Your email password or app password
EMAIL_PASS=your-password

# Optional: Custom "From" name/email
EMAIL_FROM=noreply@yourdomain.com
```

## Gmail Setup Instructions

### Method 1: Using App Password (Recommended - Most Secure)

**If you don't see "App passwords" option:**

1. **First, enable 2-Step Verification:**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Click on "2-Step Verification"
   - Follow the steps to enable it (you'll need your phone)
   - Once enabled, "App passwords" will appear

2. **Then generate App Password:**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Or: Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Enter "ITU Application" as the name
   - Click "Generate"
   - Copy the 16-character password (this is your `EMAIL_PASS`)

3. **Update .env File:**
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  # The 16-character app password (remove spaces)
EMAIL_FROM=your-email@gmail.com
```

### Method 2: Using OAuth2 (Alternative - More Complex)

If App Passwords don't work, you can use OAuth2. This requires more setup but is more secure.

### Method 3: Use a Different Email Provider

If Gmail setup is too complicated, consider:
- **Outlook/Hotmail** - Easier setup
- **Yahoo** - Similar to Gmail
- **Custom SMTP** - Your own email server
- **Email Service Providers** - SendGrid, Mailgun, AWS SES (better for production)

See sections below for other providers.

## Other Email Providers

### Outlook/Hotmail (Easier Setup - Recommended Alternative)

**Setup Steps:**
1. Go to [Microsoft Account Security](https://account.microsoft.com/security)
2. Enable "Two-step verification" (if not already enabled)
3. Go to "Advanced security options"
4. Under "App passwords", create a new app password
5. Use that password in your `.env` file

```env
EMAIL_SERVICE=hotmail
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-app-password  # Generate from Microsoft Account
EMAIL_FROM=your-email@outlook.com
```

**OR use SMTP directly:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
EMAIL_FROM=your-email@outlook.com
```

### Yahoo
```env
EMAIL_SERVICE=yahoo
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@yahoo.com
```

### Custom SMTP (e.g., SendGrid, Mailgun, AWS SES)
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-api-key
EMAIL_FROM=noreply@yourdomain.com
```

## Testing Email Configuration

After setting up your email configuration:

1. Restart your backend server
2. Check the console logs - you should see:
   - "Email server is ready to send messages" (success)
   - OR an error message if configuration is incorrect

3. Test by approving a player or form submission - an email should be sent

## Troubleshooting

### Error: "Invalid login"
- Make sure you're using an App Password for Gmail (not your regular password)
- Verify 2-Step Verification is enabled

### Error: "Connection timeout"
- Check your EMAIL_HOST and EMAIL_PORT settings
- Verify firewall/network settings allow SMTP connections

### Error: "Authentication failed"
- Double-check EMAIL_USER and EMAIL_PASS
- For Gmail, ensure you're using App Password, not account password
- For custom SMTP, verify credentials with your email provider

### Emails not sending
- Check server logs for error messages
- Verify transporter is created successfully (check console on server start)
- Test email configuration with a simple test script

## Security Notes

⚠️ **Important:**
- Never commit your `.env` file to version control
- Use App Passwords instead of regular passwords when possible
- Keep your email credentials secure
- For production, consider using environment variables in your hosting platform (Render, Vercel, etc.)

## Render.com Environment Variables

If deploying to Render.com:

1. Go to your service dashboard
2. Navigate to "Environment" tab
3. Add the following environment variables:
   - `EMAIL_SERVICE` (or `EMAIL_HOST` and `EMAIL_PORT`)
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `EMAIL_FROM` (optional)

## Support

If you continue to have issues:
1. Check backend console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test email credentials with a simple email client first
4. Contact your email provider's support if authentication fails

