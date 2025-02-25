import { 
  createWalletClient, 
  createPublicClient, 
  custom, 
  http,
} from "viem";
import { baseSepolia } from "viem/chains";
import { entryPoint07Address } from 'viem/account-abstraction';
import { createPimlicoClient } from "permissionless/clients/pimlico"
import "viem/window";

const BUNDLER_URL = `${process.env.NEXT_PUBLIC_BUNDLER_PREFIX}${baseSepolia.id}/rpc?apikey=${process.env.NEXT_PUBLIC_API_KEY}`;

export const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: custom(window.ethereum!)
})
 
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http()
})

export const pimlicoClient = createPimlicoClient({
	transport: http(BUNDLER_URL),
	entryPoint: {
		address: entryPoint07Address,
		version: "0.7",
	},
})