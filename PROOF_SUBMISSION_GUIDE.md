# 📋 Validator Proof Submission Guide

Complete guide on how to submit proof verifications for validators in the Carbon Vault system.

---

## 🎯 Overview

**What is Proof Submission?**
- Validators verify zero-knowledge (ZK) proofs for carbon offset claims
- Each verified proof earns the validator 1 CVT reward
- Only authorized addresses can submit proofs on-chain
- Proofs are submitted to the ValidatorRewards contract

**Who Can Submit Proofs?**
- ✅ Contract Owner (you)
- ✅ Authorized Submitter Contracts (e.g., CVTMinting)
- ❌ Regular validators (cannot submit for themselves)

---

## 🛠️ Method 1: Using the Management Script (Recommended)

### Quick Submit

**Submit 10 proofs for yourself:**
```bash
cd /home/crimzor/Projects/Carbon\ Vault
ACTION=submit PROOFS=10 npx hardhat run scripts/manage-validators.js --network mantleSepolia
```

**Submit proofs for another validator:**
```bash
ACTION=submit VALIDATOR=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb PROOFS=5 \
  npx hardhat run scripts/manage-validators.js --network mantleSepolia
```

### Batch Submit Multiple Validators

**1. Create a JSON file** (`validators-batch.json`):
```json
[
  {
    "address": "0x7c538b83D0295f94C4bBAf8302095d9ED4b2Ad5f",
    "proofs": 10
  },
  {
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "proofs": 5
  },
  {
    "address": "0x1234567890123456789012345678901234567890",
    "proofs": 8
  }
]
```

**2. Run batch submission:**
```bash
ACTION=batch FILE=validators-batch.json \
  npx hardhat run scripts/manage-validators.js --network mantleSepolia
```

---

## 🔧 Method 2: Direct Smart Contract Interaction

### Using Hardhat Console

**1. Start Hardhat Console:**
```bash
npx hardhat console --network mantleSepolia
```

**2. Get Contract Instance:**
```javascript
const addr = require('./deployed-addresses.json');
const ValidatorRewards = await ethers.getContractFactory("ValidatorRewards");
const validatorRewards = ValidatorRewards.attach(addr.contracts.ValidatorRewards);
```

**3. Submit Single Proof:**
```javascript
const validatorAddress = "0x7c538b83D0295f94C4bBAf8302095d9ED4b2Ad5f";
const tx = await validatorRewards.submitProof(validatorAddress);
await tx.wait();
console.log("Proof submitted!");
```

**4. Submit Multiple Proofs (Batch):**
```javascript
const validators = [
  "0x7c538b83D0295f94C4bBAf8302095d9ED4b2Ad5f",
  "0x7c538b83D0295f94C4bBAf8302095d9ED4b2Ad5f",
  "0x7c538b83D0295f94C4bBAf8302095d9ED4b2Ad5f"
];
const tx = await validatorRewards.batchSubmitProof(validators);
await tx.wait();
console.log("Batch submitted!");
```

---

## 📱 Method 3: From Frontend (Validators Page)

### For Contract Owner

**1. Navigate to Validators Page:**
```
http://localhost:8080/validators
```

**2. Find "Submit Proof" Section:**
- Look for "Admin Actions" or "Owner Controls"
- Enter validator address
- Enter number of proofs
- Click "Submit Proof"

**3. Confirm Transaction:**
- MetaMask will pop up
- Review gas fees
- Confirm transaction
- Wait for confirmation

### Using the Hook

**In your React component:**
```typescript
import { useSubmitProof } from '@/hooks/useValidators';

function ValidatorAdmin() {
  const { submitProof, isPending } = useSubmitProof();
  
  const handleSubmit = async () => {
    try {
      await submitProof('0xValidatorAddress');
      toast.success('Proof submitted!');
    } catch (error) {
      toast.error('Failed to submit proof');
    }
  };
  
  return (
    <Button onClick={handleSubmit} disabled={isPending}>
      {isPending ? 'Submitting...' : 'Submit Proof'}
    </Button>
  );
}
```

---

## 🤖 Method 4: Automated Proof Submission

### Create Automated Script

