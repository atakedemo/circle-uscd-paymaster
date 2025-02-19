import { createWalletClient, createPublicClient, custom, http } from "viem";
import { baseSepolia } from "viem/chains";
import "viem/window";

export async function ConnectWalletClient() {
  let transport;
  if (window.ethereum) {
    transport = custom(window.ethereum);
  } else {
    const errorMessage =
      "MetaMask or another web3 wallet is not installed. Please install one to proceed.";
    throw new Error(errorMessage);
  }

  const walletClient = createWalletClient({
    chain: baseSepolia,
    transport: transport,
  });

  return walletClient;
}

export function ConnectPublicClient() {
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http("https://rpc.sepolia.org"),
  });

  // Return the public client
  return publicClient;
}