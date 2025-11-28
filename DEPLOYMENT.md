# Deployment Guide for Render.com

This guide will help you deploy your NFT marketplace application to Render.com.

## Prerequisites

1. A Render.com account (sign up at https://dashboard.render.com)
2. MongoDB Atlas account (or your MongoDB connection string)
3. All API keys and secrets ready

## Step 1: Prepare Your Repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

## Step 2: Deploy Backend Service

1. Go to https://dashboard.render.com/web/new
2. Click "New" → "Web Service"
3. Connect your repository
4. Configure the service:
   - **Name**: `nft-backend`
   - **Environment**: `Java`
   - **Build Command**: `cd backend && mvn clean package -DskipTests`
   - **Start Command**: `cd backend && java -jar target/backend-0.0.1-SNAPSHOT.jar`
   - **Plan**: Choose a plan (Starter is fine for testing)

5. Add Environment Variables:
   ```
   PORT=8081
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DATABASE=iragaki-899
   FRONTEND_URL=https://your-frontend-url.onrender.com
   MORALIS_API_KEY=your_moralis_api_key
   X_CLIENT_ID=your_x_client_id
   X_CLIENT_SECRET=your_x_client_secret
   X_REDIRECT_URI=https://your-backend-url.onrender.com/api/x/callback
   FRONTEND_REDIRECT_URI=https://your-frontend-url.onrender.com/oauth/x/callback
   APILLON_API_KEY=your_apillon_api_key
   APILLON_API_SECRET=your_apillon_api_secret
   APILLON_BUCKET_UUID=your_apillon_bucket_uuid
   ```

6. Click "Create Web Service"

## Step 3: Deploy Frontend Service

1. Go to https://dashboard.render.com/web/new
2. Click "New" → "Web Service"
3. Connect the same repository
4. Configure the service:
   - **Name**: `nft-frontend`
   - **Environment**: `Node`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm run preview`
   - **Plan**: Choose a plan

5. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```

6. Click "Create Web Service"

## Step 4: Update URLs

After both services are deployed:

1. Copy the backend URL (e.g., `https://nft-backend-xxxx.onrender.com`)
2. Copy the frontend URL (e.g., `https://nft-frontend-xxxx.onrender.com`)
3. Update the backend environment variable:
   - `FRONTEND_URL` = your frontend URL
   - `X_REDIRECT_URI` = `https://your-backend-url.onrender.com/api/x/callback`
   - `FRONTEND_REDIRECT_URI` = `https://your-frontend-url.onrender.com/oauth/x/callback`
4. Update the frontend environment variable:
   - `VITE_API_BASE_URL` = your backend URL
5. Redeploy both services

## Step 5: Update CORS Configuration

The backend CORS configuration will automatically use the `FRONTEND_URL` environment variable.

## Important Notes

1. **Free Tier Limitations**: Render's free tier spins down services after 15 minutes of inactivity. Consider upgrading for production.

2. **MongoDB Atlas**: Make sure your MongoDB Atlas IP whitelist includes Render's IP ranges or allows all IPs (0.0.0.0/0) for testing.

3. **File Uploads**: The current setup stores files locally. For production, consider using cloud storage (AWS S3, Cloudinary, etc.).

4. **Environment Variables**: Never commit sensitive keys to your repository. Always use Render's environment variables.

5. **Health Checks**: The backend has a health check endpoint at `/api/auth/me`. Make sure this is accessible.

## Troubleshooting

- **Build Fails**: Check the build logs in Render dashboard
- **CORS Errors**: Verify `FRONTEND_URL` matches your frontend URL exactly
- **Database Connection**: Check MongoDB Atlas network access settings
- **API Not Working**: Verify `VITE_API_BASE_URL` is set correctly in frontend

## Alternative: Using render.yaml

You can also use the `render.yaml` file for automated deployment:

1. Push `render.yaml` to your repository root
2. In Render dashboard, select "New" → "Blueprint"
3. Connect your repository
4. Render will automatically detect and use the `render.yaml` file

This will create both services automatically with the configuration specified in the file.

