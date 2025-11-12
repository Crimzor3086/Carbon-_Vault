const hre = require("hardhat");
const crypto = require("crypto");
const addr = require("../deployed-addresses.json");

async function main() {
  console.log("\n🎯 Minting CVT (Simple)...\n");
  const [signer] = await hre.ethers.getSigners();
  
  const CVT = await hre.ethers.getContractFactory("CVTMinting");
  const cvt = CVT.attach(addr.contracts.CVTMinting);

  const amount = hre.ethers.parseEther("100");
  const ts = Math.floor(Date.now() / 1000);
  const secret = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(`TEST${100}${ts}${secret}`).digest("hex");
  const commitment = "0x" + hash;
  const proof = "0x" + crypto.randomBytes(128).toString("hex");
  const inputs = [BigInt(commitment).toString(), "100", (ts-86400).toString(), (ts+86400).toString(), "1"];

  console.log("Minting 100 CVT...");
  console.log("Commitment:", commitment.substring(0, 20) + "...");
  console.log("Validator: 0x0 (none)\n");

  try {
    const tx = await cvt.mintCVT(signer.address, amount, proof, inputs, commitment, "TEST-001", "0x0000000000000000000000000000000000000000");
    console.log("TX:", tx.hash);
    const receipt = await tx.wait();
    console.log("✅ Success! Block:", receipt.blockNumber);
    const bal = await cvt.balanceOf(signer.address);
    console.log("Balance:", hre.ethers.formatEther(bal), "CVT\n");
  } catch (e) {
    console.log("❌ Error:", e.message.substring(0, 100), "...\n");
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
