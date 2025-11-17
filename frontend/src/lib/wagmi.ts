import { createConfig, http } from 'wagmi'
import { moonbaseAlpha } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Create wagmi config for Moonbase Alpha
export const config = createConfig({
  chains: [moonbaseAlpha],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [moonbaseAlpha.id]: http(moonbaseAlpha.rpcUrls.public.http[0]!),
  },
})

export const moonbase = moonbaseAlpha

