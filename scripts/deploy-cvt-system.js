const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deploying CVT system contracts with the account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Resolve verifier
  let zkVerifierAddress = process.env.ZK_VERIFIER_ADDRESS;
  if (!zkVerifierAddress || zkVerifierAddress === "0x0000000000000000000000000000000000000000") {
    console.log("\n=== Deploying CarbonOffsetVerifier ===");
    const Verifier = await hre.ethers.getContractFactory("CarbonOffsetVerifier");
    const verifier = await Verifier.deploy();
    await verifier.waitForDeployment();
    zkVerifierAddress = await verifier.getAddress();
    console.log("CarbonOffsetVerifier deployed to:", zkVerifierAddress);
  } else {
    console.log("\nUsing existing verifier:", zkVerifierAddress);
  }

  // Deploy CVTMinting
  console.log("\n=== Deploying CVTMinting ===");
  const CVTMinting = await hre.ethers.getContractFactory("CVTMinting");
  const cvtMinting = await CVTMinting.deploy(
    zkVerifierAddress,
    "0x0000000000000000000000000000000000000000", // ValidatorRewards (set later)
    deployer.address
  );
  await cvtMinting.waitForDeployment();
  const cvtMintingAddress = await cvtMinting.getAddress();
  console.log("CVTMinting deployed to:", cvtMintingAddress);

  // Deploy ValidatorRewards (now that CVT address is known)
  console.log("\n=== Deploying ValidatorRewards ===");
  const ValidatorRewards = await hre.ethers.getContractFactory("ValidatorRewards");
  const validatorRewards = await ValidatorRewards.deploy(cvtMintingAddress);
  await validatorRewards.waitForDeployment();
  const validatorRewardsAddress = await validatorRewards.getAddress();
  console.log("ValidatorRewards deployed to:", validatorRewardsAddress);

  // Wire contracts together
  console.log("\n=== Linking Contracts ===");
  const linkTx = await cvtMinting.setValidatorRewards(validatorRewardsAddress);
  await linkTx.wait();
  console.log("Linked CVTMinting -> ValidatorRewards");

  // Update ValidatorRewards with CVT token address
  // Authorize CVTMinting to submit proofs to ValidatorRewards
  await validatorRewards.setAuthorizedSubmitter(cvtMintingAddress, true);
  console.log("Authorized CVTMinting to submit proofs");

  // Deploy CVTMarketplace
  console.log("\n=== Deploying CVTMarketplace ===");
  const CVTMarketplace = await hre.ethers.getContractFactory("CVTMarketplace");
  // For stablecoin, we'll use a placeholder - in production, use USDC/USDT/etc
  const stablecoinAddress = process.env.STABLECOIN_ADDRESS || "0x0000000000000000000000000000000000000000";
  const cvtMarketplace = await CVTMarketplace.deploy(
    cvtMintingAddress, // CVT token
    stablecoinAddress, // Stablecoin (0x0 = native)
    deployer.address // Owner / fee recipient
  );
  await cvtMarketplace.waitForDeployment();
  const cvtMarketplaceAddress = await cvtMarketplace.getAddress();
  console.log("CVTMarketplace deployed to:", cvtMarketplaceAddress);

  // Deploy CVTStaking
  console.log("\n=== Deploying CVTStaking ===");
  const CVTStaking = await hre.ethers.getContractFactory("CVTStaking");
  const cvtStaking = await CVTStaking.deploy(
    cvtMintingAddress, // CVT token
    deployer.address // Owner
  );
  await cvtStaking.waitForDeployment();
  const cvtStakingAddress = await cvtStaking.getAddress();
  console.log("CVTStaking deployed to:", cvtStakingAddress);

  // Save deployment addresses
  const fs = require("fs");
  const deploymentsDir = "./deployments";
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    timestamp: new Date().toISOString(),
    contracts: {
      CVTMinting: cvtMintingAddress,
      ValidatorRewards: validatorRewardsAddress,
      CVTMarketplace: cvtMarketplaceAddress,
      CVTStaking: cvtStakingAddress,
    },
    deployer: deployer.address,
    notes: {
      zkVerifier: "Deploy Groth16Verifier from zk-circuits/build/Verifier.sol separately",
      stablecoin: "Set STABLECOIN_ADDRESS environment variable for production"
    }
  };
  
  fs.writeFileSync(
    `${deploymentsDir}/cvt-system-${hre.network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\n=== Deployment Summary ===");
  console.log("Network:", hre.network.name);
  console.log("CVTMinting:", cvtMintingAddress);
  console.log("ValidatorRewards:", validatorRewardsAddress);
  console.log("CVTMarketplace:", cvtMarketplaceAddress);
  console.log("CVTStaking:", cvtStakingAddress);
  console.log("\nDeployment info saved to:", `${deploymentsDir}/cvt-system-${hre.network.name}.json`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

