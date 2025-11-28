# Fix CORS and Vite Host Blocking

## Issues Fixed

1. ✅ **Vite Preview Host Blocking** - Added `allowedHosts` to vite.config.ts
2. ✅ **CORS Configuration** - Updated backend to allow multiple origins including Render URLs

## Changes Made

### 1. Frontend (vite.config.ts)
Added `allowedHosts` to preview configuration:
```typescript
preview: {
  host: '0.0.0.0',
  port: parseInt(process.env.PORT || '4173'),
  strictPort: false,
  allowedHosts: [
    'badrabbit-iragaki-nft.onrender.com',
    'localhost',
    '.onrender.com', // Allow all Render subdomains
  ],
}
```

### 2. Backend (CorsConfig.java)
Updated to use `allowedOriginPatterns` which supports:
- Multiple specific origins
- Wildcard patterns (e.g., `https://*.onrender.com`)
- Your frontend URL from environment variable

## What You Need to Do

### 1. Update Backend Environment Variable

In Render dashboard, go to your backend service → Environment tab:

**Add or update:**
```
Name: FRONTEND_URL
Value: https://badrabbit-iragaki-nft.onrender.com
```

### 2. Commit and Push Changes

```bash
git add frontend/vite.config.ts backend/src/main/java/com/example/backend/CorsConfig.java
git commit -m "Fix: Add Vite allowedHosts and update CORS for Render deployment"
git push
```

### 3. Wait for Redeployment

Both services will automatically redeploy:
- Frontend: Will allow the host
- Backend: Will accept CORS requests from frontend

## Verify It's Working

After redeployment:
1. ✅ Frontend should load without host blocking errors
2. ✅ API calls from frontend should work without CORS errors
3. ✅ Check browser console - no CORS or host blocking errors

## URLs Configured

The CORS config now allows:
- `https://badrabbit-iragaki-nft.onrender.com` (your frontend)
- `http://localhost:5173` (local dev)
- `http://localhost:4173` (local preview)
- `https://*.onrender.com` (all Render subdomains)

## Important Notes

- The `allowedOriginPatterns` method supports wildcards (Spring Boot 2.4+)
- `allowedHosts` in Vite allows the host header check
- Make sure `FRONTEND_URL` environment variable is set correctly in Render

