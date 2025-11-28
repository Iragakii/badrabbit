# Render Environment Variables Setup Guide

## Backend Service Environment Variables

When deploying the backend on Render, add these environment variables in the "Environment Variables" section:

### Required Variables

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `PORT` | `8081` | Server port (Render may set this automatically, but set it to be safe) |
| `MONGODB_URI` | `mongodb+srv://sakamoto:satoshi@cluster0.mil1lct.mongodb.net/` | Your MongoDB connection string |
| `MONGODB_DATABASE` | `iragaki-899` | Your MongoDB database name |
| `FRONTEND_URL` | `https://your-frontend-url.onrender.com` | **Set this AFTER frontend deploys** - Your frontend URL for CORS |
| `MORALIS_API_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjUwZmEyYWUyLTRlOGUtNDg1Yy1iMWUyLWQ3ODc0NzJiNjY1ZiIsIm9yZ0lkIjoiNDc0NzY5IiwidXNlcklkIjoiNDg4NDE1IiwidHlwZSI6IlBST0pFQ1QiLCJ0eXBlSWQiOiJjNDlhOTYzNS04ODI4LTRkYTYtODg4Yy0yYTAzNDczNTQ0MjgiLCJpYXQiOjE3NTk5MTc4MDcsImV4cCI6NDkxNTY3NzgwN30.qe3vc5_8D-zEH0Davm7z9sE4Y512OL3JVWyFeKXQa0k` | Your Moralis API key |
| `X_CLIENT_ID` | `OUsza0xyMWF2SGlfX2tTNUMwVGU6MTpjaQ` | X (Twitter) OAuth client ID |
| `X_CLIENT_SECRET` | `ahIRlQA_LWtqaLMBTwTWwHDXdJg8AKPxg9nX_1ScfjTvonhx0B` | X (Twitter) OAuth client secret |
| `X_REDIRECT_URI` | `https://your-backend-url.onrender.com/api/x/callback` | **Set this AFTER backend deploys** - OAuth callback URL |
| `FRONTEND_REDIRECT_URI` | `https://your-frontend-url.onrender.com/oauth/x/callback` | **Set this AFTER frontend deploys** - Frontend OAuth callback |
| `APILLON_API_KEY` | `23facee0-0b3e-4665-8653-29d59ac5bf5a` | Apillon IPFS API key |
| `APILLON_API_SECRET` | `ewvn6TvStgnM` | Apillon IPFS API secret |
| `APILLON_BUCKET_UUID` | `ec101c26-67eb-40d3-83ba-52758c44cf93` | Apillon bucket UUID |

## Step-by-Step: Adding Variables in Render

### Initial Setup (Before First Deploy)

1. In Render dashboard, go to your backend service
2. Click on "Environment" tab
3. Click "Add Environment Variable"
4. Add these variables **one by one**:

**First, add these (you have the values):**
```
Name: PORT
Value: 8081
```

```
Name: MONGODB_URI
Value: mongodb+srv://sakamoto:satoshi@cluster0.mil1lct.mongodb.net/
```

```
Name: MONGODB_DATABASE
Value: iragaki-899
```

```
Name: MORALIS_API_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjUwZmEyYWUyLTRlOGUtNDg1Yy1iMWUyLWQ3ODc0NzJiNjY1ZiIsIm9yZ0lkIjoiNDc0NzY5IiwidXNlcklkIjoiNDg4NDE1IiwidHlwZSI6IlBST0pFQ1QiLCJ0eXBlSWQiOiJjNDlhOTYzNS04ODI4LTRkYTYtODg4Yy0yYTAzNDczNTQ0MjgiLCJpYXQiOjE3NTk5MTc4MDcsImV4cCI6NDkxNTY3NzgwN30.qe3vc5_8D-zEH0Davm7z9sE4Y512OL3JVWyFeKXQa0k
```

```
Name: X_CLIENT_ID
Value: OUsza0xyMWF2SGlfX2tTNUMwVGU6MTpjaQ
```

```
Name: X_CLIENT_SECRET
Value: ahIRlQA_LWtqaLMBTwTWwHDXdJg8AKPxg9nX_1ScfjTvonhx0B
```

```
Name: APILLON_API_KEY
Value: 23facee0-0b3e-4665-8653-29d59ac5bf5a
```

```
Name: APILLON_API_SECRET
Value: ewvn6TvStgnM
```

```
Name: APILLON_BUCKET_UUID
Value: ec101c26-67eb-40d3-83ba-52758c44cf93
```

**Then deploy the backend first!**

### After Backend Deploys

5. Copy your backend URL (e.g., `https://nft-backend-xxxx.onrender.com`)
6. Add this variable:
```
Name: X_REDIRECT_URI
Value: https://your-backend-url.onrender.com/api/x/callback
```
(Replace `your-backend-url.onrender.com` with your actual backend URL)

### After Frontend Deploys

7. Copy your frontend URL (e.g., `https://nft-frontend-xxxx.onrender.com`)
8. Add these variables:
```
Name: FRONTEND_URL
Value: https://your-frontend-url.onrender.com
```

```
Name: FRONTEND_REDIRECT_URI
Value: https://your-frontend-url.onrender.com/oauth/x/callback
```
(Replace `your-frontend-url.onrender.com` with your actual frontend URL)

9. Save changes - Render will automatically redeploy

## Frontend Service Environment Variables

For the frontend service, add:

| Variable Name | Value |
|---------------|-------|
| `VITE_API_BASE_URL` | `https://your-backend-url.onrender.com` |

(Replace with your actual backend URL after it deploys)

## Important Notes

- ✅ **No spaces** around the `=` sign in variable names
- ✅ Variable names are **case-sensitive** (use exact names shown)
- ✅ Replace placeholder URLs with your actual Render URLs
- ✅ After adding/updating variables, Render will auto-redeploy
- ⚠️ Some variables need to be set AFTER services deploy (URLs)

## Quick Copy-Paste Format

For easier setup, here's the format Render expects:

```
PORT=8081
MONGODB_URI=mongodb+srv://sakamoto:satoshi@cluster0.mil1lct.mongodb.net/
MONGODB_DATABASE=iragaki-899
MORALIS_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjUwZmEyYWUyLTRlOGUtNDg1Yy1iMWUyLWQ3ODc0NzJiNjY1ZiIsIm9yZ0lkIjoiNDc0NzY5IiwidXNlcklkIjoiNDg4NDE1IiwidHlwZSI6IlBST0pFQ1QiLCJ0eXBlSWQiOiJjNDlhOTYzNS04ODI4LTRkYTYtODg4Yy0yYTAzNDczNTQ0MjgiLCJpYXQiOjE3NTk5MTc4MDcsImV4cCI6NDkxNTY3NzgwN30.qe3vc5_8D-zEH0Davm7z9sE4Y512OL3JVWyFeKXQa0k
X_CLIENT_ID=OUsza0xyMWF2SGlfX2tTNUMwVGU6MTpjaQ
X_CLIENT_SECRET=ahIRlQA_LWtqaLMBTwTWwHDXdJg8AKPxg9nX_1ScfjTvonhx0B
APILLON_API_KEY=23facee0-0b3e-4665-8653-29d59ac5bf5a
APILLON_API_SECRET=ewvn6TvStgnM
APILLON_BUCKET_UUID=ec101c26-67eb-40d3-83ba-52758c44cf93
```

Then add the URL-based variables after deployment.

