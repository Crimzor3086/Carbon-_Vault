const hre = require("hardhat");
const deployedAddresses = require("../deployed-addresses.json");

async function main() {
  console.log("\n🔧 Authorizing CVTMinting Contract...\n");

  const [signer] = await hre.ethers.getSigners();
  console.log("Signer:", signer.address);

  const ValidatorRewards = await hre.ethers.getContractFactory("ValidatorRewards");
  const validatorRewards = ValidatorRewards.attach(deployedAddresses.contracts.ValidatorRewards);

  console.log("\n📋 Current Status:");
  const isAuthorized = await validatorRewards.authorizedSubmitters(deployedAddresses.contracts.CVTMinting);
  console.log(`  CVTMinting authorized: ${isAuthorized ? "✓ Yes" : "✗ No"}`);

  if (!isAuthorized) {
    console.log("\n🔓 Authorizing CVTMinting...");
    const tx = await validatorRewards.setAuthorizedSubmitter(
      deployedAddresses.contracts.CVTMinting,
      true,
      { gasLimit: 100000000 }
    );
    console.log(`  Transaction: ${tx.hash}`);
    await tx.wait();
    console.log("✓ CVTMinting authorized!\n");
  } else {
    console.log("\n✓ Already authorized!\n");
  }

  const isNowAuthorized = await validatorRewards.authorizedSubmitters(deployedAddresses.contracts.CVTMinting);
  console.log("✅ Final Status:");
  console.log(`  CVTMinting authorized: ${isNowAuthorized ? "✓ Yes" : "✗ No"}\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
