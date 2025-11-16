const hre = require("hardhat");

async function main() {
  console.log("🔧 Updating CVTMarketplace stablecoin address...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Using account:", deployer.address);

  // Marketplace address (update if needed)
  const marketplaceAddress = process.env.MARKETPLACE_ADDRESS || "0x290C258b604a3Cda5014B004ffe9c92Ab22D0F1c";
  
  // Use CVT token as stablecoin for testing (it's already a valid ERC20)
  const cvtTokenAddress = process.env.CVT_ADDRESS || "0xc5645f895a48c8A572368AaFeaAb2D42d1203819";
  
  // Or use a real stablecoin address if provided
  const stablecoinAddress = process.env.STABLECOIN_ADDRESS || cvtTokenAddress;

  console.log("📋 Configuration:");
  console.log("   Marketplace:", marketplaceAddress);
  console.log("   New Stablecoin:", stablecoinAddress);
  console.log("");

  // Connect to marketplace
  const CVTMarketplace = await hre.ethers.getContractFactory("CVTMarketplace");
  const marketplace = CVTMarketplace.attach(marketplaceAddress);

  // Update stablecoin address
  console.log("📤 Updating stablecoin address...");
  const tx = await marketplace.setStablecoin(stablecoinAddress);
  console.log("   Transaction hash:", tx.hash);
  
  console.log("⏳ Waiting for confirmation...");
  await tx.wait();
  
  console.log("✅ Stablecoin address updated successfully!");
  console.log("\n💡 Note: Using CVT token as stablecoin for testing purposes.");
  console.log("   In production, use a real stablecoin (USDC/USDT/etc).");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

