import { NextResponse, NextRequest } from "next/server";
import { 
    createPublicClient, 
    http, 
    getContract, 
    // parseSignature,
    // parseErc6492Signature,
    parseUnits,
    parseAbi, 
    hexToBigInt, 
    encodeFunctionData, 
    erc20Abi,
    encodePacked,
} from 'viem'
import { createBundlerClient } from 'viem/account-abstraction'
import { baseSepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { toEcdsaKernelSmartAccount } from 'permissionless/accounts'
import { eip2612Abi, tokenAbi } from './abi'

// const MAX_GAS_USDC = process.env.NEXT_PUBLIC_MAX_GAS_USDC as string;
const BASE_SEPOLIA_PAYMASTER = process.env.NEXT_PUBLIC_BASE_SEPOLIA_PAYMASTER as `0x${string}`;
const BASE_SEPOLIA_USDC = process.env.NEXT_PUBLIC_BASE_SEPOLIA_USDC as `0x${string}`;
const BUNDLER_URL = `${process.env.NEXT_PUBLIC_BUNDLER_PREFIX}${baseSepolia.id}/rpc?apikey=${process.env.NEXT_PUBLIC_API_KEY}`;
const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATEKEY as `0x${string}`;
const MAX_GAS_USDC = 1000000n

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const data = await request.json();
        console.log(data)
        const recipientAddress = data.recipientAddress
        // const amount = BigInt(data.amount)
        const permitSignature = data.permitSignature

        const owner = privateKeyToAccount(PRIVATE_KEY)
        console.log("Owner is ...")
        console.log(owner)
        const client = createPublicClient({
            chain: baseSepolia,
            transport: http()
        })
        const bundlerClient = createBundlerClient({
            client,
            transport: http(BUNDLER_URL)
        })
        const account = await toEcdsaKernelSmartAccount({
            client,
            owners: [owner],
            version: '0.3.1'
        })
        console.log("Account is ...")
        console.log(account.address)
        const usdc = getContract({
            client,
            address: BASE_SEPOLIA_USDC,
            abi: [...erc20Abi,...eip2612Abi, ...tokenAbi]
        })
        const usdcBalance = await usdc.read.balanceOf([account.address]);
        console.log("Smart Account USDC Balance:", usdcBalance.toString());

        const calls = [
            {
            to: usdc.address,
            abi: usdc.abi,
            functionName: 'transfer',
            args: [recipientAddress, parseUnits("0.0001", 6)]
            }
        ]
        // Specify the USDC Token Paymaster
        const paymaster = BASE_SEPOLIA_PAYMASTER
        const allowance = await usdc.read.allowance([account.address, BASE_SEPOLIA_PAYMASTER]);
        console.log("USDC Allowance:", allowance.toString());

        const paymasterData = encodePacked(
            ['uint8', 'address', 'uint256', 'bytes'],
            [
                0, // Reserved for future use
                usdc.address, // Token address
                // parseEther(MAX_GAS_USDC), // Max spendable gas in USDC
                MAX_GAS_USDC,
                permitSignature // EIP-2612 permit signature
            ]
        )
        // Get additional gas charge from paymaster
        const additionalGasCharge = hexToBigInt(
            (
                await client.call({
                    to: BASE_SEPOLIA_PAYMASTER,
                    data: encodeFunctionData({
                        abi: parseAbi(['function additionalGasCharge() returns (uint256)']),
                        functionName: 'additionalGasCharge'
                    })
                })
            ).data ?? '0x0'
        );

        // Get current gas prices
        const { standard: fees } = await bundlerClient.request({
            method: 'pimlico_getUserOperationGasPrice' as any
        }) as { standard: { maxFeePerGas: `0x${string}`, maxPriorityFeePerGas: `0x${string}` } }
        // const maxFeePerGas = hexToBigInt("0x15a4e6")
        // const maxPriorityFeePerGas = hexToBigInt("0x15a11c")
        const maxFeePerGas = hexToBigInt(fees.maxFeePerGas)
        const maxPriorityFeePerGas = hexToBigInt(fees.maxPriorityFeePerGas)
        
        console.log("Paymster in route.ts...", paymaster)
        console.log("Owner in route.ts...", account.address)

        // Estimate gas limits
        const {
            callGasLimit,
            preVerificationGas,
            verificationGasLimit,
            paymasterPostOpGasLimit,
            paymasterVerificationGasLimit
        } = await bundlerClient.estimateUserOperationGas({
            account,
            calls,
            paymaster,
            paymasterData,
            paymasterPostOpGasLimit: additionalGasCharge,
            maxFeePerGas: BigInt(1),
            maxPriorityFeePerGas: BigInt(1)
        })
        // Send user operation
        const userOpHash = await bundlerClient.sendUserOperation({
            account,
            calls,
            callGasLimit,
            preVerificationGas,
            verificationGasLimit,
            paymaster,
            paymasterData,
            paymasterVerificationGasLimit,
            paymasterPostOpGasLimit: BigInt(Math.max(
                Number(paymasterPostOpGasLimit),
                Number(additionalGasCharge)
            )),
            maxFeePerGas,
            maxPriorityFeePerGas
        })
        // Wait for receipt
        const userOpReceipt = await bundlerClient.waitForUserOperationReceipt({
            hash: userOpHash
        })
        console.log(userOpReceipt)
        return NextResponse.json({ 
            message: "こんにちは、Next.js API！",
            receipt: userOpReceipt.toString()
        });
    } catch(e) {
        console.log(e)
        return NextResponse.json({ 
            message: "error"
        });
    }
}