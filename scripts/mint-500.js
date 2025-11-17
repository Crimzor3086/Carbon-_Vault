const hre = require("hardhat");
const crypto = require("crypto");
const addr = require("../deployed-addresses.json");

async function main() {
  console.log("\n🎯 Minting 500 CVT...\n");
  const [signer] = await hre.ethers.getSigners();
  
  const CVT = await hre.ethers.getContractFactory("CVTMinting");
  const cvt = CVT.attach(addr.contracts.CVTMinting);

  const balBefore = await cvt.balanceOf(signer.address);
  console.log("Balance Before:", hre.ethers.formatEther(balBefore), "CVT\n");

  const amount = hre.ethers.parseEther("500");
  const ts = Math.floor(Date.now() / 1000);
  const secret = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(`FOREST-RESTORATION${500}${ts}${secret}`).digest("hex");
  const commitment = "0x" + hash;
  const proof = "0x" + crypto.randomBytes(128).toString("hex");
  const inputs = [BigInt(commitment).toString(), "500", (ts-86400).toString(), (ts+86400).toString(), "1"];

  console.log("Minting 500 CVT for FOREST-RESTORATION project...");
  const tx = await cvt.mintCVT(signer.address, amount, proof, inputs, commitment, "FOREST-RESTORATION-2024", "0x0000000000000000000000000000000000000000");
  console.log("TX:", tx.hash);
  console.log("Explorer: https://moonbase.moonscan.io/tx/" + tx.hash);
  
  const receipt = await tx.wait();
  console.log("\n✅ Success! Block:", receipt.blockNumber);
  
  const balAfter = await cvt.balanceOf(signer.address);
  console.log("Balance After:", hre.ethers.formatEther(balAfter), "CVT");
  console.log("Minted:", hre.ethers.formatEther(balAfter - balBefore), "CVT\n");
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
