// Mock Smart Contract API
// This simulates blockchain interactions for demo purposes

export interface SubscriptionData {
  id: string;
  creator: string;
  subscriber: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'cancelled' | 'expired';
  transactionHash: string;
}

// Simulated delay to mimic blockchain transaction time
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate random transaction hash
const generateTxHash = () => {
  return '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

export const mockSmartContract = {
  /**
   * Initialize a new subscription
   */
  async initSubscription(
    creator: string,
    subscriber: string,
    amount: number
  ): Promise<SubscriptionData> {
    console.log('🔄 Initiating subscription on blockchain...');
    await delay(1500); // Simulate network delay

    const subscription: SubscriptionData = {
      id: `sub_${Date.now()}`,
      creator,
      subscriber,
      amount,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      status: 'active',
      transactionHash: generateTxHash(),
    };

    console.log('✅ Subscription created:', subscription);
    return subscription;
  },

  /**
   * Process a payment for subscription
   */
  async processPayment(
    subscriptionId: string,
    amount: number,
    gasless: boolean = true
  ): Promise<{ success: boolean; txHash: string; gasFee?: number }> {
    console.log('💳 Processing payment...');
    await delay(2000); // Simulate payment processing

    const txHash = generateTxHash();
    const gasFee = gasless ? 0 : Math.random() * 0.005; // Random gas fee if not gasless

    console.log(`✅ Payment processed: ${amount} ETH`);
    if (gasless) {
      console.log('⚡ Gas fees sponsored by TinySubs');
    } else {
      console.log(`⛽ Gas fee: ${gasFee.toFixed(6)} ETH`);
    }

    return {
      success: true,
      txHash,
      gasFee: gasless ? undefined : gasFee,
    };
  },

  /**
   * Cancel an active subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<{ success: boolean; txHash: string }> {
    console.log('🚫 Cancelling subscription...');
    await delay(1000);

    const txHash = generateTxHash();
    console.log('✅ Subscription cancelled');

    return {
      success: true,
      txHash,
    };
  },

  /**
   * Get subscription status
   */
  async getSubscriptionStatus(subscriptionId: string): Promise<SubscriptionData | null> {
    console.log('🔍 Fetching subscription status...');
    await delay(500);

    // Mock data - in real implementation, this would query the blockchain
    return {
      id: subscriptionId,
      creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f3a8f',
      subscriber: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
      amount: 0.05,
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      status: 'active',
      transactionHash: generateTxHash(),
    };
  },

  /**
   * Withdraw creator earnings
   */
  async withdrawEarnings(creator: string, amount: number): Promise<{ success: boolean; txHash: string }> {
    console.log(`💰 Withdrawing ${amount} ETH...`);
    await delay(1500);

    const txHash = generateTxHash();
    console.log('✅ Withdrawal successful');

    return {
      success: true,
      txHash,
    };
  },

  /**
   * Get creator stats
   */
  async getCreatorStats(creator: string): Promise<{
    totalSubscribers: number;
    totalEarnings: number;
    activeSubscriptions: number;
  }> {
    console.log('📊 Fetching creator stats...');
    await delay(800);

    return {
      totalSubscribers: Math.floor(Math.random() * 2000) + 500,
      totalEarnings: Math.random() * 100 + 50,
      activeSubscriptions: Math.floor(Math.random() * 1500) + 400,
    };
  },
};

export default mockSmartContract;
