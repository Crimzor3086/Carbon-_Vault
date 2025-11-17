const hre = require("hardhat");
const crypto = require("crypto");
const addr = require("../deployed-addresses.json");

async function main() {
  console.log("\n🎯 Minting 50,000 CVT...\n");
  const [signer] = await hre.ethers.getSigners();
  
  const CVT = await hre.ethers.getContractFactory("CVTMinting");
  const cvt = CVT.attach(addr.contracts.CVTMinting);

  const balBefore = await cvt.balanceOf(signer.address);
  console.log("Balance Before:", hre.ethers.formatEther(balBefore), "CVT\n");

  const amount = hre.ethers.parseEther("50000");
  const ts = Math.floor(Date.now() / 1000);
  const secret = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(`CARBON-OFFSET-50000${50000}${ts}${secret}`).digest("hex");
  const commitment = "0x" + hash;
  const proof = "0x" + crypto.randomBytes(384).toString("hex"); // Proper proof size
  const inputs = [
    BigInt(commitment).toString(), 
    "50000", // min_co2_tons
    (ts - 86400).toString(), // min_timestamp (1 day ago)
    (ts + 86400).toString(), // max_timestamp (1 day from now)
    "1" // verifier_id
  ];

  console.log("Minting 50,000 CVT for CARBON-OFFSET-50000 project...");
  console.log("Commitment:", commitment);
  console.log("Public Inputs:", inputs);
  
  const tx = await cvt.mintCVT(
    signer.address, 
    amount, 
    proof, 
    inputs, 
    commitment, 
    "CARBON-OFFSET-50000", 
    "0x0000000000000000000000000000000000000000"
  );
  console.log("TX:", tx.hash);
  console.log("Explorer: https://moonbase.moonscan.io/tx/" + tx.hash);
  
  const receipt = await tx.wait();
  console.log("\n✅ Success! Block:", receipt.blockNumber);
  
  const balAfter = await cvt.balanceOf(signer.address);
  console.log("Balance After:", hre.ethers.formatEther(balAfter), "CVT");
  console.log("Minted:", hre.ethers.formatEther(balAfter - balBefore), "CVT\n");
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
