# Render.com Deployment Setup - Complete Guide

This repository is configured for deployment on Render.com. Follow the guides below to deploy your NFT marketplace.

## 📚 Documentation Files

- **QUICK_START.md** - Fast deployment steps
- **DEPLOYMENT.md** - Detailed deployment guide
- **ENV_VARIABLES.md** - Environment variables reference
- **MIGRATION_GUIDE.md** - Guide for updating hardcoded URLs
- **render.yaml** - Blueprint for automated deployment

## 🚀 Quick Deployment

### Option 1: Manual Setup (Recommended for First Time)

1. Follow **QUICK_START.md** for step-by-step instructions
2. Deploy backend first, then frontend
3. Update environment variables with the generated URLs

### Option 2: Blueprint (Automated)

1. Push `render.yaml` to your repository
2. In Render: "New" → "Blueprint"
3. Connect repository
4. Add environment variables
5. Deploy!

## 📋 What's Been Configured

✅ **Backend (Spring Boot)**
- Environment variable support
- CORS configuration with dynamic frontend URL
- MongoDB connection via environment variables
- All API keys configurable via env vars

✅ **Frontend (React/Vite)**
- API base URL configuration
- Environment variable support
- Axios configured to use API_BASE_URL
- API helper functions created

✅ **Deployment Files**
- `render.yaml` for automated deployment
- `.gitignore` updated
- Documentation files created

## ⚠️ Important Notes

1. **Free Tier**: Render free tier spins down after 15 min inactivity
2. **Environment Variables**: Never commit `.env` files
3. **URLs**: Update all environment variables after first deployment
4. **MongoDB**: Whitelist Render IPs in MongoDB Atlas
5. **File Storage**: Current setup uses local storage (consider cloud storage for production)

## 🔧 Remaining Tasks

Some files still have hardcoded `localhost:8081` URLs. See **MIGRATION_GUIDE.md** for:
- List of files to update
- Migration examples
- Testing instructions

Critical files already updated:
- ✅ `AuthContext.tsx` - Uses API_BASE_URL
- ✅ `ModalSearch.tsx` - Uses getApiUrl helper
- ✅ Backend CORS - Uses FRONTEND_URL env var

## 📞 Support

- Render Docs: https://render.com/docs
- Check build logs in Render dashboard for errors
- Verify environment variables are set correctly

## 🎯 Next Steps After Deployment

1. Test all API endpoints
2. Update remaining hardcoded URLs (see MIGRATION_GUIDE.md)
3. Set up custom domain (optional)
4. Configure monitoring
5. Set up CI/CD (optional)

---

**Ready to deploy?** Start with **QUICK_START.md**!

