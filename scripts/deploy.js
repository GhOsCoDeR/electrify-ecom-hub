// Netlify deployment helper script
import { execSync } from 'child_process';

console.log("🚀 Preparing for Netlify deployment...");

// Helper function to run commands
function runCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    return false;
  }
}

// Check if netlify-cli is installed
try {
  execSync('netlify --version', { stdio: 'ignore' });
  console.log("Netlify CLI is installed.");
} catch (error) {
  console.log("Installing Netlify CLI...");
  runCommand('npm install -g netlify-cli');
}

// Build the project
console.log("Building project...");
if (!runCommand('npm run build')) {
  console.error("❌ Build failed. Exiting deployment process.");
  process.exit(1);
}

// Check if user is logged in to Netlify
try {
  execSync('netlify status', { stdio: 'ignore' });
  console.log("Already logged in to Netlify.");
} catch (error) {
  console.log("Please log in to Netlify:");
  runCommand('netlify login');
}

// Deploy to Netlify
console.log("Deploying to Netlify...");
runCommand('netlify deploy --prod');

console.log("✅ Deployment process completed!"); 