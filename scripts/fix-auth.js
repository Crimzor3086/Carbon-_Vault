const hre = require("hardhat");
const deployedAddresses = require("../deployed-addresses.json");

async function main() {
  console.log("\n🔧 Authorizing CVTMinting...\n");
  const [signer] = await hre.ethers.getSigners();
  console.log("Signer:", signer.address);

  const ValidatorRewards = await hre.ethers.getContractFactory("ValidatorRewards");
  const vr = ValidatorRewards.attach(deployedAddresses.contracts.ValidatorRewards);

  const isAuth = await vr.authorizedSubmitters(deployedAddresses.contracts.CVTMinting);
  console.log(`CVTMinting authorized: ${isAuth}\n`);

  if (!isAuth) {
    console.log("Authorizing...");
    const tx = await vr.setAuthorizedSubmitter(deployedAddresses.contracts.CVTMinting, true, { gasLimit: 100000000 });
    await tx.wait();
    console.log("Done!\n");
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
