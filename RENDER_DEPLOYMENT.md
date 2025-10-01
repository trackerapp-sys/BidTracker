# Render Deployment Configuration

## 🚀 Your Render Services

- **Server**: https://auction-server-8snz.onrender.com
- **Client**: https://auction-client.onrender.com
- **Facebook App ID**: 1347679723547415

## ⚙️ Server Configuration (auction-server)

### Environment Variables to Set in Render:

```env
FACEBOOK_APP_ID=1347679723547415
FACEBOOK_APP_SECRET=your-facebook-app-secret-from-facebook-console
CALLBACK_URL=https://auction-server-8snz.onrender.com/api/auth/facebook/callback
SESSION_SECRET=generate-a-super-secure-random-string-here
NODE_ENV=production
PORT=10000
```

### Build & Start Commands:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: 18 or higher

### ✅ Fixed Issues:
- ✅ **Build process**: Now uses `tsx` for production (more reliable than esbuild)
- ✅ **Static files**: Correctly serves built client from `dist/public`
- ✅ **Dependencies**: Moved `tsx` and `cross-env` to production dependencies
- ✅ **TypeScript**: Runs TypeScript directly in production for better compatibility

## 🌐 Client Configuration (auction-client)

### Environment Variables (if needed):
```env
VITE_API_URL=https://auction-server-8snz.onrender.com
```

### Build & Deploy Commands:
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

## 📱 Facebook App Settings

### In Facebook Developers Console (App ID: 1347679723547415):

1. **Facebook Login → Settings**:
   - **Valid OAuth Redirect URIs**:
     ```
     https://auction-server-8snz.onrender.com/api/auth/facebook/callback
     http://localhost:5000/api/auth/facebook/callback
     ```

2. **Settings → Basic**:
   - **App Domains**:
     ```
     auction-server-8snz.onrender.com
     auction-client.onrender.com
     localhost
     ```
   - **Privacy Policy URL**: `https://auction-client.onrender.com/privacy`
   - **Terms of Service URL**: `https://auction-client.onrender.com/terms`

3. **Facebook Login → Settings**:
   - **Client OAuth Login**: Yes
   - **Web OAuth Login**: Yes
   - **Valid OAuth Redirect URIs**: (as above)

## 🔐 Security Checklist

### Generate Secure Session Secret:
```bash
# Run this to generate a secure session secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### CORS Configuration:
The server should allow requests from your client domain. Update if needed:
```javascript
app.use(cors({
  origin: ['https://auction-client.onrender.com', 'http://localhost:3000'],
  credentials: true
}));
```

## 🚀 Deployment Steps

### 1. Deploy Server First:
1. Set all environment variables in Render dashboard
2. Deploy the server service
3. Test: `https://auction-server-8snz.onrender.com/api/health`

### 2. Update Facebook App:
1. Add production URLs to Facebook app settings
2. Test OAuth flow

### 3. Deploy Client:
1. Update any hardcoded URLs to use production server
2. Deploy the client service
3. Test: `https://auction-client.onrender.com`

## 🧪 Testing Production

### Test Facebook OAuth:
1. Go to `https://auction-client.onrender.com`
2. Click "Continue with Facebook"
3. Should redirect to Facebook, then back to your dashboard

### Test API Endpoints:
- `GET https://auction-server-8snz.onrender.com/api/auth/me`
- `GET https://auction-server-8snz.onrender.com/api/auctions`

## 🔧 Troubleshooting

### Common Issues:

1. **"URL Blocked" Error**:
   - Check Facebook app redirect URIs match exactly
   - Ensure HTTPS is used in production

2. **CORS Errors**:
   - Verify server allows client domain
   - Check credentials: include is set

3. **Session Issues**:
   - Ensure SESSION_SECRET is set
   - Check cookie settings for production

4. **Facebook App Review**:
   - For groups access, you may need Facebook app review
   - Start with basic login first

## 📊 Monitoring

### Health Checks:
- Server: `https://auction-server-8snz.onrender.com/api/health`
- Client: `https://auction-client.onrender.com`

### Logs:
- Check Render dashboard for server logs
- Monitor Facebook app analytics

## 🎯 Next Steps

1. Set up environment variables in Render
2. Update Facebook app settings
3. Deploy and test
4. Monitor for any issues
5. Consider database setup for production data
