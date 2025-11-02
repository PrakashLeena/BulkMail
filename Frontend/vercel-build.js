// This script ensures the build directory is in the correct location
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running custom build script...');

// Run the build
console.log('Running npm install...');
execSync('npm install', { stdio: 'inherit' });

console.log('Running npm run build...');
execSync('npm run build', { stdio: 'inherit' });

// Move the build directory to the correct location
const buildDir = path.join(__dirname, 'build');
const vercelOutputDir = path.join(__dirname, '..', '.vercel_build_output');
const staticDir = path.join(vercelOutputDir, 'static');

console.log('Moving build files...');

// Create the .vercel_build_output directory if it doesn't exist
if (!fs.existsSync(vercelOutputDir)) {
  fs.mkdirSync(vercelOutputDir, { recursive: true });
}

// Move the build files to the correct location
if (fs.existsSync(buildDir)) {
  // Copy all files from build to .vercel_build_output/static
  const { execSync } = require('child_process');
  execSync(`xcopy "${buildDir}\\*" "${vercelOutputDir}\\static" /E /I /Y`, { stdio: 'inherit' });
  
  console.log('Build files moved successfully!');
} else {
  console.error('Build directory not found!');
  process.exit(1);
}
