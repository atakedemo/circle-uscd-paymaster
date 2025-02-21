"use client"

import * as React from 'react';
import { useAccount } from 'wagmi';
import { Button } from "@/components/ui/button";
import { Stack } from "@chakra-ui/react";
import { baseSepolia } from "viem/chains";
import { parseErc6492Signature, erc20Abi, parseEther, getContract } from 'viem';
import { 
  // bundlerClient, 
  smartAccount, 
  // sendUSDC,
  eip2612Abi
} from '@/lib/usdc-aa';
import { publicClient, walletClient } from '@/lib/client';

const MAX_GAS_USDC = process.env.NEXT_PUBLIC_MAX_GAS_USDC as string;
const BASE_SEPOLIA_PAYMASTER = process.env.NEXT_PUBLIC_BASE_SEPOLIA_PAYMASTER as `0x${string}`;
const BASE_SEPOLIA_USDC = process.env.NEXT_PUBLIC_BASE_SEPOLIA_USDC as `0x${string}`;
const NONCE = 0;
const DEADLINE = Math.floor(Date.now() / 1000) + 360000;

const usdc = getContract({
  client: publicClient,
  address: BASE_SEPOLIA_USDC,
  abi: [...erc20Abi, ...eip2612Abi]
});

export function AaUsdcTx() {
  const { address } = useAccount();

  const sendTx = async() => {
    const usdc_name = await usdc.read.name() as string
    
    const wrappedPermitSignature = await walletClient.signTypedData({
      account: address as `0x${string}`,
      domain: {
        name: usdc_name as string,
        version: "1",
        chainId: baseSepolia.id,
        verifyingContract: BASE_SEPOLIA_USDC,
      },
      types: {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      },
      primaryType: 'Permit',
      message: {
        owner: address as `0x${string}`,
        spender: BASE_SEPOLIA_PAYMASTER,
        value: parseEther(MAX_GAS_USDC),
        nonce: BigInt(NONCE),
        deadline: BigInt(DEADLINE),
      },
    });
    const { signature: permitSignature } = parseErc6492Signature(wrappedPermitSignature);

    console.log('Permit signature:', permitSignature);
  }

  return (
    <Stack gap="2" align="flex-start">
      Smart Account is: {smartAccount.address}
      {/* USDC Balance is: {await usdc.read.balanceOf([account.address])} */}
      <Button onClick={sendTx}>Send USDC</Button>
    </Stack>
  )
}