# Facebook OAuth Setup Guide

## 1. Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose "Consumer" as the app type
4. Fill in your app details:
   - **App Name**: BidTracker (or your preferred name)
   - **App Contact Email**: Your email address

## 2. Configure Facebook Login

1. In your app dashboard, click "Add Product"
2. Find "Facebook Login" and click "Set Up"
3. Choose "Web" as the platform
4. Enter your site URL: `http://localhost:5000`

## 3. Configure OAuth Settings

1. Go to "Facebook Login" → "Settings" in the left sidebar
2. Add these **Valid OAuth Redirect URIs**:
   ```
   http://localhost:5000/api/auth/facebook/callback
   ```
3. For production, also add:
   ```
   https://yourdomain.com/api/auth/facebook/callback
   ```

## 4. Get Your App Credentials

1. Go to "Settings" → "Basic" in the left sidebar
2. Copy your **App ID** and **App Secret**
3. Create a `.env` file in your project root:
   ```env
   FACEBOOK_APP_ID=your-app-id-here
   FACEBOOK_APP_SECRET=your-app-secret-here
   CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback
   SESSION_SECRET=your-super-secret-session-key
   ```

## 5. Request Permissions (Optional - for Groups Access)

For accessing Facebook Groups (needed for posting auctions):

1. Go to "App Review" → "Permissions and Features"
2. Request these permissions:
   - `groups_access_member_info` - To read group member info
   - `publish_to_groups` - To post to groups (requires app review)

## 6. Test Your Integration

1. Start your server: `npm run dev`
2. Go to `http://localhost:5000`
3. Click "Continue with Facebook"
4. You should be redirected to Facebook for authentication
5. After approval, you'll be redirected back to your app

## 7. Production Setup

For production deployment:

1. Update your Facebook app settings with your production domain
2. Set `NODE_ENV=production` in your environment
3. Use HTTPS for your callback URLs
4. Update the `CALLBACK_URL` environment variable

## Troubleshooting

- **"URL Blocked"**: Make sure your redirect URI is exactly the same in Facebook settings and your code
- **"App Not Setup"**: Ensure Facebook Login product is added and configured
- **"Invalid Scope"**: Check that you're requesting valid permissions in the scope array

## Features Enabled

With Facebook OAuth, users can:
- ✅ Login with their Facebook account
- ✅ Auto-populate profile information
- ✅ Access their Facebook Groups (with proper permissions)
- ✅ Post auctions directly to Facebook Groups (future feature)
- ✅ Seamless authentication experience
