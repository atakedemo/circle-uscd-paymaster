import { 
  createWalletClient, 
  createPublicClient, 
  custom, 
  http,
} from "viem";
// import { toKernelSmartAccount　} from 'permissionless/accounts';
// import { 
//   createBundlerClient,
//   entryPoint07Address,
// } from 'viem/account-abstraction';
import { baseSepolia } from "viem/chains";
import "viem/window";

// const BUNDLER_URL = `${process.env.NEXT_PUBLIC_BUNDLER_PREFIX}${baseSepolia.id}/rpc`;

export const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: custom(window.ethereum!)
})
 
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http()
})

// export const bundlerClient = createBundlerClient({
//   publicClient,
//   transport: http(BUNDLER_URL)
// });

// export async function ConnectSmartAccount () {
//   const publicClient = createPublicClient({
//     chain: baseSepolia,
//     transport: http(),
//   });

//   if (window.ethereum) {
//     const smartAccount = await toKernelSmartAccount({
//       client: publicClient,
//       entryPoint: {
//         address: entryPoint07Address,
//         version: "0.7",
//       },
//       owners: [window.ethereum],
//     })

//     return smartAccount
//   } else {
//     const errorMessage =
//       "MetaMask or another web3 wallet is not installed. Please install one to proceed.";
//     throw new Error(errorMessage);
//   }
// }