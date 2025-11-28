# How to Check Render Logs for 502 Error

## Steps to Debug

1. **Go to Render Dashboard**
   - Navigate to your backend service: `nft-backend-iragaki`
   - Click on "Logs" tab

2. **Look for these errors:**
   - Compilation errors (Java/Maven)
   - MongoDB connection errors
   - Port binding errors
   - Application startup failures

3. **Common Issues:**

   **If you see MongoDB errors:**
   - Check MongoDB Atlas Network Access
   - Verify `MONGODB_URI` environment variable is correct
   - Make sure MongoDB allows connections from Render IPs

   **If you see port errors:**
   - Verify `server.address=0.0.0.0` is in application.properties
   - Check if PORT environment variable is set

   **If you see compilation errors:**
   - Check the CORS config syntax
   - Verify all dependencies are available

4. **Quick Fixes:**

   **If CORS is the issue:**
   - The simplified CORS config should work
   - If not, we can temporarily disable CORS to test

   **If MongoDB is the issue:**
   - Add `0.0.0.0/0` to MongoDB Atlas Network Access
   - Wait 1-2 minutes for changes to propagate

   **If port is the issue:**
   - Verify `server.address=0.0.0.0` is set
   - Check Dockerfile exposes correct port

## What to Share

If the issue persists, share:
1. The last 50-100 lines of logs from Render
2. Any error messages you see
3. When the error started (after which change)