**File: `scripts/auto-submit-proofs.js`**
```javascript
const hre = require("hardhat");
const deployedAddresses = require("../deployed-addresses.json");

async function submitProofsForValidator(validatorAddress, proofCount) {
  const ValidatorRewards = await hre.ethers.getContractFactory("ValidatorRewards");
  const validatorRewards = ValidatorRewards.attach(
    deployedAddresses.contracts.ValidatorRewards
  );
  
  console.log(`Submitting ${proofCount} proofs for ${validatorAddress}...`);
  
  // Create array of validator addresses (one per proof)
  const validators = Array(proofCount).fill(validatorAddress);
  
  // Submit batch
  const tx = await validatorRewards.batchSubmitProof(validators);
  console.log(`Transaction: ${tx.hash}`);
  
  await tx.wait();
  console.log(`✅ ${proofCount} proofs submitted!`);
  
  // Check updated stats
  const rewards = await validatorRewards.getPendingRewards(validatorAddress);
  const proofs = await validatorRewards.getVerifiedProofsCount(validatorAddress);
  
  console.log(`Pending Rewards: ${hre.ethers.formatEther(rewards)} CVT`);
  console.log(`Total Proofs: ${proofs.toString()}`);
}

async function main() {
  // Get validator address from environment or use default
  const validatorAddress = process.env.VALIDATOR || "0x7c538b83D0295f94C4bBAf8302095d9ED4b2Ad5f";
  const proofCount = parseInt(process.env.PROOFS || "5");
  
  await submitProofsForValidator(validatorAddress, proofCount);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

**Run the script:**
```bash
VALIDATOR=0xYourAddress PROOFS=10 \
  npx hardhat run scripts/auto-submit-proofs.js --network mantleSepolia
```

---

## 📊 Method 5: During Token Minting

### Automatic Proof Submission

When minting CVT tokens, you can specify a validator to receive proof credit:

**Using mint-cvt.js script:**
```bash
ACTION=mint AMOUNT=100 VALIDATOR=0xValidatorAddress \
  npx hardhat run scripts/mint-cvt.js --network mantleSepolia
```

**In the minting contract:**
```solidity
function mintCVT(
    address to,
    uint256 amount,
    bytes calldata proof,
    uint256[] calldata publicInputs,
    bytes32 commitment,
    string calldata projectId,
    address validator  // ← Validator address
) external {
    // ... minting logic ...
    
    // Submit proof to validator if specified
    if (validator != address(0)) {
        validatorRewards.submitProof(validator);
    }
}
```

---

## 🎯 Best Practices

### 1. Batch Submissions

**Why?**
- Saves gas fees
- More efficient
- Faster processing

**How?**
```bash
# Instead of 10 separate transactions:
ACTION=submit PROOFS=1 npx hardhat run scripts/manage-validators.js --network mantleSepolia
# (repeat 10 times) ❌

# Do this:
ACTION=submit PROOFS=10 npx hardhat run scripts/manage-validators.js --network mantleSepolia
# (one transaction) ✅
```

### 2. Regular Intervals

**Set up a cron job:**
```bash
# Submit 5 proofs daily at 9 AM
0 9 * * * cd /path/to/project && ACTION=submit PROOFS=5 npx hardhat run scripts/manage-validators.js --network mantleSepolia
```

### 3. Verify Before Submitting

**Check validator status:**
```bash
ACTION=check VALIDATOR=0xAddress \
  npx hardhat run scripts/manage-validators.js --network mantleSepolia
```

### 4. Monitor Contract Balance

**Ensure contract has enough CVT:**
```bash
# Check balance
ACTION=check npx hardhat run scripts/manage-validators.js --network mantleSepolia

# Fund if needed
ACTION=fund AMOUNT=500 npx hardhat run scripts/manage-validators.js --network mantleSepolia
```

---

## 🔍 Verification & Tracking

### Check Proof Submission

**1. View on Block Explorer:**
```
https://explorer.sepolia.mantle.xyz/tx/YOUR_TX_HASH
```

**2. Check Validator Stats:**
```bash
ACTION=check VALIDATOR=0xAddress \
  npx hardhat run scripts/manage-validators.js --network mantleSepolia
```

**Output:**
```
📊 Validator Statistics
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Validator: 0x7c538b83D0295f94C4bBAf8302095d9ED4b2Ad5f

Stats:
  Pending rewards: 20.0 CVT
  Verified proofs: 20
  Reward per proof: 1.0 CVT
  Total earned: 20.0 CVT
```

**3. Check Contract Events:**
```javascript
// In Hardhat console
const filter = validatorRewards.filters.ProofSubmitted();
const events = await validatorRewards.queryFilter(filter);
console.log(events);
```

---

## 🚨 Troubleshooting

### Error: "Not authorized submitter"

**Problem:** You're not the owner or an authorized submitter.

**Solution:**
```bash
# Check who's the owner
npx hardhat console --network mantleSepolia
> const vr = await ethers.getContractAt("ValidatorRewards", "0xAddress")
> await vr.owner()

