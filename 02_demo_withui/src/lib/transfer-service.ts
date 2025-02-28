import { createPublicClient, http, getContract, parseErc6492Signature, formatUnits } from 'viem'
import { baseSepolia } from 'viem/chains'
import { toEcdsaKernelSmartAccount } from 'permissionless/accounts'
import { eip2612Permit, tokenAbi } from './permit-helpers'

const MAX_GAS_USDC = BigInt(1000000)
const BASE_SEPOLIA_PAYMASTER = process.env.NEXT_PUBLIC_BASE_SEPOLIA_PAYMASTER as `0x${string}`;
const BASE_SEPOLIA_USDC = process.env.NEXT_PUBLIC_BASE_SEPOLIA_USDC as `0x${string}`;

export async function transferUSDC(
    recipientAddress: string,
    amount: number
) {
    console.log(MAX_GAS_USDC)
    // Create clients
    const client = createPublicClient({
        chain: baseSepolia,
        transport: http()
    })
    const account = await toEcdsaKernelSmartAccount({
        client,
        owners: [window.ethereum!],
        version: '0.3.1'
    })
    console.log("Smart Account is ...")
    console.log(account)
    
    // Setup USDC contract
    const usdc = getContract({
        client,
        address: BASE_SEPOLIA_USDC,
        abi: tokenAbi,
    })
    // Verify USDC balance first
    const balance = await usdc.read.balanceOf([account.address])
    if (balance < amount) {
        throw new Error(`Insufficient USDC balance. Have: ${formatUnits(balance, 6)}, Need: ${formatUnits(BigInt(amount), 6)}`)
    }
    // Construct and sign permit
    const permitData = await eip2612Permit({
        token: usdc,
        chain: baseSepolia,
        ownerAddress: account.address,
        spenderAddress: BASE_SEPOLIA_PAYMASTER,
        // value: parseUnits("10", 6)
        value: MAX_GAS_USDC
    })
    const signData = { ...permitData, primaryType: 'Permit' as const }
    const wrappedPermitSignature = await account.signTypedData(signData)
    const { signature: permitSignature } = parseErc6492Signature(wrappedPermitSignature)

    //*********************
    // 以降はバックエンドで実行する
    //***********
    console.log(permitSignature)
    const response = await fetch("/api/transferUsdc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            recipientAddress: recipientAddress,
            permitSignature: permitSignature,
            signature: wrappedPermitSignature,
            amount: amount
        }),
      });
      const data = await response.json();
      console.log(data)
}
