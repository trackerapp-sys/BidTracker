import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { storage } from "./storage";
import type { User } from "@shared/schema";

// Facebook OAuth configuration
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || "1347679723547415";
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || "your-facebook-app-secret";
const CALLBACK_URL = process.env.CALLBACK_URL ||
  (process.env.NODE_ENV === 'production'
    ? "https://auction-server-8snz.onrender.com/api/auth/facebook/callback"
    : "http://localhost:5000/api/auth/facebook/callback");

// Configure Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: CALLBACK_URL,
  profileFields: ['id', 'displayName', 'photos', 'email']
}, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
  try {
    // Check if user already exists with this Facebook ID
    let user = await storage.getUserByFacebookId(profile.id);
    
    if (user) {
      // Update access token
      user = await storage.updateUser(user.id, {
        facebookAccessToken: accessToken
      });
      return done(null, user);
    }
    
    // Check if user exists with same email
    if (profile.emails && profile.emails[0]) {
      const existingUser = await storage.getUserByEmail(profile.emails[0].value);
      if (existingUser) {
        // Link Facebook account to existing user
        user = await storage.updateUser(existingUser.id, {
          facebookId: profile.id,
          facebookAccessToken: accessToken,
          avatar: profile.photos?.[0]?.value || null
        });
        return done(null, user);
      }
    }
    
    // Create new user
    user = await storage.createUser({
      username: `fb_${profile.id}`, // Generate username from Facebook ID
      password: Math.random().toString(36), // Random password (won't be used)
      name: profile.displayName,
      email: profile.emails?.[0]?.value || null,
      facebookId: profile.id,
      avatar: profile.photos?.[0]?.value || null
    });
    
    // Update with access token
    user = await storage.updateUser(user.id, {
      facebookAccessToken: accessToken
    });
    
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
