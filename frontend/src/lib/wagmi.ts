import { createConfig, http } from 'wagmi'
import { mantleSepoliaTestnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Define Mantle Sepolia Testnet
export const mantleSepolia = {
  id: 5003,
  name: 'Mantle Sepolia Testnet',
  network: 'mantle-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Mantle',
    symbol: 'MNT',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia.mantle.xyz'],
    },
    public: {
      http: ['https://rpc.sepolia.mantle.xyz'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'Mantle Sepolia Explorer', 
      url: 'https://explorer.sepolia.mantle.xyz' 
    },
  },
  testnet: true,
} as const

// Create wagmi config
export const config = createConfig({
  chains: [mantleSepolia],
  connectors: [
    injected({ 
      target: 'metaMask',
      shimDisconnect: true,
    }),
  ],
  transports: {
    [mantleSepolia.id]: http(),
  },
})

