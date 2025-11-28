# Environment Variables Reference

## Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:8081
```

For production on Render, set this to your backend URL:
```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

## Backend Environment Variables

Set these in Render dashboard or in `application.properties`:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port (Render sets this automatically) | `8081` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `MONGODB_DATABASE` | MongoDB database name | `iragaki-899` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-frontend.onrender.com` |
| `MORALIS_API_KEY` | Moralis API key | `eyJhbGci...` |
| `X_CLIENT_ID` | X (Twitter) OAuth client ID | `OUsza0xy...` |
| `X_CLIENT_SECRET` | X (Twitter) OAuth client secret | `ahIRlQA...` |
| `X_REDIRECT_URI` | X OAuth redirect URI | `https://backend.onrender.com/api/x/callback` |
| `FRONTEND_REDIRECT_URI` | Frontend OAuth callback | `https://frontend.onrender.com/oauth/x/callback` |
| `APILLON_API_KEY` | Apillon IPFS API key | `23facee0-...` |
| `APILLON_API_SECRET` | Apillon IPFS API secret | `ewvn6TvStgnM` |
| `APILLON_BUCKET_UUID` | Apillon bucket UUID | `ec101c26-...` |

## Local Development Setup

1. **Frontend**: Create `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8081
   ```

2. **Backend**: The `application.properties` file has default values for local development.

## Production Setup on Render

1. **Backend Service**:
   - Set all environment variables in Render dashboard
   - Make sure `FRONTEND_URL` matches your frontend service URL exactly
   - Update `X_REDIRECT_URI` and `FRONTEND_REDIRECT_URI` with production URLs

2. **Frontend Service**:
   - Set `VITE_API_BASE_URL` to your backend service URL
   - Example: `https://nft-backend-xxxx.onrender.com`

## Important Notes

- Never commit `.env` files to Git
- All sensitive keys should be stored in Render's environment variables
- The `render.yaml` file uses `sync: false` for security (you must set values manually)
- For local development, defaults in `application.properties` will be used if env vars are not set

