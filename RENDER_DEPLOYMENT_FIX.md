# Render Backend Deployment Fix

## Issues Fixed

### 1. ✅ Added Health Check Endpoints
- Added root endpoint (`/`) that returns server status
- Added `/health` endpoint for Render health checks
- These endpoints are required for Render to verify the service is running

### 2. ✅ Fixed Server Binding
- Changed server to bind to `0.0.0.0` instead of default (localhost)
- This is required for Render to accept external connections
- Server now listens on: `0.0.0.0:${PORT}`

### 3. ✅ Improved Error Handling
- Added 404 handler for unknown routes
- Added global error handler
- Improved database connection error messages

### 4. ✅ Enhanced Database Connection
- Added support for both `MONGO_URI` and `MONGODB_URI` environment variables
- Added connection timeout settings
- Better error messages for debugging

## Render Configuration Checklist

### 1. Environment Variables
Make sure these are set in your Render dashboard:

**Required:**
- `MONGO_URI` or `MONGODB_URI` - Your MongoDB connection string
- `PORT` - Usually auto-set by Render, but can be explicitly set
- `SESSION_SECRET` - Secret key for sessions

**Optional but Recommended:**
- `EMAIL_SERVICE` - Email service (gmail, outlook, etc.)
- `EMAIL_USER` - Email address for sending emails
- `EMAIL_PASS` - Email password or app password
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins

### 2. Build & Start Commands
In Render dashboard, set:

**Build Command:**
```bash
cd backend && npm install
```

**Start Command:**
```bash
cd backend && npm start
```

**OR if your root is the backend folder:**
```bash
npm install
npm start
```

### 3. Root Directory
- If your backend is in a subfolder, set Root Directory to: `backend`
- If backend is at root, leave Root Directory empty

### 4. Health Check Path
In Render dashboard, set:
- **Health Check Path:** `/health`
- Render will ping this endpoint to verify the service is running

### 5. Port Configuration
- Render automatically sets the `PORT` environment variable
- The server will use `process.env.PORT` (defaults to 3001 if not set)
- **Do NOT** hardcode a port number

## Testing the Fix

After deploying, test these endpoints:

1. **Root endpoint:**
   ```
   GET https://your-render-url.onrender.com/
   ```
   Should return: `{ status: 'success', message: 'ITU Backend API is running', timestamp: ... }`

2. **Health check:**
   ```
   GET https://your-render-url.onrender.com/health
   ```
   Should return: `{ status: 'healthy', message: 'Server is running', timestamp: ... }`

3. **API endpoint:**
   ```
   GET https://your-render-url.onrender.com/api/states
   ```
   Should return your states data

## Common Issues & Solutions

### Issue: "Service not responding"
**Solution:**
- Check Render logs for errors
- Verify `MONGO_URI` is set correctly
- Ensure health check path is set to `/health`
- Check that build/start commands are correct

### Issue: "Database connection failed"
**Solution:**
- Verify `MONGO_URI` or `MONGODB_URI` is set in Render environment variables
- Check MongoDB Atlas whitelist includes Render's IP (or use 0.0.0.0/0 for all IPs)
- Verify MongoDB connection string format is correct

### Issue: "Port already in use"
**Solution:**
- Remove any hardcoded port numbers
- Use `process.env.PORT` only
- Render automatically assigns a port

### Issue: "CORS errors"
**Solution:**
- Add your frontend URL to `ALLOWED_ORIGINS` environment variable
- Or update the CORS origin array in `backend/index.js`

## Next Steps

1. **Commit and push these changes:**
   ```bash
   git add backend/index.js backend/config/db.js
   git commit -m "Fix Render deployment: add health checks, bind to 0.0.0.0, improve error handling"
   git push origin main
   ```

2. **Update Render service:**
   - Go to your Render dashboard
   - Navigate to your backend service
   - Go to "Environment" tab
   - Verify all environment variables are set
   - Go to "Settings" tab
   - Set Health Check Path to `/health`
   - Save changes

3. **Redeploy:**
   - Render should auto-deploy on git push
   - Or manually trigger a deploy from Render dashboard
   - Check logs for any errors

4. **Test:**
   - Visit `https://your-render-url.onrender.com/health`
   - Should see a JSON response with status "healthy"

## Files Modified

- `backend/index.js` - Added health checks, error handlers, bind to 0.0.0.0
- `backend/config/db.js` - Improved connection handling and error messages

