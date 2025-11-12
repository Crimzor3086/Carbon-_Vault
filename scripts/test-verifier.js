const hre = require("hardhat");
const crypto = require("crypto");
const deployedAddresses = require("../deployed-addresses.json");

async function main() {
  console.log("\n🧪 Testing ZK Verifier...\n");

  const [signer] = await hre.ethers.getSigners();
  
  // Get verifier contract
  const CarbonOffsetVerifier = await hre.ethers.getContractFactory("CarbonOffsetVerifier");
  const verifier = CarbonOffsetVerifier.attach(deployedAddresses.contracts.CarbonOffsetVerifier);

  console.log("📋 Verifier Info:");
  console.log(`  Address: ${deployedAddresses.contracts.CarbonOffsetVerifier}`);

  // Generate mock proof
  const proofBytes = "0x" + crypto.randomBytes(128).toString("hex");
  const publicInputs = ["1", "100", "1000", "2000", "1"];

  console.log("\n🔧 Testing verifyProof()...");
  console.log(`  Proof length: ${proofBytes.length} chars`);
  console.log(`  Public inputs: [${publicInputs.join(", ")}]`);

  try {
    const result = await verifier.verifyProof(proofBytes, publicInputs);
    console.log(`  Result: ${result ? "✓ Valid" : "✗ Invalid"}`);
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
  }

  console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

