import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, baseSepolia, base } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http()
  },
})