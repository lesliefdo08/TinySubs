# 🚀 TinySubs Deployment Guide

## Prerequisites

Before deploying, you need:

1. **Base Sepolia Testnet ETH**
   - Get testnet ETH from: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
   - Or bridge from Sepolia: https://bridge.base.org/

2. **WalletConnect Project ID**
   - Create a free project at: https://cloud.walletconnect.com/
   - Copy your Project ID

3. **Private Key**
   - Export your wallet's private key (MetaMask: Account > Show Private Key)
   - ⚠️ NEVER share this or commit it to git!

## Deployment Steps

### 1. Setup Environment

Create `.env` file in the root directory:

```bash
# Copy from .env.example
cp .env.example .env
```

Add your values:
```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_api_key_here (optional)
```

### 2. Deploy Contract

```bash
cd contracts
npx hardhat run scripts/deploy.ts --network baseTestnet
```

Copy the deployed contract address.

### 3. Update Frontend

Update `.env` with the deployed contract address:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

Also update `lib/contract.ts` with the same address.

### 4. Run Frontend

```bash
npm run dev
```

Visit http://localhost:3000

## Network Info

- **Network**: Base Sepolia Testnet
- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org

## Verification (Optional)

Verify your contract on Basescan:

```bash
cd contracts
npx hardhat verify --network baseTestnet YOUR_CONTRACT_ADDRESS
```

## Troubleshooting

### "Insufficient funds for gas"
- Get more testnet ETH from the faucet

### "Network error"
- Check your internet connection
- Verify you're using the correct RPC URL

### "Invalid private key"
- Ensure your private key is correct
- Remove any 0x prefix if present

## Production Deployment

For mainnet deployment:
1. Change network to Base mainnet in `hardhat.config.ts`
2. Update chain ID to 8453
3. Use real ETH (not testnet)
4. Get audited before deploying with real funds!

---

Built with ❤️ for BuildOnchain
