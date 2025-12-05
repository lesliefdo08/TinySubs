// Human-written error messages and user-facing copy
// Professional, clear, and helpful without AI-like enthusiasm

export const errorMessages = {
  wallet: {
    notConnected: 'Please connect your wallet to continue.',
    wrongNetwork: 'Switch to Base network to use TinySubs.',
    rejectedTransaction: 'Transaction was cancelled.',
    insufficientFunds: 'Insufficient funds to complete this transaction.',
    networkError: 'Network error. Please check your connection and try again.',
  },

  creator: {
    invalidPrice: 'Price must be between 0.01 and 1000 ETH.',
    emptyFields: 'Please fill in all required fields.',
    registrationFailed: 'Failed to register. Please try again.',
    alreadyRegistered: 'You are already registered as a creator.',
    planNotFound: 'Creator plan not found.',
  },

  subscription: {
    alreadySubscribed: 'You are already subscribed to this creator.',
    notSubscribed: 'No active subscription found.',
    paymentFailed: 'Payment failed. Please check your wallet and try again.',
    cancelFailed: 'Failed to cancel subscription. Please try again.',
    renewFailed: 'Failed to renew subscription. Please try again.',
  },

  general: {
    unknownError: 'Something went wrong. Please try again.',
    loadingFailed: 'Failed to load data. Refresh the page to try again.',
    invalidInput: 'Invalid input. Please check your entry.',
  },
};

export const successMessages = {
  creator: {
    registered: 'Successfully registered as a creator.',
    planUpdated: 'Plan settings updated.',
    withdrawn: 'Funds withdrawn successfully.',
    statusToggled: 'Plan status updated.',
  },

  subscription: {
    subscribed: 'Subscription activated.',
    cancelled: 'Subscription cancelled.',
    renewed: 'Subscription renewed.',
  },
};

export const placeholders = {
  creator: {
    planName: 'Premium Newsletter',
    description: 'Weekly insights and exclusive content for subscribers.',
    price: '0.01',
  },

  search: 'Search creators...',
  email: 'your@email.com',
};

export const labels = {
  creator: {
    planName: 'Plan Name',
    description: 'Description',
    price: 'Price per Month (ETH)',
    subscribers: 'Subscribers',
    earnings: 'Total Earnings',
    status: 'Status',
  },

  dashboard: {
    activeSubscriptions: 'Active Subscriptions',
    totalSpent: 'Total Spent',
    nextPayment: 'Next Payment',
  },

  actions: {
    connect: 'Connect Wallet',
    disconnect: 'Disconnect',
    subscribe: 'Subscribe',
    cancel: 'Cancel',
    renew: 'Renew',
    withdraw: 'Withdraw',
    save: 'Save Changes',
    create: 'Create Plan',
    edit: 'Edit',
    delete: 'Delete',
    back: 'Back',
    next: 'Next',
  },
};

export const descriptions = {
  home: {
    hero: 'Enable micro-subscriptions for your content. Built for creators who want fair revenue without platform fees.',
    pricing: 'Transparent pricing. Low fees. Instant payouts.',
    cta: 'Join creators already earning with micro-subscriptions.',
  },

  creator: {
    dashboard: 'Manage your subscription plan and track earnings.',
    benefits: 'Set your price, track subscribers, withdraw earnings anytime.',
    registration: 'Register your subscription plan and start building your community.',
  },

  discover: {
    header: 'Support creators with recurring micro-subscriptions.',
    empty: 'No creators yet. Be the first to create a subscription plan.',
  },

  dashboard: {
    header: 'Track your subscriptions and spending.',
    empty: 'You are not subscribed to any creators yet.',
  },
};
