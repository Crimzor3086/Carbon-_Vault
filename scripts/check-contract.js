const hre = require("hardhat");
const deployedAddresses = require("../deployed-addresses.json");

async function main() {
  console.log("\n🔍 Checking CVTMinting Contract...\n");

  const [signer] = await hre.ethers.getSigners();
  console.log("Signer:", signer.address);

  const CVTMinting = await hre.ethers.getContractFactory("CVTMinting");
  const cvt = CVTMinting.attach(deployedAddresses.contracts.CVTMinting);

  // Check basic info
  console.log("\n📋 Token Info:");
  const name = await cvt.name();
  const symbol = await cvt.symbol();
  const totalSupply = await cvt.totalSupply();
  const balance = await cvt.balanceOf(signer.address);
  
  console.log(`  Name: ${name}`);
  console.log(`  Symbol: ${symbol}`);
  console.log(`  Total Supply: ${hre.ethers.formatEther(totalSupply)} CVT`);
  console.log(`  Your Balance: ${hre.ethers.formatEther(balance)} CVT`);

  // Check verifier
  console.log("\n🔐 ZK Verifier:");
  const verifierAddress = await cvt.zkVerifier();
  console.log(`  Address: ${verifierAddress}`);

  // Check if verifier exists
  const verifierCode = await hre.ethers.provider.getCode(verifierAddress);
  console.log(`  Deployed: ${verifierCode !== "0x" ? "✓ Yes" : "✗ No"}`);

  // Check validator rewards
  console.log("\n💰 Validator Rewards:");
  const validatorRewardsAddress = await cvt.validatorRewards();
  console.log(`  Address: ${validatorRewardsAddress}`);

  // Check owner
  console.log("\n👤 Owner:");
  const owner = await cvt.owner();
  console.log(`  Address: ${owner}`);
  console.log(`  Is Signer: ${owner.toLowerCase() === signer.address.toLowerCase() ? "✓ Yes" : "✗ No"}`);

  console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

