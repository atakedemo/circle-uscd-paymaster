import { 
    Address, 
    Chain,
    getContract, 
    erc20Abi,
} from 'viem';
import { toKernelSmartAccount　} from 'permissionless/accounts';
import { entryPoint07Address } from 'viem/account-abstraction';
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

// export const bundlerClient:BundlerClient = createBundlerClient({
//   client: publicClient,
//   transport: http(BUNDLER_URL)
// });

export const smartAccount = await toKernelSmartAccount({
    client: publicClient,
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7",
    },
    owners: [window.ethereum!],
})