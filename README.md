# 🎯 TinySubs

**Frictionless Onchain Micro-Subscriptions for Everything**

TinySubs is a decentralized micro-subscription platform that enables creators to charge extremely small recurring payments (₹1–₹5 / $0.01–$0.05) using smart-contract-based streaming. Built on Base/Polygon testnet.

## ✨ Features

- 🔐 **Fully Onchain**: All subscription logic handled by smart contracts
- 💸 **Micro Payments**: Support for tiny recurring payments
- 🎨 **Beautiful UI**: Modern, animated interface built with Next.js
- 👛 **Easy Wallet Connection**: Powered by RainbowKit
- 📊 **Creator Analytics**: Real-time dashboard for creators
- 🔄 **Cancel Anytime**: Users have full control over their subscriptions
- 💰 **Instant Withdrawals**: Creators can withdraw earnings anytime

## 🛠️ Tech Stack

### Smart Contract
- Solidity (v0.8.20+)
- OpenZeppelin Contracts
- Hardhat

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Wagmi + Viem
- RainbowKit
- Tailwind CSS
- Framer Motion

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask or compatible wallet

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lesliefdo08/TinySubs.git
cd TinySubs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your values:
```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
PRIVATE_KEY=your_wallet_private_key
BASESCAN_API_KEY=your_api_key
```

### Smart Contract Deployment

1. Compile contracts:
```bash
cd contracts
npm install
npx hardhat compile
```

2. Run tests:
```bash
npx hardhat test
```

3. Deploy to testnet:
```bash
npx hardhat run scripts/deploy.ts --network baseTestnet
```

### Frontend Development

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
TinySubs/
├── contracts/              # Smart contracts
│   ├── contracts/
│   │   └── TinySubs.sol   # Main subscription contract
│   ├── test/              # Contract tests
│   ├── scripts/           # Deployment scripts
│   └── hardhat.config.ts
├── app/                   # Next.js app
│   ├── page.tsx          # Landing page
│   ├── discover/         # Creator discovery
│   ├── dashboard/        # User dashboard
│   └── creator/          # Creator dashboard
├── components/           # React components
├── lib/                  # Utilities and config
└── public/              # Static assets
```

## 📝 Smart Contract Functions

### For Creators
- `registerCreator()`: Register a subscription plan
- `withdrawFunds()`: Withdraw accumulated earnings
- `updatePlan()`: Update plan details

### For Subscribers
- `subscribe()`: Subscribe to a creator
- `cancelSubscription()`: Cancel active subscription
- `getRemainingDays()`: Check remaining subscription days

## 🌐 Deployed Contracts

- **Base Testnet**: `0x...` (Coming soon)
- **Polygon Mumbai**: `0x...` (Coming soon)

## 🎨 Pages

- `/` - Landing page with product overview
- `/discover` - Browse all creator subscription plans
- `/dashboard` - User subscription management
- `/creator` - Creator dashboard and analytics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Website](https://tinysubs.vercel.app)
- [Twitter](https://twitter.com/tinysubs)
- [Discord](https://discord.gg/tinysubs)

---

Built with ❤️ for BuildOnchain
