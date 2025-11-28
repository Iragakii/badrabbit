# Fix 502 Bad Gateway After CORS Update

## Problem
Backend returned 502 Bad Gateway after updating CORS configuration. This was likely due to:
1. Using both `allowedOriginPatterns` and `allowedOrigins` together (not allowed)
2. Compilation error in CORS config

## Solution Applied

✅ **Fixed CORS Configuration** - Now uses only `allowedOriginPatterns` which supports:
- Specific origins (exact URLs)
- Wildcard patterns (e.g., `https://*.onrender.com`)
- Both together in the same list

## What Changed

**Before (Broken):**
- Used both `allowedOriginPatterns` and `allowedOrigins` - causes error
- Could cause compilation or runtime failure

**After (Fixed):**
- Uses only `allowedOriginPatterns` 
- Supports both specific URLs and wildcards
- Properly handles null/empty frontend URL

## Next Steps

1. **Commit and push:**
   ```bash
   git add backend/src/main/java/com/example/backend/CorsConfig.java
   git commit -m "Fix: CORS config - use only allowedOriginPatterns"
   git push
   ```

2. **Wait for redeployment** (2-5 minutes)

3. **Verify:**
   - Backend should be live again
   - No 502 errors
   - CORS should work for frontend

## CORS Now Allows

- `https://badrabbit-iragaki-nft.onrender.com` (your frontend)
- `http://localhost:5173` (local dev)
- `http://localhost:4173` (local preview)
- `https://*.onrender.com` (all Render subdomains)
- `http://localhost:*` (localhost on any port)
- Frontend URL from `FRONTEND_URL` environment variable

## Important Notes

- Spring Boot 3.1.5 supports `allowedOriginPatterns` with wildcards
- Cannot use both `allowedOriginPatterns` and `allowedOrigins` together
- `allowedOriginPatterns` can accept both specific URLs and wildcard patterns

