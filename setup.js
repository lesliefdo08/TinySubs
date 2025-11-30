#!/usr/bin/env node

/**
 * TinySubs Setup Script
 * Automated setup for TinySubs development environment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎯 TinySubs Setup Script\n');

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file from template...');
  fs.copyFileSync('.env.example', '.env');
  console.log('✅ .env file created. Please update it with your values.\n');
  console.log('You need to add:');
  console.log('  1. NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID (from https://cloud.walletconnect.com/)');
  console.log('  2. PRIVATE_KEY (your wallet private key for deployment)');
  console.log('  3. NEXT_PUBLIC_CONTRACT_ADDRESS (after contract deployment)\n');
} else {
  console.log('✅ .env file already exists\n');
}

// Install dependencies
console.log('📦 Installing dependencies...\n');

try {
  console.log('Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\nInstalling contract dependencies...');
  execSync('cd contracts && npm install', { stdio: 'inherit', shell: true });
  
  console.log('\n✅ All dependencies installed!\n');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Compile contracts
console.log('🔨 Compiling smart contracts...\n');
try {
  execSync('cd contracts && npx hardhat compile', { stdio: 'inherit', shell: true });
  console.log('\n✅ Contracts compiled successfully!\n');
} catch (error) {
  console.error('❌ Error compiling contracts:', error.message);
  process.exit(1);
}

// Run tests
console.log('🧪 Running tests...\n');
try {
  execSync('cd contracts && npx hardhat test', { stdio: 'inherit', shell: true });
  console.log('\n✅ All tests passed!\n');
} catch (error) {
  console.error('❌ Error running tests:', error.message);
  process.exit(1);
}

console.log('🎉 Setup complete!\n');
console.log('Next steps:');
console.log('1. Update .env with your WalletConnect Project ID');
console.log('2. Add testnet ETH to your wallet from https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet');
console.log('3. Deploy contract: cd contracts && npx hardhat run scripts/deploy.ts --network baseTestnet');
console.log('4. Update .env with deployed contract address');
console.log('5. Start frontend: npm run dev\n');
console.log('📚 For detailed instructions, see DEPLOYMENT.md\n');
