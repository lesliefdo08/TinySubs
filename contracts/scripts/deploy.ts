import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying TinySubs contract...");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy the contract
  const TinySubsFactory = await ethers.getContractFactory("TinySubs");
  const tinySubs = await TinySubsFactory.deploy();
  
  await tinySubs.waitForDeployment();
  const address = await tinySubs.getAddress();

  console.log("✅ TinySubs deployed to:", address);
  console.log("🔍 Transaction hash:", tinySubs.deploymentTransaction()?.hash);

  // Log deployment info
  console.log("\n📋 Deployment Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Contract Address:", address);
  console.log("Deployer:", deployer.address);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Verify contract settings
  const platformFee = await tinySubs.platformFeePercent();
  console.log("\n⚙️  Contract Configuration:");
  console.log("Platform Fee:", Number(platformFee) / 100, "%");
  console.log("Month Duration:", "30 days");

  console.log("\n🎉 Deployment complete!");
  console.log("\n📝 Next steps:");
  console.log("1. Update NEXT_PUBLIC_CONTRACT_ADDRESS in .env file");
  console.log("2. Verify contract on block explorer:");
  console.log(`   npx hardhat verify --network baseTestnet ${address}`);
  console.log("3. Start the frontend: npm run dev");

  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
