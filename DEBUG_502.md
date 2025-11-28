# Debug 502 Bad Gateway - Step by Step

## Immediate Actions

### 1. Check Render Logs (Most Important!)

1. Go to Render Dashboard → Your Backend Service (`nft-backend-iragaki`)
2. Click **"Logs"** tab
3. Scroll to the **bottom** (most recent logs)
4. Look for:
   - ❌ **Red errors** (compilation, startup failures)
   - ⚠️ **Warnings** (MongoDB connection, port issues)
   - ✅ **"Started BackendApplication"** (means it's working)

### 2. Common Errors to Look For

**MongoDB Connection Error:**
```
MongoSocketException: Exception in monitor thread
```
**Fix:** Add `0.0.0.0/0` to MongoDB Atlas Network Access

**Port Binding Error:**
```
Address already in use
```
**Fix:** Already configured with `server.address=0.0.0.0`

**Compilation Error:**
```
[ERROR] Failed to execute goal
```
**Fix:** Check Java syntax, dependencies

**Application Context Error:**
```
Error starting ApplicationContext
```
**Fix:** Usually MongoDB or missing environment variable

### 3. Quick Verification Checklist

✅ **Environment Variables Set:**
- `MONGODB_URI` - Must be set
- `MONGODB_DATABASE` - Must be set
- `PORT` - Render sets automatically (don't override)

✅ **Configuration:**
- `server.address=0.0.0.0` in application.properties ✅
- `server.port=${PORT:8081}` in application.properties ✅
- Dockerfile exposes port ✅

✅ **MongoDB Atlas:**
- Network Access allows `0.0.0.0/0` or Render IPs
- Connection string is correct

### 4. Try Manual Restart

1. In Render Dashboard → Your Backend Service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Watch the logs in real-time
4. See where it fails

### 5. If Still Failing

**Temporarily simplify CORS** (to rule it out):
- Comment out CORS config
- See if service starts
- If yes, CORS was the issue
- If no, it's something else (MongoDB, env vars, etc.)

## What to Share

If you need help, share:
1. **Last 50 lines of logs** from Render
2. **Any red error messages**
3. **When it started failing** (after which change)

## Most Likely Causes (in order)

1. **MongoDB Connection** (80% of cases)
   - Check MongoDB Atlas Network Access
   - Verify `MONGODB_URI` is correct

2. **Missing Environment Variable** (15%)
   - Check all required vars are set
   - Verify no typos in variable names

3. **CORS Config Issue** (5%)
   - The simplified config should work
   - Can temporarily disable to test

