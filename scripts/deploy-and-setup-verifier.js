const hre = require("hardhat");
const addr = require("../deployed-addresses.json");

async function main() {
  console.log("🔧 Deploying Mock Verifier and updating CVTMinting...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Using account:", deployer.address);

  // Deploy CarbonOffsetVerifier (mock verifier that always returns true)
  console.log("📄 Deploying CarbonOffsetVerifier (Mock Verifier)...");
  const CarbonOffsetVerifier = await hre.ethers.getContractFactory("CarbonOffsetVerifier");
  const verifier = await CarbonOffsetVerifier.deploy();
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();
  console.log("✅ Verifier deployed to:", verifierAddress);

  // Update CVTMinting to use the new verifier
  console.log("\n🔗 Updating CVTMinting verifier...");
  const CVTMinting = await hre.ethers.getContractFactory("CVTMinting");
  const cvtMinting = CVTMinting.attach(addr.contracts.CVTMinting);
  
  const tx = await cvtMinting.setZKVerifier(verifierAddress);
  console.log("   Transaction hash:", tx.hash);
  await tx.wait();
  console.log("✅ CVTMinting verifier updated!");

  console.log("\n🎉 Setup complete! You can now mint CVT tokens.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

