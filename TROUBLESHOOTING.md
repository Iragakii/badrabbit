# Troubleshooting 502 Bad Gateway Error

## Common Causes and Solutions

### 1. Check Build Logs

In Render dashboard:
1. Go to your service
2. Click on "Logs" tab
3. Look for error messages during startup

Common errors you might see:
- `MongoSocketException` - MongoDB connection issue
- `BeanCreationException` - Missing configuration
- `Port already in use` - Port configuration issue

### 2. MongoDB Connection Issue

**Problem**: MongoDB Atlas might be blocking Render's IP addresses.

**Solution**:
1. Go to MongoDB Atlas dashboard
2. Click "Network Access" → "IP Access List"
3. Click "Add IP Address"
4. Click "Allow Access from Anywhere" (adds `0.0.0.0/0`)
   - Or add Render's IP ranges if you want to be more secure
5. Wait 1-2 minutes for changes to propagate

### 3. Missing Environment Variables

**Check if all required variables are set:**

Go to Render → Your Service → Environment tab and verify:

✅ Required variables:
- `MONGODB_URI` - Must be set
- `MONGODB_DATABASE` - Must be set
- `PORT` - Render sets this automatically, but you can set it to `8081` to be safe

✅ Optional but recommended:
- `MORALIS_API_KEY`
- `X_CLIENT_ID`
- `X_CLIENT_SECRET`
- `APILLON_API_KEY`
- `APILLON_API_SECRET`
- `APILLON_BUCKET_UUID`

⚠️ Can be set later (after frontend deploys):
- `FRONTEND_URL`
- `X_REDIRECT_URI`
- `FRONTEND_REDIRECT_URI`

### 4. Port Configuration

Render automatically sets the `PORT` environment variable. Spring Boot should read it from `server.port=${PORT:8081}`.

**If still having issues**, try:
1. In Render, set `PORT=8081` explicitly
2. Or remove the PORT variable and let Render handle it automatically

### 5. Check Application Logs

The error message shows:
```
Error starting ApplicationContext
```

This usually means:
- **Database connection failed** - Check MongoDB URI and network access
- **Missing required bean** - Check if all dependencies are available
- **Configuration error** - Check environment variables

### 6. Verify MongoDB URI Format

Your MongoDB URI should be:
```
mongodb+srv://sakamoto:satoshi@cluster0.mil1lct.mongodb.net/
```

Make sure:
- ✅ No trailing slash issues
- ✅ Username and password are correct
- ✅ Cluster name is correct
- ✅ Network access is allowed

### 7. Test MongoDB Connection

You can test if MongoDB is accessible:
1. Try connecting from a different location
2. Check MongoDB Atlas logs for connection attempts
3. Verify the connection string is correct

### 8. Docker Build Issues

If Docker build fails:
1. Check build logs in Render
2. Verify `backend/Dockerfile` exists
3. Make sure `backend/pom.xml` is correct
4. Check if Maven dependencies download successfully

### 9. Quick Fix Checklist

- [ ] MongoDB Atlas network access allows `0.0.0.0/0` or Render IPs
- [ ] `MONGODB_URI` environment variable is set correctly
- [ ] `MONGODB_DATABASE` environment variable is set
- [ ] All environment variables have correct values (no typos)
- [ ] Build completed successfully (check build logs)
- [ ] Service is not in "Sleep" mode (free tier limitation)

### 10. Enable Debug Logging

To see more detailed error messages, you can temporarily add to `application.properties`:

```properties
logging.level.root=DEBUG
logging.level.org.springframework=DEBUG
```

But this will create a lot of logs, so remove it after debugging.

## Most Likely Issue

Based on the error "Error starting ApplicationContext", the most common cause is:

**MongoDB Connection Failure**

1. ✅ **First**: Check MongoDB Atlas Network Access
2. ✅ **Second**: Verify `MONGODB_URI` is set correctly in Render
3. ✅ **Third**: Check build logs for specific MongoDB error messages

## Next Steps

1. Check Render logs for specific error message
2. Verify MongoDB Atlas network access
3. Double-check all environment variables are set
4. Try redeploying after fixing MongoDB access

## Still Having Issues?

1. Copy the full error log from Render
2. Check MongoDB Atlas connection logs
3. Verify all environment variables match the format in `RENDER_ENV_VARS.md`