# Make sure you're using the owner account
```

### Error: "Validator not active"

**Problem:** The validator hasn't registered or has unregistered.

**Solution:**
```bash
# Check if validator is active
ACTION=check VALIDATOR=0xAddress \
  npx hardhat run scripts/manage-validators.js --network mantleSepolia

# If not active, they need to register first
```

### Error: "Insufficient funds"

**Problem:** Not enough MNT for gas fees.

**Solution:**
```bash
# Get testnet MNT from faucet
# Visit: https://faucet.sepolia.mantle.xyz
```

### Error: "Reward rate not set"

**Problem:** Reward per proof is 0.

**Solution:**
```bash
# Set reward rate
ACTION=set-reward AMOUNT=1 \
  npx hardhat run scripts/manage-validators.js --network mantleSepolia
```

---

## 📈 Proof Submission Workflow

### Complete Example

**Scenario:** Submit 10 proofs for 3 validators

**Step 1: Create batch file**
```json
[
  {"address": "0xValidator1", "proofs": 10},
  {"address": "0xValidator2", "proofs": 10},
  {"address": "0xValidator3", "proofs": 10}
]
```

**Step 2: Submit batch**
```bash
ACTION=batch FILE=validators-batch.json \
  npx hardhat run scripts/manage-validators.js --network mantleSepolia
```

**Step 3: Verify submissions**
```bash
# Check each validator
ACTION=check VALIDATOR=0xValidator1 \
  npx hardhat run scripts/manage-validators.js --network mantleSepolia
```

**Step 4: Validators claim rewards**
```bash
# Each validator runs:
npx hardhat run scripts/claim-validator-rewards.js --network mantleSepolia
```

---

## 🎓 Understanding Proof Submission

### What Happens When You Submit?

```
1. Transaction Sent
   ↓
2. ValidatorRewards Contract Called
   ↓
3. Authorization Check (owner or authorized?)
   ↓
4. Validator Active Check
   ↓
5. Reward Added (rewardPerProof)
   ↓
6. Proof Count Incremented
   ↓
7. Event Emitted (ProofSubmitted)
   ↓
8. Transaction Confirmed
```

### Gas Costs

**Single Proof:**
- Estimated: ~50,000 gas
- Cost at 0.01 Gwei: ~0.0005 MNT

**Batch (10 proofs):**
- Estimated: ~200,000 gas
- Cost at 0.01 Gwei: ~0.002 MNT

**Savings:**
- Batch is 4x more efficient!

---

## 🔗 Quick Reference

### Common Commands

```bash
# Submit 5 proofs for yourself
ACTION=submit PROOFS=5 npx hardhat run scripts/manage-validators.js --network mantleSepolia

# Submit for another validator
ACTION=submit VALIDATOR=0xAddress PROOFS=10 \
  npx hardhat run scripts/manage-validators.js --network mantleSepolia

# Batch submit from file
ACTION=batch FILE=validators.json \
  npx hardhat run scripts/manage-validators.js --network mantleSepolia

# Check validator stats
ACTION=check VALIDATOR=0xAddress \
  npx hardhat run scripts/manage-validators.js --network mantleSepolia

# List all validators
ACTION=list npx hardhat run scripts/manage-validators.js --network mantleSepolia
```

### Contract Functions

```solidity
// Submit single proof
submitProof(address validator)

// Submit multiple proofs
batchSubmitProof(address[] calldata validators)

// Check pending rewards
getPendingRewards(address validator) returns (uint256)

// Check proof count
getVerifiedProofsCount(address validator) returns (uint256)
```

---

## ✅ Checklist

Before submitting proofs, ensure:

- [ ] You are the contract owner or authorized submitter
- [ ] Validator is registered and active
- [ ] Contract has sufficient CVT balance for rewards
- [ ] You have enough MNT for gas fees
- [ ] Reward rate is set (default: 1 CVT per proof)
- [ ] Validator address is correct

---

## 🎉 Summary

**Easiest Method:**
```bash
ACTION=submit PROOFS=10 npx hardhat run scripts/manage-validators.js --network mantleSepolia
```

**Most Efficient:**
```bash
ACTION=batch FILE=validators.json npx hardhat run scripts/manage-validators.js --network mantleSepolia
```

**For Automation:**
Set up cron job with auto-submit-proofs.js script

**From Frontend:**
Use `useSubmitProof()` hook in Validators page

---

Need help? Check the troubleshooting section or run:
```bash
HELP=true npx hardhat run scripts/manage-validators.js --network mantleSepolia
```

