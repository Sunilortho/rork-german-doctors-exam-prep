# Deployment Guide - German Doctors Exam Prep App

## 🚀 Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy your app. It takes just a few clicks!

### Step 1: Go to Vercel
1. Visit [https://vercel.com/new](https://vercel.com/new)
2. Sign in with your GitHub account (or create a free Vercel account)

### Step 2: Import Your Project
1. Click **"Import Project"**
2. Paste your GitHub repository URL:
   ```
   https://github.com/Sunilortho/rork-german-doctors-exam-prep
   ```
3. Click **"Continue"**

### Step 3: Configure Project
1. **Project Name**: `german-doctors-exam-prep` (or your choice)
2. **Framework Preset**: Select "Other" (since it's Expo/React Native Web)
3. **Root Directory**: `./` (default)
4. **Build Command**: `bun run build-web`
5. **Output Directory**: `dist`
6. **Install Command**: `bun install`

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-3 minutes)
3. You'll get a live URL! 🎉

### Step 5: Custom Domain (Optional)
1. After deployment, go to **"Settings" → "Domains"**
2. Add your custom domain
3. Update DNS records as instructed

---

## 📱 Deploy Mobile App

### Build for App Store (iOS)
```bash
bun install -g @expo/eas-cli
eas build --platform ios
eas submit --platform ios
```

Requirements:
- Apple Developer Account ($99/year)
- See [Expo's iOS Deploy Guide](https://docs.expo.dev/submit/ios/)

### Build for Google Play (Android)
```bash
bun install -g @expo/eas-cli
eas build --platform android
eas submit --platform android
```

Requirements:
- Google Play Developer Account ($25 one-time)
- See [Expo's Android Deploy Guide](https://docs.expo.dev/submit/android/)

---

## 🔄 Continuous Deployment

Once connected to Vercel:
- Every time you push to `main` branch → Automatic deployment
- Vercel will automatically rebuild and deploy your changes
- You can preview pull requests before merging

---

## 📊 Monitor Your Deployment

1. Visit your Vercel project dashboard
2. View:
   - **Deployments**: See all versions
   - **Analytics**: Track performance and visitors
   - **Logs**: Debug build issues
   - **Settings**: Configure environment variables

---

## 🆘 Troubleshooting

### Build fails with "bun not found"
**Solution**: Vercel needs to install bun. The vercel.json is already configured.

### "Module not found" errors
**Solution**: 
```bash
rm -rf node_modules
bun install
```

### App looks broken on mobile
**Solution**: Some native features don't work in web. Use mobile app instead or stick to web-compatible features.

---

## 📍 Your Live App

Once deployed, you'll get a URL like:
```
https://german-doctors-exam-prep.vercel.app
```

Share this link with others to access your app!

---

## 🎯 Next Steps

1. ✅ Deploy to Vercel (this guide)
2. 📱 Build iOS/Android apps using EAS
3. 🔐 Add authentication (Google Sign In, etc.)
4. 💾 Connect to database (Supabase, Firebase)
5. 📈 Track analytics and user engagement

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Expo Docs**: https://docs.expo.dev
- **GitHub Issues**: Open an issue in this repository
