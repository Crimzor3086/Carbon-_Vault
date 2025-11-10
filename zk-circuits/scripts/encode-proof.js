/**
 * Encode proof for smart contract submission
 * Converts SnarkJS proof format to contract-compatible format
 */
const fs = require("fs");
const path = require("path");

function encodeProof(proof) {
    /**
     * Encode Groth16 proof for Solidity contract
     * Proof structure: { pi_a, pi_b, pi_c }
     * Each component is an array of BigInt values
     */
    
    // Convert proof components to hex strings
    const encoded = {
        a: [
            proof.pi_a[0].toString(),
            proof.pi_a[1].toString()
        ],
        b: [
            [
                proof.pi_b[0][1].toString(), // Note: Groth16 uses reversed order
                proof.pi_b[0][0].toString()
            ],
            [
                proof.pi_b[1][1].toString(),
                proof.pi_b[1][0].toString()
            ]
        ],
        c: [
            proof.pi_c[0].toString(),
            proof.pi_c[1].toString()
        ]
    };
    
    return encoded;
}

function encodeProofForContract(proof, publicSignals) {
    /**
     * Encode proof and public signals for contract submission
     * Returns format compatible with Groth16 verifier contract
     */
    const encodedProof = encodeProof(proof);
    
    return {
        proof: encodedProof,
        publicSignals: publicSignals.map(s => s.toString())
    };
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);
    const proofPath = args[0] || path.join(__dirname, "../build/proof.json");
    
    if (!fs.existsSync(proofPath)) {
        console.error("Proof file not found:", proofPath);
        process.exit(1);
    }
    
    const proofData = JSON.parse(fs.readFileSync(proofPath, "utf8"));
    const encoded = encodeProofForContract(proofData.proof, proofData.publicSignals);
    
    console.log(JSON.stringify(encoded, null, 2));
    
    // Save encoded proof
    const outputPath = path.join(__dirname, "../build/encoded_proof.json");
    fs.writeFileSync(outputPath, JSON.stringify(encoded, null, 2));
    console.log("\nEncoded proof saved to:", outputPath);
}

module.exports = { encodeProof, encodeProofForContract };

