import { createPublicClient, http, getContract, parseEther, parseErc6492Signature, formatUnits } from 'viem'
import { createBundlerClient } from 'viem/account-abstraction'
import { baseSepolia } from 'viem/chains'
import { toEcdsaKernelSmartAccount } from 'permissionless/accounts'
import { eip2612Permit, tokenAbi } from './permit-helpers'
// import { publicClient } from '@/lib/client';
// import { smartAccount } from '@/lib/usdc-aa'

const MAX_GAS_USDC = process.env.NEXT_PUBLIC_MAX_GAS_USDC as string;
const BASE_SEPOLIA_PAYMASTER = process.env.NEXT_PUBLIC_BASE_SEPOLIA_PAYMASTER as `0x${string}`;
const BASE_SEPOLIA_USDC = process.env.NEXT_PUBLIC_BASE_SEPOLIA_USDC as `0x${string}`;
// const NONCE = 0;
// const DEADLINE = Math.floor(Date.now() / 1000) + 360000;
const BUNDLER_URL = `${process.env.NEXT_PUBLIC_BUNDLER_PREFIX}${baseSepolia.id}/rpc?apikey=${process.env.NEXT_PUBLIC_API_KEY}`;

export async function transferUSDC(
    recipientAddress: string,
    amount: bigint
) {
    console.log(MAX_GAS_USDC)
    // Create clients
    const client = createPublicClient({
        chain: baseSepolia,
        transport: http()
    })
    const bundlerClient = createBundlerClient({
        client,
        transport: http(BUNDLER_URL)
    })
    // Create accounts
    // const owner = privateKeyToAccount(privateKey)
    const account = await toEcdsaKernelSmartAccount({
        client,
        owners: [window.ethereum!],
        version: '0.3.1'
    })
    // const account = smartAccount;
    
    // Setup USDC contract
    const usdc = getContract({
        client,
        address: BASE_SEPOLIA_USDC,
        abi: tokenAbi,
    })
    // Verify USDC balance first
    const balance = await usdc.read.balanceOf([account.address])
    console.log(account.address)
    console.log(balance)
    if (balance < amount) {
        throw new Error(`Insufficient USDC balance. Have: ${formatUnits(balance, 6)}, Need: ${formatUnits(amount, 6)}`)
    }
    // Construct and sign permit
    const permitData = await eip2612Permit({
        // token: usdc,
        chain: baseSepolia,
        ownerAddress: account.address,
        spenderAddress: BASE_SEPOLIA_PAYMASTER,
        value: parseEther(MAX_GAS_USDC)
    })
    const signData = { ...permitData, primaryType: 'Permit' as const }
    const wrappedPermitSignature = await account.signTypedData(signData)
    const { signature: permitSignature } = parseErc6492Signature(wrappedPermitSignature)

    //*********************
    // 以降はバックエンドで実行する
    //***********
    console.log(permitSignature)


    // Prepare transfer call
    // const calls = [{
    //     to: usdc.address,
    //     abi: usdc.abi,
    //     functionName: 'transfer',
    //     args: [recipientAddress, amount]
    // }]
    // // Specify the USDC Token Paymaster
    // const paymaster = BASE_SEPOLIA_PAYMASTER
    // const paymasterData = encodePacked(
    //     ['uint8', 'address', 'uint256', 'bytes'],
    //     [
    //         0, // Reserved for future use
    //         usdc.address, // Token address
    //         parseEther(MAX_GAS_USDC), // Max spendable gas in USDC
    //         permitSignature // EIP-2612 permit signature
    //     ]
    // )
    // // Get additional gas charge from paymaster
    // const additionalGasCharge = hexToBigInt(
    //     (
    //         await publicClient.call({
    //             to: BASE_SEPOLIA_PAYMASTER,
    //             data: encodeFunctionData({
    //                 abi: parseAbi(['function additionalGasCharge() returns (uint256)']),
    //                 functionName: 'additionalGasCharge'
    //             })
    //         })
    //     ).data ?? '0x0'
    // );

    // Get current gas prices
    // const { standard: fees } = await bundlerClient.request({
    //     method: 'pimlico_getUserOperationGasPrice' as any
    // }) as { standard: { maxFeePerGas: `0x${string}`, maxPriorityFeePerGas: `0x${string}` } }
    // const maxFeePerGas = hexToBigInt("0x15a4e6")
    // const maxPriorityFeePerGas = hexToBigInt("0x15a11c")
    // const maxFeePerGas = hexToBigInt(fees.maxFeePerGas)
    // const maxPriorityFeePerGas = hexToBigInt(fees.maxPriorityFeePerGas)
    // Estimate gas limits
    // const {
    //     callGasLimit,
    //     preVerificationGas,
    //     verificationGasLimit,
    //     paymasterPostOpGasLimit,
    //     paymasterVerificationGasLimit
    // } = await bundlerClient.estimateUserOperationGas({
    //     account,
    //     calls,
    //     paymaster,
    //     paymasterData,
    //     paymasterPostOpGasLimit: additionalGasCharge,
    //     maxFeePerGas: BigInt(1),
    //     maxPriorityFeePerGas: BigInt(1)
    // })
    // // Send user operation
    // const userOpHash = await bundlerClient.sendUserOperation({
    //     account,
    //     calls,
    //     callGasLimit,
    //     preVerificationGas,
    //     verificationGasLimit,
    //     paymaster,
    //     paymasterData,
    //     paymasterVerificationGasLimit,
    //     paymasterPostOpGasLimit: BigInt(Math.max(
    //         Number(paymasterPostOpGasLimit),
    //         Number(additionalGasCharge)
    //     )),
    //     maxFeePerGas,
    //     maxPriorityFeePerGas
    // })
    // // Wait for receipt
    // const userOpReceipt = await bundlerClient.waitForUserOperationReceipt({
    //     hash: userOpHash
    // })
    // return userOpReceipt
}
