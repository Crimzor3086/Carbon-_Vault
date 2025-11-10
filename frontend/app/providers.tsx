'use client'

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { mantle, mantleTestnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/ThemeProvider'
import '@rainbow-me/rainbowkit/styles.css'

const { chains, publicClient } = configureChains(
  [mantle, mantleTestnet],
  [publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'CarbonVault',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'your-project-id',
  chains
})

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}

