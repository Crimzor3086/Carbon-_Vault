# 🌍 Carbon Vault

> Blockchain-based carbon credit trading and verification platform

[![Network](https://img.shields.io/badge/Network-Moonbase%20Alpha-purple)](https://moonbase.moonscan.io)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)](https://github.com/Innovah-Tech/Carbon-Vault)

**Carbon Vault** is a decentralized platform for tokenizing, trading, and verifying carbon credits using blockchain technology, zero-knowledge proofs, and real-world data integration.

---

## ✨ Features

### **Core Functionality**
- 🪙 **CVT Token** - ERC20 carbon credit tokens with ZK proof minting
- 💰 **Staking** - Stake CVT tokens to earn yield rewards
- 🏪 **Marketplace** - P2P trading platform for carbon credits
- ✅ **Validators** - Proof verification and reward system
- 📊 **Reports** - ESG compliance and transaction reporting

### **Technical Features**
- 🔐 **Zero-Knowledge Proofs** - Private carbon offset verification
- 📡 **Data Pipeline** - IoT sensors and satellite data integration
- 🎨 **Modern UI** - React + TypeScript + TailwindCSS
- ⛓️ **Smart Contracts** - Solidity on Moonbeam Network
- 🔄 **Real-time Updates** - Live blockchain data

---

## 🚀 Quick Start

### **1. Prerequisites**

```bash
Node.js 18+
npm or yarn
MetaMask wallet
Moonbase Alpha DEV tokens (GLMR testnet)
```

### **2. Installation**

```bash
# Clone repository
git clone <repository-url>
cd "Carbon Vault"

# Install dependencies (root + frontend)
npm install
cd frontend && npm install && cd ..
```

### **3. Configuration**

Create `.env` file in project root (never commit secrets):

```env
# Hardhat deployer (Moonbeam)
PRIVATE_KEY=your_private_key_without_0x
MOONBASE_RPC_URL=https://rpc.api.moonbase.moonbeam.network

# Optional marketplace override (default uses CVT token)
# STABLECOIN_ADDRESS=0x0000000000000000000000000000000000000000  # accept native GLMR
```

If you plan to run the Python data pipeline, copy `data-pipeline/.env.example` and set the required API keys (Planet Labs, Sentinel, OpenAQ, etc.).

### **4. Run Frontend**

```bash
cd frontend
npm run dev
# Open http://localhost:5173
```

### **5. Mint CVT Tokens**

```bash
# Mint 100 CVT
npx hardhat run scripts/mint-simple.js --network moonbaseAlpha

# Mint 500 CVT
npx hardhat run scripts/mint-500.js --network moonbaseAlpha
```

---

## 📁 Project Structure

```
Carbon Vault/
├── contracts/              # Solidity smart contracts
│   ├── CVTMinting.sol     # ERC20 token with ZK minting
│   ├── CVTStaking.sol     # Staking and yield
│   ├── CVTMarketplace.sol # P2P trading
│   ├── ValidatorRewards.sol # Validator incentives
│   └── verifiers/         # ZK proof verifiers
│
├── frontend/              # React application
│   ├── src/
│   │   ├── pages/        # Main pages
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # Business logic
│   │   └── lib/          # Utilities & contracts
│   └── public/
│       └── logo.png      # Carbon Vault logo
│
├── data-pipeline/         # Python data processing
│   ├── pipeline/
│   │   ├── sources/      # IoT & satellite data
│   │   ├── processors/   # Data normalization
│   │   └── storage/      # Database integration
│   └── docker-compose.yml
│
├── zk-circuits/           # Zero-knowledge circuits
│   ├── circuits/
│   │   └── CarbonOffsetVerifier.circom
│   └── scripts/          # Proof generation
│
└── scripts/               # Deployment & utilities
    ├── deploy-cvt-system.js
    ├── mint-simple.js
    └── check-contract.js
```

---

## 🔧 Smart Contracts

### **Target Deployment: Moonbase Alpha**

| Contract | Address | Purpose |
|----------|---------|---------|
| **CVTMinting** | _TBD (deploy to Moonbase Alpha)_ | ERC20 token minting + faucet |
| **CVTStaking** | _TBD_ | Staking & rewards |
| **CVTMarketplace** | _TBD_ | P2P trading |
| **ValidatorRewards** | _TBD_ | Validator incentives |
| **CarbonOffsetVerifier** | _TBD_ | ZK proof verification |

### **Key Functions**

```solidity
// Mint CVT with ZK proof
function mintCVT(
    address to,
    uint256 amount,
    bytes calldata proof,
    uint256[] calldata publicInputs,
    bytes32 commitment,
    string memory projectId,
    address validator
) external

// Stake CVT tokens
function stake(uint256 amount) external

// Create marketplace listing
function listCVT(
    uint256 amount,
    uint256 price,
    uint256 expiresIn
) external returns (uint256)

// Submit validator proof
function submitProof(address validator) external
```

---

## 💻 Development

### **Compile Contracts**

```bash
npx hardhat compile
```

### **Run Tests**

```bash
npx hardhat test
```

### **Deploy Contracts**

```bash
# Deploy to Moonbase Alpha
npx hardhat run scripts/deploy-cvt-system.js --network moonbaseAlpha

# Point marketplace at a stablecoin (defaults to CVT token if none supplied)
npx hardhat run scripts/update-marketplace-stablecoin.js --network moonbaseAlpha
# To accept native GLMR payments, pass STABLECOIN_ADDRESS=0x0000000000000000000000000000000000000000

# Deploy to Moonbeam Mainnet
npx hardhat run scripts/deploy-cvt-system.js --network moonbeam
```

### **Verify Contracts**

```bash
npx hardhat verify --network moonbaseAlpha <CONTRACT_ADDRESS>
```

---

## 🎨 Frontend

### **Technology Stack**

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + shadcn/ui
- **Web3**: wagmi + viem
- **State**: React hooks + localStorage
- **Routing**: React Router

### **Pages**

| Page | Route | Description |
|------|-------|-------------|
| **Dashboard** | `/` | Portfolio overview & staking |
| **Marketplace** | `/marketplace` | Buy/sell carbon credits |
| **Validators** | `/validators` | Submit proofs & earn rewards |
| **Reports** | `/reports` | Generate compliance reports |
| **Settings** | `/settings` | User preferences |

### **Run Development Server**

```bash
cd frontend
npm run dev
```

### **Build for Production**

```bash
cd frontend
npm run build
npm run preview
```

---

## 📊 Data Pipeline

### **Purpose**
Process carbon offset data from IoT sensors and satellite imagery for verification.

### **Data Sources**

1. **IoT Sensors** - Real-time CO2 measurements
2. **Satellite Imagery** - Vegetation indices (NDVI)
3. **Manual Inputs** - Project documentation

### **Run Pipeline**

```bash
cd data-pipeline

# With Docker
docker-compose up -d

# Manually
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run_pipeline.py
```

### **Auto-Mint from Pipeline Output**

After running the pipeline you can mint CVT directly from the generated measurements:

```bash
# Run pipeline + mint newest 2 records (dry-run first)
HARDHAT_NETWORK=moonbaseAlpha node scripts/mint-from-pipeline.js --run-pipeline --limit 2 --dry-run

# Execute for real
HARDHAT_NETWORK=moonbaseAlpha node scripts/mint-from-pipeline.js --run-pipeline --limit 2
```

Options include `--min-co2`, `--file <custom_json>`, `--recipient`, `--validator`, and `--dry-run` for previews. The script reuses the proof generation helpers from `mint-cvt.js`, so each qualifying pipeline record becomes a mint transaction with matching project IDs and CO₂ amounts.

### **Faucet (Test CVT)**

During development every connected wallet can claim 5 CVT per hour from the dashboard faucet button. Under the hood this calls `CVTMinting.claimFaucet()`. Owners can tune or disable the faucet with:

```bash
npx hardhat console --network moonbaseAlpha
> const staking = await ethers.getContractAt("CVTMinting", "<address>")
> await staking.setFaucetConfig(ethers.parseEther("5"), 3600)
```

This gives other contributors instant test funds without needing access to your private pipeline runs.

### **Configuration**

Edit `data-pipeline/config.py`:

```python
DATABASE_URL = "postgresql://user:pass@localhost/carbonvault"
IOT_API_KEY = "your_iot_api_key"
SATELLITE_API_KEY = "your_satellite_api_key"
```

---

## 🔐 Zero-Knowledge Proofs

### **Purpose**
Verify carbon offset claims without revealing sensitive data.

### **Circuit**

`zk-circuits/circuits/CarbonOffsetVerifier.circom`

```circom
// Verifies:
// - Emission data validity
// - Project authenticity
// - Timestamp constraints
// - Verifier signature
```

### **Generate Proof**

```bash
cd zk-circuits
npm install
npm run setup
node scripts/generate-proof.js
```

### **Verify Proof**

```bash
node scripts/verify-proof.js
```

---

## 🌐 Network Information

### **Moonbase Alpha (Testnet)**

- **Chain ID**: 1287
- **RPC URL**: https://rpc.api.moonbase.moonbeam.network
- **Explorer**: https://moonbase.moonscan.io
- **Faucet**: https://docs.moonbeam.network/builders/get-started/faucet/

### **Moonbeam Mainnet**

- **Chain ID**: 1284
- **RPC URL**: https://rpc.api.moonbeam.network
- **Explorer**: https://moonbeam.moonscan.io

---

## 📖 Usage Examples

### **Mint CVT Tokens**

```bash
# Mint 100 CVT to your wallet
npx hardhat run scripts/mint-simple.js --network moonbaseAlpha
```

### **Check Balance**

```bash
npx hardhat run scripts/check-contract.js --network moonbaseAlpha
```

### **Stake CVT**

1. Open frontend: http://localhost:5173
2. Connect wallet
3. Go to Dashboard
4. Click "Stake More"
5. Enter amount and confirm

### **List on Marketplace**

1. Go to Marketplace page
2. Click "Create Listing"
3. Enter amount, price, expiration
4. Approve CVT (transaction 1/2)
5. Create listing (transaction 2/2)

### **Generate Report**

1. Go to Reports page
2. Choose report type (ESG/ZK/Transaction)
3. Click "Generate Report"
4. Download as CSV or JSON

---

## 🧪 Testing

### **Smart Contract Tests**

```bash
npx hardhat test
npx hardhat coverage
```

### **Frontend Tests**

```bash
cd frontend
npm run test
npm run test:coverage
```

### **Integration Tests**

```bash
# Start local node
npx hardhat node

# Deploy contracts
npx hardhat run scripts/deploy-cvt-system.js --network localhost

# Run frontend
cd frontend && npm run dev
```

---

## 🔗 Useful Links

### **Documentation**
- [Architecture](docs/ARCHITECTURE.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Data Pipeline](data-pipeline/README.md)
- [ZK Circuits](zk-circuits/README.md)

### **Network**
- [Moonbeam Docs](https://docs.moonbeam.network)
- [Moonbase Faucet](https://docs.moonbeam.network/builders/get-started/faucet/)
- [Moonbase Explorer](https://moonbase.moonscan.io)

### **Tools**
- [Hardhat](https://hardhat.org)
- [wagmi](https://wagmi.sh)
- [shadcn/ui](https://ui.shadcn.com)
- [Circom](https://docs.circom.io)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎯 Roadmap

- [x] Smart contract deployment
- [x] Frontend dashboard
- [x] CVT token minting
- [x] Staking functionality
- [x] Marketplace trading
- [x] Validator rewards
- [x] Report generation
- [ ] Mobile app (React Native)
- [ ] Cross-chain bridge
- [ ] DAO governance
- [ ] NFT certificates
- [ ] Advanced analytics

---


## 🙏 Acknowledgments

- Built on [Moonbeam Network](https://moonbeam.network)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- ZK circuits powered by [Circom](https://docs.circom.io)
- Web3 integration with [wagmi](https://wagmi.sh)

---

<div align="center">

**Made with 💚 for a sustainable future**

[Website](https://carbonvault.io) • [Documentation](docs/) • [Twitter](https://twitter.com/CarbonVault)

</div>
