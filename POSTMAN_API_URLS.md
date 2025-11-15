# Postman API URLs for Testing

## Base URL
- **Local Development**: `http://localhost:3001`
- **Production**: `https://itu-r1qa.onrender.com` (or your production URL)

---

## 📸 SLIDER ENDPOINTS

### 1. Get All Slider Images (Used in Home Page & Admin)
**Method**: `GET`  
**URL**: 
- Local: `http://localhost:3001/api/admin/getSlider`
- Production: `https://itu-r1qa.onrender.com/api/admin/getSlider`

**Description**: Returns all slider images from database. Used by both:
- Home page slider
- Admin slider management

**Response Format**:
```json
[
  {
    "_id": "slider_id",
    "filename": "image_filename.jpg",
    "uploadedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Example Image URL** (if filename is `slider-1234567890.jpg`):
- `http://localhost:3001/uploads/slider-1234567890.jpg`
- `https://itu-r1qa.onrender.com/uploads/slider-1234567890.jpg`

---

### 2. Upload Slider Image
**Method**: `POST`  
**URL**: 
- Local: `http://localhost:3001/api/admin/uploadSlider`
- Production: `https://itu-r1qa.onrender.com/api/admin/uploadSlider`

**Headers**:
- Content-Type: `multipart/form-data`

**Body** (form-data):
- `image`: [File] (Select file)

---

### 3. Delete Slider Image
**Method**: `DELETE`  
**URL**: 
- Local: `http://localhost:3001/api/admin/deleteSlider/:id`
- Production: `https://itu-r1qa.onrender.com/api/admin/deleteSlider/:id`

**Example**:
- `http://localhost:3001/api/admin/deleteSlider/65a1b2c3d4e5f6g7h8i9j0k1`

---

## 🖼️ GALLERY ENDPOINTS

### 1. Get All Gallery Images
**Method**: `GET`  
**URL**: 
- Local: `http://localhost:3001/api/admin/getGallery`
- Production: `https://itu-r1qa.onrender.com/api/admin/getGallery`

**Response Format**:
```json
[
  {
    "_id": "gallery_id",
    "filename": "gallery_image.jpg",
    "title": "Image Title",
    "uploadedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Example Image URL** (if filename is `gallery-1234567890.jpg`):
- `http://localhost:3001/uploads/gallery-1234567890.jpg`
- `https://itu-r1qa.onrender.com/uploads/gallery-1234567890.jpg`

---

## 📰 BLOG/NEWS ENDPOINTS

### 1. Get All News/Blog Posts
**Method**: `GET`  
**URL**: 
- Local: `http://localhost:3001/api/admin/getallNews`
- Production: `https://itu-r1qa.onrender.com/api/admin/getallNews`

**Response Format**:
```json
[
  {
    "_id": "news_id",
    "title": "News Title",
    "content": "News content...",
    "image": "news_image.jpg",
    "date": "2024-01-01T00:00:00.000Z"
  }
]
```

**Example Image URL** (if image is `news-1234567890.jpg`):
- `http://localhost:3001/uploads/news-1234567890.jpg`
- `https://itu-r1qa.onrender.com/uploads/news-1234567890.jpg`

---

### 2. Get Blog Posts (Alternative Blog Endpoint)
**Method**: `GET`  
**URL**: 
- Local: `http://localhost:3001/api/admin/blog/posts`
- Production: `https://itu-r1qa.onrender.com/api/admin/blog/posts`

---

### 3. Get Featured Blog Posts
**Method**: `GET`  
**URL**: 
- Local: `http://localhost:3001/api/admin/blog/featured`
- Production: `https://itu-r1qa.onrender.com/api/admin/blog/featured`

---

### 4. Get Blog Post by Slug
**Method**: `GET`  
**URL**: 
- Local: `http://localhost:3001/api/admin/blog/post/:slug`
- Production: `https://itu-r1qa.onrender.com/api/admin/blog/post/:slug`

**Example**:
- `http://localhost:3001/api/admin/blog/post/my-blog-post-title`

---

## 🔍 TESTING IN POSTMAN

### Quick Test Steps:

1. **Test Slider Images**:
   - Open Postman
   - Create new GET request
   - URL: `http://localhost:3001/api/admin/getSlider`
   - Click Send
   - Check response for `filename` field
   - Test image URL: `http://localhost:3001/uploads/{filename}`

2. **Test Gallery Images**:
   - Create new GET request
   - URL: `http://localhost:3001/api/admin/getGallery`
   - Click Send
   - Check response for `filename` field
   - Test image URL: `http://localhost:3001/uploads/{filename}`

3. **Test Blog/News**:
   - Create new GET request
   - URL: `http://localhost:3001/api/admin/getallNews`
   - Click Send
   - Check response for `image` field
   - Test image URL: `http://localhost:3001/uploads/{image}`

---

## 📝 NOTES

- All image files are served from `/uploads` directory
- Image URLs are constructed as: `{BASE_URL}/uploads/{filename}`
- Make sure backend server is running before testing
- For production, replace `localhost:3001` with your production URL
- Check CORS settings if you get CORS errors in Postman

---

## 🚀 PRODUCTION URLS

If your production backend is hosted at `https://itu-r1qa.onrender.com`:

- **Slider**: `https://itu-r1qa.onrender.com/api/admin/getSlider`
- **Gallery**: `https://itu-r1qa.onrender.com/api/admin/getGallery`
- **News**: `https://itu-r1qa.onrender.com/api/admin/getallNews`
- **Blog Posts**: `https://itu-r1qa.onrender.com/api/admin/blog/posts`

Image URLs will be:
- `https://itu-r1qa.onrender.com/uploads/{filename}`

