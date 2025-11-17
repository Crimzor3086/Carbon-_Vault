const hre = require("hardhat");
const path = require("path");
const fs = require("fs");

function loadDeploymentAddresses() {
  const deploymentFile = path.join(__dirname, "..", "deployed-addresses.json");
  if (!fs.existsSync(deploymentFile)) {
    console.warn("⚠️  deployed-addresses.json not found. Falling back to environment variables.");
    return null;
  }

  try {
    const data = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
    return data.contracts || null;
  } catch (error) {
    console.warn("⚠️  Unable to parse deployed-addresses.json. Falling back to environment variables.");
    return null;
  }
}

async function main() {
  console.log("🔧 Updating CVTMarketplace stablecoin address...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Using account:", deployer.address);

  const deployments = loadDeploymentAddresses();

  // Marketplace + CVT token addresses (priority: env vars > deployments file > manual fallback)
  const marketplaceAddress =
    process.env.MARKETPLACE_ADDRESS ||
    (deployments && deployments.CVTMarketplace) ||
    "0x86925c66119e5F1F1A85EBb39FeEA2bC2F983013";

  const cvtTokenAddress =
    process.env.CVT_ADDRESS ||
    (deployments && deployments.CVTMinting) ||
    "0x037594a32Db6ae77ba09cAA6D5849B16b0F68807";

  // Stablecoin address to set
  // - Use STABLECOIN_ADDRESS if provided
  // - Otherwise default to CVT token for testnets
  const stablecoinAddress = process.env.STABLECOIN_ADDRESS || cvtTokenAddress;

  console.log("📋 Configuration");
  console.log("   Network           :", hre.network.name);
  console.log("   Marketplace       :", marketplaceAddress);
  console.log("   CVT token         :", cvtTokenAddress);
  console.log("   New stablecoin    :", stablecoinAddress);
  console.log("");

  if (!hre.ethers.isAddress(stablecoinAddress)) {
    throw new Error("Stablecoin address is invalid. Set STABLECOIN_ADDRESS or update deployed-addresses.json.");
  }

  const CVTMarketplace = await hre.ethers.getContractFactory("CVTMarketplace");
  const marketplace = CVTMarketplace.attach(marketplaceAddress);

  const currentStablecoin = await marketplace.stablecoin();
  if (currentStablecoin.toLowerCase() === stablecoinAddress.toLowerCase()) {
    console.log("ℹ️  Stablecoin is already configured to the desired address. Nothing to do.");
    return;
  }

  console.log("📤 Sending transaction...");
  const tx = await marketplace.setStablecoin(stablecoinAddress);
  console.log("   Transaction hash :", tx.hash);

  console.log("⏳ Waiting for confirmation...");
  await tx.wait();

  console.log("✅ Stablecoin address updated successfully!");
  console.log("\n💡 Tip: use STABLECOIN_ADDRESS to point at a real testnet stablecoin (e.g., USDC) when available.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Failed to update stablecoin address:", error);
    process.exit(1);
  });
