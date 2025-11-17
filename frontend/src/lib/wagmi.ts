import { createConfig, http } from 'wagmi'
import { moonbaseAlpha } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Create wagmi config for Moonbase Alpha
const DEFAULT_MOONBASE_RPC = 'https://rpc.api.moonbase.moonbeam.network'
const moonbaseRpc =
  moonbaseAlpha.rpcUrls?.public?.http?.[0] ||
  moonbaseAlpha.rpcUrls?.default?.http?.[0] ||
  DEFAULT_MOONBASE_RPC

export const config = createConfig({
  autoConnect: true,
  chains: [moonbaseAlpha],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [moonbaseAlpha.id]: http(moonbaseRpc),
  },
})

export const moonbase = moonbaseAlpha

