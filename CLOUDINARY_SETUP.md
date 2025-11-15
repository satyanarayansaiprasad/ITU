# Cloudinary Setup Guide

## Overview
This project now uses Cloudinary for image storage while keeping MongoDB for database storage. All images (slider, gallery, news, user profiles) are uploaded to Cloudinary and their URLs are stored in MongoDB.

## Setup Instructions

### 1. Create a Cloudinary Account
1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account (or use existing account)
3. Once logged in, go to Dashboard
4. Copy your credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 2. Add Environment Variables

Add these to your `.env` file in the `backend` directory:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. For Production (Render.com)

1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add these environment variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

### 4. How It Works

#### Image Upload Flow:
1. User uploads image via form
2. Multer receives file in memory (buffer)
3. File is uploaded to Cloudinary
4. Cloudinary returns:
   - `secure_url` (HTTPS URL) - stored in `filename` field
   - `public_id` - stored in `cloudinaryPublicId` field for deletion
5. URL is saved to MongoDB

#### Image Deletion Flow:
1. Get `cloudinaryPublicId` from database
2. Delete from Cloudinary using `public_id`
3. Delete record from MongoDB

### 5. Folder Structure in Cloudinary

Images are organized in folders:
- **Sliders**: `itu/sliders/`
- **Gallery**: `itu/gallery/`
- **Logos**: `itu/logos/`
- **Secretary Images**: `itu/secretary-images/`
- **News**: `itu/news/`

### 6. Benefits

✅ **Persistent Storage**: Images persist even after server restarts  
✅ **CDN Delivery**: Fast image delivery worldwide  
✅ **Automatic Optimization**: Images are automatically optimized  
✅ **Transformations**: Can resize/transform images on-the-fly  
✅ **Free Tier**: 25GB storage, 25GB bandwidth/month (free)

### 7. Testing

After setup, test by:
1. Upload a slider image via admin panel
2. Check MongoDB - `filename` should contain Cloudinary URL (starts with `https://res.cloudinary.com`)
3. Check Cloudinary dashboard - image should appear in `itu/sliders/` folder
4. Image should display on website

### 8. Migration from Local Storage

**Note**: Existing images in database with local filenames will need to be migrated. The frontend will automatically handle both:
- Old format: `filename.jpg` → constructs URL as `{API_URL}/uploads/filename.jpg`
- New format: `https://res.cloudinary.com/...` → uses URL directly

### 9. Troubleshooting

**Images not uploading?**
- Check Cloudinary credentials in `.env`
- Check console for Cloudinary errors
- Verify API key/secret are correct

**Images not showing?**
- Check if `filename` field contains full Cloudinary URL
- Verify Cloudinary URL is accessible in browser
- Check browser console for CORS errors

**Deletion not working?**
- Verify `cloudinaryPublicId` is stored in database
- Check Cloudinary dashboard to see if image exists
- Check console for deletion errors

### 10. Cloudinary Dashboard

Access your Cloudinary dashboard at:
- URL: [https://console.cloudinary.com](https://console.cloudinary.com)
- View all uploaded images
- Monitor usage
- Manage transformations

---

## Code Changes Summary

### Backend Changes:
1. ✅ Installed `cloudinary` package
2. ✅ Created `backend/config/cloudinary.js` configuration
3. ✅ Updated `multer.js` to use memory storage
4. ✅ Updated Slider model to include `cloudinaryPublicId`
5. ✅ Updated Gallery model to include `cloudinaryPublicId`
6. ✅ Updated all upload controllers to use Cloudinary
7. ✅ Updated delete controllers to delete from Cloudinary

### Frontend Changes:
- ✅ No changes needed! Frontend already handles full URLs
- ✅ `getImageUrl()` function already checks for full URLs (starts with `http://` or `https://`)
- ✅ Cloudinary URLs are full URLs, so they work automatically

---

## Next Steps

1. Set up Cloudinary account and get credentials
2. Add environment variables to `.env` and production
3. Test image uploads
4. (Optional) Migrate existing local images to Cloudinary

