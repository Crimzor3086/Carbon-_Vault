const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying CarbonVault contracts to Moonbase Alpha...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "GLMR\n");

  if (balance === 0n) {
    console.error("❌ Error: Account has no GLMR balance!");
    console.log("\n📝 To get test DEV/GLMR:");
    console.log("   1. Visit: https://docs.moonbeam.network/builders/get-started/faucet/");
    console.log("   2. Connect wallet:", deployer.address);
    console.log("   3. Request test tokens\n");
    process.exit(1);
  }

  // 1. Deploy CVTMinting (ERC20 token)
  console.log("📄 Deploying CVTMinting...");
  const CVTMinting = await hre.ethers.getContractFactory("CVTMinting");
  
  // Deploy with placeholder verifier (update later)
  const placeholderVerifier = deployer.address; // Temporary
  const cvtMinting = await CVTMinting.deploy(
    placeholderVerifier,
    hre.ethers.ZeroAddress, // No validator rewards initially
    deployer.address
  );
  const cvtDeployTx = await cvtMinting.deploymentTransaction();
  console.log("   Transaction hash:", cvtDeployTx.hash);
  await cvtMinting.waitForDeployment();
  const cvtAddress = await cvtMinting.getAddress();
  console.log("✅ CVTMinting deployed to:", cvtAddress);
  
  // Wait a bit for transaction to be fully confirmed
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 2. Deploy ValidatorRewards
  console.log("\n📄 Deploying ValidatorRewards...");
  const ValidatorRewards = await hre.ethers.getContractFactory("ValidatorRewards");
  const validatorRewards = await ValidatorRewards.deploy(cvtAddress);
  const validatorDeployTx = await validatorRewards.deploymentTransaction();
  console.log("   Transaction hash:", validatorDeployTx.hash);
  await validatorRewards.waitForDeployment();
  const validatorRewardsAddress = await validatorRewards.getAddress();
  console.log("✅ ValidatorRewards deployed to:", validatorRewardsAddress);
  
  // Wait a bit for transaction to be fully confirmed
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 3. Deploy CVTStaking
  console.log("\n📄 Deploying CVTStaking...");
  const CVTStaking = await hre.ethers.getContractFactory("CVTStaking");
  const cvtStaking = await CVTStaking.deploy(cvtAddress, deployer.address);
  const stakingDeployTx = await cvtStaking.deploymentTransaction();
  console.log("   Transaction hash:", stakingDeployTx.hash);
  await cvtStaking.waitForDeployment();
  const cvtStakingAddress = await cvtStaking.getAddress();
  console.log("✅ CVTStaking deployed to:", cvtStakingAddress);
  
  // Wait a bit for transaction to be fully confirmed
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 4. Deploy CVTMarketplace
  console.log("\n📄 Deploying CVTMarketplace...");
  const CVTMarketplace = await hre.ethers.getContractFactory("CVTMarketplace");
  
  // Use CVT token as stablecoin for testing (it's a valid ERC20)
  // In production, use a real stablecoin address (USDC/USDT/etc)
  const stablecoinAddress = process.env.STABLECOIN_ADDRESS || cvtAddress;
  const cvtMarketplace = await CVTMarketplace.deploy(
    cvtAddress, // CVT token
    stablecoinAddress, // Stablecoin (using CVT for testing)
    deployer.address // Owner
  );
  const marketplaceDeployTx = await cvtMarketplace.deploymentTransaction();
  console.log("   Transaction hash:", marketplaceDeployTx.hash);
  await cvtMarketplace.waitForDeployment();
  const cvtMarketplaceAddress = await cvtMarketplace.getAddress();
  console.log("✅ CVTMarketplace deployed to:", cvtMarketplaceAddress);
  if (stablecoinAddress === cvtAddress) {
    console.log("   ℹ️  Using CVT token as stablecoin for testing");
  }
  
  // Wait a bit for transaction to be fully confirmed
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Update CVTMinting with ValidatorRewards address
  console.log("\n🔗 Linking ValidatorRewards to CVTMinting...");
  const tx = await cvtMinting.setValidatorRewards(validatorRewardsAddress);
  await tx.wait();
  console.log("✅ ValidatorRewards linked");

  // Set initial yield rate (5% APY)
  console.log("\n⚙️  Setting initial yield rate (5% APY)...");
  // 5% APY = 0.05 / 365 / 24 / 60 / 60 ≈ 1.585e-9 per second
  const yieldRate = hre.ethers.parseEther("0.000000001585"); // ~5% APY
  const yieldTx = await cvtStaking.setYieldRatePerSecond(yieldRate);
  await yieldTx.wait();
  console.log("✅ Yield rate set to ~5% APY");

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 Deployment Complete!");
  console.log("=".repeat(60));
  console.log("\n📋 Contract Addresses:");
  console.log("━".repeat(60));
  console.log("CVTMinting:       ", cvtAddress);
  console.log("CVTStaking:       ", cvtStakingAddress);
  console.log("CVTMarketplace:   ", cvtMarketplaceAddress);
  console.log("ValidatorRewards: ", validatorRewardsAddress);
  console.log("━".repeat(60));

  console.log("\n📝 Next Steps:");
  console.log("1. Update frontend/src/lib/contracts.ts with these addresses");
  console.log("2. Verify contracts on explorer (optional)");
  console.log("3. Test minting CVT tokens");
  console.log("\n🔗 View on Explorer:");
  console.log(`   https://moonbase.moonscan.io/address/${cvtAddress}`);

  // Save addresses to file
  const fs = require('fs');
  const addresses = {
    network: "moonbaseAlpha",
    chainId: 1287,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      CVTMinting: cvtAddress,
      CVTStaking: cvtStakingAddress,
      CVTMarketplace: cvtMarketplaceAddress,
      ValidatorRewards: validatorRewardsAddress,
    }
  };
  
  fs.writeFileSync(
    './deployed-addresses.json',
    JSON.stringify(addresses, null, 2)
  );
  console.log("\n💾 Addresses saved to: deployed-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });

