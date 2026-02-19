# 🚂 Railway Deployment Guide (Easiest Method)

Railway is much simpler than Google Cloud. It connects to your GitHub and handles everything automatically.

## 🛠️ Step 1: Prepare your Code
1.  **Push to GitHub**: Ensure your `backend` folder is pushed to a GitHub repository.
2.  **Check Port**: Ensure your `backend/index.js` uses the dynamic port:
    ```javascript
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
    ```

---

## 🚀 Step 2: Deploy on Railway

1.  **Login**: Go to [Railway.app](https://railway.app/) and login with your **GitHub** account.
2.  **New Project**: Click **"+ New Project"**.
3.  **Choose Source**: Select **"Deploy from GitHub repo"**.
4.  **Configure**:
    *   Select your repository.
    *   Click **"Deploy Now"**.
5.  **Set Root Directory**: 
    *   If your backend is in a folder named `backend`, go to **Settings** -> **General** -> **Root Directory** and set it to `/backend`.
6.  **Add Variables**:
    *   Go to the **Variables** tab.
    *   Click **"Raw Editor"** and paste your `.env` content, or add them one by one:
        *   `MONGODB_URI`
        *   `JWT_SECRET`
        *   `RESEND_API_KEY`
        *   `RESEND_FROM_EMAIL` (etc.)

---

## 🔗 Step 3: Get your URL
1.  Go to the **Settings** tab.
2.  Under **Networking**, click **"Generate Domain"**.
3.  You will get a URL like `https://backend-production-xyz.up.railway.app`.
4.  Copy this URL and put it in your **Frontend** `.env` file as `VITE_API_BASE_URL`.

---

## 📦 Step 4: Persistent Storage (Images)
**Note:** Just like Google Cloud, Railway's disk is temporary. 
- Images in `uploads/` will be deleted if the server restarts.
- **Solution:** Use **Cloudinary** or **Firebase Storage** for your images to keep them forever for free.

---

## 💰 Is it Free?
*   **Trial**: Railway gives you **$5 monthly credit** for free (which is usually enough for a small backend to run 24/7 if it doesn't use massive RAM).
*   **Hobby Plan**: If you exceed the $5, it is very cheap (usage-based).

---

## ✅ Why Railway?
- **Zero Config**: No Dockerfiles needed.
- **Auto-SSL**: Your API is automatically `https`.
- **Easy Logs**: Click the "Logs" tab to see exactly why your server is running or crashing.
