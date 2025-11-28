# Fix Frontend Port Binding Issue

## Problem
Vite preview server is not binding to `0.0.0.0` and not using Render's PORT environment variable.

## Solution Applied

✅ **Updated `vite.config.ts`** to configure preview server:
```typescript
preview: {
  host: '0.0.0.0',
  port: parseInt(process.env.PORT || '4173'),
  strictPort: false,
}
```

✅ **Updated start command** in Render to explicitly bind to 0.0.0.0:
```
cd frontend && vite preview --host 0.0.0.0 --port $PORT
```

## What Changed

1. **Added preview configuration** to `vite.config.ts` - Binds to 0.0.0.0 and uses PORT env var
2. **Updated start command** - Explicitly sets host and port for Render
3. **Updated documentation** - QUICK_START.md and DEPLOYMENT.md now have correct start command

## Next Steps

1. **Update your Render service:**
   - Go to your frontend service in Render dashboard
   - Click "Settings"
   - Update "Start Command" to: `cd frontend && vite preview --host 0.0.0.0 --port $PORT`
   - Click "Save Changes"
   - Render will automatically redeploy

2. **Or commit and push** (if using render.yaml):
   ```bash
   git add frontend/vite.config.ts render.yaml
   git commit -m "Fix: Bind Vite preview to 0.0.0.0 for Render"
   git push
   ```

## Verify It's Working

After redeployment:
- ✅ Service shows "Live" status
- ✅ No "No open ports detected" errors
- ✅ Frontend is accessible at your Render URL

## Important Notes

- Render sets `PORT` environment variable automatically
- Vite preview needs `--host 0.0.0.0` to accept external connections
- The `$PORT` variable is provided by Render automatically

