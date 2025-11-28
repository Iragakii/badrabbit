# Fix 500 Error on Login

## Problem
Getting 500 error when calling `/api/auth/message?address=0x4eb93d214e037926165b9d689818e609d4efe6c4`
Error: "Unexpected end of JSON input" - suggests empty or malformed response

## Possible Causes

1. **MongoDB Connection Failure** - If MongoDB is down, Spring might fail to initialize beans
2. **CORS Preflight Issue** - OPTIONS request might be failing
3. **Exception Not Caught** - Some exception is being thrown but not handled properly
4. **Response Format Issue** - Response might be empty or corrupted

## Fixes Applied

✅ **Added Global Exception Handler** - Catches all exceptions and returns proper JSON
✅ **Added Error Handling** - `/api/auth/message` now has try-catch
✅ **Better Error Messages** - Returns proper JSON error responses

## Next Steps

1. **Check Render Logs:**
   - Go to Render Dashboard → Backend Service → Logs
   - Look for MongoDB connection errors
   - Look for any exception stack traces

2. **Verify MongoDB:**
   - Check MongoDB Atlas is accessible
   - Verify `MONGODB_URI` environment variable is correct
   - Check Network Access allows Render IPs

3. **Test the Endpoint:**
   - Try: `https://nft-backend-iragaki.onrender.com/api/auth/message?address=0x4eb93d214e037926165b9d689818e609d4efe6c4`
   - Should return: `{"message": "Login to MyApp with wallet ..."}`

4. **Commit and Push:**
   ```bash
   git add backend/src/main/java/com/example/backend/exception/GlobalExceptionHandler.java
   git add backend/src/main/java/com/example/backend/Controller/AuthController.java
   git commit -m "Add error handling for auth endpoints"
   git push
   ```

## Most Likely Issue

**MongoDB Connection Failure** - If MongoDB can't connect, Spring might fail to initialize the `UserRepository` bean, which could cause the controller to fail.

**Quick Test:**
- Check if MongoDB Atlas Network Access allows `0.0.0.0/0`
- Verify the connection string in Render environment variables
- Check Render logs for MongoDB connection errors

## If Still Failing

Share the error from Render logs - it will show the exact exception causing the 500 error.

