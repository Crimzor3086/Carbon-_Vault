const hre = require("hardhat");
const crypto = require("crypto");
const deployedAddresses = require("../deployed-addresses.json");

async function main() {
  console.log("\n🎯 Simple CVT Minting Test...\n");

  const [signer] = await hre.ethers.getSigners();
  console.log("Signer:", signer.address);

  // Get contract
  const CVTMinting = await hre.ethers.getContractFactory("CVTMinting");
  const cvt = CVTMinting.attach(deployedAddresses.contracts.CVTMinting);

  // Check balance before
  const balanceBefore = await cvt.balanceOf(signer.address);
  console.log(`Balance Before: ${hre.ethers.formatEther(balanceBefore)} CVT\n`);

  // Prepare minting parameters
  const recipient = signer.address;
  const amount = hre.ethers.parseEther("100");
  const timestamp = Math.floor(Date.now() / 1000);
  
  // Generate commitment
  const secret = crypto.randomBytes(32).toString("hex");
  const data = `CARBON-PROJECT-001${100}${timestamp}${secret}`;
  const commitmentHash = crypto.createHash("sha256").update(data).digest("hex");
  const commitment = "0x" + commitmentHash;
  
  console.log("📋 Parameters:");
  console.log(`  Recipient: ${recipient}`);
  console.log(`  Amount: 100 CVT`);
  console.log(`  Commitment: ${commitment.substring(0, 10)}...`);
  console.log(`  Project: CARBON-PROJECT-001`);
  console.log(`  Validator: 0x0000000000000000000000000000000000000000\n`);

  // Generate proof
  const proofBytes = "0x" + crypto.randomBytes(128).toString("hex");
  const commitmentUint = BigInt(commitment);
  const publicInputs = [
    commitmentUint.toString(),
    "100",
    (timestamp - 86400).toString(),
    (timestamp + 86400).toString(),
    "1"
  ];

  console.log("🔐 Proof & Inputs:");
  console.log(`  Proof: ${proofBytes.substring(0, 20)}...`);
  console.log(`  Public Inputs: [${publicInputs[0].substring(0, 10)}..., ${publicInputs[1]}, ${publicInputs[2]}, ${publicInputs[3]}, ${publicInputs[4]}]\n`);

  // Try minting
  console.log("📤 Submitting transaction...");
  try {
    const tx = await cvt.mintCVT(
      recipient,
      amount,
      proofBytes,
      publicInputs,
      commitment,
      "CARBON-PROJECT-001",
      "0x0000000000000000000000000000000000000000",
      {
        gasLimit: 100000000
      }
    );

    console.log(`✓ Transaction: ${tx.hash}`);
    console.log(`  Explorer: https://moonbase.moonscan.io/tx/${tx.hash}\n`);

    console.log("⏳ Waiting for confirmation...");
    const receipt = await tx.wait();

    console.log(`✅ Confirmed in block ${receipt.blockNumber}`);
    console.log(`  Gas used: ${receipt.gasUsed.toString()}\n`);

    // Check balance after
    const balanceAfter = await cvt.balanceOf(signer.address);
    console.log(`Balance After: ${hre.ethers.formatEther(balanceAfter)} CVT`);
    console.log(`Minted: ${hre.ethers.formatEther(balanceAfter - balanceBefore)} CVT\n`);

    console.log("🎉 Success!");

  } catch (error) {
    console.log(`\n❌ Error: ${error.message}\n`);
    
    if (error.data) {
      console.log("Error data:", error.data);
    }
    if (error.receipt) {
      console.log("Receipt status:", error.receipt.status);
      console.log("Gas used:", error.receipt.gasUsed.toString());
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

