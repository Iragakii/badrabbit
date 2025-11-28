# Fix 502 Bad Gateway - Backend Crashing

## Problem
Backend service keeps crashing after a few seconds, causing 502 errors. The service starts, then immediately fails.

## Root Cause
Most likely: **MongoDB connection failure** during startup causes the application to crash.

## Fixes Applied

### 1. Made ItemDataLoader Resilient ✅
- Added try-catch around MongoDB operations
- Application will start even if seed data fails to load
- Logs warning instead of crashing

### 2. Added MongoDB Connection Timeouts ✅
- Set connection timeout to 10 seconds
- Set socket timeout to 10 seconds
- Set server selection timeout to 10 seconds
- Prevents hanging on connection attempts

### 3. Added Startup Error Handling ✅
- Better error logging in main method
- Application will show clear error messages if startup fails

## What You Need to Do

### 1. Check MongoDB Atlas (Most Important!)

**Go to MongoDB Atlas → Network Access:**
1. Click "Add IP Address"
2. Click "Allow Access from Anywhere" (`0.0.0.0/0`)
3. Wait 1-2 minutes for changes to propagate

**Verify Connection String:**
- In Render → Backend Service → Environment
- Check `MONGODB_URI` is correct
- Should be: `mongodb+srv://sakamoto:satoshi@cluster0.mil1lct.mongodb.net/`

### 2. Check Render Logs

**Go to Render Dashboard → Backend Service → Logs:**
- Look for MongoDB connection errors
- Look for "Failed to start application" messages
- Check if there are any exception stack traces

### 3. Commit and Push

```bash
git add backend/src/main/java/com/example/backend/config/ItemDataLoader.java
git add backend/src/main/java/com/example/backend/BackendApplication.java
git add backend/src/main/resources/application.properties
git commit -m "Fix: Make backend resilient to MongoDB connection failures"
git push
```

### 4. Monitor After Deployment

- Watch the logs in real-time
- Check if service stays up longer
- Look for any new error messages

## Expected Behavior After Fix

✅ **If MongoDB is available:**
- Service starts normally
- Seed data loads (if needed)
- All endpoints work

✅ **If MongoDB is unavailable:**
- Service still starts
- Seed data loading fails gracefully (logged as warning)
- API endpoints that need MongoDB will return errors, but service stays up
- `/api/auth/message` should still work (doesn't need MongoDB)

## Debugging Steps

1. **Check if MongoDB is the issue:**
   - Look for `MongoSocketException` in logs
   - Check MongoDB Atlas Network Access

2. **Check if it's another issue:**
   - Look for other exception types in logs
   - Check if all environment variables are set
   - Verify Docker build completes successfully

3. **Test the endpoint:**
   - Try: `https://nft-backend-iragaki.onrender.com/api/auth/message?address=0x123`
   - Should work even if MongoDB is down (doesn't use MongoDB)

## Most Likely Solution

**MongoDB Atlas Network Access** - This is the #1 cause of backend crashes on Render.

1. Go to MongoDB Atlas
2. Network Access → Add IP → Allow from anywhere
3. Wait 2 minutes
4. Service should stay up

The fixes I made will help, but MongoDB connection is still required for most endpoints to work properly.

