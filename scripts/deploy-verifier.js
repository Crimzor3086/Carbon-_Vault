const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("\n╔════════════════════════════════════════════════════════════════╗");
  console.log("║        Deploy ZK Verifier & Fix CVTMinting Contract           ║");
  console.log("╚════════════════════════════════════════════════════════════════╝\n");

  const [deployer] = await hre.ethers.getSigners();
  const network = await hre.ethers.provider.getNetwork();

  console.log("📋 Configuration:");
  console.log(`  Network: ${network.name}`);
  console.log(`  Chain ID: ${network.chainId}`);
  console.log(`  Deployer: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`  Balance: ${hre.ethers.formatEther(balance)} MNT\n`);

  // Load deployed addresses
  const deployedAddressesPath = path.join(__dirname, "..", "deployed-addresses.json");
  const deployedAddresses = JSON.parse(fs.readFileSync(deployedAddressesPath, "utf8"));

  // Deploy CarbonOffsetVerifier
  console.log("🚀 Deploying CarbonOffsetVerifier...");
  const CarbonOffsetVerifier = await hre.ethers.getContractFactory("CarbonOffsetVerifier");
  const verifier = await CarbonOffsetVerifier.deploy();
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();

  console.log(`✓ CarbonOffsetVerifier deployed to: ${verifierAddress}`);
  console.log(`  Explorer: https://explorer.sepolia.mantle.xyz/address/${verifierAddress}\n`);

  // Update CVTMinting contract to use new verifier
  console.log("🔧 Updating CVTMinting contract...");
  const CVTMinting = await hre.ethers.getContractFactory("CVTMinting");
  const cvtMinting = CVTMinting.attach(deployedAddresses.contracts.CVTMinting);

  console.log(`  Setting ZK Verifier to: ${verifierAddress}`);
  const tx = await cvtMinting.setZKVerifier(verifierAddress, {
    gasLimit: 100000000 // 100M gas for Mantle
  });
  console.log(`  Transaction: ${tx.hash}`);
  
  await tx.wait();
  console.log("✓ CVTMinting updated successfully!\n");

  // Verify the update
  console.log("✅ Verifying update...");
  const newVerifier = await cvtMinting.zkVerifier();
  console.log(`  New Verifier Address: ${newVerifier}`);
  console.log(`  Match: ${newVerifier.toLowerCase() === verifierAddress.toLowerCase() ? "✓ Yes" : "✗ No"}\n`);

  // Update deployed-addresses.json
  deployedAddresses.contracts.CarbonOffsetVerifier = verifierAddress;
  deployedAddresses.timestamp = new Date().toISOString();
  fs.writeFileSync(deployedAddressesPath, JSON.stringify(deployedAddresses, null, 2));
  console.log("💾 Updated deployed-addresses.json\n");

  console.log("╔════════════════════════════════════════════════════════════════╗");
  console.log("║                    ✨ Setup Complete! ✨                      ║");
  console.log("╚════════════════════════════════════════════════════════════════╝\n");

  console.log("📝 Summary:");
  console.log(`  CarbonOffsetVerifier: ${verifierAddress}`);
  console.log(`  CVTMinting: ${deployedAddresses.contracts.CVTMinting}`);
  console.log(`  Status: Ready to mint CVT tokens!\n`);

  console.log("🚀 Next Step:");
  console.log("  Run: npx hardhat run scripts/mint-cvt.js --network mantleSepolia\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:");
    console.error(error);
    process.exit(1);
  });

