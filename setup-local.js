#!/usr/bin/env node

const fs = require('fs');
const crypto = require('crypto');

console.log('🚀 Setting up BidTracker for local development...\n');

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file from template...');
  
  // Generate a secure session secret
  const sessionSecret = crypto.randomBytes(64).toString('hex');
  
  // Read template and replace values
  let envContent = fs.readFileSync('.env.example', 'utf8');
  envContent = envContent.replace(
    'your-super-secret-session-key-change-in-production',
    sessionSecret
  );
  
  // Write .env file
  fs.writeFileSync('.env', envContent);
  console.log('✅ .env file created with secure session secret');
} else {
  console.log('✅ .env file already exists');
}

console.log('\n🔧 Next steps:');
console.log('1. Get your Facebook App Secret from Facebook Developers Console');
console.log('2. Update FACEBOOK_APP_SECRET in your .env file');
console.log('3. Run: npm run dev');
console.log('4. Open: http://localhost:5000');

console.log('\n📚 For production deployment:');
console.log('- See RENDER_DEPLOYMENT.md for Render configuration');
console.log('- See FACEBOOK_OAUTH_SETUP.md for Facebook app setup');

console.log('\n🎉 Setup complete! Happy coding!');
