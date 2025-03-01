import { 
    Address, 
    Chain,
    getContract, 
    erc20Abi,
} from 'viem';
import { toEcdsaKernelSmartAccount } from 'permissionless/accounts'
import { publicClient } from './client';

const BASE_SEPOLIA_USDC = process.env.NEXT_PUBLIC_BASE_SEPOLIA_USDC as `0x${string}`;

interface Token {
  address: Address;
  read: {
    name: () => Promise<string>;
    version: () => Promise<string>;
    nonces: (args: [Address]) => Promise<bigint>;
  };
}

export interface EIP2612PermitParams {
  token: Token;
  chain: Chain;
  ownerAddress: Address;
  spenderAddress: Address;
  value: bigint;
}

export const eip2612Abi = [
    {
        inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
        name: 'nonces',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }]
    },
    {
        inputs: [],
        name: 'version',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function'
    }
];

export async function sendUSDC(to: string, amount: string) {
    const usdc = getContract({
        client: publicClient,
        address: BASE_SEPOLIA_USDC,
        abi: [...erc20Abi, ...eip2612Abi]
    });

    return {
      to: usdc.address,
      abi: usdc.abi,
      functionName: 'transfer',
      args: [to, amount]
    };
}

export const smartAccount = await toEcdsaKernelSmartAccount({
  client: publicClient,
  owners: [window.ethereum!],
  version: '0.3.1'
})