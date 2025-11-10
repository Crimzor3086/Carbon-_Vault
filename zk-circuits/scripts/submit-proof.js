/**
 * Script to submit ZK proof to CarbonVault smart contract
 * Example integration with Hardhat/Ethers
 */
const { ethers } = require("hardhat");
const { encodeProofForContract } = require("./encode-proof");
const fs = require("fs");
const path = require("path");

async function submitProof(proofPath, contractAddress, assetId, commitment) {
    console.log("Submitting ZK proof to CarbonVault contract...\n");
    
    // Load proof
    const proofData = JSON.parse(fs.readFileSync(proofPath, "utf8"));
    
    // Encode proof for contract
    const encoded = encodeProofForContract(proofData.proof, proofData.publicSignals);
    
    console.log("Proof data:");
    console.log("  Asset ID:", assetId);
    console.log("  Commitment:", commitment);
    console.log("  Public signals:", encoded.publicSignals.length);
    console.log();
    
    // Get contract instance
    const [signer] = await ethers.getSigners();
    const CarbonVaultZK = await ethers.getContractFactory("CarbonVaultZK");
    const contract = CarbonVaultZK.attach(contractAddress);
    
    // Prepare proof for contract
    // Note: Actual format depends on your verifier contract implementation
    const proof = [
        encoded.proof.a,
        encoded.proof.b,
        encoded.proof.c
    ];
    
    const publicInputs = encoded.publicSignals;
    
    console.log("Submitting transaction...");
    
    try {
        // Call createPrivateAsset
        const tx = await contract.createPrivateAsset(
            assetId,
            commitment,
            proof,
            publicInputs
        );
        
        console.log("Transaction hash:", tx.hash);
        console.log("Waiting for confirmation...");
        
        const receipt = await tx.wait();
        console.log("✓ Transaction confirmed!");
        console.log("  Block:", receipt.blockNumber);
        console.log("  Gas used:", receipt.gasUsed.toString());
        
        return receipt;
        
    } catch (error) {
        console.error("Error submitting proof:", error);
        throw error;
    }
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length < 3) {
        console.log("Usage: node submit-proof.js <proof.json> <contract_address> <asset_id> <commitment>");
        console.log("\nExample:");
        console.log("  node submit-proof.js build/proof.json 0x123... 1 0xabc...");
        process.exit(1);
    }
    
    const [proofPath, contractAddress, assetId, commitment] = args;
    
    submitProof(proofPath, contractAddress, assetId, commitment)
        .then(() => {
            console.log("\nProof submitted successfully!");
        })
        .catch((error) => {
            console.error("Error:", error);
            process.exit(1);
        });
}

module.exports = { submitProof };

