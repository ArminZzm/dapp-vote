'use client'

import { http, createConfig, WagmiProvider } from 'wagmi'
import { mainnet, sepolia, hardhat } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'

const config = createConfig({
  chains: [mainnet, sepolia, hardhat],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http(process.env.NEXT_PUBLIC_HARDHAT_JSON_RPC_URL)
  }
})

const client = new QueryClient()

const BlockChainProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <>{children}</>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default BlockChainProvider
