# BidTracker

A full-stack auction management system for Facebook groups with Facebook OAuth integration.

## 🚀 Features

- **Facebook OAuth Login** - Seamless authentication with Facebook
- **Real-time Bidding** - WebSocket-powered live bid updates
- **Auction Management** - Create and manage individual and live feed auctions
- **Facebook Groups Integration** - Ready for posting auctions to Facebook groups
- **User Dashboard** - Track your auctions, bids, and statistics
- **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **Node.js** with TypeScript
- **Express.js** with Passport.js for authentication
- **WebSocket** for real-time updates
- **Drizzle ORM** with PostgreSQL schema
- **bcryptjs** for password hashing
- **express-session** for session management

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **TanStack Query** for data fetching
- **Wouter** for routing
- **Shadcn UI** components
- **Tailwind CSS** for styling

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Facebook OAuth (Optional)
1. Follow the guide in `FACEBOOK_OAUTH_SETUP.md`
2. Copy `.env.example` to `.env` and fill in your Facebook app credentials

### 3. Start the Development Server
```bash
npm run dev
```

### 4. Open Your Browser
Go to `http://localhost:5000`

## 🔐 Authentication Options

### Option 1: Facebook OAuth (Recommended)
- Click "Continue with Facebook" on the login page
- Seamless authentication with your Facebook account
- Auto-populates profile information
- Ready for Facebook Groups integration

### Option 2: Traditional Login
- Use the demo account: `demo` / `demo123`
- Or create a new account with username/password

## 📱 How to Use

1. **Login** - Use Facebook OAuth or create an account
2. **Dashboard** - View your auction stats and active auctions
3. **Create Auctions** - Add individual posts or live feed sessions
4. **Browse Auctions** - See all available auctions and place bids
5. **Real-time Bidding** - Watch bids update live with WebSocket
6. **History** - Track your bidding history and wins
7. **Settings** - Configure notifications and preferences

## 🔧 Configuration

### Environment Variables
```env
# Facebook OAuth (optional)
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback

# Session Security
SESSION_SECRET=your-super-secret-session-key

# Server
PORT=5000
NODE_ENV=development
```

## 🚀 Deployment

### Production Setup
1. Set up a PostgreSQL database
2. Configure environment variables for production
3. Update Facebook app settings with production URLs
4. Build and deploy:
   ```bash
   npm run build
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints
- `GET /api/auth/facebook` - Initiate Facebook OAuth
- `GET /api/auth/facebook/callback` - Facebook OAuth callback
- `POST /api/auth/login` - Traditional login
- `POST /api/auth/register` - Create new account
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Main Features
- User management and profiles
- Auction CRUD operations
- Real-time bidding system
- Facebook Groups integration (ready)
- WebSocket real-time updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
