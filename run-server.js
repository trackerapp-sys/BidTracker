const { spawn } = require('child_process');
const path = require('path');

console.log('Starting BidTracker server...');

const server = spawn('npx', ['tsx', 'server/index.ts'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

server.on('error', (error) => {
  console.error('Failed to start server:', error);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.kill('SIGINT');
  process.exit(0);
});
