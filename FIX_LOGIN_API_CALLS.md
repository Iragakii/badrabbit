# Fix Login API Calls - Use Backend URL

## Problem
Frontend was calling relative URLs like `/api/auth/message` which in production tries to call the frontend URL instead of the backend.

**Error:** `GET https://badrabbit-iragaki-nft.onrender.com/api/auth/message` → 500 error

**Should be:** `GET https://nft-backend-iragaki.onrender.com/api/auth/message`

## Fix Applied

✅ **Updated `ModalLogin.tsx`** to use `getApiUrl()` helper:
- `/api/auth/message` → `getApiUrl('api/auth/message')`
- `/api/auth/verify` → `getApiUrl('api/auth/verify')`
- `/api/wallet/${address}/erc20` → `getApiUrl('api/wallet/${address}/erc20')`

## What Changed

1. **Added import:** `import { getApiUrl } from '../../config/api';`
2. **Updated all fetch calls** to use `getApiUrl()` instead of relative URLs
3. **Added error handling** for failed API calls

## Next Steps

1. **Verify Frontend Environment Variable:**
   - In Render → Frontend Service → Environment
   - Make sure `VITE_API_BASE_URL` is set to: `https://nft-backend-iragaki.onrender.com`

2. **Commit and Push:**
   ```bash
   git add frontend/src/Modal/ModalLogin/ModalLogin.tsx
   git commit -m "Fix: Use backend URL for login API calls"
   git push
   ```

3. **Wait for redeployment** (2-5 minutes)

4. **Test Login:**
   - Try logging in with MetaMask
   - Should now call the correct backend URL
   - Should get proper response instead of 500 error

## Important Note

The `VITE_API_BASE_URL` environment variable **must** be set in Render for the frontend to know where the backend is. Without it, it will default to `http://localhost:8081` which won't work in production.

