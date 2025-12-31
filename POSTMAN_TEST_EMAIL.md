# 📧 Postman Test Email Setup

## ✅ Correct Request Format

### Method: POST
### URL: `https://itu-r1qa.onrender.com/test-email`

### Headers:
```
Content-Type: application/json
```

### Body (raw JSON):
```json
{
  "email": "satyanarayansaiprasadofficial@gmail.com"
}
```

## ❌ Common Mistakes

### Wrong Format 1 (Array with string):
```json
[
  "email":"satyanarayansaiprasadofficial@gmail.com"
]
```
**Problem:** Invalid JSON syntax - mixing array and object syntax

### Wrong Format 2 (Array):
```json
[
  {
    "email": "satyanarayansaiprasadofficial@gmail.com"
  }
]
```
**Problem:** Server expects an object, not an array

### Wrong Format 3 (Missing quotes):
```json
{
  email: "satyanarayansaiprasadofficial@gmail.com"
}
```
**Problem:** JSON keys must be in quotes

## ✅ Correct Format

```json
{
  "email": "satyanarayansaiprasadofficial@gmail.com"
}
```

## 📋 Postman Setup Steps

1. **Method:** Select `POST`
2. **URL:** `https://itu-r1qa.onrender.com/test-email`
3. **Headers Tab:**
   - Add header: `Content-Type` = `application/json`
4. **Body Tab:**
   - Select `raw`
   - Select `JSON` from dropdown
   - Paste this:
     ```json
     {
       "email": "satyanarayansaiprasadofficial@gmail.com"
     }
     ```
5. **Click Send**

## ✅ Expected Response (Success)

```json
{
  "success": true,
  "message": "Test email sent successfully",
  "details": {
    "to": "satyanarayansaiprasadofficial@gmail.com",
    "messageId": "re_xxxxx"
  }
}
```

## ❌ Expected Response (Error)

```json
{
  "success": false,
  "error": "Email address is required"
}
```
**This means:** JSON body is not being parsed correctly (check format)

## 🔍 Troubleshooting

### Error: "Email address is required"
- ✅ Check JSON is valid (use JSON validator)
- ✅ Check `Content-Type: application/json` header is set
- ✅ Check body is `raw` and format is `JSON`
- ✅ Ensure it's an object `{}`, not an array `[]`

### Error: "Route not found"
- ✅ Use POST method (not GET)
- ✅ Check URL is correct: `/test-email`
- ✅ Wait for Render to finish deploying

### Error: "Invalid from field"
- ✅ Code needs to be deployed (push to GitHub)
- ✅ Check Render logs for details

## 🎯 Quick Test Command

```bash
curl -X POST https://itu-r1qa.onrender.com/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"satyanarayansaiprasadofficial@gmail.com"}'
```

---

**The key issue in your screenshot:** The JSON body was an array `[]` instead of an object `{}`. Use the correct format above! ✅

