# TinySubs

**Onchain Micro-Subscriptions Built on Base**

TinySubs enables creators to launch subscription plans starting at $0.01/month through fully automated smart contracts on Base. Unlike traditional platforms charging 10-30% fees, we take only 2.5% and give creators instant access to their earnings.

## 🎯 Problem Statement

Current subscription platforms (Patreon, Substack, OnlyFans) have critical flaws:
- **High Fees**: 10-30% platform cuts + payment processing fees
- **Minimum Pricing**: Can't charge less than $5-10/month, limiting accessibility
- **Delayed Payouts**: Wait weeks for withdrawals
- **Platform Risk**: Account bans, policy changes, payment blocks

## 💡 Our Solution

Smart contract-powered subscriptions with:
- **2.5% Platform Fee** - Industry-low, transparent onchain
- **Micro-Pricing** - Start at $0.01/month, perfect for newsletters, APIs, content
- **Instant Withdrawals** - Access earnings anytime, no waiting periods
- **True Ownership** - Censorship-resistant, no platform lock-in
- **Base Network** - Low gas fees, fast transactions, Ethereum security

## ✨ Key Features

### For Creators
- **Launch in Minutes**: Connect wallet → Set price → Share link
- **Flexible Pricing**: Any price from $0.01 upwards per month
- **Real-Time Dashboard**: Track subscribers, revenue, and growth
- **Instant Withdrawals**: Access earnings anytime, no KYC delays
- **98% Revenue Share**: Keep 97.5% after the 2.5% platform fee

### For Subscribers
- **Micro-Pricing**: Support creators for pennies per month
- **Cancel Anytime**: No lock-ins, full control over subscriptions
- **Transparent Onchain**: All transactions verifiable on Base
- **Secure Payments**: Non-custodial, wallet-to-wallet transfers

### Technical
- **Smart Contract Automation**: Subscription logic handled by Solidity contracts
- **Gas Optimized**: Efficient contract design minimizes transaction costs
- **Base Network**: Built on Base L2 for low fees and fast finality
- **Production Ready**: Full test coverage, security-focused architecture

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

## 🏗️ Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Creator   │────────▶│   Frontend   │────────▶│    Base     │
│   Browser   │         │  (Next.js)   │         │  Network    │
└─────────────┘         └──────────────┘         └─────────────┘
                              │                         │
                              │                         ▼
                         ┌────▼─────┐          ┌──────────────┐
                         │ RainbowKit│          │  TinySubs    │
                         │   Wagmi   │          │   Contract   │
                         └───────────┘          └──────────────┘
                                                        │
                         ┌──────────────────────────────┘
                         │
                    ┌────▼─────┐
                    │Subscriber│
                    │ Browser  │
                    └──────────┘
```

**Flow**:
1. Creator registers plan via frontend → Contract stores plan details
2. Subscriber browses creators → Frontend reads from contract
3. Subscriber pays → ETH sent to contract (2.5% fee deducted)
4. Creator withdraws → Contract sends ETH minus platform fee

## 💼 Use Cases

1. **Newsletter Writers**: Charge $0.02/month for 5,000 subscribers = $100/month
2. **API Providers**: $0.05/month per API key for indie developers  
3. **Content Creators**: Micro-tiers ($0.01, $0.05, $0.10) for different access levels
4. **Community Access**: $0.03/month for Discord/Telegram group entry
5. **Research Papers**: $0.02/month for academic content access

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask or compatible wallet
- Base Testnet ETH ([faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet))

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

Add your credentials:
```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address
PRIVATE_KEY=your_wallet_private_key
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
