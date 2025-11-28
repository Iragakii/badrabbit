# Quick Start: Deploy to Render.com

## Prerequisites
- Git repository with your code
- Render.com account
- MongoDB Atlas account

## Step-by-Step Deployment

### 1. Prepare Your Code

Make sure all files are committed and pushed to your Git repository.

### 2. Deploy Backend (Spring Boot)

**Option A: Using Docker (Recommended if Java language not available)**

1. Go to https://dashboard.render.com/web/new
2. Connect your Git repository
3. Configure:
   - **Name**: `nft-backend`
   - **Environment**: `Docker` (choose Docker if Java not available)
   - **Root Directory**: `backend` (or leave empty if Dockerfile is in root)
   - **Dockerfile Path**: `backend/Dockerfile` (or just `Dockerfile` if root is backend)
   - **Docker Context**: `backend` (or leave empty)

**Option B: Using Java Runtime (if available)**

1. Go to https://dashboard.render.com/web/new
2. Connect your Git repository
3. Configure:
   - **Name**: `nft-backend`
   - **Language**: `Java` or `Maven` (if available)
   - **Root Directory**: Leave empty
   - **Build Command**: `cd backend && mvn clean package -DskipTests`
   - **Start Command**: `cd backend && java -jar target/backend-0.0.1-SNAPSHOT.jar`
4. Add environment variables (see `ENV_VARIABLES.md`)
5. Click "Create Web Service"
6. **Copy the backend URL** (e.g., `https://nft-backend-xxxx.onrender.com`)

### 3. Deploy Frontend (React)

1. Go to https://dashboard.render.com/web/new
2. Connect the same Git repository
3. Configure:
   - **Name**: `nft-frontend`
   - **Language**: `Node` (correct for React/Vite)
   - **Root Directory**: Leave empty
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm run preview`
4. Add environment variable:
   - `VITE_API_BASE_URL` = your backend URL from step 2
5. Click "Create Web Service"
6. **Copy the frontend URL** (e.g., `https://nft-frontend-xxxx.onrender.com`)

### 4. Update Backend Environment Variables

Go back to your backend service and update:
- `FRONTEND_URL` = your frontend URL from step 3
- `X_REDIRECT_URI` = `https://your-backend-url.onrender.com/api/x/callback`
- `FRONTEND_REDIRECT_URI` = `https://your-frontend-url.onrender.com/oauth/x/callback`

### 5. Redeploy

Both services will automatically redeploy when you update environment variables.

## Alternative: Use Blueprint (render.yaml)

1. Push `render.yaml` to your repository
2. In Render, select "New" → "Blueprint"
3. Connect your repository
4. Render will create both services automatically
5. Add environment variables in the Render dashboard

## Troubleshooting

- **Build fails**: Check build logs in Render dashboard
- **CORS errors**: Verify `FRONTEND_URL` matches exactly
- **API not working**: Check `VITE_API_BASE_URL` is set correctly
- **Database connection**: Verify MongoDB Atlas network access

## Next Steps

- Update remaining hardcoded URLs using `MIGRATION_GUIDE.md`
- Set up custom domains (optional)
- Configure health checks
- Set up monitoring

For detailed information, see `DEPLOYMENT.md`.

